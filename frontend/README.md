# Longevity App

A modern, evidence-based longevity tracking application with biological age estimation, protocol management, and health insights.

## Features

- **Dashboard**: Track your biological age and key health metrics
- **Protocol Tracking**: Manage daily longevity protocols (supplements, exercise, sleep, nutrition)
- **Fasting Timer**: Track intermittent fasting with metabolic state indicators
- **Sleep Tracking**: Monitor sleep patterns and quality
- **Activity Tracking**: Log exercise and physical activity
- **Biomarkers**: Track and visualize health biomarkers
- **Health News**: Stay updated with the latest longevity research
- **AI Insights**: Get personalized recommendations based on your data

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Animations**: Framer Motion
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/longevity-app.git
   cd longevity-app/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file from the example:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=your-api-url
   GNEWS_API_KEY=your-gnews-api-key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    dashboard/            # Dashboard pages
      activity/           # Activity tracking
      add/                # Quick add page
      biomarkers/         # Biomarker tracking
      fasting/            # Fasting timer
      insights/           # AI insights
      news/               # Health news feed
      protocols/          # Protocol management
      settings/           # User settings
      sleep/              # Sleep tracking
    layout.tsx            # Root layout
    page.tsx              # Landing page
    providers.tsx         # App providers
  components/             # React components
    layout/               # Layout components
    tracking/             # Tracking components
    ui/                   # UI primitives (shadcn)
  hooks/                  # Custom React hooks
  lib/                    # Utility functions
  stores/                 # Zustand stores
  types/                  # TypeScript types
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `GNEWS_API_KEY` | GNews API key for health news | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | No |
| `NEXT_PUBLIC_ANALYTICS_ID` | Analytics tracking ID | No |

## PWA Support

This app is a Progressive Web App (PWA) and can be installed on mobile devices. The manifest is located at `/public/manifest.json`.

### Required PWA Assets

Icons should be placed in `/public/icons/`:
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`
- `apple-touch-icon.png`
- `favicon-16x16.png`
- `favicon-32x32.png`

Splash screens should be placed in `/public/splash/` for iOS devices.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
