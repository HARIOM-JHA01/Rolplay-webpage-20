import pytest
from app.services import hubspot

pytestmark = pytest.mark.unit


def test_push_contact_skips_when_no_token(mocker, monkeypatch):
    monkeypatch.setattr(hubspot, "HUBSPOT_ACCESS_TOKEN", "")
    post = mocker.patch("app.services.hubspot.requests.post")

    hubspot.push_contact("Jane Doe", "jane@example.com", "Acme", "hi")

    post.assert_not_called()


def test_push_contact_creates_new_contact(mocker, monkeypatch):
    monkeypatch.setattr(hubspot, "HUBSPOT_ACCESS_TOKEN", "token-123")
    post = mocker.patch("app.services.hubspot.requests.post")
    post.return_value.ok = True
    post.return_value.status_code = 201

    hubspot.push_contact("Jane Doe", "jane@example.com", "Acme", "hi")

    post.assert_called_once()
    payload = post.call_args.kwargs["json"]["properties"]
    assert payload["firstname"] == "Jane"
    assert payload["lastname"] == "Doe"
    assert payload["email"] == "jane@example.com"
    assert payload["company"] == "Acme"


def test_push_contact_updates_on_conflict(mocker, monkeypatch):
    monkeypatch.setattr(hubspot, "HUBSPOT_ACCESS_TOKEN", "token-123")
    post = mocker.patch("app.services.hubspot.requests.post")
    post.return_value.ok = False
    post.return_value.status_code = 409

    get = mocker.patch("app.services.hubspot.requests.get")
    get.return_value.ok = True
    get.return_value.json.return_value = {"id": "42"}

    patch = mocker.patch("app.services.hubspot.requests.patch")
    patch.return_value.ok = True

    hubspot.push_contact("Jane Doe", "jane@example.com", "Acme", "hi")

    get.assert_called_once()
    patch.assert_called_once()
    assert "42" in patch.call_args.args[0]


def test_push_contact_handles_single_name(mocker, monkeypatch):
    monkeypatch.setattr(hubspot, "HUBSPOT_ACCESS_TOKEN", "token-123")
    post = mocker.patch("app.services.hubspot.requests.post")
    post.return_value.ok = True

    hubspot.push_contact("Madonna", "m@example.com", "", "hi")

    payload = post.call_args.kwargs["json"]["properties"]
    assert payload["firstname"] == "Madonna"
    assert payload["lastname"] == ""
