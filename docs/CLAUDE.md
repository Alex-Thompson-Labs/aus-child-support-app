# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and Desktop Commander when working with code in this repository.

---

## 🚀 Quick Start Commands

```bash
npm install                 # Install dependencies
npx expo start              # Start development server (all platforms)
npx expo start --ios        # Run on iOS simulator
npx expo start --android    # Run on Android emulator
npx expo start --web        # Run in web browser
npm run lint                # Run ESLint
```

## 🔑 Environment Setup

**Production environment variables (already configured):**
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase database URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `EXPO_PUBLIC_ADMIN_EMAIL` - Admin login email
- `EXPO_PUBLIC_ADMIN_PASSWORD` - Admin login password
- (PostHog disabled for web platform)

**⚠️ NEVER commit `.env` to git** - It contains secrets and is in `.gitignore`

**Note for new developers:** If `.env` is missing, contact the project owner for credentials.

---

## 🏗️ Architecture Overview

**🎯 BUSINESS MODEL:** This is a **B2B lead generation** app, not a B2C utility.
- Parents use FREE calculator
- Complexity triggers detect high-value cases (high income variance, special circumstances, court dates)
- "Get Legal Help" buttons connect parents with lawyers
- Lawyers pay $100 per booked consultation
- Target: $4K-$380K/year revenue
- **Full Model Justification:** See `docs/PRICING_STRATEGY_ANALYSIS.md` for comprehensive regulatory compliance analysis

This is an **Expo/React Native multi-platform app** (iOS, Android, Web) that implements an Australian Child Support Calculator with integrated lawyer lead generation.

### 📱 Platform Support

**Multi-platform (React Native):**
- ✅ **iOS** - Mobile app (App Store deployment pending)
- ✅ **Android** - Mobile app (Play Store deployment pending)  
- ✅ **Web** - Static site export for `auschildsupport.com`

**Platform-specific considerations:**
- PostHog analytics: Mobile only (disabled on web)
- Haptic feedback: Mobile only
- Admin panel: Web-optimized (mobile compatible)

---

## 🗂️ Project Structure

```
csc/
├── app/                      # Expo Router file-based routing
│   ├── _layout.tsx           # Root layout with theme provider
│   ├── (tabs)/               # Tab navigation for calculator
│   │   ├── index.tsx         # Home screen (CalculatorScreen)
│   │   └── explore.tsx       # About/Help screen
│   ├── admin/                # Admin panel routes
│   │   ├── dashboard.tsx     # Lead management dashboard
│   │   ├── login.tsx         # Admin authentication
│   │   └── lead/[id].tsx     # Individual lead details
│   └── lawyer-inquiry.tsx    # Inquiry form screen
│
├── src/                      # Domain logic (platform-agnostic)
│   ├── components/           # React components
│   │   ├── CalculatorForm.tsx
│   │   ├── CalculatorResults.tsx
│   │   ├── SmartConversionFooter.tsx
│   │   └── WebInquiryPanel.tsx
│   ├── screens/              # Screen components
│   │   ├── CalculatorScreen.tsx
│   │   └── LawyerInquiryScreen.tsx
│   ├── hooks/                # Custom hooks
│   │   └── useCalculator.ts  # Main calculation logic
│   ├── utils/                # Business logic
│   │   ├── child-support-calculations.ts
│   │   ├── complexity-detection.ts
│   │   ├── supabase.ts       # Database client
│   │   └── analytics.ts      # PostHog wrapper (mobile only)
│   └── types/                # TypeScript definitions
│       └── calculator.ts
│
├── docs/                     # Documentation
│   ├── BUSINESS_MODEL.md     # Revenue model details
│   ├── DESIGN_SYSTEM.md      # UI patterns & calculation formulas
│   └── guides/               # Implementation guides
│       ├── active/           # Current phase guides
│       └── old/              # Archived phase guides
│
└── dist/                     # Web build output (generated)
```

---

## 🎯 Current Project Phase

**Status:** Phase 2 - Near Launch  
**Progress:** 
- ✅ Calculator built and tested
- ✅ Complexity triggers implemented
- ✅ Inquiry form with Supabase integration
- ✅ Admin panel for lead management
- ✅ Web platform support added
- 🚧 Web deployment in progress
- ⏳ Privacy policy integration needed
- ⏳ Lawyer outreach preparation

