from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import ScoreRequest, ScoreResponse
from .scorer import score_text, USE_LLM, LLM_PROVIDER

app = FastAPI(title="Saathi NLP Service", version="0.1.0")

print(f"[saathi-nlp] Config loaded — USE_LLM={USE_LLM}, PROVIDER={LLM_PROVIDER}")

# Wide open for hackathon demo speed — tighten before anything real.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "service": "saathi-nlp"}


@app.post("/nlp/score", response_model=ScoreResponse)
def nlp_score(req: ScoreRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="text cannot be empty")
    result = score_text(req.text, req.lang)
    return result
