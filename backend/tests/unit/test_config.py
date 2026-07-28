import pytest
from app.config import _require

pytestmark = pytest.mark.unit


def test_require_raises_when_missing(monkeypatch):
    monkeypatch.delenv("SOME_UNSET_VAR", raising=False)
    with pytest.raises(RuntimeError, match="SOME_UNSET_VAR"):
        _require("SOME_UNSET_VAR")


def test_require_returns_value_when_set(monkeypatch):
    monkeypatch.setenv("SOME_SET_VAR", "value")
    assert _require("SOME_SET_VAR") == "value"


def test_require_raises_when_empty_string(monkeypatch):
    monkeypatch.setenv("SOME_EMPTY_VAR", "")
    with pytest.raises(RuntimeError):
        _require("SOME_EMPTY_VAR")
