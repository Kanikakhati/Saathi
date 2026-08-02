from typing import List

from fastapi import APIRouter, Depends, Query

from .. import models
from ..deps import get_current_user
from ..schemas import DoctorOut
from ..services.places import find_nearby_gynecologists

router = APIRouter(prefix="/doctors", tags=["doctors"])


@router.get("/nearby", response_model=List[DoctorOut])
async def nearby_doctors(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    radius_m: int = Query(5000, ge=500, le=20000),
    current_user: models.User = Depends(get_current_user),
):
    """Nearby gynecologists, backed by a bounded TTL cache (see services/places.py)."""
    return await find_nearby_gynecologists(lat, lng, radius_m)
