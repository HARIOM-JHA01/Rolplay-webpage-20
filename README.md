# RolPlay — AI-Powered Sales Training Platform

> Enterprise-grade sales enablement powered by AI coaching simulations.
> Trusted by Fortune-ranked companies for over 20 years.
> Recognized: **Training Industry Top 20 · 2026 2025** & **Watch List 2024**

A bilingual (EN/ES) marketing site: a **React SPA** frontend and a
**FastAPI + MongoDB** backend (contact form, newsletter, blog), deployed
together via Docker Compose behind Coolify/Traefik.

📖 **Full documentation:** [`docs/ONBOARDING.md`](docs/ONBOARDING.md) — architecture,
configuration, integrations, API reference, deployment, and handoff. Start there.

---

## Quick Start (local)

**Frontend**

```bash
npm install --legacy-peer-deps
npm start                       # → http://localhost:3000
```

`.env.local` in the project root:

```env
REACT_APP_ELEVENLABS_AGENT_ID=your_agent_id_here
REACT_APP_API_URL=http://localhost:8001
```

**Backend**

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload --port 8000   # → http://localhost:8000
```

`backend/.env` (see [`docs/ONBOARDING.md`](docs/ONBOARDING.md) §6 for the full list):

```env
MONGO_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/
DB_NAME=rolplay
ADMIN_API_KEY=your_secret_key
MAILGUN_API_KEY=key-...
MAILGUN_DOMAIN=mg.rolplay.ai
MAILGUN_FROM=RolPlay <noreply@rolplay.ai>
SITE_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
```

**Docker Compose (closest to production)**

```bash
cp .env.example .env            # fill in values
docker compose up -d --build
```

---

## Documentation

Everything beyond this quick start lives in **[`docs/ONBOARDING.md`](docs/ONBOARDING.md)**:
architecture, tech stack, repo structure, environment variables, integrations
(ElevenLabs, HubSpot, Mailgun, WhatsApp, Calendly), API reference, deployment &
ops, i18n, QA checklist, known issues, and access/credentials handoff.

---

## Contact

- **Email:** info@rolplay.ai
- **Phone:** +52 55 1800 6006
- **Web:** [rolplay.ai](https://rolplay.ai)
