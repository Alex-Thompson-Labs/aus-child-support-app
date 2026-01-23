---
inclusion: always
---

# Tech Stack & Build System

## Framework
- **Expo SDK 54** with React Native 0.81.5
- **React 19.1** with TypeScript 5.9
- **Expo Router** - File-based routing with async routes for code splitting

## Platform Support
- ✅ Web (primary) - Static export deployed to Vercel
- ✅ iOS - Mobile app (App Store pending)
- ✅ Android - Mobile app (Play Store pending)

## Key Dependencies
- **@supabase/supabase-js** - Database & auth (PostgreSQL, Sydney region)
- **expo-router** - Navigation with typed routes
- **react-ga4** - Google Analytics
- **@vercel/analytics** + **@vercel/speed-insights** - Web performance
- **lucide-react-native** - Icons
- **expo-print** / **expo-sharing** - PDF export (lazy loaded)
- **@react-pdf/renderer** - PDF generation

## Styling
- **React Native StyleSheet** - No Tailwind CSS
- Slate/blue color theme (see docs/DESIGN_SYSTEM.md)
- Platform-specific code via `Platform.OS` checks

## Project Structure
```
/
├── app/                    # Expo Router (file-based routing)
│   ├── (tabs)/             # Tab navigation (calculator home)
│   ├── admin/              # Admin dashboard & lead management
│   ├── lawyer-inquiry.tsx  # Lead capture form
│   ├── special-circumstances.tsx  # Direct entry from blog
│   └── partner/[slug].tsx  # Partner landing pages
├── src/
│   ├── components/         # UI components
│   ├── features/           # Feature modules (calculator, conversion, lawyer-inquiry)
│   ├── hooks/              # useCalculator, useCalculatorState
│   ├── utils/              # Business logic (formulas, complexity detection)
│   └── config/             # Configuration (partners, scoring)
├── docs/                   # Documentation
│   ├── CLAUDE.md           # Architecture & coding standards
│   ├── DESIGN_SYSTEM.md    # UI patterns & formulas
│   └── business-docs/      # Strategy & roadmap
└── supabase/               # Database functions & migrations
```

## Common Commands

```bash
# Development
npm start              # Start Expo dev server (all platforms)
npm run dev            # Start with cache cleared
npm run web            # Web browser only

# Quality
npm run lint           # ESLint
npm run type-check     # TypeScript validation

# Production
npm run build:web      # Build for Vercel (generates sitemap + exports)
npm run build:analyze  # Bundle size analysis

# Testing
npm run test           # Run Jest tests
npm run test:coverage  # Coverage report
```

## Environment Variables
Required in `.env` (never commit):
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_ADMIN_EMAIL`
- `EXPO_PUBLIC_ADMIN_PASSWORD`
- `EXPO_PUBLIC_GA_MEASUREMENT_ID`

## Database
- **Platform**: Supabase (PostgreSQL, Sydney region)
- **Tables**: leads, proposals (with RLS policies)
- **Security**: Row Level Security, encrypted storage
- **Compliance**: Privacy Act 1988 compliant (consent tracking, audit trails)

## Deployment
- **Web**: Vercel (static export)
- **Build**: `expo export --platform web`
- **Analytics**: Google Analytics + Vercel Analytics & Speed Insights
