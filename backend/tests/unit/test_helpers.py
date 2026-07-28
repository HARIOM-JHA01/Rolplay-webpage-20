import pytest
from app.helpers import calc_reading_time, slugify

pytestmark = pytest.mark.unit


def test_slugify_basic():
    assert slugify("Hello World") == "hello-world"


def test_slugify_collapses_symbols_and_trims():
    assert slugify("  Trim -- Me!! ") == "trim-me"


def test_slugify_empty_when_only_symbols():
    assert slugify("!!!") == ""


def test_calc_reading_time_strips_html_tags():
    html = "<p>" + ("word " * 200) + "</p>"
    assert calc_reading_time(html) == 1


def test_calc_reading_time_rounds_up():
    html = "<p>" + ("word " * 450) + "</p>"
    assert calc_reading_time(html) == 3


def test_calc_reading_time_minimum_is_one():
    assert calc_reading_time("") == 1
