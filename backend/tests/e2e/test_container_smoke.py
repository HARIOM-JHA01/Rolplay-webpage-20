"""
Full-stack smoke test: builds the real backend Docker image and runs it
against the real mongo-test container (docker-compose.test.yml, --profile e2e),
then hits it over actual HTTP. Unlike the integration tests (which call the
ASGI app in-process), this exercises the Dockerfile, uvicorn entrypoint, and
env var wiring exactly as Coolify would run them.

Requires Docker. Skipped unless explicitly requested:
    pytest -m e2e
"""

import shutil
import subprocess
import time
from pathlib import Path

import httpx
import pytest

pytestmark = pytest.mark.e2e

COMPOSE_FILE = Path(__file__).resolve().parents[3] / "docker-compose.test.yml"
BASE_URL = "http://localhost:8099"

requires_docker = pytest.mark.skipif(shutil.which("docker") is None, reason="Docker not available")


def _compose(*args):
    subprocess.run(
        ["docker", "compose", "-f", str(COMPOSE_FILE), "--profile", "e2e", *args],
        check=True,
        capture_output=True,
        text=True,
    )


@pytest.fixture(scope="module")
def running_stack():
    _compose("up", "-d", "--build")
    try:
        deadline = time.time() + 60
        last_error = None
        while time.time() < deadline:
            try:
                resp = httpx.get(f"{BASE_URL}/api/", timeout=2)
                if resp.status_code == 200:
                    break
            except httpx.HTTPError as exc:
                last_error = exc
            time.sleep(1)
        else:
            pytest.fail(f"backend-test never became healthy: {last_error}")
        yield
    finally:
        _compose("down", "-v")


@requires_docker
def test_root_endpoint_over_real_http(running_stack):
    resp = httpx.get(f"{BASE_URL}/api/")
    assert resp.status_code == 200
    assert resp.json() == {"message": "Hello World"}


@requires_docker
def test_blogs_endpoint_over_real_http(running_stack):
    resp = httpx.get(f"{BASE_URL}/api/blogs")
    assert resp.status_code == 200
    assert resp.json()["success"] is True
