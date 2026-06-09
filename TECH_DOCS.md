# RolPlay Website — Technical Documentation

> **Version:** 1.0 | **Last updated:** June 2026 | **Owner:** RolPlay Engineering

---

## Executive Summary

The RolPlay marketing website is a React single-page application (SPA) built with Create React App and deployed on Vercel via a GitHub-connected CI/CD pipeline. The site is fully bilingual (EN/ES), features an AI voice assistant powered by ElevenLabs, and integrates with HubSpot for CRM-connected contact forms. All infrastructure is serverless — there is no backend server to maintain.

---

## Infrastructure Overview

### Hosting — Vercel

| Property | Value |
|---|---|
| Platform | Vercel (Hobby/Pro plan) |
| Region | Auto (Edge Network — global CDN) |
| Build command | `CI=false npm run build` |
| Install command | `npm install --legacy-peer-deps` |
| Output directory | `build/` |
| Framework | Create React App (CRACO) |
| Deployment trigger | Push to `main` branch on GitHub |
| Preview deployments | Automatic on every Pull Request |
| Production URL | `rolplay-optimization.vercel.app` |
| Custom domain | Configure in Vercel Dashboard → Domains |

**Deployment flow:**
```
Developer pushes to main
    → GitHub webhook triggers Vercel
    → Vercel installs dependencies
    → Vercel runs CI=false npm run build
    → Static files uploaded to global CDN
    → DNS propagates within ~30 seconds
```

### Source Control — GitHub

| Property | Value |
|---|---|
| Repository | `RahulAIML/rolplay_optimization` |
| Default branch | `main` |
| Branch protection | Recommended: require PR + 1 review before merge |
| Access model | Owner + collaborators |

**Recommended branch strategy:**
- `main` — production (auto-deploys to Vercel)
- `dev` — integration branch for testing
- `feature/*` — individual feature branches
- `fix/*` — bug fix branches

---

## Frontend Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| Create React App (CRACO) | 5.x / 7.x | Build tooling |
| React Router DOM | 7.x | Client-side routing (SPA) |
| Tailwind CSS | 3.x | Utility-first styling |
| Framer Motion | 12.x | Animations |
| i18next + react-i18next | 26.x / 17.x | EN/ES internationalization |
| Lucide React | 0.5x | Icon library |
| Sonner | 2.x | Toast notifications |
| Radix UI | Various | Accessible headless components |
| @11labs/react | 0.2.x | ElevenLabs voice widget |

**Key source directories:**
```
src/
  components/    — Reusable UI (Navigation, Footer, ElevenLabsWidget…)
  pages/         — Route-level pages (Home, About, Contact, FAQs…)
  locales/       — en.json / es.json translation files
  index.css      — Global styles + Tailwind utilities
public/
  logo.png       — RolPlay logo
  medal1.jpg     — Training Industry 2025 Top 20 badge
  medal2.jpg     — Training Industry 2024 Watch List badge
  callmentor-logo.jpg   — CallMentor AI product logo
  second-brain-logo.jpg — Second Brain product logo
  about-mission.mp4     — Mission section video
  meet-rolplay.mp4      — Homepage video
```

---

## Third-Party Services & Integrations

### ElevenLabs — AI Voice Assistant
| Property | Value |
|---|---|
| SDK | `@11labs/react` `useConversation` hook |
| Agent ID | `REACT_APP_ELEVENLABS_AGENT_ID` (env var) |
| Protocol | WebRTC (WSS) |
| Where shown | Floating FAB button (bottom-right, all pages) |
| Requires | Microphone permission from user |

### HubSpot — CRM / Contact Forms
| Property | Value |
|---|---|
| Status | Configured externally (portal credentials in HubSpot dashboard) |
| Integration | Forms embed via `js.hsforms.net` or API submission |
| Data destination | HubSpot CRM contacts |
| Current form | Custom React form (migrate to HubSpot embed when portal is ready) |

### Google Analytics / Tag Manager
| Property | Value |
|---|---|
| Status | Ready for integration (CSP allows GTM + GA4) |
| Add via | `public/index.html` `<head>` script tags |
| CSP | Already whitelisted in `vercel.json` |

### Hotjar — Heatmaps / Session Recording
| Property | Value |
|---|---|
| Status | Ready for integration |
| Add via | `public/index.html` `<head>` |
| CSP | Already whitelisted in `vercel.json` |

### Apollo — Sales Intelligence
| Property | Value |
|---|---|
| Status | Ready for integration |
| CSP | `widget.apollo.io` whitelisted |

