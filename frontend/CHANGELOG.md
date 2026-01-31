# Changelog

All notable changes to the Longevity App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-31

### Added

- **Dashboard**
  - Main dashboard with biological age display
  - Health score visualization
  - Quick access to all features
  - Today's progress overview

- **Protocol Tracking**
  - Daily protocol checklist
  - Support for supplements, exercise, nutrition, sleep, mindfulness, and therapy categories
  - Streak tracking
  - 30-day adherence statistics
  - Protocol templates

- **Fasting Timer**
  - Interactive fasting timer with metabolic state indicators
  - Multiple fasting protocols (16:8, 18:6, 20:4, 24h, 36h, 48h)
  - Progress visualization
  - Fasting history tracking
  - Statistics dashboard

- **Sleep Tracking**
  - Sleep duration logging
  - Sleep quality scoring
  - Sleep stage visualization
  - Weekly trends

- **Activity Tracking**
  - Exercise logging
  - Activity metrics
  - Progress charts

- **Biomarkers**
  - Biomarker tracking interface
  - Reference range visualization
  - Trend analysis

- **Health News**
  - Curated health and longevity news feed
  - Multiple news sources (GNews API, RSS feeds)
  - Category filtering (Health, Longevity, Research)
  - Featured articles

- **Insights**
  - AI-powered recommendations
  - Personalized insights based on tracked data

- **Settings**
  - User profile management
  - Theme toggle (light/dark mode)
  - Notification preferences
  - Fasting defaults configuration
  - Data management options

- **PWA Support**
  - Progressive Web App manifest
  - Mobile-optimized UI
  - Safe area support for notched devices
  - Offline-first data storage with localStorage

- **UI/UX**
  - Responsive design for mobile and desktop
  - Premium glass-morphism design
  - Smooth animations with Framer Motion
  - Mobile navigation with haptic feedback
  - Dark mode support

### Technical

- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Radix UI + shadcn/ui components
- Zustand for state management
- TanStack Query for data fetching
- Recharts for data visualization
- ESLint configuration with unused variable pattern support

### Fixed

- Build errors related to unused variables
- TypeScript strict mode compliance
- Image optimization with next/image
- MobileNav pathname null check

### Security

- Environment variables for API keys
- No sensitive data in client-side code

---

## Future Releases

### Planned for v0.2.0

- Backend API integration
- User authentication
- Cloud data sync
- Push notifications
- Apple Health / Google Fit integration
- Wearable device support

### Planned for v0.3.0

- AI-powered insights
- Biomarker trend analysis
- Personalized protocol recommendations
- Social features
- Export functionality
