"""
Quick sanity check — no server needed. Run: python test_scorer.py
Add your own test phrases here as you find real examples during the demo prep.
"""

from app.scorer import score_text

TEST_CASES = [
    ("Aajkal raat ko bahut garmi lagti hai, neend nahi aata", "hi"),
    ("Mujhe bahut chidchidapan ho raha hai aur gussa jaldi aata hai", "hi"),
    ("I feel exhausted all the time and my joints hurt", "en"),
    ("Baar baar peshab jaana padta hai aur neend bhi puri nahi hoti", "hi"),
    ("I'm just really tired", "en"),  # deliberately vague -> should be ambiguous
]

if __name__ == "__main__":
    for text, lang in TEST_CASES:
        print(f"\n--- \"{text}\" ({lang}) ---")
        result = score_text(text, lang)
        nonzero = {k: v for k, v in result["mrs_scores"].items() if v > 0}
        print("Scored symptoms:", nonzero)
        print("Ambiguous:", result["ambiguous_symptoms"])
