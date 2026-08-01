"""
Menopause Rating Scale (MRS) — the real 11-item clinical questionnaire.
Each symptom is scored 0 (none) to 4 (very severe).

Every symptom has English + Hindi (Romanized + Devanagari) keyword/phrase
patterns. This is what lets the rule-based scorer work instantly, offline,
with zero API cost — and it's also what we feed the LLM as context so it
stays anchored to the real clinical scale instead of hallucinating symptoms.
"""

# The 11 official MRS symptom keys, in official order (used for consistent output)
MRS_KEYS = [
    "hot_flashes",          # Vasomotor: hot flashes, sweating
    "heart_discomfort",     # Unusual heart sensations, racing/skipping
    "sleep_problems",       # Difficulty falling asleep, staying asleep, waking early
    "depressive_mood",      # Feeling low, sad, tearful, loss of interest
    "irritability",         # Feeling nervous, tense, aggressive
    "anxiety",              # Inner restlessness, feeling panicky
    "physical_exhaustion",  # Fatigue, decreased performance, poor concentration
    "sexual_problems",      # Change in sexual desire/activity/satisfaction
    "bladder_problems",     # Difficulty urinating, urinary frequency/urgency
    "vaginal_dryness",      # Dryness, discomfort during intercourse
    "joint_muscle_discomfort",  # Pain in joints, rheumatoid complaints
]

# Human-readable labels (bilingual) — handy for the family card / UI later
MRS_LABELS = {
    "hot_flashes": {"en": "Hot flashes / sweating", "hi": "गर्मी के दौरे / पसीना"},
    "heart_discomfort": {"en": "Heart discomfort", "hi": "दिल में बेचैनी"},
    "sleep_problems": {"en": "Sleep problems", "hi": "नींद की समस्या"},
    "depressive_mood": {"en": "Depressive mood", "hi": "उदासी / मन भारी होना"},
    "irritability": {"en": "Irritability", "hi": "चिड़चिड़ापन"},
    "anxiety": {"en": "Anxiety", "hi": "बेचैनी / चिंता"},
    "physical_exhaustion": {"en": "Physical & mental exhaustion", "hi": "थकावट"},
    "sexual_problems": {"en": "Sexual problems", "hi": "यौन समस्याएं"},
    "bladder_problems": {"en": "Bladder problems", "hi": "पेशाब की समस्या"},
    "vaginal_dryness": {"en": "Vaginal dryness", "hi": "योनि में सूखापन"},
    "joint_muscle_discomfort": {"en": "Joint & muscle discomfort", "hi": "जोड़ों/मांसपेशियों में दर्द"},
}

# Keyword patterns per symptom. Lowercased substring match against the
# (lowercased) transcript. Mix of Hindi-in-Roman-script (what Whisper usually
# outputs for colloquial speech) + Devanagari + English.
# Each entry: (phrase, weight) — weight roughly maps to severity signal (1-4).
MRS_KEYWORDS = {
    "hot_flashes": [
        ("garmi lagti", 3), ("bahut garmi", 3), ("garam garam", 2),
        ("hot flash", 3), ("sweating", 3), ("paseena", 3), ("पसीना", 3),
        ("garam lagta", 3), ("achanak garmi", 3), ("ग़रमी", 2),
    ],
    "heart_discomfort": [
        ("dil dhadakta", 3), ("dil ghabraye", 3), ("heart race", 3),
        ("dil me bechaini", 3), ("palpitation", 3), ("dil ki dhadkan", 3),
        ("heart skip", 3), ("chest me ajeeb", 2),
    ],
    "sleep_problems": [
        ("neend nahi aata", 3), ("neend nahi aati", 3), ("neend nahi aa rahi", 3),
        ("sleep problem", 3), ("nind nahi", 3), ("raat ko jaagna", 3),
        ("can't sleep", 3), ("insomnia", 4), ("neend udd", 3), ("नींद नहीं", 3),
        ("neend puri nahi", 3), ("neend bhi puri nahi", 3), ("trouble sleeping", 3),
        ("waking up at night", 2), ("wake up at night", 2), ("neend kam", 2),
    ],
    "depressive_mood": [
        ("udaas", 3), ("man udaas", 3), ("rona aata", 3), ("mann nahi lagta", 2),
        ("feeling low", 3), ("sad", 2), ("depressed", 4), ("hopeless", 4),
        ("man bhari", 2), ("उदास", 3), ("dil dukhta", 2),
    ],
    "irritability": [
        ("gussa aata", 3), ("chidchida", 3), ("irritable", 3), ("irritated", 2),
        ("chid chid", 3), ("bina baat gussa", 3), ("angry easily", 3),
        ("चिड़चिड़ा", 3), ("gussa jaldi", 3),
    ],
    "anxiety": [
        ("bechaini", 3), ("ghabrahat", 3), ("anxious", 3), ("anxiety", 3),
        ("panic", 4), ("dar lagta", 3), ("restless", 2), ("बेचैनी", 3),
        ("tension rehta", 2),
    ],
    "physical_exhaustion": [
        ("thakaan", 3), ("thak jaati", 3), ("tired", 2), ("exhausted", 3),
        ("energy nahi", 3), ("kamzori", 3), ("focus nahi", 2), ("concentration", 2),
        ("थकान", 3), ("kaam karne ka man nahi", 2),
    ],
    "sexual_problems": [
        ("sexual desire", 3), ("physical relation", 2), ("intimacy problem", 3),
        ("dard hota hai during", 3), ("man nahi karta relation", 3),
        ("sex me interest", 3),
    ],
    "bladder_problems": [
        ("baar baar peshab", 3), ("urine leak", 3), ("bladder", 3),
        ("peshab rokna mushkil", 3), ("frequent urination", 3),
        ("पेशाब", 3), ("urine control", 3),
    ],
    "vaginal_dryness": [
        ("sookhapan", 3), ("dryness", 3), ("vaginal dry", 4),
        ("dard hota hai relation ke dauran", 3), ("सूखापन", 3),
    ],
    "joint_muscle_discomfort": [
        ("jodo me dard", 3), ("joint pain", 3), ("body pain", 2),
        ("kamar dard", 2), ("muscle pain", 3), ("haddiyon me dard", 3),
        ("जोड़ों में दर्द", 3), ("stiffness", 2), ("joints hurt", 3),
        ("joint hurt", 3), ("muscles hurt", 2), ("achy joints", 3), ("dard hota hai body", 2),
    ],
}

MRS_MAX_SCORE = 4  # per symptom, per official MRS scale (0-4)
