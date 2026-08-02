from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db
from ..deps import get_current_user
from ..scoring import validate_mrs_scores

router = APIRouter(prefix="/entries", tags=["symptom-entries"])


@router.post("", response_model=schemas.SymptomEntryOut, status_code=201)
def create_entry(
    payload: schemas.SymptomEntryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Store one final, merged check-in (called after the app has combined
    voice + any quiz answers into a complete 11-symptom set).
    Rejects incomplete/out-of-range payloads with a 422 before anything
    touches the database.
    """
    try:
        validate_mrs_scores(payload.mrs_scores)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return crud.create_entry(db, current_user.id, payload)


@router.get("", response_model=schemas.EntryPage)
def list_entries(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Paginated history — holds at most `limit` rows in memory per request."""
    items, next_offset = crud.list_entries_page(db, current_user.id, limit, offset)
    return schemas.EntryPage(items=items, next_offset=next_offset, limit=limit)


@router.get("/latest", response_model=Optional[schemas.SymptomEntryOut])
def get_latest_entry(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Powers the home-screen risk summary — single-row fetch, no history scan."""
    return crud.latest_entry(db, current_user.id)
