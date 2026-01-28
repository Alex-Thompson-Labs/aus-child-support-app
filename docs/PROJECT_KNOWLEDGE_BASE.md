# Project Knowledge Base & Context Brief

**Last Updated:** 2026-01-28

---

## Project Overview

**Child Support Calculator** - A comprehensive Expo/React Native web application for calculating child support payments according to Australian family law guidelines, with integrated B2B lead generation for family law firms.

**Business Model:** Free calculator → Complexity detection → Lawyer lead generation ($50/qualified lead)

---

## 🏗️ **Technical Architecture**

### **Framework & Stack**

- **Platform**: Expo (React Native for Web + Mobile)
- **Router**: `expo-router` with async routes for code splitting
- **Language**: TypeScript/TSX
- **Deployment**: Vercel
- **Key Libraries**:
  - `expo-print` & `expo-sharing` (dynamically imported for admin features)
  - `@expo/vector-icons` (optimized imports)
  - Analytics: Google Analytics (react-ga4) + Vercel Analytics & Speed Insights

### **Backend & Database Infrastructure**

- **Database**: Supabase (Sydney region, free tier)
  - Encrypted lead storage with full calculation history
  - Row Level Security (RLS) policies for data protection
  - Privacy Act 1988 compliant (consent tracking, audit trails, deletion capability)
- **Authentication**: Supabase Auth (admin-only access)
- **Automation**: Make.com (formerly Integromat)
  - Webhook integration with Supabase
  - Lead notification workflow: User submits enquiry → Supabase → Make.com → Email notification
  - Real-time alerts for new lead submissions
- **Admin Dashboard**:
  - Login at `/admin/login` (password protected)
  - Dashboard at `/admin/dashboard`
  - Lead list with search/filter capabilities
  - Status management (new/reviewing/sent/converted/lost)
  - Full lead details view with lawyer assignment tracking
  - Mobile-optimized for on-the-go management
- **Lead Management Workflow**:
  - Parent submits inquiry → Saved to Supabase database with full calculation history
  - Admin reviews leads in dashboard for quality and routing
  - Lead status tracking for billing and conversion metrics
- **SEO Strategy**:
  - Blog routes (`app/blog/*`) utilize `+html.tsx` for proper meta tag injection and static rendering.
  - Goal: Ensure indexability of content to drive organic traffic for Phase 3A validation.
- **Privacy & Compliance**:
  - Privacy policy published at auschildsupport.com.au/privacy
  - Mandatory consent checkbox on inquiry form
  - Data rights supported (access, correction, deletion)
  - All lead access and status changes logged for audit trail

### **Project Structure**

```
/Users/sammcdougal/d/csc/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with Suspense boundaries
│   ├── (tabs)/            # Tab navigation (single tab: Calculator)
│   │   ├── _layout.tsx    # Tab bar hidden on web
│   │   └── index.tsx      # Home screen (renders CalculatorScreen)
│   ├── admin/             # Admin-only features
│   ├── change-of-assessment/
│   │   └── [reason-slug].tsx # Dynamic landing pages for specific reasons
│   ├── partner/
│   │   └── [slug].tsx     # Partnership proposal pages
│   ├── about.tsx          # About page
│   ├── contact.tsx        # Contact page
│   ├── court-order-tool.tsx # AI Court Order Scanner tool
│   ├── faq.tsx            # FAQ page
│   ├── lawyer-inquiry.tsx # Lead capture screen
│   ├── special-circumstances.tsx # Direct entry for complex cases
│   └── +html.tsx          # HTML wrapper for web
├── src/
│   ├── components/        # React components
│   │   └── ui/            # UI components (BrandSwitch, etc.)
│   ├── screens/
│   │   └── CalculatorScreen.tsx  # Main calculator interface
│   ├── hooks/             # Custom hooks (useCalculator)
│   ├── utils/             # Business logic & calculations
│   │   └── exportLeadPDF.ts
│   └── types/             # TypeScript types
├── docs/                  # Documentation
├── vercel.json            # Deployment config
└── README.md              # Project overview
```

---

## 🎯 **Core Features**

### **1. Child Support Calculator**

The primary and only screen in the application.

#### **ATI Input**

- Consolidated card for both Parent A & Parent B Adjusted Taxable Income
- Single input interface for both parents

#### **Care Arrangements**

