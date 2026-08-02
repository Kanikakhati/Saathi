from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth, content, doctors, entries

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Saathi API",
    description="Backend for the Saathi menopause-awareness companion.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to the app's real origin before shipping past the hackathon
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(entries.router)
app.include_router(doctors.router)
app.include_router(content.router)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}
