import pytest

pytestmark = pytest.mark.integration


async def test_root(client):
    resp = await client.get("/api/")
    assert resp.status_code == 200
    assert resp.json() == {"message": "Hello World"}


async def test_create_and_list_status_check(client):
    resp = await client.post("/api/status", json={"client_name": "acme"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["client_name"] == "acme"
    assert "id" in body

    resp = await client.get("/api/status")
    assert resp.status_code == 200
    clients = [c["client_name"] for c in resp.json()]
    assert "acme" in clients
