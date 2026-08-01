"""
Core NLP logic: score_text(text, lang)

Strategy (built for a hackathon demo that MUST work even with flaky wifi):
  1. ALWAYS run the fast, offline keyword/rule-based scorer first.
     -> loops the 11 MRS symptom keys, returns score + confidence per key.
  2. If USE_LLM=true and an API key is present, ask Claude to refine only the
     keys the rule-based pass was unsure about (low confidence / no match).
     This is the "AI Brain" from your architecture slide, but scoped down so
     it's fast (small prompt) and never blocks the demo if it fails/times out.
  3. Anything still under CONFIDENCE_THRESHOLD after both passes goes into
     ambiguous_symptoms -> that's what the MRS quiz fallback (slide 6, #3)
     asks the user directly.
"""

import os
import json
import re
from difflib import SequenceMatcher
from typing import Tuple

from dotenv import load_dotenv
load_dotenv()  # actually reads .env into the environment — was missing before

from .mrs_data import MRS_KEYS, MRS_KEYWORDS, MRS_MAX_SCORE

CONFIDENCE_THRESHOLD = float(os.getenv("SAATHI_CONFIDENCE_THRESHOLD", "0.5"))
USE_LLM = os.getenv("SAATHI_USE_LLM", "false").lower() == "true"
LLM_PROVIDER = os.getenv("SAATHI_LLM_PROVIDER", "anthropic").lower()  # "anthropic" or "groq"


def _phrase_fuzzy_match(phrase: str, text_words: list) -> bool:
    """
    True if most words in `phrase` have a close match somewhere in
    text_words. Word-level (not whole-phrase char-level) so it survives
    an inserted word ("jodo me bohot dard") and doesn't false-positive on
    short phrases that happen to share letters ("dar lagta" vs "garmi lagta").
    """
    phrase_words = phrase.split()
    used_idx = set()
    matched = 0

    for pw in phrase_words:
        found = False
        if len(pw) < 4:
            # short words (hai, ko, me, h) are too generic to fuzzy match —
            # require exact match only, or skip them entirely
            found = pw in text_words
        else:
            for i, tw in enumerate(text_words):
                if i in used_idx:
                    continue
                if SequenceMatcher(None, pw, tw).ratio() >= 0.78:
                    used_idx.add(i)
                    found = True
                    break
        if found:
            matched += 1

    # require at least 75% of the phrase's words to be present/near-matched
    return (matched / len(phrase_words)) >= 0.75


def _rule_based_pass(text: str) -> Tuple[dict, dict]:
    """
    Keyword matching with a fuzzy fallback for twisted/misheard phrasing.
    Returns (scores, confidence) dicts for all 11 keys.
    """
    lower_text = text.lower()
    words = lower_text.split()
    scores = {k: 0 for k in MRS_KEYS}
    confidence = {k: 0.0 for k in MRS_KEYS}

    for key in MRS_KEYS:
        best_weight = 0
        exact_hits = 0
        fuzzy_hits = 0

        for phrase, weight in MRS_KEYWORDS[key]:
            phrase_l = phrase.lower()
            if phrase_l in lower_text:
                exact_hits += 1
                best_weight = max(best_weight, weight)
                continue

            # Fuzzy fallback: catches typos, mistranscriptions, slightly
            # different word endings, and inserted filler words
            # (e.g. "jodo me dard" vs "jodo me bohot dard").
            if _phrase_fuzzy_match(phrase_l, words):
                fuzzy_hits += 1
                best_weight = max(best_weight, weight)

        total_hits = exact_hits + fuzzy_hits
        if total_hits == 0:
            scores[key] = 0
            confidence[key] = 0.0  # no evidence at all -> ambiguous, not "definitely absent"
        else:
            scores[key] = min(best_weight, MRS_MAX_SCORE)
            # exact hits count more toward confidence than fuzzy ones
            confidence[key] = min(0.6 + 0.15 * exact_hits + 0.08 * fuzzy_hits, 0.95)

    return scores, confidence


