from typing import Any, Dict, List, Literal

from fastapi import APIRouter, HTTPException

from .. import content

router = APIRouter(tags=["content"])


@router.get("/mrs-questions", response_model=List[Dict[str, Any]])
def get_mrs_questions(lang: Literal["en", "hi"] = "en"):
    """The 11-question MRS quiz bank, used for the ambiguity-fallback popup."""
    try:
        return content.get_questions(lang)
    except content.ContentNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/suggestions", response_model=Dict[str, Any])
def get_suggestions(
    severity: Literal["none", "mild", "moderate", "severe"],
    lang: Literal["en", "hi"] = "en",
):
    """Diet/exercise tips keyed by the severity_band returned on a SymptomEntry."""
    try:
        return content.get_suggestions(severity, lang)
    except content.ContentNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
