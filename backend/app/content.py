"""
Loads Member 4's content files (MRS questions, suggestions) from disk.

Deliberately raises plain Python exceptions (ContentNotFoundError), not
HTTPException — this module doesn't know it's being used inside a web
app, so it stays testable on its own and reusable if the content ever
needs to be served a different way (a CLI, a batch export, etc.).
The router layer (routers/content.py) is what translates these into
HTTP responses.
"""
import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List

CONTENT_DIR = Path(__file__).resolve().parent.parent / "content"


class ContentNotFoundError(Exception):
    """No content file, language, or severity band matches the request."""


@lru_cache(maxsize=8)
def _load_json(filename: str) -> Any:
    """
    Read + parse once per filename, then serve from memory forever after.
    Content files are small (a few KB) and static for the duration of a
    hackathon demo, so an unbounded-by-request-count but tiny, fixed-size
    cache (at most a handful of filenames ever get requested) is the
    right trade: O(1) disk reads instead of O(requests).
    """
    path = CONTENT_DIR / filename
    if not path.exists():
        raise ContentNotFoundError(f"Missing content file: {filename}")
    return json.loads(path.read_text(encoding="utf-8"))


def get_questions(lang: str) -> List[Dict[str, Any]]:
    return _load_json(f"questions_{lang}.json")


def get_suggestions(severity: str, lang: str) -> Dict[str, Any]:
    data = _load_json("suggestions.json")
    band = data.get(severity)
    if band is None:
        raise ContentNotFoundError(f"No suggestions for severity={severity}")
    localized = band.get(lang)
    if localized is None:
        raise ContentNotFoundError(f"No suggestions for lang={lang}")
    return {"severity": severity, "lang": lang, **localized}
