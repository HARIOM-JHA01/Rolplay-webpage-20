# RolPlay Website — Onboarding & Engineering Guide

> **Audience:** Anyone taking over or joining the RolPlay marketing website.
> **Owner:** RolPlay Engineering · **Last updated:** July 2026
>
> This is the single source of truth for the website. Read §1–§2 to get running
> today; §3–§9 are the reference; §10–§13 cover operations and handoff.
> Secret **values** are never stored here — see §13.

---

## 1. Overview

The RolPlay marketing site is a **two-service application**:

- a **React single-page app** (Create React App / CRACO), and
- a **FastAPI + MongoDB backend** that powers the contact form, newsletter
  subscriptions, and the blog.

Both run as containers via **Docker Compose**, behind a reverse proxy
(**Coolify / Traefik**) that handles the domain, routing, and SSL. The site is
bilingual (**EN / ES**, default Spanish), includes an ElevenLabs AI voice
assistant, and pushes contact submissions to **HubSpot** while emailing the team
via **Mailgun**.

---

## 2. Quick Start (local)

**Prerequisites:** Docker + Docker Compose, or Node 20 and Python 3.11 for
running services directly.

### Option A — Docker Compose (closest to production)

```bash
git clone <your-repo-url>
cd <repo>
cp .env.example .env          # fill in the values (see §6)
docker compose up -d --build
```

- Frontend → served on container port `3000`
- Backend  → container port `8000` (host `8001` by default via `BACKEND_HOST_PORT`)
- MongoDB  → `mongo:7` with a persistent `mongo_data` volume

### Option B — run services directly

```bash
# Frontend
npm ci --legacy-peer-deps
npm start                      # http://localhost:3000

# Backend (separate terminal)
cd backend
pip install -r requirements.txt
cp .env.example .env           # then edit backend/.env (see §6)
uvicorn server:app --reload --port 8000
```

**Verify it works:** open the site, switch EN/ES, submit the contact form, and
subscribe to the newsletter — then confirm the Mongo `contacts` / `subscribers`
documents were created.

---

## 3. Architecture

| Service | Tech | Build |
|---|---|---|
| **Frontend** | React 19 (CRA/CRACO), served via `serve` | `frontend.Dockerfile` (`node:20-alpine`) |
| **Backend** | FastAPI + MongoDB (Motor) | `backend/Dockerfile` (`python:3.11-slim`, `uvicorn`) |
| **Database** | MongoDB | `mongo:7` image |

All three are services in `docker-compose.yml` at the repo root, using `expose`
only (no host port bindings in production) — the reverse proxy handles external
routing, the domain, and SSL termination.

**Deploy flow:**

```
push to main → host/Coolify pulls → docker compose up -d --build
             → frontend, backend, mongo rebuilt/restarted
             → Coolify/Traefik routes traffic + terminates SSL
```

---

## 4. Tech Stack

> **Source of truth for versions:** `package.json` (frontend) and
> `backend/requirements.txt` (backend). The lists below are for orientation.

**Frontend:** React 19 · CRACO 7 · React Router 7 · Tailwind CSS 3 ·
Framer Motion 12 · i18next + react-i18next · Axios · Lucide React · Sonner ·
Radix UI · react-globe.gl · ElevenLabs (`@11labs/react`).

**Backend:** FastAPI · Motor (async MongoDB) · Mailgun (transactional email) ·
HubSpot API (CRM push) · `requests`. Blog-create is authenticated with an
`x-api-key` header (`ADMIN_API_KEY`).

---

## 5. Repository Structure

```
src/
  components/       Navigation, Footer, ContactForm, ElevenLabsWidget,
                    WhatsAppOrb, SubscribeForm, VideoPlayer, GlobeSection…
  components/blog/  BlogCard, BlogGrid, NewsletterForm, ShareBar,
                    LikeButton, CommentsSection, RelatedArticles…
  components/ui/    Radix-based primitives
  pages/            Home, About, Benefits, Achievements, SuccessStories,
                    Contact, FAQs, Blog, BlogPost
  locales/          en.json, es.json
  i18n.js           i18next config
backend/
  server.py         entrypoint (imports app.main)
  app/
    main.py         FastAPI app, router registration, CORS, middleware
    config.py       env var loading
    database.py     Motor client / get_db()
    models.py       Pydantic models
    helpers.py, logging_config.py, middleware/request_logging.py
    routes/         status.py, blogs.py, contact.py, subscribe.py
    services/       hubspot.py, mailgun.py, subscriber_email.py
```