### Calendly — Meeting Booking
| Property | Value |
|---|---|
| Link | `https://calendly.com/viridiana-flores-audioweb/30min` |
| Integration | Direct link (no embed required) |

### WhatsApp — Live Chat
| Property | Value |
|---|---|
| Number | +1 579 798 6707 |
| Link | `https://wa.me/15797986707` |
| Component | `WhatsAppOrb.jsx` (fixed bottom-right) |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_ELEVENLABS_AGENT_ID` | Yes | ElevenLabs conversational agent ID |
| `REACT_APP_API_URL` | Optional | Backend API for email subscriptions |

**Set in Vercel:** Dashboard → Project → Settings → Environment Variables

---

## Security

### Security Headers (vercel.json)
| Header | Value | Purpose |
|---|---|---|
| `Content-Security-Policy` | Full policy | Prevents XSS, controls script sources |
| `X-Frame-Options` | `SAMEORIGIN` | Prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage |
| `Permissions-Policy` | `microphone=(self)` | Restricts sensor/API access |

### SSL
- Managed automatically by Vercel (Let's Encrypt, auto-renewed)
- HTTPS enforced on all routes
- HSTS recommended: add `Strict-Transport-Security: max-age=31536000; includeSubDomains` to `vercel.json` once custom domain is verified

### Secrets Management
- All secrets in Vercel Environment Variables (never in source code)
- `.env.example` committed (without values) for developer onboarding
- `.env.local` should never be committed (add to `.gitignore`)

---

## Routing

The app uses React Router v7 with client-side routing. Vercel is configured to rewrite all routes to `index.html` (SPA fallback) via `vercel.json`:

```json
"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
```

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About / Nosotros |
| `/benefits` | Benefits / Beneficios |
| `/achievements` | Achievements / Logros |
| `/success-stories` | Success Stories / Casos de Éxito |
| `/contact` | Contact / Contáctanos |
| `/faqs` | FAQs / Preguntas Frecuentes |

---

## Internationalisation

- Languages: **English (EN)** and **Spanish (ES)**
- Detection: Browser language → `localStorage` → fallback to EN
- Files: `src/locales/en.json` and `src/locales/es.json`
- Switcher: Language toggle in Navigation (desktop + mobile)
- Library: `i18next` + `react-i18next` + `i18next-browser-languagedetector`

---

## Caching Strategy

| Asset type | Cache-Control |
|---|---|
| JS/CSS bundles (`/static/*`) | `public, max-age=31536000, immutable` |
| Images, videos | `public, max-age=86400, stale-while-revalidate=604800` |
| HTML (`index.html`) | `no-cache` (Vercel default) |

---

## Maintenance Guide

### Deploy to Production
```bash
git checkout main
git pull origin main
# make changes
git add .
git commit -m "feat: description"
git push origin main
# Vercel auto-deploys within ~1 minute
```

### Rollback
1. Vercel Dashboard → Deployments → Find previous deployment → "Promote to Production"
2. Or: `git revert HEAD && git push origin main`

### Add / Change Copy
- Edit `src/locales/en.json` and `src/locales/es.json`
- Use the same key in both files
- Push to `main` — deploys in ~60 seconds

### Add Environment Variable
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add variable for Production, Preview, and Development
3. Redeploy (push a commit or trigger manually)

---

## Diego GitHub Access — Verification Checklist

See `DIEGO_ACCESS_CHECKLIST.md` for the full verification guide.

---

## QA Baseline

### Pre-deploy checklist
- [ ] `npm run build` completes with 0 errors
- [ ] EN and ES routes load correctly
- [ ] Contact form submits (check success state)
- [ ] ElevenLabs widget opens (requires `REACT_APP_ELEVENLABS_AGENT_ID`)
- [ ] Navigation links resolve to correct pages
- [ ] Mobile menu works on viewport < 1024px
- [ ] WhatsApp orb visible
- [ ] Award medals display on Home and Achievements pages
- [ ] Logos display correctly (Second Brain, CallMentor AI) in navbar

### Lighthouse targets
| Metric | Target |
|---|---|
| Performance | ≥ 85 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 90 |
| SEO | ≥ 90 |

---

## Handover Checklist

- [ ] Vercel project ownership transferred or team member added
- [ ] GitHub repository access granted to Diego (see `DIEGO_ACCESS_CHECKLIST.md`)
- [ ] ElevenLabs agent ID shared via secure channel
- [ ] HubSpot portal credentials shared with marketing team
- [ ] Google Analytics property ID added to site
- [ ] Hotjar Site ID added to site
- [ ] Custom domain configured in Vercel + DNS records updated
- [ ] This document updated with all production credentials locations
