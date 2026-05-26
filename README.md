# RolPlay — AI-Powered Sales Training Platform

> Enterprise-grade sales enablement powered by AI coaching simulations.  
> Trusted by Fortune-ranked companies for over 20 years.  
> Recognized: **Training Industry Top 20 · 2025** & **Watch List 2024**

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start         # http://localhost:3000

# Production build
CI=false npm run build
```

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Create React App / CRACO) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Routing | React Router v6 |
| i18n | i18next + react-i18next |
| 3D Globe | react-globe.gl |
| AI Widget | ElevenLabs Conversational AI |
| Icons | Lucide React |
| Notifications | Sonner |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navigation.jsx       # White sticky navbar, EN/ES toggle
│   ├── Footer.jsx
│   ├── CursorSparks.jsx     # Global red spark click effect
│   ├── GlobeSection.jsx     # Interactive 3D globe (3 office pins)
│   ├── KPIGrid.jsx          # Animated stats counters
│   ├── ProductShowcase.jsx  # 7-product carousel
│   ├── TestimonialsCarousel.jsx  # Enterprise testimonials, autoplay
│   ├── VideoPlayer.jsx      # Lazy-load iframe/native video
│   ├── ElevenLabsWidget.jsx # AI chat widget (env-var gated)
│   ├── Preloader.jsx        # Loading screen with 4s fail-safe
│   └── ...
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Benefits.jsx
│   ├── Achievements.jsx
│   ├── SuccessStories.jsx
│   ├── FAQs.jsx
│   └── Contact.jsx
├── locales/
│   ├── en.json              # English translations
│   └── es.json              # Spanish translations
└── hooks/
    └── useRipple.js
public/
├── logo.png                 # Official RolPlay logo
├── medal1.jpg               # 2025 Top 20 Company — Training Industry
└── medal2.jpg               # 2024 Watch List Company — Training Industry
```

---

## 🌍 Internationalisation

Language is toggled via the navbar (EN / ES). Persisted in `localStorage` under key `rolplay_lang`.

All strings live in `src/locales/en.json` and `src/locales/es.json`.

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_ELEVENLABS_AGENT_ID=your_agent_id_here
```

> The ElevenLabs widget gracefully hides if this variable is not set.

---

## 🚢 Deployment (Vercel)

The `vercel.json` at project root handles build configuration automatically:

```json
{
  "buildCommand": "CI=false npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "outputDirectory": "build",
  "framework": "create-react-app"
}
```

Just connect the GitHub repo to Vercel — every push to `main` deploys automatically.

---

## 📍 Office Locations

| City | Country | Coordinates |
|---|---|---|
| Toronto | Canada | 43.65°N / 79.38°W |
| Monterrey | Mexico | 25.69°N / 100.32°W |
| Ciudad de México | Mexico | 19.43°N / 99.13°W |

---

## 📧 Contact

- **Email:** info@rolplay.ai  
- **Phone:** +52 (55) 5093 7376  
- **Web:** [rolplay.ai](https://rolplay.ai)

---

© 2025 RolPlay. All rights reserved.
