import time
from typing import Dict, List, Optional, Tuple

import httpx

from ..config import get_settings
from ..schemas import DoctorOut

settings = get_settings()

_PLACES_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"


class _BoundedTTLCache:
    """
    A fixed-capacity, expiring cache for doctor-search results.

    Why not a plain dict? A plain dict grows forever — every distinct
    (lat, lng, radius) a user ever searches from would sit in memory for
    the lifetime of the process. This cache instead guarantees:
      - Space: O(maxsize) always, never O(distinct queries seen).
      - Freshness: an entry older than ttl_seconds is treated as a miss,
        so a clinic that closes or a rating that changes doesn't get
        served stale forever.
    Eviction is oldest-first and O(maxsize) only on the rare insert that
    overflows capacity — not on every read.
    """

    def __init__(self, maxsize: int, ttl_seconds: int):
        self.maxsize = maxsize
        self.ttl = ttl_seconds
        self._store: Dict[str, Tuple[float, List[DoctorOut]]] = {}

    def get(self, key: str) -> Optional[List[DoctorOut]]:
        hit = self._store.get(key)
        if hit is None:
            return None
        timestamp, value = hit
        if time.time() - timestamp > self.ttl:
            self._store.pop(key, None)
            return None
        return value

    def set(self, key: str, value: List[DoctorOut]) -> None:
        if len(self._store) >= self.maxsize and key not in self._store:
            oldest_key = min(self._store, key=lambda k: self._store[k][0])
            self._store.pop(oldest_key, None)
        self._store[key] = (time.time(), value)

    def __len__(self) -> int:
        return len(self._store)


_cache = _BoundedTTLCache(settings.places_cache_size, settings.places_cache_ttl_seconds)


def _cache_key(lat: float, lng: float, radius_m: int) -> str:
    # Round to ~1km grid cells so nearby searches (e.g. two users on the
    # same street) share one cache entry instead of each paying for a
    # fresh, near-identical Places API call.
    return f"{round(lat, 2)},{round(lng, 2)},{radius_m}"


async def find_nearby_gynecologists(
    lat: float, lng: float, radius_m: int = 5000
) -> List[DoctorOut]:
    key = _cache_key(lat, lng, radius_m)
    cached = _cache.get(key)
    if cached is not None:
        return cached

    params = {
        "location": f"{lat},{lng}",
        "radius": radius_m,
        "keyword": "gynecologist",
        "type": "doctor",
        "key": settings.google_places_api_key,
    }
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(_PLACES_URL, params=params)
        resp.raise_for_status()
        data = resp.json()

    results = [
        DoctorOut(
            name=r["name"],
            address=r.get("vicinity", ""),
            rating=r.get("rating"),
            lat=r["geometry"]["location"]["lat"],
            lng=r["geometry"]["location"]["lng"],
            place_id=r["place_id"],
        )
        # Cap at 15 — the map UI never shows more pins than that usefully,
        # so there's no reason to carry a bigger payload over the wire
        # or hold it in the cache.
        for r in data.get("results", [])[:15]
    ]
    _cache.set(key, results)
    return results