---

## 6. Configuration (environment variables)

In production, all env vars are supplied via the **Compose / Coolify environment
on the host** — not committed `.env` files. Use `.env.example` /
`backend/.env.example` as templates locally.

**Frontend**

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_ELEVENLABS_AGENT_ID` | Yes | ElevenLabs conversational agent ID |
| `REACT_APP_API_URL` | Optional | Backend base URL (build arg for `frontend.Dockerfile`) |
| `BACKEND_HOST_PORT` | Optional | Host port for the backend, **local Docker only** (default `8001`) |

**Backend**

| Variable | Required | Description |
|---|---|---|
| `MONGO_URL` | Yes | Mongo connection string — internal service `mongodb://mongo:27017` in prod |
| `DB_NAME` | Yes | Database name (`rolplay`) |
| `ADMIN_API_KEY` | For blog create | Auth for `POST /api/blogs/create` |
| `CORS_ORIGINS` | Optional | Comma-separated origins (default `*`) |
| `SITE_URL` | Optional | Base URL used in email links (default `https://rolplay.ai`) |
| `MAILGUN_API_KEY` / `MAILGUN_DOMAIN` / `MAILGUN_FROM` | For email | Mailgun credentials |
| `HUBSPOT_ACCESS_TOKEN` | For CRM push | HubSpot private-app token |
| `NOTIFICATION_EMAILS` | Optional | Comma-separated recipients for contact-form notifications |

---

## 7. Integrations

| Integration | What it does | Where / how |
|---|---|---|
| **ElevenLabs** | AI voice assistant (floating button, all pages) | `@11labs/react`, WebRTC; `src/components/ElevenLabsWidget.jsx`; needs `REACT_APP_ELEVENLABS_AGENT_ID` + mic permission |
| **HubSpot** | Server-side CRM contact push (not an embedded form) | `backend/app/services/hubspot.py`; fired as a background task on every `/api/contact` submit; `HUBSPOT_ACCESS_TOKEN` |
| **Mailgun** | Transactional email — contact-team notifications + subscriber welcome/broadcast | `backend/app/services/mailgun.py` → `api.mailgun.net/v3`; `MAILGUN_*` |
| **WhatsApp** | Live chat orb (bottom-right) | `src/components/WhatsAppOrb.jsx` → `https://wa.me/15797986707` |
| **Calendly** | Meeting booking (direct link, no embed) | `https://calendly.com/viridiana-flores-audioweb/30min` |
| **GA / Hotjar / Apollo** | Analytics — **not yet integrated** | No scripts/IDs wired in anywhere active |

**Contact form flow:** `ContactForm.jsx` → `POST /api/contact` → save to Mongo
`contacts` → background task 1: Mailgun notifies `NOTIFICATION_EMAILS` →
background task 2: `hubspot.push_contact()`.

**Newsletter flow:** `SubscribeForm.jsx` / blog `NewsletterForm.jsx` →
`POST /api/subscribe` → dedupe by email → store in Mongo `subscribers` →
Mailgun welcome email. New blog posts trigger a Mailgun broadcast to confirmed
subscribers. Locale is `en` / `es` only.

---

## 8. API Reference (backend)

