import enum
import uuid
from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, Enum as SAEnum, Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


def gen_uuid() -> str:
    return str(uuid.uuid4())


class Stage(str, enum.Enum):
    PRE = "pre_menopause"
    PERI = "peri_menopause"
    MENO = "menopause"
    POST = "post_menopause"
    UNKNOWN = "unknown"


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(120), nullable=False)
    phone = Column(String(20), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    preferred_language = Column(String(10), default="hi")
    age = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # lazy="raise" is deliberate: it forbids implicit lazy-loading of
    # entries through a User object. Any code that needs a user's entries
    # must go through crud.list_entries_page() and get a paginated,
    # bounded-memory result — it can never accidentally do
    # `user.entries` and pull an entire history table into memory.
    entries = relationship(
        "SymptomEntry",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="raise",
    )


class SymptomEntry(Base):
    """
    One voice/text check-in, already scored against the Menopause Rating
    Scale (MRS) by the AI/NLP service (Member 3). The backend just stores
    and serves it — no scoring logic lives here.
    """
    __tablename__ = "symptom_entries"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    raw_text = Column(Text, nullable=False)  # transcribed speech, kept for the doctor-visit summary
    mrs_scores = Column(JSON, nullable=False)  # {"hot_flashes": 3, "sleep": 2, ...} — one flexible column
    # instead of one DB column per possible MRS symptom (which would be
    # mostly-empty/sparse per row and waste storage as the symptom list grows).
    total_score = Column(Float, nullable=False)  # computed server-side from mrs_scores — see scoring.py
    severity_band = Column(String(10), nullable=False)  # "none" | "mild" | "moderate" | "severe"
    stage = Column(SAEnum(Stage), default=Stage.UNKNOWN, nullable=False)
    source = Column(String(10), default="voice", nullable=False)  # "voice" | "quiz" | "hybrid"

    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="entries")

    __table_args__ = (
        # Composite index matching the (user_id, created_at DESC) query shape
        # used by list_entries_page() — turns "this user's history" into an
        # index range scan instead of a full-table scan as entries grow.
        Index("ix_entries_user_created", "user_id", "created_at"),
    )
