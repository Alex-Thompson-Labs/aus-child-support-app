---
inclusion: always
---

> ## 🚨 CRITICAL: Documentation Maintenance Required
> 
> **BEFORE making ANY code changes, you MUST update relevant documentation.**
> 
> **Read this first:** `/docs/AI_DOCUMENTATION_GUIDE.md`
> 
> **Quick checklist after making code changes:**
> - New feature implemented? → Update `/docs/business-docs/BUSINESS_MODEL.md` (change 📋 to ✅)
> - UI component added/modified? → Update `/docs/DESIGN_SYSTEM.md`
> - New route/screen created? → Update `/docs/business-docs/USER_FLOW.md`
> - Database schema changed? → Update `/docs/CLAUDE.md`
> - Bug fixed? → Update `/docs/PROJECT_KNOWLEDGE_BASE.md`
> 
> **See `/docs/CLAUDE.md` for complete checklist and examples.**
> 
> **This is mandatory, not optional.** Documentation accuracy is critical to this project.

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

## 🚨 External Lead Generation Channels

**CRITICAL:** The app receives traffic from external sources beyond the main calculator.

### Chatbot Widget (blog.auschildsupport.com.au)
- Custom chatbot on blog guides readers directly to inquiry form
- Uses Direct Inquiry URL patterns (bypasses calculator)
- **Key traffic source** - be aware when modifying inquiry form URLs

### Direct Routing URLs
These URLs are embedded in **chatbot widget AND blog posts**:

```
https://auschildsupport.com.au/lawyer-inquiry?mode=direct
https://auschildsupport.com.au/lawyer-inquiry?mode=direct&reason=binding_agreement
https://auschildsupport.com.au/special-circumstances
```

**⚠️ Breaking Changes:** If you modify these URL patterns or parameters:
1. Update chatbot widget configuration
2. Search/replace URLs in all blog posts
3. Notify team before deploying

### Direct Enquiry Flow
- **Entry Point 1**: `/special-circumstances` - Factor selection first
- **Entry Point 2**: `/lawyer-inquiry?mode=direct&reason=[slug]` - Direct form entry
- **Mechanism**: `mode=direct` param triggers manual income/children inputs
- **Slugs**: `hidden_income`, `binding_agreement` (defined in `src/features/lawyer-inquiry/config.ts`)

## Production Code Standards

**⚠️ Apply to EVERY code generation task:**

Before implementing, check:
- [ ] Proper TypeScript types (no `any`)
- [ ] Error handling for all failure cases
- [ ] Loading states where needed
- [ ] Input validation and sanitization
- [ ] Edge case handling (empty strings, null, undefined, extreme values)
- [ ] Accessibility labels where appropriate

**Think:** What could go wrong? What am I forgetting? Is this production-ready?
