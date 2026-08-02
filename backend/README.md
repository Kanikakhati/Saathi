# Saathi Backend (Member 2)

FastAPI service covering: user accounts, storing hybrid-scored symptom
check-ins, the bilingual MRS quiz + suggestions content, and a cached
nearby-gynecologist search.

## Setup

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then fill in GOOGLE_PLACES_API_KEY and JWT_SECRET_KEY
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs` for interactive Swagger docs — the fastest
way to demo this to the other three members or to judges.

## Run the tests

`scoring.py` and `content.py` have zero framework dependencies, so their
tests run with nothing but the standard library — no venv needed:

```bash
python3 -m unittest discover -s tests -v
```

26 tests, all green as of this build. These cover: every severity-band
boundary, missing/unknown/out-of-range MRS keys, and that both content
JSON files actually have all 11 items with matching keys and valid score
ranges in both languages — so if Member 4 edits a content file and typos a
key, this catches it immediately instead of at demo time.

> **Note on the FastAPI layer specifically:** this sandbox has no network
> access, so `uvicorn`/`fastapi` themselves couldn't be pip-installed and
> live-tested here — that part was verified with `python -m py_compile`
> (all clean) plus a careful manual trace of each endpoint. Run the Setup
> steps above yourself early, not the night before demo.

## Endpoints

| Method | Path              | Auth | Purpose |
|--------|-------------------|------|---------|
| POST   | `/auth/register`  | –    | Create a user (name, phone, password) |
| POST   | `/auth/login`     | –    | Get a JWT (`phone` goes in the `username` field) |
| POST   | `/entries`        | ✅   | Store one final, merged check-in |
| GET    | `/entries`        | ✅   | Paginated check-in history (`?limit=&offset=`) |
| GET    | `/entries/latest` | ✅   | Most recent check-in (for the home screen) |
| GET    | `/mrs-questions`  | –    | The 11-question quiz bank (`?lang=en\|hi`) |
| GET    | `/suggestions`    | –    | Diet/exercise tips (`?severity=&lang=`) |
| GET    | `/doctors/nearby` | ✅   | Nearby gynecologists (`?lat=&lng=&radius_m=`) |
| GET    | `/health`         | –    | Liveness check |

Authenticated routes expect `Authorization: Bearer <token>` from `/auth/login`.

### `POST /entries` request body

```json
{
  "raw_text": "raat ko bahut garmi lagti hai...",
  "mrs_scores": { "hot_flashes": 3, "sleep_problems": 2, "...": "...all 11 keys" },
  "stage": "peri_menopause",
  "source": "hybrid"
}
```

`total_score` and `severity_band` are **not** sent by the client — the
backend computes both from `mrs_scores` and returns them in the response.
`mrs_scores` must contain exactly the 11 keys in `app/scoring.py`
(`MRS_SYMPTOM_KEYS`), each 0-4, or the request is rejected with a 422 and a
message naming exactly what's wrong.

## How this plugs into the other members' work

- **Member 3 (AI/NLP)** exposes its own `POST /nlp/score`; once the app has
  merged voice + any quiz answers into a complete 11-key set, it calls
  `POST /entries` here to persist the final result.
- **Member 1 (App)** calls `/auth/*`, `/mrs-questions` (to render the
  ambiguity-fallback popup), `/entries`, `/suggestions`, and
  `/doctors/nearby`.
- **Member 4** owns `content/questions_en.json`, `content/questions_hi.json`,
  and `content/suggestions.json` — edit those files directly, no code
  changes needed, then run the test suite above to confirm nothing broke.

## Time/space complexity choices (why the code looks the way it does)

- **Paginated history (`crud.list_entries_page`)** — fetches `limit + 1` rows via
  `OFFSET/LIMIT` on an index that matches the query (`ix_entries_user_created`).
  Memory per request is `O(limit)`, not `O(user's total entries)`, and there's no
  separate `COUNT(*)` query to know if another page exists.
- **`lazy="raise"` on `User.entries`** — blocks any code path that would
  accidentally lazy-load a user's *entire* history just by touching `user.entries`.
  Forces every read through the paginated function above.
- **`mrs_scores` as one JSON column** instead of one DB column per MRS symptom —
  avoids a sparse, ever-growing schema as more symptoms get added; the set of
  symptoms is a concern for the AI service, not the DB schema.
- **Stateless JWT auth** — no server-side session store, so auth memory usage is
  `O(1)` regardless of how many users are logged in concurrently.
- **Bounded TTL cache for doctor search (`services/places.py`)** — capped at
  `places_cache_size` entries (default 256) with a 6-hour expiry and coordinate
  rounding to a ~1km grid, so repeated nearby searches share a cache entry
  instead of the cache (or the Google API bill) growing unbounded over a long
  demo/judging session.
- **Hard ceilings everywhere a caller supplies a size** — `limit` is clamped to
  `[1, 100]`, doctor results capped at 15 — so no single request can force the
  server to hold an unexpectedly large response in memory.
- **Content files loaded once, cached forever (`content.py`)** — `lru_cache`
  on the file loader means each JSON file is read from disk at most once per
  process, not once per request. The cache is bounded by the small, fixed
  number of real filenames (`questions_en.json`, `questions_hi.json`,
  `suggestions.json`) — it can never grow with request volume.
- **Server-computed `total_score`/`severity_band`, not client-supplied** —
  removes an entire class of bug where the app's merge logic disagrees with
  what it reports, and removes it as an attack surface (a client can't lie
  about its own severity).

## Swapping SQLite → Supabase/Postgres

Nothing in the code changes — just set `DATABASE_URL` in `.env` to a Postgres
connection string. `check_same_thread` is only applied when the URL starts
with `sqlite`, so it's a no-op on Postgres.
