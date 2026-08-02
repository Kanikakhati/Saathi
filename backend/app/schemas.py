from datetime import datetime
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, constr


class UserCreate(BaseModel):
    name: constr(min_length=1, max_length=120)
    phone: constr(min_length=8, max_length=20)
    password: constr(min_length=6)
    preferred_language: str = "hi"
    age: Optional[int] = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    phone: str
    preferred_language: str
    age: Optional[int] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class SymptomEntryCreate(BaseModel):
    raw_text: constr(min_length=1, max_length=2000)
    mrs_scores: Dict[str, float] = Field(
        ..., description="All 11 MRS symptom keys -> score 0-4. See scoring.MRS_SYMPTOM_KEYS."
    )
    stage: str = "unknown"
    source: Literal["voice", "quiz", "hybrid"] = "voice"
    # NOTE: total_score is intentionally NOT accepted from the client.
    # The backend computes it from mrs_scores (see scoring.total_score_of)
    # so a bug in the app's merge logic can't silently write a wrong number.


class SymptomEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    raw_text: str
    mrs_scores: Dict[str, float]
    total_score: float
    severity_band: str
    stage: str
    source: str
    created_at: datetime


class EntryPage(BaseModel):
    """
    Pagination envelope. Deliberately NOT `total_count` + full list —
    computing a COUNT(*) on every page request would force a full-table
    scan just to render a "next" button. next_offset is None once the
    caller has reached the end.
    """
    items: List[SymptomEntryOut]
    next_offset: Optional[int]
    limit: int


class DoctorOut(BaseModel):
    name: str
    address: str
    rating: Optional[float] = None
    lat: float
    lng: float
    place_id: str
