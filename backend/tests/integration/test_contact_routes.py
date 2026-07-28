import pytest

pytestmark = pytest.mark.integration


async def test_contact_saves_and_notifies(client, test_db, mock_mailgun, mock_hubspot, monkeypatch):
    monkeypatch.setattr("app.routes.contact.NOTIFICATION_EMAILS", ["team@example.com"])
    mock_mailgun.return_value.ok = True
    mock_hubspot["post"].return_value.ok = True

    resp = await client.post(
        "/api/contact",
        json={"name": "Jane Doe", "email": "jane@example.com", "company": "Acme", "message": "Hi there"},
    )

    assert resp.status_code == 201
    assert resp.json() == {"success": True}

    saved = await test_db.contacts.find_one({"email": "jane@example.com"})
    assert saved is not None
    assert saved["name"] == "Jane Doe"
    assert saved["company"] == "Acme"

    mock_mailgun.assert_called_once()
    mock_hubspot["post"].assert_called_once()


async def test_contact_skips_team_email_when_no_notification_emails(
    client, mock_mailgun, mock_hubspot, monkeypatch
):
    monkeypatch.setattr("app.routes.contact.NOTIFICATION_EMAILS", [])
    mock_hubspot["post"].return_value.ok = True

    resp = await client.post(
        "/api/contact",
        json={"name": "No Notify", "email": "nonotify@example.com", "message": "Hi"},
    )

    assert resp.status_code == 201
    mock_mailgun.assert_not_called()
    mock_hubspot["post"].assert_called_once()


async def test_contact_rejects_invalid_email(client):
    resp = await client.post(
        "/api/contact",
        json={"name": "Bad Email", "email": "not-an-email", "message": "hi"},
    )
    assert resp.status_code == 422