def _build_prompt(text: str, lang: str, weak_keys: list) -> str:
    symptom_list = "\n".join(f"- {k}" for k in weak_keys)
    return f"""You are a clinical NLP assistant scoring the Menopause Rating Scale (MRS).
A woman said (language={lang}): "{text}"

For ONLY these symptom keys, decide if the text implies that symptom, and if so how severe (0-4):
{symptom_list}

Score: 0=not mentioned/no evidence, 1=mild, 2=moderate, 3=severe, 4=very severe.
Respond with ONLY a JSON object, no prose, in this exact shape:
{{"scores": {{"<key>": <0-4 int>, ...}}, "confidence": {{"<key>": <0.0-1.0 float>, ...}}}}
Only include the keys listed above. If genuinely no evidence, use score 0 and confidence 0.3."""


def _call_anthropic(prompt: str) -> str:
    import anthropic
    client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}],
    )
    return "".join(block.text for block in response.content if hasattr(block, "text"))


def _call_groq(prompt: str) -> str:
    from openai import OpenAI  # groq uses the OpenAI-compatible client
    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=os.getenv("GROQ_API_KEY"),
    )
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content


def _llm_refine(text: str, lang: str, scores: dict, confidence: dict) -> Tuple[dict, dict]:
    """
    Ask the configured LLM provider (SAATHI_LLM_PROVIDER=anthropic|groq) to
    fill in only the low-confidence keys, grounded strictly to the 11 MRS
    symptoms so it can't wander off-scale. Fails soft: on any error, just
    returns the rule-based results unchanged.
    """
    weak_keys = [k for k in MRS_KEYS if confidence[k] < CONFIDENCE_THRESHOLD]
    if not weak_keys:
        print("[saathi-nlp] LLM refine skipped: rule-based pass was confident on all keys")
        return scores, confidence

    print(f"[saathi-nlp] Calling {LLM_PROVIDER} to refine {len(weak_keys)} low-confidence keys...")

    try:
        prompt = _build_prompt(text, lang, weak_keys)

        if LLM_PROVIDER == "groq":
            raw = _call_groq(prompt)
        else:
            raw = _call_anthropic(prompt)

        raw = re.sub(r"```json|```", "", raw).strip()
        parsed = json.loads(raw)

        for k in weak_keys:
            if k in parsed.get("scores", {}):
                scores[k] = int(parsed["scores"][k])
            if k in parsed.get("confidence", {}):
                confidence[k] = float(parsed["confidence"][k])

        print(f"[saathi-nlp] {LLM_PROVIDER} refinement succeeded")

    except Exception as e:
        # Soft-fail: demo keeps working on rule-based results alone.
        print(f"[saathi-nlp] LLM refine skipped ({LLM_PROVIDER}): {e}")

    return scores, confidence


def get_severity_band(mrs_scores: dict) -> dict:
    """
    Sums the 11 MRS symptom scores (0-44 total) into a severity band.
    Bands roughly follow the official MRS scale conventions:
      0-4   : none/minimal
      5-8   : little
      9-16  : moderate
      17-44 : severe -> flagged for doctor visit
    """
    total = sum(mrs_scores.values())
    if total <= 4:
        band, flag = "minimal", False
    elif total <= 8:
        band, flag = "little", False
    elif total <= 16:
        band, flag = "moderate", False
    else:
        band, flag = "severe", True

    return {"total_score": total, "severity_band": band, "flag_for_doctor": flag}


def score_text(text: str, lang: str = "en") -> dict:
    """
    Loops the 11 MRS symptom keys, returns score + confidence per key,
    plus the list of symptoms still too ambiguous to trust.
    """
    scores, confidence = _rule_based_pass(text)

    if USE_LLM:
        scores, confidence = _llm_refine(text, lang, scores, confidence)

    ambiguous = [k for k in MRS_KEYS if confidence[k] < CONFIDENCE_THRESHOLD]

    result = {
        "mrs_scores": scores,
        "confidence": {k: round(v, 2) for k, v in confidence.items()},
        "ambiguous_symptoms": ambiguous,
    }
    result.update(get_severity_band(scores))
    return result