- **Layout**: 2x2 grid on mobile (Parent A/B side-by-side, Period/Age Range below)
- **Visibility**: Both parent care percentages visible by default
- **Auto-balancing**: Percentages automatically balance to 100% across periods (week/fortnight/year)
- **Dispute Detection**: Trigger system for shared care scenarios
- **Bug Fix**: Dispute zone trigger now correctly deactivates when care percentages change

#### **Relevant Dependents**

- Popover interface with persistent state
- **UX Fix**: Popover stays open during input interaction (closes only on explicit toggle)
- **Mobile Optimization**: Vertical stacking to prevent horizontal overflow
- Multi-input fields for dependent details

### **2. Assessment Results**

Detailed calculation breakdowns with comprehensive tooltips:

- **Income Metrics**: ATI, SSA (Self-Support Amount), CSI (Child Support Income)
- **Percentage Calculations**: Care/Cost/Child Support Percentages
- **Liability**: Calculations with rate applications
- **Reference Values**: FAR, MAR, Combined CSI
- **Smart Conversion Footer**: Lead generation CTA based on complexity detection

### **3. Lead Capture System**

- **LawyerInquiryScreen**: Main inquiry form (`app/lawyer-inquiry.tsx`)
- **EnquiryForm/ContactModal**: Conditional fields based on user context
  - Court date input (conditional on selected reasons)
  - Financial issue choice chips
  - Dynamic validation
- **PDF Export**: `exportLeadPDF.ts` for professional use

### **4. Special Circumstances Entry**

- **SpecialCircumstancesScreen**: Standalone screen (`app/special-circumstances.tsx`)
- **Purpose**: Allows users from blog links to skip the calculator and select complex factors directly.
- **Direct Mode**: Navigates to `/lawyer-inquiry` with `mode=direct`, which enables manual income inputs for users who haven't used the calculator.

### **5. Court Order Scanner (New)**

- **CourtOrderToolScreen**: Standalone tool (`app/court-order-tool.tsx`)
- **Functionality**:
  - Upload Family Court Order (PDF/Image)
  - AI-powered analysis to extract care schedules
  - Generates "Care Calendar" and calculates exact night counts
  - Detects potential savings opportunities (e.g., travel costs, specific clauses)
- **Tech**: Uses Supabase Edge Functions (`analyze-order`) for processing.

### **6. Blog Chatbot Widget (Conversion Optimization)**

**Location**: `public/chatbot-widget.js` (vanilla JavaScript, deployed to blog subdomain)

**Purpose**: Guides blog readers from educational content to lawyer inquiry form with intelligent qualification.

**Recent Improvements (2026-01-26)**:
- ✅ **Value-First Messaging**: Restructured conversation flow to lead with benefits before asking qualification questions
- ✅ **Urgency Triage**: New fast-track path for users with court dates or urgent deadlines
- ✅ **Trust Signals**: Added credibility markers (24hr response time, confidentiality, no obligation) on success screens
- ✅ **Benefit-Driven CTAs**: Replaced generic button copy with outcome-focused language (e.g., "Uncover Hidden Income – Free Consultation")
- ✅ **Analytics Tracking**: Comprehensive Google Analytics 4 event tracking for all interactions:
  - `chatbot_opened` / `chatbot_closed`
  - `chatbot_button_click` (with button_id, label, node context)
  - `chatbot_navigation` (node-to-node transitions)
  - `chatbot_form_handoff` (tracks qualifying answers and conversation path)
  - `chatbot_external_link` (calculator/blog link clicks)
- ✅ **Context-Aware Messaging**: Dynamic opening message based on referrer (blog vs calculator vs direct)
- ✅ **Escape Hatches**: "Help me decide" option for confused users to reduce decision paralysis
- ✅ **Progressive Profiling**: Captures complexity signals (international, self-employed, court proceedings) and timeline urgency

**Conversation Flow**:
```
main → value_prop (concern selection) → qualified_[type] (with trust signals) → form handoff
     → urgency_check → urgent_[type] → form handoff
     → help_decide → qualified_[type] → form handoff
```

**Data Captured**:
- `primaryConcern`: hidden_income | agreement | special | unsure
- `urgencyType`: court_date | deadline | urgent_no_deadline
- `complexityFactor`: international | self_employed | court | standard
- `timeline`: urgent | soon | exploring

**Integration**: Passes all qualifying answers as URL parameters to `/lawyer-inquiry` form for pre-population and lead enrichment.

**Analytics Dashboard**: All events visible in Google Analytics 4 under "chatbot" event category for funnel analysis and optimization.

### **7. Admin Features**