Base URL (local): `http://localhost:8000` · all routes are prefixed `/api`.

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/status` | — | Health check |
| GET | `/api/blogs` | — | List posts (`page`, `limit`, `search`, `tags`) |
| GET | `/api/blogs/tags` | — | All tags with counts |
| GET | `/api/blogs/{slug}` | — | Single post (full content) |
| GET | `/api/blogs/{slug}/related` | — | Related posts by tag overlap |
| POST | `/api/blogs/{slug}/view` | — | Increment view counter |
| POST | `/api/blogs/{slug}/like` | — | Like a post |
| GET | `/api/blogs/{slug}/comments` | — | List comments |
| POST | `/api/blogs/{slug}/comments` | — | Add a comment |
| POST | `/api/blogs/create` | `x-api-key` | Create a post |
| POST | `/api/contact` | — | Contact form → Mongo + Mailgun notify + HubSpot push |
| POST | `/api/subscribe` | — | Newsletter subscribe → Mongo + welcome email |

---

## 9. Deployment & Operations

**Deploy to production**

```bash
git checkout main && git pull origin main
# make changes, commit, push
git push origin main
# on the host (or via Coolify):
docker compose up -d --build
```

**Redeploy a single service:** `docker compose build backend && docker compose up -d backend`

**Rollback:** `git revert HEAD && git push origin main` then rebuild, or check out
a previous commit/image on the host and rebuild.

**SSL / domain / security headers / SPA fallback / caching** are all the reverse
proxy's job (Coolify/Traefik) — configure them there, not in the app. Suggested
cache headers: long-lived immutable for `/static/*`, short + stale-while-revalidate
for images/video, `no-cache` for `index.html`.

---

## 10. Content & i18n

- Languages: **EN** and **ES** only; default/fallback is **Spanish**.
- Detection order: `localStorage` (key `rolplay_lang`) → browser language → ES.
- Files: `src/locales/en.json`, `src/locales/es.json` — use the **same key in both**.
- Switcher lives in `Navigation` (desktop + mobile).
- To change copy: edit both locale files, then rebuild/redeploy the frontend.

---

## 11. QA / Pre-deploy checklist

- [ ] `npm run build` completes with 0 errors
- [ ] EN and ES routes load correctly
- [ ] Contact form submits (success state, Mongo `contacts` doc, HubSpot contact, team email)
- [ ] Newsletter subscribe works (Mongo `subscribers` doc, welcome email received)
- [ ] Blog list / detail / tag filter / search / like / comments work
- [ ] ElevenLabs widget opens (requires `REACT_APP_ELEVENLABS_AGENT_ID`)
- [ ] Navigation links resolve; mobile menu works below 1024px
- [ ] WhatsApp orb visible; award medals + partner logos display
- [ ] Lighthouse targets: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90

---

## 12. Known Issues / Pending Items

- **No CI/CD** (`.github/workflows/`) — deploys to the Docker Compose / Coolify
  stack are triggered manually (or via Coolify's git-watch/webhook if configured).
- **`vercel.json` is leftover** from an earlier Vercel-based plan and is **not
  part of the current deploy path**. Production security headers, SPA fallback,
  and caching belong at the reverse proxy. Remove it or clearly mark it unused.
- **GA / Hotjar / Apollo** not yet integrated.
- **Custom domain + HSTS** should be verified/configured at the reverse-proxy level.

---

## 13. Access & Credentials Handoff

> **No secret values live in this repo.** Credential *values* and their storage
> location are tracked in the private Plane workspace (INNOVATION-408). This
> section covers only the git-safe process.

**Accounts to transfer / grant access to:**

| Service | What's needed |
|---|---|
| GitHub repository | Collaborator access (see below) |
| Docker host / Coolify | Project + deploy access |
| ElevenLabs | Agent ID + account access |
| HubSpot | Private-app token / account seat |
| Mailgun | API key + sending domain |
| MongoDB | Connection string / DB access |
| Domain registrar / DNS | For domain + SSL at the proxy |

**GitHub access (owner action):** add the collaborator under
**Settings → Collaborators**, grant **`Write`** (minimum) or **`Maintain`**
(recommended — push + merge, without repo deletion). The invitee accepts the
emailed invite, then verifies with clone → branch → commit → push → PR.

**Recommended branch protection on `main`:** require a PR + 1 approving review,
dismiss stale reviews on new commits, disallow force-pushes, and don't allow
bypassing these rules.

**Credential hygiene:** `.env` files are git-ignored and must never be
committed; production secrets are injected via the Coolify environment.

---

*Related work item: INNOVATION-408. This document supersedes the previous
`TECH_DOCS.md` and `DIEGO_ACCESS_CHECKLIST.md`.*
