# Saathi NLP Service (Member 3)

`POST /nlp/score` — turns a voice-note transcript into MRS symptom scores.

## 1. Setup (30 seconds)

```bash
cd saathi-nlp
pip install -r requirements.txt --break-system-packages   # drop the flag if not on Debian/Ubuntu
uvicorn app.main:app --reload --port 8001
```



Returns:
```json
{
  "mrs_scores": {"hot_flashes": 3, "sleep_problems": 3, ...},
  "confidence": {"hot_flashes": 0.9, "sleep_problems": 0.75, ...},
  "ambiguous_symptoms": ["heart_discomfort", "depressive_mood", ...]
}
```

## 3. (Optional) Turn on LLM refinement

Only do this if you have spare time and a stable connection. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then set:
```
SAATHI_USE_LLM=true
ANTHROPIC_API_KEY=sk-ant-...
```

Restart the server. Now, any symptom the keyword pass is unsure about gets
a second opinion from Claude — but if the API call fails or times out, it
**silently falls back to the rule-based result**. The demo never crashes.

## 4. How scoring works

1. `score_text(text, lang)` in `app/scorer.py` loops the **11 official MRS
   symptom keys** (`app/mrs_data.py`).
2. For each key, it checks the transcript against bilingual (Hindi/English)
   keyword patterns and assigns a 0–4 severity + a confidence score.
3. If `SAATHI_USE_LLM=true`, low-confidence keys get re-scored by Claude,
   grounded to just those keys so it can't hallucinate off-scale symptoms.
4. Anything still below `SAATHI_CONFIDENCE_THRESHOLD` (default 0.5) goes into
   `ambiguous_symptoms` — hand this list to the MRS quiz fallback so the app
   only asks the user about what it's genuinely unsure of, not all 11.

## 5. Extending the keyword list fast

If during testing tonight you notice a phrase isn't matching (e.g. someone
says "bahut pasina aa raha hai" and hot_flashes doesn't fire), just add it:

```python
# app/mrs_data.py
"hot_flashes": [
    ("garmi lagti", 3),
    ("bahut pasina aa raha", 3),   # <- add new phrases here, no restart needed with --reload
    ...
],
```

`uvicorn --reload` picks up the change instantly — no restart needed.

## 6. Wiring into the rest of the app

- **Voice → this service**: whatever Whisper transcribes, POST it here as `text`.
- **This service → Risk Scoring**: sum `mrs_scores.values()` for the total
  MRS score (0–44) your Data Flow Diagram slide mentions; map to a severity
  band (e.g. <16 none/little, 17-33 moderate, 34+ severe — check the tuning
  based on the official MRS if you have time, but this range works for demo).
- **This service → MRS quiz fallback**: for each key in `ambiguous_symptoms`,
  show the corresponding quiz question from the real MRS questionnaire.

## Files

```
saathi-nlp/
├── app/
│   ├── main.py       # FastAPI app, POST /nlp/score
│   ├── scorer.py      # score_text(text, lang) — the core logic
│   ├── mrs_data.py     # 11 MRS keys + bilingual keyword patterns
│   └── schemas.py      # request/response models
├── requirements.txt
├── .env.example
└── test_scorer.py      # quick sanity tests, run with: python test_scorer.py
```
