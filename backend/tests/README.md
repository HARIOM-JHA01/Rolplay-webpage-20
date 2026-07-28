# Backend tests

Three tiers, run with plain `pytest` from `backend/`. `conftest.py` forces
`MONGO_URL`/`DB_NAME` to a throwaway test DB before anything imports
`app.config` — tests can never accidentally hit whatever's in `backend/.env`
(e.g. a real Atlas URL).

## Setup (one-time)

```bash
cd backend
source .venv/bin/activate        # or create one: python3 -m venv .venv
pip install -r requirements-dev.txt
```

## Unit tests — no DB, no network

Pure logic (`helpers.py`, `models.py`) and service modules with `requests`
mocked (`mailgun.py`, `hubspot.py`).

```bash
pytest tests/unit
```

## Integration tests — real Mongo, external HTTP mocked

Hits FastAPI routes in-process (`httpx.ASGITransport`) against a real
MongoDB container, so query/index/pagination/dedupe logic is genuinely
exercised. Mailgun/HubSpot calls are mocked — no real email or CRM traffic.

```bash
docker compose -f ../docker-compose.test.yml up -d mongo-test
pytest tests/integration
docker compose -f ../docker-compose.test.yml down -v   # when done
```

`pytest tests/unit tests/integration` (or just `pytest`, since `pytest.ini`
excludes `e2e` by default) requires `mongo-test` to be up.

## E2E — the real Docker image, over real HTTP

Builds `backend/Dockerfile` and runs it against `mongo-test` on the Docker
network via `docker-compose.test.yml --profile e2e`, then hits it with real
HTTP requests to `localhost:8099`. This is the only tier that would catch a
broken `Dockerfile`, a bad `CMD`, or env vars not reaching the container —
things the in-process integration tests can't see. Slow (image build) and
requires Docker; skipped by default.

```bash
pytest -m e2e tests/e2e
```

The test manages `docker compose up -d --build` / `down -v` itself.

## Everything except e2e (what CI should run on every push)

```bash
docker compose -f ../docker-compose.test.yml up -d mongo-test
pytest
docker compose -f ../docker-compose.test.yml down -v
```
