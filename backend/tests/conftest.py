import os

# Must run before any `app.*` import — app.config raises if MONGO_URL/DB_NAME are
# unset, and python-dotenv's load_dotenv() never overrides an already-set env var.
# Setting these here guarantees tests always hit the throwaway test DB below,
# never whatever MONGO_URL happens to be in backend/.env (e.g. a real Atlas URL).
os.environ.setdefault("MONGO_URL", "mongodb://localhost:27018")
os.environ.setdefault("DB_NAME", "rolplay_test")
os.environ.setdefault("ADMIN_API_KEY", "test-admin-key")
os.environ.setdefault("SITE_URL", "http://testserver")
os.environ.setdefault("CORS_ORIGINS", "*")
os.environ.setdefault("MAILGUN_API_KEY", "")
os.environ.setdefault("MAILGUN_DOMAIN", "")
os.environ.setdefault("HUBSPOT_ACCESS_TOKEN", "")
os.environ.setdefault("NOTIFICATION_EMAILS", "")

import httpx
import pytest

TEST_COLLECTIONS = ["blogs", "subscribers", "contacts", "comments", "status_checks"]


@pytest.fixture
async def test_db():
    from app.database import connect, disconnect, get_db

    await connect()
    db = get_db()
    try:
        yield db
    finally:
        for name in TEST_COLLECTIONS:
            await db[name].delete_many({})
        await disconnect()


@pytest.fixture
async def client(test_db):
    from app.main import app

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac


@pytest.fixture
def mock_mailgun(mocker, monkeypatch):
    # send() no-ops unless these look configured — set dummy values so the
    # mocked requests.post is actually reached.
    #
    # NB: mailgun.py and hubspot.py both do a plain `import requests`, so
    # they share the exact same `requests` module object. Patching
    # `app.services.mailgun.requests.post` directly would also clobber
    # hubspot's `requests.post` (and vice versa) if both fixtures are active
    # in the same test — whichever patches last silently wins for both.
    # Replacing each module's own `requests` *name binding* with an
    # independent fake object keeps the two fully isolated.
    from app.services import mailgun

    monkeypatch.setattr(mailgun, "MAILGUN_API_KEY", "test-key")
    monkeypatch.setattr(mailgun, "MAILGUN_DOMAIN", "mg.test.example.com")
    fake_requests = mocker.MagicMock()
    monkeypatch.setattr(mailgun, "requests", fake_requests)
    return fake_requests.post


@pytest.fixture
def mock_hubspot(mocker, monkeypatch):
    from app.services import hubspot

    monkeypatch.setattr(hubspot, "HUBSPOT_ACCESS_TOKEN", "test-token")
    fake_requests = mocker.MagicMock()
    monkeypatch.setattr(hubspot, "requests", fake_requests)
    return {
        "post": fake_requests.post,
        "get": fake_requests.get,
        "patch": fake_requests.patch,
    }


@pytest.fixture
def make_blog(test_db):
    async def _make(**overrides):
        doc = {
            "title": "Test Post",
            "slug": "test-post",
            "summary": "A test post summary",
            "content": "<p>hello world</p>",
            "coverImage": None,
            "tags": ["ai", "sales"],
            "source": None,
            "published": True,
            "views": 0,
            "likes": 0,
            "readingTime": 1,
            "createdAt": "2026-01-01T00:00:00+00:00",
            "updatedAt": "2026-01-01T00:00:00+00:00",
        }
        doc.update(overrides)
        await test_db.blogs.insert_one(doc)
        return doc

    return _make
