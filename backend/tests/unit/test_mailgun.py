import pytest
from app.services import mailgun

pytestmark = pytest.mark.unit


def test_send_skips_when_not_configured(mocker, monkeypatch):
    monkeypatch.setattr(mailgun, "MAILGUN_API_KEY", "")
    monkeypatch.setattr(mailgun, "MAILGUN_DOMAIN", "")
    post = mocker.patch("app.services.mailgun.requests.post")

    mailgun.send(["a@example.com"], "Subject", "<p>body</p>")

    post.assert_not_called()


def test_send_posts_to_mailgun_per_recipient(mocker, monkeypatch):
    monkeypatch.setattr(mailgun, "MAILGUN_API_KEY", "key-123")
    monkeypatch.setattr(mailgun, "MAILGUN_DOMAIN", "mg.example.com")
    monkeypatch.setattr(mailgun, "MAILGUN_FROM", "RolPlay <noreply@example.com>")
    post = mocker.patch("app.services.mailgun.requests.post")
    post.return_value.ok = True

    mailgun.send(["a@example.com", "b@example.com"], "Subject", "<p>body</p>")

    assert post.call_count == 2
    first_call = post.call_args_list[0]
    assert first_call.args[0] == "https://api.mailgun.net/v3/mg.example.com/messages"
    assert first_call.kwargs["auth"] == ("api", "key-123")
    assert first_call.kwargs["data"]["to"] == "a@example.com"
    assert first_call.kwargs["data"]["subject"] == "Subject"


def test_send_logs_but_does_not_raise_on_failure(mocker, monkeypatch):
    monkeypatch.setattr(mailgun, "MAILGUN_API_KEY", "key-123")
    monkeypatch.setattr(mailgun, "MAILGUN_DOMAIN", "mg.example.com")
    post = mocker.patch("app.services.mailgun.requests.post")
    post.return_value.ok = False
    post.return_value.status_code = 500
    post.return_value.text = "boom"

    mailgun.send(["a@example.com"], "Subject", "<p>body</p>")  # must not raise
