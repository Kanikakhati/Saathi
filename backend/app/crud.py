from typing import List, Optional, Tuple

from sqlalchemy import select
from sqlalchemy.orm import Session

from . import models, schemas
from .scoring import compute_severity_band, total_score_of
from .security import hash_password


def create_user(db: Session, payload: schemas.UserCreate) -> models.User:
    user = models.User(
        name=payload.name,
        phone=payload.phone,
        hashed_password=hash_password(payload.password),
        preferred_language=payload.preferred_language,
        age=payload.age,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_phone(db: Session, phone: str) -> Optional[models.User]:
    return db.execute(
        select(models.User).where(models.User.phone == phone)
    ).scalar_one_or_none()


def create_entry(db: Session, user_id: str, payload: schemas.SymptomEntryCreate) -> models.SymptomEntry:
    """
    Assumes the caller (the router) has already run scoring.validate_mrs_scores
    on payload.mrs_scores — this function trusts that and just does the math
    + the write. Keeping validation in the router and computation here keeps
    each layer doing one job.
    """
    total = total_score_of(payload.mrs_scores)
    entry = models.SymptomEntry(
        user_id=user_id,
        raw_text=payload.raw_text,
        mrs_scores=payload.mrs_scores,
        total_score=total,
        severity_band=compute_severity_band(total),
        stage=models.Stage(payload.stage),
        source=payload.source,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def list_entries_page(
    db: Session, user_id: str, limit: int = 20, offset: int = 0
) -> Tuple[List[models.SymptomEntry], Optional[int]]:
    """
    One page of a user's check-in history, newest first.

    Space: O(limit) — at most `limit + 1` rows ever live in memory here,
    regardless of how many thousand entries the user has accumulated.
    Time: an index range scan on (user_id, created_at) rather than a
    full-table scan + sort, thanks to ix_entries_user_created.

    The "+1" trick (fetch limit+1, return limit) tells us whether another
    page exists without running a separate COUNT(*) query.
    """
    limit = max(1, min(limit, 100))  # hard ceiling: no caller can force an unbounded fetch
    rows = db.execute(
        select(models.SymptomEntry)
        .where(models.SymptomEntry.user_id == user_id)
        .order_by(models.SymptomEntry.created_at.desc())
        .offset(offset)
        .limit(limit + 1)
    ).scalars().all()

    has_more = len(rows) > limit
    page = rows[:limit]
    next_offset = offset + limit if has_more else None
    return page, next_offset


def latest_entry(db: Session, user_id: str) -> Optional[models.SymptomEntry]:
    """O(1) memory — a single LIMIT 1 row, not 'load history then take last'."""
    return db.execute(
        select(models.SymptomEntry)
        .where(models.SymptomEntry.user_id == user_id)
        .order_by(models.SymptomEntry.created_at.desc())
        .limit(1)
    ).scalar_one_or_none()
