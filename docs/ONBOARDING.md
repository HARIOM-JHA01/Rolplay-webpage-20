# RolPlay Website — Onboarding & Engineering Guide

> **Audience:** Anyone taking over or joining the RolPlay marketing website.
> **Owner:** RolPlay Engineering · **Last updated:** July 2026
>
> This is the single source of truth for the website. Read section 1–2 to get running
> today; section 3–9 are the reference; section 10–12 cover operations and handoff.
> Secret **values** are never stored here — see section 12.

---

## Contents

1. [Overview](#1-overview)
2. [Quick Start (local)](#2-quick-start-local)
3. [Architecture](#3-architecture)
4. [Tech Stack](#4-tech-stack)
5. [Repository Structure](#5-repository-structure)
6. [Configuration (environment variables)](#6-configuration-environment-variables)
7. [Integrations](#7-integrations)
8. [API Reference (backend)](#8-api-reference-backend)
9. [Deployment & Operations](#9-deployment--operations)
10. [Content & i18n](#10-content--i18n)
11. [QA / Pre-deploy checklist](#11-qa--pre-deploy-checklist)
12. [Access & Credentials Handoff](#12-access--credentials-handoff)

---

## 1. Overview

The RolPlay marketing site is a **two-service application**:

- a **React single-page app** (Create React App / CRACO), and
- a **FastAPI backend** (using **MongoDB Atlas**, external — not containerized)
  that powers the contact form, newsletter subscriptions, and the blog.

The frontend and backend run as containers via **Docker Compose**, behind a
reverse proxy (**Coolify / Traefik**) that handles the domain, routing, and
SSL. The site is bilingual (**EN / ES**, default Spanish), includes an
ElevenLabs AI voice assistant, and pushes contact submissions to **HubSpot**
while emailing the team via **Mailgun**.

---

## 2. Quick Start (local)

**Prerequisites:** Docker + Docker Compose, or Node 22 and Python 3.11 for
running services directly.

### Option A — Docker Compose (closest to production)

```bash
git clone
cd rolplay-webpage-20
cp .env.example .env          # fill in the values (see section 6)
# MONGO_URL must point at a real MongoDB instance (Atlas) — there is
# no bundled Mongo container. Use a dev/staging Atlas cluster, not prod.
docker compose up -d --build
```

- Frontend → served on container port `3000`
- Backend  → container port `8000` (host `8001` by default via `BACKEND_HOST_PORT`)
- MongoDB  → **external MongoDB Atlas** — no local container; set `MONGO_URL`
  to your Atlas connection string (see section 6)

### Option B — run services directly

```bash
# Frontend
npm ci --legacy-peer-deps
npm start                      # http://localhost:3000

# Backend (separate terminal)
cd backend
pip install -r requirements.txt
cp .env.example .env           # then edit backend/.env (see section 6)
uvicorn server:app --reload --port 8000
```

**Verify it works:** open the site, switch EN/ES, submit the contact form, and
subscribe to the newsletter — then confirm the Mongo `contacts` / `subscribers`
documents were created.

---

## 3. Architecture

| Service | Tech | Build |
|---|---|---|
| **Frontend** | React 19 (CRA/CRACO), served via `serve` | `frontend.Dockerfile` (`node:22-alpine`) |
| **Backend** | FastAPI + MongoDB (Motor) | `backend/Dockerfile` (`python:3.11-slim`, `uvicorn`) |
| **Database** | MongoDB Atlas | External managed service — not in `docker-compose.yml` |

`frontend` and `backend` are the two services in `docker-compose.yml` at the
repo root, using `expose` only (no host port bindings in production) — the
reverse proxy handles external routing, the domain, and SSL termination. The
backend connects out to MongoDB Atlas via `MONGO_URL`.

**Deploy flow:**

```
push to main → host/Coolify pulls → docker compose up -d --build
             → frontend, backend rebuilt/restarted (backend connects to Atlas)
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
  tests/            unit / integration / e2e — see backend/tests/README.md
```

---

## 6. Configuration (environment variables)

In production, all env vars are supplied via the **Compose / Coolify environment
on the host** — not committed `.env` files. Use `.env.example` /
`backend/.env.example` as templates locally. Secret **values** are never
stored in this repo or this doc — only variable names and where to set them.

**Frontend** — set at build time (build args in `docker-compose.yml` /
`frontend.Dockerfile`), or in a root `.env.local` for `npm start`.

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_ELEVENLABS_AGENT_ID` | Yes | ElevenLabs conversational agent ID |
| `REACT_APP_API_URL` | Optional | Backend base URL the frontend calls (build arg for `frontend.Dockerfile`) |
| `BACKEND_HOST_PORT` | Optional | Host port for the backend, **local Docker only** (default `8001`) |

**Backend** — set in `backend/.env` locally, or as Coolify app-level
environment variables in prod.

| Variable | Required | Description |
|---|---|---|
| `MONGO_URL` | **Yes** | **MongoDB Atlas** connection string (`mongodb+srv://<user>:<pass>@<cluster>/`). There is **no bundled Mongo container** — this must point at a real Atlas cluster (a separate dev/staging cluster locally, the prod cluster only in Coolify's env vars). App fails to start without it (`config.py` raises on missing value). |
| `DB_NAME` | **Yes** | Database name inside the Atlas cluster (`rolplay`) |
| `ADMIN_API_KEY` | For blog create | Auth for `POST /api/blogs/create` (sent as `x-api-key` header) |
| `CORS_ORIGINS` | Optional | Comma-separated allowed origins (default `*`) |
| `SITE_URL` | Optional | Base URL used in email links (default `https://rolplay.ai`) |
| `MAILGUN_API_KEY` / `MAILGUN_DOMAIN` / `MAILGUN_FROM` | For email | Mailgun credentials — required for contact-notification and newsletter emails to send |
| `HUBSPOT_ACCESS_TOKEN` | For CRM push | HubSpot private-app token — without it, contact form still saves to Mongo but skips the CRM push |
| `NOTIFICATION_EMAILS` | Optional | Comma-separated recipients for contact-form notifications |

**Where to actually set these:**

| Environment | Frontend vars | Backend vars |
|---|---|---|
| Local (Docker Compose) | root `.env` (from `.env.example`) | root `.env` (compose passes them through to the `backend` service) |
| Local (running directly) | root `.env.local` (CRA reads this) | `backend/.env` (from `backend/.env.example`) |
| Production (Coolify) | Coolify → this app → **Environment Variables** (used as Docker build args) | Coolify → this app → **Environment Variables** |

Never commit a filled-in `.env` — only `.env.example` / `backend/.env.example`
belong in git.

---

## 7. Integrations

| Integration | What it does | Where / how |
|---|---|---|
| **ElevenLabs** | AI voice assistant (floating button, all pages) | `@11labs/react`, WebRTC; `src/components/ElevenLabsWidget.jsx`; needs `REACT_APP_ELEVENLABS_AGENT_ID` + mic permission |
| **HubSpot** | Server-side CRM contact push (not an embedded form) | `backend/app/services/hubspot.py`; fired as a background task on every `/api/contact` submit; `HUBSPOT_ACCESS_TOKEN` |
| **Mailgun** | Transactional email — contact-team notifications + subscriber welcome/broadcast | `backend/app/services/mailgun.py` → `api.mailgun.net/v3`; `MAILGUN_*` |
| **WhatsApp** | Live chat orb (bottom-right) | `src/components/WhatsAppOrb.jsx` → `https://wa.me/15797986707` |
| **Calendly** | Meeting booking (direct link, no embed) | `https://calendly.com/viridiana-flores-audioweb/30min` |
| **Hotjar** | Session recording / heatmaps | Inline snippet in `public/index.html`, site ID `6674847` |
| **Apollo** | Website visitor tracking (sales intelligence) | Inline snippet in `public/index.html`, loads `assets.apollo.io` tracker, app ID `67be3ef9640bdd0011209d85` |
| **Metricool** | Analytics / social tracking | Inline snippet in `public/index.html`, loads `tracker.metricool.com`, hash `9b576b85db94c6d058f9c961b411b177` |
| **Leadfeeder** | Visitor/company identification for sales | Inline snippet in `public/index.html`, loads `sc.lfeeder.com`, tracker ID `Xbp1oaE029X4EdVj` |
| **GA** | Analytics — **not yet integrated** | No script/ID wired in |

The four tracking scripts above (Hotjar, Apollo, Metricool, Leadfeeder) are
**hardcoded directly in `public/index.html`**, not driven by env vars — they
load unconditionally on every page, for every visitor, in every environment
(local, staging, prod) with no gating. To rotate/replace an ID or disable one,
edit `public/index.html` directly and redeploy the frontend.

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
- [ ] Backend unit + integration tests pass (`cd backend && pytest`, needs `mongo-test` up — see `backend/tests/README.md`)
- [ ] EN and ES routes load correctly
- [ ] Contact form submits (success state, Mongo `contacts` doc, HubSpot contact, team email)
- [ ] Newsletter subscribe works (Mongo `subscribers` doc, welcome email received)
- [ ] Blog list / detail / tag filter / search / like / comments work
- [ ] ElevenLabs widget opens (requires `REACT_APP_ELEVENLABS_AGENT_ID`)
- [ ] Navigation links resolve; mobile menu works below 1024px
- [ ] WhatsApp orb visible; award medals + partner logos display
- [ ] Lighthouse targets: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90

---

## 12. Access & Credentials Handoff

This repo never stores secret values — only variable **names** (section 6).
Whoever is handing off or taking over ownership should transfer access to:

| System | What it's for | Notes |
|---|---|---|
| **GitHub repo** (`HARIOM-JHA01/Rolplay-webpage-20`) | Source control, triggers Coolify deploy on push to `main` | Add new owner as collaborator |
| **Coolify instance** (deploys to the "innovation server") | Hosting, env vars, deploy logs, domain/SSL via Traefik | App-level env vars live here — see section 6 |
| **MongoDB Atlas** | Primary datastore (`contacts`, `subscribers`, blog collections) | Confirm who owns the Atlas org/project and the prod `MONGO_URL` |
| **Mailgun** | Transactional email (contact notify + newsletter) | Domain `mg.rolplay.ai` (or configured `MAILGUN_DOMAIN`) |
| **HubSpot** | CRM push from the contact form | Private-app token (`HUBSPOT_ACCESS_TOKEN`) |
| **ElevenLabs** | Conversational AI widget | Agent ID is not secret, but the ElevenLabs account/billing owner should be identified |
| **Hotjar / Apollo / Metricool / Leadfeeder** | Analytics & visitor tracking (see section 7) | IDs are hardcoded in `public/index.html`, not secret, but confirm who owns each account/dashboard |
| **Domain / DNS** (`rolplay.ai`) | Points at the Coolify/Traefik host | Confirm registrar + DNS provider access |

When handing off, rotate `ADMIN_API_KEY`, `HUBSPOT_ACCESS_TOKEN`, and
`MAILGUN_API_KEY` after transferring access, and confirm the new owner can log
into Coolify and the Atlas cluster before revoking the previous owner's access.

---