"""
Scoring rules for the 11-item Menopause Rating Scale (MRS).

Deliberately has ZERO dependency on FastAPI/SQLAlchemy — this is pure
business logic. That means it can be unit-tested in isolation (see
tests/test_scoring.py) without spinning up a database or an HTTP server,
and it can be reused by a future CLI tool, a batch job, or a different
web framework without dragging the whole app in.
"""
from typing import Dict, Tuple

# The 11 MRS symptom keys, grouped by clinical domain. This is the single
# source of truth for the key names — questions_en.json/questions_hi.json
# and every mrs_scores payload must use exactly these strings.
MRS_SYMPTOM_KEYS: Tuple[str, ...] = (
    # somatic
    "hot_flashes",
    "heart_discomfort",
    "sleep_problems",
    "joint_muscle_discomfort",
    # psychological
    "depressive_mood",
    "irritability",
    "anxiety",
    "exhaustion",
    # urogenital
    "sexual_problems",
    "bladder_problems",
    "vaginal_dryness",
)

MIN_ITEM_SCORE = 0
MAX_ITEM_SCORE = 4
MAX_TOTAL_SCORE = MAX_ITEM_SCORE * len(MRS_SYMPTOM_KEYS)  # 44

# (inclusive_low, inclusive_high, label) — ordered, first match wins.
# Approximate bands for a hackathon prototype; not a diagnostic cutoff.
SEVERITY_BANDS: Tuple[Tuple[int, int, str], ...] = (
    (0, 4, "none"),
    (5, 8, "mild"),
    (9, 15, "moderate"),
    (16, MAX_TOTAL_SCORE, "severe"),
)


def compute_severity_band(total_score: float) -> str:
    """Map a total MRS score to a severity band. Clamped at the extremes
    so an out-of-range float (e.g. a future scoring tweak) never raises."""
    for low, high, label in SEVERITY_BANDS:
        if low <= total_score <= high:
            return label
    return "severe" if total_score > MAX_TOTAL_SCORE else "none"


def validate_mrs_scores(mrs_scores: Dict[str, float]) -> None:
    """
    Enforce the full-11-keys, 0-4-range contract before anything touches
    the database. Raises ValueError with a message safe to surface to the
    caller (it never echoes anything except key names / numbers already
    in their own payload).
    """
    given_keys = set(mrs_scores)
    expected_keys = set(MRS_SYMPTOM_KEYS)

    missing = expected_keys - given_keys
    if missing:
        raise ValueError(f"Missing MRS symptom keys: {sorted(missing)}")

    unknown = given_keys - expected_keys
    if unknown:
        raise ValueError(f"Unknown MRS symptom keys: {sorted(unknown)}")

    out_of_range = {
        key: value
        for key, value in mrs_scores.items()
        if not (MIN_ITEM_SCORE <= value <= MAX_ITEM_SCORE)
    }
    if out_of_range:
        raise ValueError(f"Scores must be between {MIN_ITEM_SCORE} and {MAX_ITEM_SCORE}: {out_of_range}")


def total_score_of(mrs_scores: Dict[str, float]) -> float:
    """Sum the 11 item scores. Call validate_mrs_scores() first."""
    return sum(mrs_scores.values())