**See:** `docs/guides/active/REMAINING_TASKS.md` for immediate next steps

---

## 📚 Documentation Structure

### 🎯 Start Here (For Developers & AI)

**Essential Reading Order:**
1. **This file (CLAUDE.md)** - Architecture and AI guidance
2. **docs/BUSINESS_MODEL.md** - Revenue model and business logic
3. **docs/DESIGN_SYSTEM.md** - UI patterns, colors, calculation formulas
4. **docs/guides/active/REMAINING_TASKS.md** - Current work in progress

### 📖 Active Guides (`docs/guides/active/`)

**Current Phase Documentation:**
- `REMAINING_TASKS.md` - Immediate next steps and blockers
- `LEAD_HANDOVER.md` - How to handle incoming leads
- `WEB_DEPLOYMENT_GUIDE.md` - Web platform deployment process

### 🗄️ Archived Guides (`docs/guides/old/`)

**Completed Phase Documentation:**
- Phase 1 technical development (calculator, complexity triggers, forms)
- Phase 2 business setup (email templates, partnership agreements)
- Historical reference only - not needed for current work

### 📧 Email Templates (`docs/templates/`)

**Business Communication:**
- `EMAIL_COLD_OUTREACH.md` - Lawyer recruitment
- `EMAIL_WELCOME_NEW_PARTNER.md` - Onboarding new partners
- `EMAIL_LEAD_FORWARDING.md` - Sending leads to lawyers
- `EMAIL_WEEKLY_CHECKIN.md` - Partner engagement
- `EMAIL_MONTHLY_INVOICE.md` - Billing communication
- `LAWYER_PARTNERSHIP_AGREEMENT.md` - Legal agreement template

---

## 🔧 Key Technical Patterns

### Calculator Logic
The app implements the official Australian child support 8-step formula from Services Australia.

**Read the full explanation in `docs/DESIGN_SYSTEM.md`**

**Key concepts:**
- **CSI (Child Support Income)**: ATI - SSA - relevant dependents
- **Income %**: Your share of combined income
- **Cost %**: Credit for care time (derived from care nights)
- **The Gap**: Income % - Cost % = Payment %

**Implementation:**
- `src/hooks/useCalculator.ts` - Form state and orchestration
- `src/utils/child-support-calculations.ts` - Core formulas
- `src/utils/child-support-constants.ts` - Government rates (year-indexed)
- `src/utils/cost-of-children-tables.ts` - Official cost tables

### Complexity Detection
Identifies high-value cases that need legal help:
- High income variance between parents
- Special circumstances (Change of Assessment reasons)
- Court dates or legal proceedings
- Zero payment anomalies

**Implementation:** `src/utils/complexity-detection.ts`

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

// Analytics (mobile only)
if (Platform.OS !== 'web') {
  PostHog.capture('event_name');
}

