<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/n8n-Workflow-ea4b71?style=for-the-badge&logo=n8n" alt="n8n" />
</p>

# Longevity App

**Evidence-based longevity tracking with biological age estimation, protocol management, and AI-powered health recommendations.**

A comprehensive health optimization platform inspired by the protocols of leading longevity researchers including Peter Attia, David Sinclair, Bryan Johnson, and Valter Longo.

[Live Demo](https://longevity-app-lake.vercel.app) · [Report Bug](https://github.com/yourusername/longevity-app/issues) · [Request Feature](https://github.com/yourusername/longevity-app/issues)

---

## Features

### Health Dashboard
- **Biological Age Calculator** — Track your biological age vs chronological age with evidence-based algorithms
- **Health Score** — Composite longevity score (0-100) with weighted breakdown across sleep, activity, recovery, nutrition, and biomarkers
- **Trend Analysis** — Visualize health metrics over time with interactive charts

### Sleep Tracking
- **Sleep Score** — Quality assessment with stage breakdown (Deep, REM, Light)
- **HRV Monitoring** — Heart rate variability trends correlated with recovery
- **Circadian Optimization** — Sleep consistency and timing insights

### Activity & Exercise
- **Peter Attia's Framework** — Track the four pillars: Zone 2 cardio, VO2 max training, strength, and stability
- **VO2 Max Estimation** — The single strongest predictor of all-cause mortality
- **Workout History** — Log and analyze training sessions

### Fasting Timer
- **Metabolic State Tracking** — Real-time visualization of metabolic transitions:
  - Fed → Early Fasting → Fat Burning → Ketosis → Deep Ketosis → Autophagy
- **Multiple Protocols** — Support for 16:8, 18:6, 20:4, OMAD, and custom fasting windows
- **Progress Visualization** — Circular timer with metabolic state indicators

### Biomarkers
- **Longevity-Optimized Ranges** — Optimal targets differ from standard "normal" ranges
- **Key Markers Tracked:**
  - Metabolic: HbA1c, Fasting Glucose, Fasting Insulin
  - Lipids: ApoB, LDL-C, HDL-C, Triglycerides
  - Inflammation: hs-CRP, Homocysteine
  - Nutrients: Vitamin D, B12, Ferritin
- **Trend Visualization** — Track improvements over time

### Protocol Management
- **Pre-built Templates:**
  - Bryan Johnson's Blueprint Protocol
  - Peter Attia's Framework
  - Longevity Essentials Stack
- **Daily Checklists** — Track supplement and protocol adherence
- **Streak Tracking** — Gamified consistency motivation

### AI-Powered Insights
- **Personalized Recommendations** — AI analysis of your health data
- **Priority-Based Suggestions** — Actionable insights ranked by impact
- **Category Focus** — Sleep, activity, nutrition, and lifestyle optimization

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State Management:** Zustand + React Query
- **Charts:** Recharts + Tremor
- **Animations:** Framer Motion

### Backend
- **API:** n8n Webhook Workflows
- **Endpoints:**
  - `POST /api/health/metrics` — Record health data
  - `GET /api/health/metrics` — Retrieve metrics
  - `POST /api/protocol/log` — Log protocol items
  - `GET /api/scores/current` — Get health scores
  - `POST /api/fasting/start` — Start fasting session
  - `POST /api/ai/recommendations` — Get AI insights

### Infrastructure
- **Hosting:** Vercel (Edge Network)
- **Workflow Engine:** n8n (Self-hosted)
- **Database:** Supabase (PostgreSQL) — Optional

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- n8n instance (for API backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/longevity-app.git
   cd longevity-app
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://your-n8n-instance.com/webhook
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

---

## Project Structure

```
longevity-app/
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   │   ├── dashboard/          # Main dashboard routes
│   │   │   │   ├── activity/       # Activity tracking
│   │   │   │   ├── biomarkers/     # Blood marker analysis
│   │   │   │   ├── fasting/        # Fasting timer
│   │   │   │   ├── insights/       # AI recommendations
│   │   │   │   ├── protocols/      # Protocol management
│   │   │   │   ├── settings/       # User preferences
│   │   │   │   └── sleep/          # Sleep tracking
│   │   │   ├── globals.css         # Global styles + mobile utilities
│   │   │   └── layout.tsx          # Root layout with PWA support
│   │   ├── components/
│   │   │   ├── charts/             # Data visualization
│   │   │   ├── dashboard/          # Dashboard widgets
│   │   │   ├── layout/             # Navigation components
│   │   │   ├── tracking/           # Protocol & fasting UI
│   │   │   └── ui/                 # shadcn/ui components
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/                    # Utilities & API client
│   │   ├── stores/                 # Zustand state stores
│   │   └── types/                  # TypeScript definitions
│   └── public/
│       └── manifest.json           # PWA configuration
├── workflows/                      # n8n workflow JSON exports
├── docs/                           # Additional documentation
└── PROJECT_PLAN.md                 # Comprehensive project specification
```

---

## Mobile & PWA Support

The app is fully optimized for mobile devices:

- **Progressive Web App** — Installable on iOS and Android
- **Safe Area Support** — Proper handling of notched devices
- **Touch Optimized** — 44px minimum touch targets
- **Responsive Design** — Adaptive layouts for all screen sizes
- **Offline Ready** — Service worker support (optional)

---

## API Reference

### Health Metrics

```bash
# Record metrics
curl -X POST https://api.example.com/webhook/api/health/metrics \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "metrics": {"sleep_hours": 7.5, "hrv": 45}}'

# Response
{
  "success": true,
  "message": "Metrics recorded",
  "timestamp": "2024-01-30T12:00:00Z"
}
```

### Health Scores

```bash
# Get current scores
curl https://api.example.com/webhook/api/scores/current?userId=user123

# Response
{
  "success": true,
  "scores": {
    "overall": 85,
    "breakdown": {
      "cardiovascular": 88,
      "metabolic": 82,
      "sleep": 90,
      "activity": 80
    }
  }
}
```

### Fasting

```bash
# Start fasting session
curl -X POST https://api.example.com/webhook/api/fasting/start \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "targetHours": 16}'

# Response
{
  "success": true,
  "startedAt": "2024-01-30T20:00:00Z",
  "targetHours": 16,
  "estimatedEndAt": "2024-01-31T12:00:00Z"
}
```

---

## Science & Research

This app is built on evidence-based longevity research:

### Key Researchers
- **Peter Attia, MD** — Medicine 3.0, Outlive framework
- **David Sinclair, PhD** — NAD+ and sirtuin research (Harvard)
- **Valter Longo, PhD** — Fasting-mimicking diet (USC)
- **Rhonda Patrick, PhD** — Nutrigenomics and micronutrients
- **Bryan Johnson** — Blueprint protocol and quantified self

### Evidence Hierarchy
- **Tier 1 (Strong):** Vitamin D, Omega-3, Creatine, Exercise
- **Tier 2 (Moderate):** NMN/NR, Metformin, Rapamycin, Spermidine
- **Tier 3 (Emerging):** Fisetin, Quercetin + Dasatinib

### Key Biomarkers
| Marker | Standard Range | Optimal for Longevity |
|--------|---------------|----------------------|
| HbA1c | < 5.7% | 4.8-5.2% |
| hs-CRP | < 3 mg/L | < 1 mg/L |
| ApoB | < 130 mg/dL | < 90 mg/dL |
| Vitamin D | > 30 ng/mL | 50-80 ng/mL |
| Fasting Glucose | < 100 mg/dL | 70-85 mg/dL |

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Peter Attia](https://peterattiamd.com/) — Outlive and Medicine 3.0
- [David Sinclair](https://sinclair.hms.harvard.edu/) — Lifespan research
- [Bryan Johnson](https://blueprint.bryanjohnson.com/) — Blueprint protocol
- [shadcn/ui](https://ui.shadcn.com/) — Beautiful UI components
- [n8n](https://n8n.io/) — Workflow automation

---

<p align="center">
  <strong>Built for those who want to live longer, healthier lives.</strong>
</p>
