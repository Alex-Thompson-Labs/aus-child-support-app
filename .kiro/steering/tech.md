# Technology Stack & Build System

## Core Framework
- **React Native 0.81.5** with **Expo 54** - Cross-platform mobile development
- **TypeScript 5.9** - Type safety and developer experience
- **Expo Router 6** - File-based navigation system

## Platform Targets
- **iOS/Android:** Native apps via Expo
- **Web:** Static site generation for auschildsupport.com
- **Deployment:** Vercel (web), Expo Application Services (mobile)

## Key Dependencies
- **@supabase/supabase-js** - Database and authentication
- **react-ga4** - Google Analytics tracking
- **expo-print** - PDF generation for lead exports
- **lucide-react-native** - Icon system
- **react-native-render-html** - Rich text rendering

## Development Tools
- **ESLint** with Expo config - Code linting
- **Prettier** - Code formatting (semi: true, singleQuote: true, tabWidth: 2)
- **TypeScript** strict mode - Type checking

## Build Commands

### Development
```bash
npm start          # Start Expo dev server
npm run dev        # Start with cleared cache
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in web browser
```

### Production
```bash
npm run build:web     # Export static web build to /dist
npm run type-check    # TypeScript validation
npm run lint          # ESLint validation
npm run format        # Prettier formatting
```

### Performance & Analysis
```bash
npm run build:analyze    # Bundle analysis with source maps
npm run lighthouse       # Performance audit
npm run serve:dist       # Serve built files locally
```

### Utilities
```bash
npm run images:optimize  # Convert images to WebP format
npm run reset-project    # Clean project state
```

## Project Structure Conventions
- **`/src`** - All source code (components, utils, hooks, screens)
- **`/app`** - Expo Router pages (file-based routing)
- **`/docs`** - Documentation and guides
- **`/assets`** - Images and static resources
- **`/public`** - Web-only static files

## Environment Setup
1. Copy `.env.example` to `.env`
2. Add Google Analytics ID: `EXPO_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
3. Configure Supabase credentials for database access

## Code Quality Standards
- **No `any` types** - Explicit TypeScript interfaces required
- **Production-ready code** - Error handling, validation, loading states
- **Accessibility** - ARIA labels, screen reader support
- **Cross-platform compatibility** - Test on iOS, Android, and web