# RolPlay — AI-Powered Sales Training Platform

> Enterprise-grade sales enablement powered by AI coaching simulations.  
> Trusted by Fortune-ranked companies for over 20 years.  
> Recognized: **Training Industry Top 20 · 2025** & **Watch List 2024**

---

## Architecture

Two independently deployed services:

| Service | Tech | Deploy target |
|---|---|---|
| **Frontend** | React 19 (CRA / CRACO) | Vercel |
| **Backend** | FastAPI (Python) + MongoDB | Render / Railway |

---

## Quick Start (local)

### 1. Frontend

```bash
npm install --legacy-peer-deps
npm start
# → http://localhost:3000
```

Create a `.env.local` in the project root:

```env
REACT_APP_ELEVENLABS_AGENT_ID=your_agent_id_here
REACT_APP_API_URL=http://localhost:8001
```

### 2. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
# → http://localhost:8000
```

Create `backend/.env`:

```env
MONGO_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/
DB_NAME=rolplay
ADMIN_API_KEY=your_secret_key
RESEND_API_KEY=re_...          # optional — email notifications
SITE_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
```

---

## Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 19 (Create React App / CRACO) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Routing | React Router v7 |
| i18n | i18next + react-i18next (EN / ES / FR) |
| HTTP | Axios |
| 3D Globe | react-globe.gl |
| AI Widget | ElevenLabs Conversational AI |
| Icons | Lucide React |
| Notifications | Sonner |

### Backend

| Layer | Technology |
|---|---|
| Framework | FastAPI |
| Database | MongoDB (Motor async driver) |
| Email | Resend |
| Auth | `x-api-key` header (blog create endpoint) |

---

## Project Structure

```
├── backend/
│   ├── server.py            # FastAPI app — all API routes
│   ├── requirements.txt
│   └── .env                 # local only, never committed
│
├── src/
│   ├── components/
│   │   ├── blog/
│   │   │   ├── BlogCard.jsx
│   │   │   ├── BlogGrid.jsx
│   │   │   ├── BlogSearchBar.jsx
│   │   │   ├── BlogTagFilter.jsx
│   │   │   ├── BlogPagination.jsx
│   │   │   ├── BlogPostContent.jsx
│   │   │   ├── RelatedArticles.jsx
│   │   │   ├── NewsletterForm.jsx
│   │   │   └── blog-content.css
│   │   ├── Navigation.jsx       # Sticky navbar, EN/ES toggle, Blog link
│   │   ├── Footer.jsx
│   │   ├── ContactForm.jsx      # Submits to HubSpot API
│   │   ├── CursorSparks.jsx
│   │   ├── GlobeSection.jsx
│   │   ├── KPIGrid.jsx
│   │   ├── ProductShowcase.jsx
│   │   ├── TestimonialsCarousel.jsx
│   │   ├── VideoPlayer.jsx
│   │   ├── ElevenLabsWidget.jsx
│   │   └── Preloader.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Benefits.jsx
│   │   ├── Achievements.jsx
│   │   ├── SuccessStories.jsx
│   │   ├── FAQs.jsx
│   │   ├── Contact.jsx
│   │   ├── Blog.jsx             # /blog — list, search, tag filter
│   │   └── BlogPost.jsx         # /blog/:slug — single post
│   ├── locales/
│   │   ├── en.json
│   │   └── es.json
│   └── hooks/
│       └── useRipple.js
│
├── public/
├── vercel.json
└── .env.example
```

---

## API Reference

Base URL (local): `http://localhost:8000`

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/blogs` | — | List posts. Query: `page`, `limit`, `search`, `tags` |
| GET | `/api/blogs/tags` | — | All tags with counts |
| GET | `/api/blogs/{slug}` | — | Single post (full content) |
| GET | `/api/blogs/{slug}/related` | — | Related posts by tag overlap |
| POST | `/api/blogs/{slug}/view` | — | Increment view counter |
| POST | `/api/blogs/create` | `x-api-key` | Create a new post |
| POST | `/api/subscribe` | — | Newsletter subscribe |

**Create a blog post:**
```bash
curl -X POST http://localhost:8000/api/blogs/create \
  -H "x-api-key: your_admin_key" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Post",
    "summary": "Short description.",
    "content": "<p>Full HTML content.</p>",
    "tags": ["ai", "sales"],
    "published": true
  }'
```

---

## Internationalisation

Language toggled via the navbar (EN / ES). Persisted in `localStorage` under `rolplay_lang`.

All strings live in `src/locales/en.json` and `src/locales/es.json`. Every user-visible string goes through `t("key")` — no hardcoded text in components.

---

## Deployment

### Frontend → Vercel

`vercel.json` is already configured. Connect the GitHub repo to Vercel — every push to `main` deploys automatically.

Set these env vars in the **Vercel dashboard**:

```env
REACT_APP_ELEVENLABS_AGENT_ID=...
REACT_APP_API_URL=https://your-backend.onrender.com
```

If you run the backend through `docker compose`, the default API URL is `http://localhost:8001` and the backend binds to host port `8001` by default. You can override it with `BACKEND_HOST_PORT` if needed.

### Backend → Render (recommended)

1. New Web Service → connect repo → set **Root Directory** to `backend`
2. **Build command:** `pip install -r requirements.txt`
3. **Start command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. Add env vars in the Render dashboard:

```env
MONGO_URL=mongodb+srv://...
DB_NAME=rolplay
ADMIN_API_KEY=...
RESEND_API_KEY=...
SITE_URL=https://rolplay.ai
CORS_ORIGINS=https://rolplay.ai
```

> `backend/.env` is for **local development only** — never committed to git.

---

## Office Locations

| City | Country | Coordinates |
|---|---|---|
| Toronto | Canada | 43.65°N / 79.38°W |
| Monterrey | Mexico | 25.67°N / 100.31°W |
| Ciudad de México | Mexico | 19.43°N / 99.13°W |

---

## Contact

- **Email:** info@rolplay.ai
- **Phone:** +52 55 1800 6006
- **Web:** [rolplay.ai](https://rolplay.ai)
