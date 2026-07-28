import pytest
from pydantic import ValidationError

from app.models import BlogCreate, CommentCreate, ContactCreate, SubscriberCreate

pytestmark = pytest.mark.unit


def test_contact_create_rejects_invalid_email():
    with pytest.raises(ValidationError):
        ContactCreate(name="Jane", email="not-an-email", message="hi")


def test_contact_create_rejects_empty_message():
    with pytest.raises(ValidationError):
        ContactCreate(name="Jane", email="jane@example.com", message="")


def test_contact_create_accepts_valid_payload():
    c = ContactCreate(name="Jane", email="jane@example.com", message="hi there")
    assert c.email == "jane@example.com"


def test_subscriber_create_rejects_invalid_email():
    with pytest.raises(ValidationError):
        SubscriberCreate(email="not-an-email")


def test_comment_create_rejects_empty_body():
    with pytest.raises(ValidationError):
        CommentCreate(name="Jane", body="")


def test_blog_create_rejects_title_over_max_length():
    with pytest.raises(ValidationError):
        BlogCreate(title="x" * 201, summary="s", content="c")


def test_blog_create_defaults_published_true():
    b = BlogCreate(title="Title", summary="Summary", content="Content")
    assert b.published is True
    assert b.tags == []
