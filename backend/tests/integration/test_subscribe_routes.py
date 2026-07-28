import pytest

pytestmark = pytest.mark.integration


async def test_subscribe_success(client, test_db, mock_mailgun):
    mock_mailgun.return_value.ok = True

    resp = await client.post(
        "/api/subscribe", json={"email": "new@example.com", "locale": "es", "source": "blog"}
    )

    assert resp.status_code == 201
    assert resp.json() == {"success": True}

    saved = await test_db.subscribers.find_one({"email": "new@example.com"})
    assert saved is not None
    assert saved["confirmed"] is True
    assert saved["locale"] == "es"
    assert saved["unsubscribeToken"]

    mock_mailgun.assert_called_once()


async def test_subscribe_duplicate_email_returns_409(client, mock_mailgun):
    mock_mailgun.return_value.ok = True

    first = await client.post("/api/subscribe", json={"email": "dupe@example.com"})
    second = await client.post("/api/subscribe", json={"email": "dupe@example.com"})

    assert first.status_code == 201
    assert second.status_code == 409
    assert second.json()["detail"] == "already_subscribed"


async def test_subscribe_falls_back_to_defaults_for_invalid_locale_source(client, test_db, mock_mailgun):
    mock_mailgun.return_value.ok = True

    await client.post(
        "/api/subscribe", json={"email": "fallback@example.com", "locale": "fr", "source": "random"}
    )

    saved = await test_db.subscribers.find_one({"email": "fallback@example.com"})
    assert saved["locale"] == "en"
    assert saved["source"] == "footer"


async def test_subscribe_rejects_invalid_email(client):
    resp = await client.post("/api/subscribe", json={"email": "not-an-email"})
    assert resp.status_code == 422