- Located in `app/admin/` directory
- Heavy libraries (expo-print/sharing) dynamically imported to reduce main bundle size

---

## 🎨 **Design & UX Priorities**

### **Accessibility (A11y)**

Recent improvements to meet WCAG standards:

- ✅ All `role="switch"` elements have `aria-checked` attributes
- ✅ `accessibilityRole` on interactive elements
- ✅ `accessibilityLabel`/`accessibilityLabelledBy` on inputs
- ✅ Grouped list items with `accessible={true}`
- ✅ **Contrast Fix**: Blog button uses `#0056b3` (not `#007AFF`)

### **Responsive Design**

Mobile-first approach with specific optimizations:

- Grid layouts adapt: 2x2 on mobile, flexible on desktop
- Input fields sized for easy tapping (touch-friendly)
- Vertical stacking to prevent horizontal overflow
- **Form Spacing**: Reduced margins (e.g., `my-3` vs `my-6`) for compact, scannable forms

### **Performance Optimizations**

Lighthouse Performance score improvements:

- **Code Splitting**: Async routes via `expo-router` plugin
- **Lazy Loading**: Heavy components wrapped in React `Suspense`
- **Tree Shaking**: Optimized library imports
- **Dynamic Imports**: Admin-only libraries (expo-print/sharing)
- **Bundle Size Reduction**: ~550KB eliminated from unmapped code
  - ~400KB from `@expo/vector-icons` optimization
  - ~150KB from dynamic admin library imports

---

## 🐛 **Recent Bug Fixes & Refactors**

### **Fixed Issues** (Last 30 Days)

1. ✅ **Shared Care Trigger**: Dispute zone trigger now deactivates correctly when care percentages change
2. ✅ **Relevant Dependents Popover**: Stays open during input interaction (no auto-close)
3. ✅ **Mobile Horizontal Overflow**: Resolved in Relevant Dependents section
4. ✅ **Care Component Grid**: 2x2 grid enforced on mobile browsers
5. ✅ **Switch Accessibility**: All switch elements have proper `aria-checked` attributes
6. ✅ **Blog Button Contrast**: Improved to `#0056b3` for WCAG compliance
7. ✅ **Navigation Issue**: LawyerInquiryScreen routing fixed
8. ✅ **Form Spacing**: SpecialCircumstancesForm spacing tightened
9. ✅ **Platform Import Missing** (2026-01-26): Added missing `Platform` import to `CalculatorHeader.tsx` - was causing "Can't find variable: Platform" runtime error
10. ✅ **Formula 6 Income Support Modal** (2026-01-27): Fixed income support modal incorrectly appearing for deceased parent (Parent B) in Formula 6 cases. Added check in `needsIncomeSupportPrompt` to skip prompt when `nonParentCarer.hasDeceasedParent` is true.
11. ✅ **Formula 6 Care Input UX** (2026-01-27): Hidden "OTHER" parent care input in ChildRow when deceased parent toggle is enabled. Added `hideParentB` prop to ChildRow component that conditionally hides Parent B input and adjusts care total calculations accordingly. Also added handler to reset Parent B care amounts to 0 when deceased toggle is enabled to prevent hidden values from affecting calculations. Additionally, hidden "Other Parent's Income" input and reset income to 0 when deceased toggle is enabled. Made deceased and overseas toggles mutually exclusive - enabling one automatically disables the other. Fixed breakdown view crash by adding null checks for `rateApplied` property in SmartConversionFooter and SpecialRateGlossary components. Fixed Formula 6 calculation to use actual parent care percentage instead of hardcoded 0%, and added proper result mapping to convert Formula6Result to CalculationResults structure with `finalPaymentAmount` for UI display.
12. ✅ **Formula 6 Breakdown View UX** (2026-01-27): Hidden "Other Parent" details in step-by-step breakdown when deceased parent toggle is enabled. Added `hasDeceasedParent` prop that flows from `CalculatorScreen` → `CalculatorResults` → `ResultsModalContent` → `ResultsSimpleExplanation` → `BreakdownView` → individual step components (`IncomeStep`, `CareStep`, `CostStep`, `LiabilityStep`, `AnnualRateBreakdown`). When deceased parent flag is true, breakdown now hides: Parent B income deductions (Step 1), Parent B combined income row and "Combined CS Income" total (Step 2), Parent B income percentage card and comparison bar (Step 3), Parent B care percentage bar (Step 4), Parent B cost conversion card (Step 5), Parent B gap analysis card (Step 6), and "Liability to other parent" row (Step 8). Additionally, Step 6 CS% card now shows simplified view with Income%/Cost%/CS% calculation vertically stacked via `simplifiedView` prop on GapAnalysisCard. Fixed Step 7 (Cost of Children) not rendering by adding `costBracketInfo` to Formula 6 result mapping. Fixed Step 6 CS% showing incorrect value (100%) by calculating it properly as `incomePercA - costPercA` in Formula 6 mapping. This provides a cleaner, less confusing breakdown view for Formula 6 cases where only one living parent exists.
13. ✅ **Formula 6 Step 2 Simplification** (2026-01-27): Removed redundant "Combined CS Income" line in Step 2 for deceased parent cases since it's the same as "Your CS Income". Updated explanation text to reflect single parent scenario.
14. ✅ **Cost of Children Base Amount Display** (2026-01-28): Fixed incorrect base amount shown in Step 7 breakdown when income exceeds highest bracket. Previously showed $25,147 (base of last bracket) instead of $28,407 (maximum cost cap for 2026). Updated `child-support-calculations.ts` to use `values.max` instead of `values.bases[bands.length - 1]` when income is above MTAWE cap.
15. ✅ **NPC Care Validation** (2026-01-28): Added validation to prevent calculation when Non-Parent Carer has less than 35% care. Created `NPCCareValidationModal` component that displays when NPC care is below the legal minimum threshold. Modal explains that no child support is payable to NPCs with less than 35% care under Australian law. Validation runs in `handleCalculate` before income support modal, blocking calculation and showing informative popup instead of incorrect results.
16. ✅ **Multi-Case Cost Grouped Display** (2026-01-29): Implemented new grouped format for multi-case cost breakdown in Step 1. Previously showed individual child calculations which was repetitive. Now groups children by age bracket (13 and under vs over 13) with single COTC calculation per group. Updated `MultiCaseChildBreakdown` interface to include `bracketInfo` for detailed COTC display. Added `MultiCaseAgeBracketBreakdown` interface for grouped data structure. Enhanced `calculateMultiCaseAllowanceDetailed` to generate grouped breakdown with child counts per age bracket. Updated `IncomeStep.tsx` to display grouped format showing: age bracket header with total children count, detailed COTC calculation (income bracket, base amount, rate), multi-case cost per child, and summary section listing children in current case vs other cases by age bracket with divider line. Falls back to individual child display if grouped data unavailable. Provides cleaner, more efficient presentation of multi-case calculations per user specification.

