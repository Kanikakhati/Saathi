"""
Centralized, cached settings. get_settings() is memoized with lru_cache(maxsize=1)
so the whole app shares ONE Settings object instead of re-parsing the environment
(and re-allocating a new object) on every request.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./saathi.db"
    google_places_api_key: str = ""

    jwt_secret_key: str = "dev-only-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 1 day

    # Bounds on the in-memory doctor-search cache — see services/places.py
    places_cache_size: int = 256
    places_cache_ttl_seconds: int = 60 * 60 * 6  # 6 hours

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
