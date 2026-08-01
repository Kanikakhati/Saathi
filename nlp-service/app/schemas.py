from typing import Literal, Dict, List
from pydantic import BaseModel, Field


class ScoreRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Raw transcribed voice note")
    lang: Literal["en", "hi"] = "en"


class ScoreResponse(BaseModel):
    mrs_scores: Dict[str, int]        # e.g. {"hot_flashes": 2, ...}  (0-4 each)
    confidence: Dict[str, float]      # e.g. {"hot_flashes": 0.85, ...} (0-1 each)
    ambiguous_symptoms: List[str]     # keys where confidence is too low to trust
    total_score: int                  # sum of all 11 symptom scores (0-44)
    severity_band: str                # "minimal" | "little" | "moderate" | "severe"
    flag_for_doctor: bool             # true when severity_band == "severe"
