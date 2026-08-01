from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import get_settings

settings = get_settings()

# check_same_thread only matters for SQLite; harmless to set unconditionally-guarded here
# since it's only added when the URL is actually SQLite (a Postgres/Supabase URL ignores it).
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """
    One connection per request, closed as soon as the request ends —
    no session or connection is ever held in module-level state, so
    server memory doesn't grow with request count.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