// Haptics (mobile only)
if (Platform.OS !== 'web') {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}
```

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
- Performance optimization strategies
- Security audits
- Design judgment tasks (responsive web design)
- When stuck >2 hours on same problem

**Cost Reality:**
- Sonnet 4.5: ~$0.01-0.05 per prompt
- Opus 4: ~$0.10-0.50 per prompt (10x more)
- Most tasks work perfectly with Sonnet

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
- Complex features spanning multiple systems
- Architecture decisions
- When stuck after 2-3 attempts
- Major refactoring
- Integration work (database, API, auth)

### ❌ Use Regular Mode For:
- Single file edits
- Bug fixes
- Adding one feature
- Documentation updates
- Simple prompts (1-3 sentences)
- Copy-paste tasks

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
- Inquiry form saves to Supabase
- Admin panel loads and displays leads
- All navigation works smoothly
- Styling looks correct on all platforms

### Production Testing

**After deployment:**
- Test live web app at `auschildsupport.com`
- Verify privacy policy link works
- Test form submission end-to-end
- Check admin panel on production database
- Monitor for console errors
- Test on multiple browsers (Chrome, Safari, Firefox)
- Test on mobile browsers

---

## 🚀 Deployment

### Web Platform (Current Priority)

**Build for production:**
```bash
npx expo export --platform web
```

**Deploy to Netlify:**
1. Build: `npx expo export --platform web`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag `dist/` folder to upload
4. Point `auschildsupport.com` to Netlify (update nameservers at registrar)

**See:** `docs/guides/active/WEB_DEPLOYMENT_GUIDE.md` for detailed steps

### Mobile Platforms (Future)

**iOS App Store:**
- Requires Apple Developer account ($99/year)
- See `docs/guides/old/APP_STORE_DEPLOYMENT.md`

**Android Play Store:**
- Requires Google Play account ($25 one-time)
- See `docs/guides/old/APP_STORE_DEPLOYMENT.md`

---

## 🔐 Admin Access

**Admin Panel:** `auschildsupport.com/admin/login`

**Login credentials:** Stored in `.env`
- `EXPO_PUBLIC_ADMIN_EMAIL`
- `EXPO_PUBLIC_ADMIN_PASSWORD`

**Features:**
- View all submitted leads
- Mark leads as contacted/converted
- View lead details and urgency
- Track lead sources

---

## 🗄️ Database (Supabase)

**Connection:** `src/utils/supabase.ts`

**Tables:**
- `leads` - Inquiry form submissions

**Schema:**
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  description TEXT NOT NULL,
  urgency TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**RLS Policies:** Configured for public insert, admin read/update

**Access:** Project dashboard at `supabase.com`

---

## 📝 Making Changes

### Code Changes

1. **Understand the change:**
   - Read relevant documentation first
   - Check existing patterns in codebase
   - Review `docs/DESIGN_SYSTEM.md` for UI patterns

2. **Make the change:**
   - Follow existing code style
   - Use TypeScript types (no `any`)
   - Add error handling
   - Include edge case handling
   - Add comments for complex logic

3. **Test the change:**
   - Test on all platforms (web, iOS, Android)
   - Test edge cases
   - Check for console errors
   - Verify no regressions

4. **Document the change:**
   - Update relevant docs if architecture changed
   - Update `docs/guides/active/REMAINING_TASKS.md` if completing a task

### Documentation Changes

- Update `CLAUDE.md` for architectural changes
- Update `DESIGN_SYSTEM.md` for UI pattern changes
- Update `BUSINESS_MODEL.md` for business logic changes
- Update `guides/active/REMAINING_TASKS.md` for progress tracking

---

## 🆘 Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clear cache and rebuild
npx expo start --clear
```

**Database connection fails:**
- Check `.env` has correct Supabase credentials
- Verify RLS policies allow operation
- Check Supabase project is active

**Admin login fails:**
- Verify credentials in `.env`
- Check console for error messages
- Verify EXPO_PUBLIC_ prefix on variables

**Styling looks wrong on web:**
- Platform-specific styles may need adjustment
- Check for mobile-only components
- Review responsive breakpoints

**PostHog errors on web:**
- PostHog is intentionally disabled on web
- This is expected behavior

### Getting Help

1. Check existing documentation in `docs/`
2. Search codebase for similar patterns
3. Check `docs/guides/active/` for current phase guidance
4. Ask Claude Code or Desktop Commander with specific error messages

---

## 📚 Additional Resources

### Official Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

### Project-Specific Docs
- `docs/BUSINESS_MODEL.md` - Revenue model details
- `docs/DESIGN_SYSTEM.md` - UI patterns and calculation formulas
- `docs/PRICING_STRATEGY_ANALYSIS.md` - Regulatory compliance analysis
- `docs/templates/` - Email and agreement templates

### Business Setup Docs
- `docs/guides/active/LEAD_HANDOVER.md` - Lead handling process
- `docs/guides/active/WEB_DEPLOYMENT_GUIDE.md` - Web deployment steps
- `docs/guides/active/REMAINING_TASKS.md` - Current tasks and blockers

---

## 🎯 Success Metrics

### Phase 2 Goals (Current)
- ✅ Web app deployed to `auschildsupport.com`
- ✅ Privacy policy integrated
- ✅ Admin panel functional
- ✅ Lead database operational
- 🎯 3-5 lawyer partners signed
- 🎯 First leads generated

### Long-term Goals
- Monthly leads: 15-380
- Monthly revenue: $1,500-$38,000
- Lawyer partners: 5-20
- Conversion rate: >20% (inquiry → booked consultation)

---

**Questions? Ask Claude Code or Desktop Commander for help!**