### **Performance Improvements**

- Lighthouse Performance score optimized via bundle size reduction
- Async routes implemented for faster initial load
- Icon imports refactored to reduce payload
- Admin features code-split to reduce main bundle

### **Feature Removals**

- ❌ Lifetime Simulator (removed)
- ❌ Scenario Planner (removed)
- Focus narrowed to core calculator + lead generation

---

## 📋 **Key Components Reference**

### **Main Components**

- **CalculatorScreen** (`src/screens/CalculatorScreen.tsx`): Main calculator interface
- **CalculatorForm** (`src/components/CalculatorForm.tsx`): Input form with ATI, care, dependents
- **CalculatorResults** (`src/components/CalculatorResults.tsx`): Results display with conversion footer
- **SpecialCircumstancesForm**: Legal/financial/costs sections with tightened spacing
- **RelevantDependentsPopover**: Persistent popover with multi-input
- **BrandSwitch** (`src/components/ui/BrandSwitch.tsx`): Accessible switch component
- **Header**: Navigation with accessible blog button

### **Utilities**

- **exportLeadPDF.ts**: PDF generation for leads
- **useCalculator**: Custom hook for calculation logic
- **Admin Teaser Generator**: Logic to strip PII (Personal Identifiable Information) from lead details for the initial lawyer email.

---

## 🔑 **Business Context**

### **Target Users**

- Parents navigating child support calculations
- Family law professionals
- Individuals in dispute scenarios

### **Conversion Strategy**

- **Complexity Detection**: Automatic identification of high-value cases
- **Smart Footer**: Context-aware CTAs in assessment results
- **High-Value Lead Capture**: Conditional fields based on user context (court dates, financial issues)
- **Professional Export**: PDF generation for sharing with lawyers

### **Revenue Model**

- B2B lead generation: $50 per qualified lead
- Target: $10K-$15K/month at scale (Year 1)
- Current Phase: Phase 3A - Proof Before Pitch (Validation)

### **Compliance**

