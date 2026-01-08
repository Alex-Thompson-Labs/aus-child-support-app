# CLAUDE.md

**Last Updated:** 2026-01-01
**Project Phase:** Phase 3A - Validation
**Status:** Production Ready / Validation Mode

This file provides guidance to Claude Code (claude.ai/code) and Desktop Commander when working with code in this repository.

---

## 📑 Table of Contents

- [Quick Start Commands](#-quick-start-commands)
- [Quick Reference](#-quick-reference)
- [Environment Setup](#-environment-setup)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Current Project Phase](#-current-project-phase)
- [Documentation Structure](#-documentation-structure)
- [Key Technical Patterns](#-key-technical-patterns)
- [AI Assistant Guidance](#-ai-assistant-guidance)
- [Production Code Standards](#-production-code-standards)
- [Common Pitfalls to Avoid](#-common-pitfalls-to-avoid)
- [When to Use Plan Mode](#-when-to-use-plan-mode-claude-code)
- [Testing Guidelines](#-testing-guidelines)
- [Deployment](#-deployment)
- [Admin Access](#-admin-access)
- [Database (Supabase)](#-database-supabase)
- [Making Changes](#-making-changes)
- [Troubleshooting](#-troubleshooting)
- [Additional Resources](#-additional-resources)
- [Success Metrics](#-success-metrics)

---

## 🚀 Quick Start Commands

```bash
npm install                 # Install dependencies
npx expo start              # Start development server (all platforms)
npx expo start --ios        # Run on iOS simulator
npx expo start --android    # Run on Android emulator
npx expo start --web        # Run in web browser
npm run lint                # Run ESLint
npm run type-check          # Verify TypeScript types
npm run build:web           # Build for production (web)

## 🎯 Quick Reference

## 🎯 Quick Reference

| Task | Command | Notes |
|------|---------|-------|
| Start dev server | `npm start` | All platforms |
| Test web | `npm run web` | Browser only |
| Test iOS | `npm run ios` | Requires Xcode |
| Test Android | `npm run android` | Requires Android Studio |
| Build for production | `npm run build:web` | Creates `dist/` folder |
| Run linter | `npm run lint` | Check code quality |
| Type check | `npm run type-check` | Verify TypeScript |
| Clear cache | `npm run dev` | Clears Expo cache |
| Analyze bundle | `npm run build:analyze` | Bundle size analysis |
| Run Lighthouse | `npm run lighthouse` | Performance audit |

## 🔑 Environment Setup

**Production environment variables (already configured):**

- `EXPO_PUBLIC_SUPABASE_URL` - Supabase database URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `EXPO_PUBLIC_ADMIN_EMAIL` - Admin login email
- `EXPO_PUBLIC_ADMIN_PASSWORD` - Admin login password
- `EXPO_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics ID (Web/Mobile)

**⚠️ NEVER commit `.env` to git** - It contains secrets and is in `.gitignore`

**Note for new developers:** If `.env` is missing, contact the project owner for credentials.

### 🗂️ .gitignore Structure

The project uses a comprehensive `.gitignore` to protect sensitive business data:

**Business Data (NOT tracked):**
- `/business-docs/` - Lawyer partnerships, invoices, signed agreements
- `/data/` - Email lists, outreach data, analytics exports
- `*.key`, `*.pem`, `*.cert` - Security certificates
- `secrets/`, `config/secrets.json` - API keys and credentials

**Build Artifacts (NOT tracked):**
- `dist/`, `build/`, `out/` - Generated web builds
- `/ios`, `/android` - Generated native folders (use `npx expo prebuild` to regenerate)
- `*.map` - Source maps
- `.expo/`, `.expo-shared/`, `.expo-internal/` - Expo cache

**Development Files (NOT tracked):**
- `node_modules/` - Dependencies
- `.env*` - Environment variables
- `*.log` - Log files
- `.DS_Store` - macOS metadata

**Documentation (TRACKED in git):**
- `docs/` - All documentation files are version controlled for team collaboration

---

## 🏗️ Architecture Overview

**🎯 BUSINESS MODEL:** This is a **B2B lead generation** app with a "Privacy First" architecture.

- Parents use FREE calculator
- Complexity triggers detect high-value cases
- **Secure Magic Links** deliver lead data to lawyers (No PII in emails)
- Lawyers pay **$50 per qualified lead** (or a Monthly Retainer)
- **Marketing Retainer Model:** We manage Google Ads accounts for exclusive partners
- **Full Model Justification:** See `docs/business-docs/BUSINESS_MODEL.md`

This is an **Expo/React Native multi-platform app** (iOS, Android, Web) that implements an Australian Child Support Calculator with integrated lawyer lead generation.

### 📱 Platform Support

**Multi-platform (React Native):**

- ✅ **iOS** - Mobile app (App Store deployment pending)
- ✅ **Android** - Mobile app (Play Store deployment pending)
- ✅ **Web** - Static site export for `auschildsupport.com`

**Platform-specific considerations:**

- **Analytics:** Google Analytics (react-ga4) + Vercel Analytics & Speed Insights
- **Haptic feedback:** Mobile only
- **Admin panel:** Web-optimized
- **Secure View:** Web-only route for lawyers (planned: `/admin/view-lead/[token]`)

---

## 🗂️ Project Structure

```

csc/
├── app/ # Expo Router file-based routing
│ ├── \_layout.tsx # Root layout with theme provider
│ ├── (tabs)/ # Tab navigation for calculator
│ │ ├── index.tsx # Home screen (CalculatorScreen)
│ ├── admin/ # Admin panel routes
│ │ ├── dashboard.tsx # Lead management dashboard
│ │ ├── login.tsx # Admin authentication
│ │ └── lead/[id].tsx # Individual lead details (Internal)
│ └── lawyer-inquiry.tsx # Inquiry form screen
│
├── src/ # Domain logic (platform-agnostic)
│ ├── components/ # React components
│ │ ├── CalculatorForm.tsx
│ │ ├── CalculatorResults.tsx
│ │ └── SmartConversionFooter.tsx
│ ├── screens/ # Screen components
│ │ └── CalculatorScreen.tsx
│ ├── features/ # Feature modules
│ │ └── lawyer-inquiry/
│ │ └── LawyerInquiryScreen.tsx
│ ├── hooks/ # Custom hooks
│ │ └── useCalculator.ts # Main calculation logic
│ ├── utils/ # Business logic
│ │ ├── child-support-calculations.ts
│ │ ├── complexity-detection.ts
│ │ ├── supabase.ts # Database client
│ │ └── analytics.ts # Google Analytics + Vercel Analytics wrapper
│ └── types/ # TypeScript definitions
│ └── calculator.ts
│
├── docs/ # Documentation (tracked in git)
│ ├── business-docs/
│ │ └── BUSINESS_MODEL.md # Revenue model details
│ ├── DESIGN_SYSTEM.md # UI patterns & calculation formulas
│ └── CLAUDE.md # This file - AI assistant guidance
│
├── business-docs/ # Business data (NOT in git - see .gitignore)
│ └── [lawyer contacts, partnership agreements, invoices]
│
├── data/ # Email lists & analytics (NOT in git)
│ └── [lawyer emails, outreach lists, analytics exports]
│
└── dist/ # Web build output (generated, not tracked)

````

---

## 🎯 Current Project Phase

**Status:** Phase 3A - Validation

**Goal:** Prove lead quality before scaling

**Progress:**

- ✅ Calculator built and tested
- ✅ Complexity triggers implemented
- ✅ Inquiry form with Supabase integration
- ✅ Admin panel for lead management
- ✅ **Analytics** integration (Google Analytics + Vercel Analytics)
- ⏳ **Secure Magic Link** implementation (In Progress)
- ⏳ **Exclusive Partner (Retainer)** outreach (In Progress)

**Next steps:** See BUSINESS_MODEL.md for current validation plan

---

## 📚 Documentation Structure

### 🎯 Start Here (For Developers & AI)

**Essential Reading Order:**

1. **This file (CLAUDE.md)** - Architecture and AI guidance
2. **docs/business-docs/BUSINESS_MODEL.md** - Revenue model and business logic
3. **docs/DESIGN_SYSTEM.md** - UI patterns, colors, calculation formulas
4. **docs/business-docs/proof-before-pitch-v2.md** - Current validation plan

### 📖 Documentation Structure

**Current Phase Documentation:**

- See `docs/business-docs/BUSINESS_MODEL.md` for current status
- See `docs/business-docs/PRODUCT_ROADMAP.md` for strategic plan
- See `docs/business-docs/proof-before-pitch-v2.md` for validation plan

---

## 🔧 Key Technical Patterns

### Calculator Logic

The app implements the official Australian child support 8-step formula from Services Australia.

**Read the full explanation in `docs/DESIGN_SYSTEM.md`**

**Key concepts:**

- **CSI (Child Support Income)**: ATI - SSA - relevant dependents
- **The Gap**: Income % - Cost % = Payment %

**Implementation:**

- `src/hooks/useCalculator.ts` - Form state and orchestration
- `src/utils/child-support-calculations.ts` - Core formulas

### Complexity Detection

Identifies high-value cases that need legal help:

- High income variance between parents
- Change of Assessment reasons (10 official grounds)
- Court dates or legal proceedings

**Implementation:** `src/utils/complexity-detection.ts`

### Secure Data Delivery (Privacy First)

We **never** email raw lead data to lawyers.

1. **Submission:** Parent submits form -> Saved to Supabase (Encrypted)
2. **Notification:** Admin gets "Teaser" email (No PII)
3. **Handover:** Admin generates **Secure Magic Link** -> Sends to Lawyer
4. **Access:** Lawyer clicks link -> Views data in secure route (planned: `/admin/view-lead/[token]`)

**Implementation Status:** Secure Magic Link system planned (route and utility file to be implemented)

### Database Integration (Supabase)

Stores inquiry form submissions for admin review:

- **Client:** `src/utils/supabase.ts`
- **Table:** `leads` (id, name, email, phone, description, urgency, source, created_at)
- **RLS Policies:** Read/write access configured
- **Admin Panel:** `app/admin/*` routes

### Platform-Specific Code

Use `Platform.OS` checks for platform-specific features:

```typescript
import { Platform } from 'react-native';

// Haptics (mobile only)
if (Platform.OS !== 'web') {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}
````

### Styling System

All styling uses React Native StyleSheet with consistent color palette:

**Colors (from `docs/DESIGN_SYSTEM.md`):**

- Primary: `#2563eb` (blue-600)
- Background: `#0f172a` (slate-900)
- Cards: `#1e293b` (slate-800)
- Text: `#f8fafc` (slate-50)

**No Tailwind CSS** - Use StyleSheet.create() for all styles.

---

## 🤖 AI Assistant Guidance

### Recommended Models by Task Type

**Claude Sonnet 4.5** (Default) ✅

- Code implementation (components, utils, screens)
- Bug fixes and debugging
- Adding features to existing code
- Refactoring and optimization
- Documentation updates
- Most development tasks

**Claude Opus 4** (Strategic Use)

- Complex architectural decisions
- Multi-system integrations
- Security audits (Secure Link logic)
- Design judgment tasks (responsive web design)

**Cost Reality:**

- Sonnet 4.5: ~$0.01-0.05 per prompt
- Opus 4: ~$0.10-0.50 per prompt (10x more)
- Most tasks work perfectly with Sonnet

---

## ⚠️ Common Pitfalls to Avoid

**Code Quality:**

- ❌ Don't use `any` types - always define proper TypeScript interfaces
- ❌ Don't skip error handling - production code needs try/catch blocks
- ❌ Don't forget loading states - users need feedback
- ❌ Don't ignore edge cases - test with null, undefined, empty strings, extreme values

**Project-Specific:**

- ❌ Don't use Tailwind CSS - this project uses React Native StyleSheet
- ❌ Don't modify `/ios` or `/android` manually - they're generated by `expo prebuild`
- ❌ Don't use `react-native-web` specific APIs without Platform checks

**Security:**

- ❌ **NEVER email PII (Name, Phone, Email)** - always use Secure Magic Links
- ❌ Don't commit `.env` files - they're gitignored for a reason
- ❌ Don't store business data in git - use `/business-docs/` and `/data/` (gitignored)

**Business Logic:**

- ❌ Don't modify calculation formulas without verifying against Services Australia documentation
- ❌ Don't change complexity triggers without understanding business impact (affects revenue)
- ❌ Don't alter lead submission flow without testing end-to-end

---

## 💡 Production Code Standards

**⚠️ CRITICAL: Apply to EVERY code generation task**

When asking Claude to write code, ALWAYS include:

```
PRODUCTION REQUIREMENTS:
- Proper TypeScript types (no 'any')
- Error handling for all failure cases
- Loading states where needed
- Input validation and sanitization
- Edge case handling (empty strings, null, undefined, extreme values)
- Accessibility labels where appropriate

Before implementing, think:
1. What could go wrong? (error cases)
2. What am I forgetting? (loading states, validation, edge cases)
3. Is this production-ready or just a demo?
```

### Good vs Bad Prompts

**❌ Bad Prompt:**

```
Create a component that displays lead information
```

**✅ Good Prompt:**

```
Create src/components/LeadCard.tsx that displays lead information.

PRODUCTION REQUIREMENTS:
- Props: lead (Lead type), onPress (callback)
- Handle missing/null fields gracefully
- Add loading state if data is fetching
- Validate email/phone format before display
- Add accessibility labels for screen readers
- Error boundary for render failures

Think about edge cases: What if lead has no phone? What if email is malformed?
```

**Why This Matters:** The difference between demo code and production code is in YOUR prompt. Claude builds exactly what you ask for - no more, no less.

---

## 🎯 When to Use Plan Mode (Claude Code)

### What is Plan Mode?

**Plan Mode** makes Claude Code create a detailed plan BEFORE executing. It costs ~10x more but is valuable for complex tasks.

**Visual Indicators:**

- **Regular Mode:** `? for shortcuts` (default)
- **Plan Mode:** `" plan mode on (shift+tab to cycle)`
- **Accept Edits:** `▶▶ accept edits on (shift+tab to cycle)` (different feature - auto-approves changes)

**Cycle through modes:** Press **Shift+Tab**

### ✅ Use Plan Mode For:

- Multi-file changes (3+ files)
- **Secure Magic Link** implementation (Security critical)
- Architecture decisions
- Integration work (database, API, auth)

### ❌ Use Regular Mode For:

- Single file edits
- Bug fixes
- Documentation updates
- Simple prompts

### Cost Comparison

- Phase 1-2 with smart Plan mode use: ~$2-5
- Same work using Plan mode everywhere: ~$15-30
- **Rule of thumb:** Use Plan mode for <10% of prompts

---

## 🧪 Testing Guidelines

### Local Testing

**Before deployment:**

```bash
# Test all platforms
npx expo start --ios        # Test iOS
npx expo start --android    # Test Android
npx expo start --web        # Test web

# Test with cache cleared
npx expo start --clear
```

**Verify:**

- Calculator produces correct results
- Complexity triggers fire appropriately
- **Google Analytics** events firing
- Admin panel loads and displays leads
- **Secure Link** route works correctly

### Production Testing

**After deployment:**

- Test live web app at `auschildsupport.com`
- Verify privacy policy link works
- Test form submission end-to-end
- Check admin panel on production database
- Verify analytics events firing (Google Analytics + Vercel Analytics)

---

## 🚀 Deployment

### Web Platform (Current Priority)

**Build for production:**

```bash
npx expo export --platform web
```

**Deploy to Vercel:**

1. Build: `npx expo export --platform web`
2. Use Vercel CLI: `vercel --prod` or connect repository to Vercel dashboard
3. Point `auschildsupport.com` to Vercel (update DNS records at registrar)

**Deployment details:** See deployment section above

### Mobile Platforms (Future)

**iOS App Store:**

- Requires Apple Developer account ($99/year)
- Deployment guide to be created when ready

**Android Play Store:**

- Requires Google Play account ($25 one-time)
- Deployment guide to be created when ready

---

## 🔐 Admin Access

**Admin Panel:** `auschildsupport.com/admin/login`

**Login credentials:** Stored in `.env`

- `EXPO_PUBLIC_ADMIN_EMAIL`
- `EXPO_PUBLIC_ADMIN_PASSWORD`

**Features:**

- View all submitted leads
- Mark leads as qualified/paid
- **Generate Secure View Links** for lawyers

---

## 🗄️ Database (Supabase)

**Connection:** `src/utils/supabase.ts`

**Tables:** `leads`

**RLS Policies:** Configured for public insert, admin read/update

**Access:** Project dashboard at `supabase.com`

---

## 📝 Making Changes

### Code Changes

1. **Understand the change:** Read relevant documentation first
2. **Make the change:** Follow existing code style, use TypeScript
3. **Test the change:** Test on all platforms
4. **Document the change:** Update `docs/` and `REMAINING_TASKS.md`

### Documentation Changes

**Documentation is tracked in git** - All files in `docs/` are version controlled.

**Business data is NOT tracked** - Keep sensitive data in `/business-docs/` and `/data/` (gitignored)

---

## 🆘 Troubleshooting

---

## 📚 Additional Resources

### Official Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

---

## 🎯 Success Metrics

### Phase 3A Goals (Current)

- ✅ Web app deployed to `auschildsupport.com`
- ✅ **Analytics** active (Google Analytics + Vercel Analytics)
- 🎯 **Secure Magic Link** system operational
- 🎯 1 Exclusive Partner signed (**$500 Retainer**)
- 🎯 15%+ Consultation Rate

### Long-term Goals

- Monthly leads: 15-380
- Monthly revenue: $1,500-$38,000
- Lawyer partners: 5-20
- Dispute Rate: <20%

---

**Questions? Ask Claude Code or Desktop Commander for help!**
