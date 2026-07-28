import pytest

pytestmark = pytest.mark.integration


async def test_create_blog_requires_api_key(client):
    resp = await client.post(
        "/api/blogs/create",
        json={"title": "No Auth", "summary": "s", "content": "c"},
    )
    assert resp.status_code == 401


async def test_create_blog_rejects_wrong_api_key(client):
    resp = await client.post(
        "/api/blogs/create",
        json={"title": "Wrong Key", "summary": "s", "content": "c"},
        headers={"x-api-key": "not-the-real-key"},
    )
    assert resp.status_code == 401


async def test_create_blog_success(client):
    resp = await client.post(
        "/api/blogs/create",
        json={"title": "My First Post", "summary": "s", "content": "word " * 250},
        headers={"x-api-key": "test-admin-key"},
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["data"]["slug"] == "my-first-post"
    assert body["data"]["url"].endswith("/blog/my-first-post")


async def test_create_blog_duplicate_title_gets_unique_slug(client):
    payload = {"title": "Same Title", "summary": "s", "content": "c"}
    headers = {"x-api-key": "test-admin-key"}

    first = await client.post("/api/blogs/create", json=payload, headers=headers)
    second = await client.post("/api/blogs/create", json=payload, headers=headers)

    assert first.json()["data"]["slug"] == "same-title"
    assert second.json()["data"]["slug"] == "same-title-1"


async def test_list_blogs_only_returns_published(client, make_blog):
    await make_blog(slug="published-post", published=True)
    await make_blog(slug="draft-post", published=False)

    resp = await client.get("/api/blogs")
    slugs = [d["slug"] for d in resp.json()["data"]]

    assert "published-post" in slugs
    assert "draft-post" not in slugs


async def test_list_blogs_pagination(client, make_blog):
    for i in range(3):
        await make_blog(slug=f"post-{i}", title=f"Post {i}")

    resp = await client.get("/api/blogs?page=1&limit=2")
    body = resp.json()

    assert len(body["data"]) == 2
    assert body["pagination"]["total"] == 3
    assert body["pagination"]["totalPages"] == 2


async def test_get_blog_not_found(client):
    resp = await client.get("/api/blogs/does-not-exist")
    assert resp.status_code == 404


async def test_get_blog_found(client, make_blog):
    await make_blog(slug="hello-post", title="Hello Post")
    resp = await client.get("/api/blogs/hello-post")
    assert resp.status_code == 200
    assert resp.json()["data"]["title"] == "Hello Post"


async def test_blog_tags_counts_only_published(client, make_blog):
    await make_blog(slug="p1", tags=["ai", "sales"], published=True)
    await make_blog(slug="p2", tags=["ai"], published=True)
    await make_blog(slug="p3", tags=["ai"], published=False)

    resp = await client.get("/api/blogs/tags")
    counts = {t["tag"]: t["count"] for t in resp.json()}

    assert counts["ai"] == 2
    assert counts["sales"] == 1


async def test_increment_view(client, make_blog):
    await make_blog(slug="view-me", views=0)
    resp = await client.post("/api/blogs/view-me/view")
    assert resp.status_code == 200
    check = await client.get("/api/blogs/view-me")
    assert check.json()["data"]["views"] == 1


async def test_like_blog_not_found(client):
    resp = await client.post("/api/blogs/nope/like")
    assert resp.status_code == 404


async def test_like_blog_increments(client, make_blog):
    await make_blog(slug="like-me", likes=0)
    resp = await client.post("/api/blogs/like-me/like")
    assert resp.status_code == 200
    assert resp.json()["likes"] == 1


async def test_comment_flow(client, make_blog):
    await make_blog(slug="commentable")

    missing = await client.post("/api/blogs/nope/comments", json={"name": "Jane", "body": "hi"})
    assert missing.status_code == 404

    created = await client.post(
        "/api/blogs/commentable/comments", json={"name": "Jane", "body": "Great post!"}
    )
    assert created.status_code == 201

    listed = await client.get("/api/blogs/commentable/comments")
    bodies = [c["body"] for c in listed.json()["data"]]
    assert "Great post!" in bodies


async def test_related_blogs_share_tags_and_exclude_self(client, make_blog):
    await make_blog(slug="main-post", tags=["ai"])
    await make_blog(slug="related-post", tags=["ai"])
    await make_blog(slug="unrelated-post", tags=["cats"])

    resp = await client.get("/api/blogs/main-post/related")
    slugs = [d["slug"] for d in resp.json()]

    assert "related-post" in slugs
    assert "main-post" not in slugs
    assert "unrelated-post" not in slugs