- Australian family law guidelines
- WCAG accessibility standards
- Mobile-responsive requirements

---

## 🚀 **Development Workflow**

### **Testing Focus**

- Lighthouse Performance & Accessibility scores
- Mobile responsiveness (especially input layouts)
- Form validation and conditional rendering
- Care percentage auto-balancing logic
- Analytics event tracking (Google Analytics)

### **Deployment**

- **Platform**: Vercel
- **Config**: `vercel.json`
- **Build**: Optimized for web target
- **Environment**: `.env` for configuration (GA tracking ID, etc.)

### **Available Scripts**

```bash
npm start           # Start Expo dev server
npm run dev         # Start with cleared cache
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run web         # Run in web browser
npm run lint        # Run ESLint
npm run type-check  # TypeScript validation
```

---

## 📝 **Code Conventions & Patterns**

### **Styling**

- **Spacing**: Reduced margins in forms (e.g., `my-3` vs `my-6`) for compact feel
- **Layout**: 2x2 grids on mobile, flexible on desktop
- **Colors**: Curated palette (slate/blue theme), avoid generic colors
- **Primary Actions**: `#0056b3` for buttons/links
- **Typography**: Professional, accessible font sizes

### **Component Patterns**

- **Popovers**: Should persist during interaction, close only on explicit toggle
- **Icons**: Optimized imports to reduce bundle size
- **Tooltips**: Comprehensive explanations for all calculation metrics
- **Forms**: Conditional rendering based on user input
- **Validation**: Dynamic validation with clear error messages

### **Performance**

- Lazy load heavy components
- Dynamic imports for admin features
- Tree-shakeable library imports
- Code splitting via async routes

---

## 📚 **Documentation**

### **Essential Docs**

- `README.md` - Quick start and project overview
- `docs/CLAUDE.md` - Architecture & production code requirements
- `docs/BUSINESS_MODEL.md` - Revenue model details
- `docs/DESIGN_SYSTEM.md` - Colors, spacing, design tokens
- `guides/TROUBLESHOOTING.md` - Common issues and fixes

### **Phase Documentation**

- Phase 1: Foundation ✅ (Complete)
- Phase 3A: Validation 🔄 (Current - proof before pitch)
- Phase 3B: Pilot / First Revenue (Planned)
- Phase 4: Scale (Planned - 20+ firms, $5K-10K MRR)

---

## 🎯 **Current State Summary**

This is a **mature, production-ready application** with a strong focus on:

- ✅ **Accessibility** (WCAG compliance)
- ✅ **Performance** (Lighthouse optimization)
- ✅ **Conversion Optimization** (Smart lead capture)
- ✅ **Mobile UX** (Responsive, touch-friendly)

**Recent work** has centered on:

- Refining mobile UX and responsive layouts
- Reducing bundle size (~550KB eliminated)
- Ensuring WCAG compliance
- Fixing edge cases in calculation logic
- Optimizing conversion funnel

**Recent Bug Fixes (2026-01-29)**:
- Fixed Step 7 (Cost of Children) calculation to use "Same Age" rule per section 55HA
  - Each child's cost is now calculated separately assuming all children are the same age as that child
  - Matches the multi-case allowance calculation approach from Step 1
  - Provides more accurate per-child costs for mixed-age scenarios

**Current Phase**: Validation (proving parents click "Get Legal Help" buttons)
**Success Metric**: >2% click-through rate

---

## 🔍 **Quick Reference**

### **File Locations**

- Main Calculator: `src/screens/CalculatorScreen.tsx`
- Lead Capture: `app/lawyer-inquiry.tsx`
- PDF Export: `src/utils/exportLeadPDF.ts`
- Deployment: `vercel.json` (Vercel)
- Environment: `.env`

### **Navigation Structure**

- Home (`/`) → CalculatorScreen
- Court Order Tool (`/court-order-tool`) → AI Scanner
- Inquiry (`/lawyer-inquiry`) → Lead capture form
- Direct Entry (`/special-circumstances`) → Factors selection for lawyer inquiry
- Change of Assessment (`/change-of-assessment/[reason]`) → Landing pages
- Partner (`/partner/[firm]`) → Custom proposals
- Admin (`/admin/*`) → Admin-only features

### **Key Metrics to Track**

- Calculator usage
- "Get Legal Help" button clicks
- Form submissions
- PDF exports
- Complexity trigger activations

---

_This knowledge base reflects the state of the project as of December 31, 2025. For the most up-to-date information, refer to the codebase and recent conversation history._
