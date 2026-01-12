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

## Styling
- **React Native StyleSheet** - No Tailwind CSS
- Slate/blue color theme (see DESIGN_SYSTEM.md)
- Platform-specific code via `Platform.OS` checks

## Common Commands

```bash
# Development
npm start              # Start Expo dev server (all platforms)
npm run dev            # Start with cache cleared
npm run web            # Web browser only
npm run ios            # iOS simulator
npm run android        # Android emulator

# Quality
npm run lint           # ESLint
npm run type-check     # TypeScript validation

# Production
npm run build:web      # Build for Vercel (generates sitemap + exports)
npm run build:analyze  # Bundle size analysis

# Performance
npm run lighthouse     # Full Lighthouse audit (builds, serves, runs)
npm run serve:dist     # Serve production build locally
```

## Environment Variables
Required in `.env` (never commit):
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_ADMIN_EMAIL` / `EXPO_PUBLIC_ADMIN_PASSWORD`
- `EXPO_PUBLIC_GA_MEASUREMENT_ID`

## TypeScript Config
- Strict mode enabled
- Path alias: `@/*` maps to project root
- Types include Jest for testing

## Deployment
- **Web**: Vercel (static export via `expo export --platform web`)
- **Domain**: auschildsupport.com
- **Database**: Supabase with Row Level Security
