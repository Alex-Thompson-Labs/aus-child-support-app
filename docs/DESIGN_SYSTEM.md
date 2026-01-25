# Design System & Architecture

## Overview

Child Support Calculator - React Native/Expo app following Australian Government Services Australia formula.

**Business Model:** B2B lead generation platform connecting parents with family law practitioners. Parents use free calculator, complexity triggers identify high-value cases, and lawyers pay **$50 per qualified lead**.

**Platform Support:** Native iOS/Android via Expo, plus web version deployed at auschildsupport.com.au.

## Color Palette

### Core Colors

- **Primary Background**: `#0f172a` (slate-900) - Main app background
- **Card Background**: `#1e293b` (slate-800) - Content cards
- **Accent**: `#2563eb` (blue-600) - Primary actions, hero sections
- **Borders**: `#334155` (slate-700) - Subtle dividers
- **Text Primary**: `#ffffff` - Main headings, values
- **Text Secondary**: `#94a3b8` (slate-400) - Labels, descriptions
- **Text Tertiary**: `#64748b` (slate-500) - Metadata

### Urgency & Status Colors

- **High Urgency**: `#ef4444` (red-500) - Critical alerts, court dates
- **Medium Urgency**: `#f59e0b` (amber-500) - Important notifications, Change of Assessment
- **Low Urgency**: `#3b82f6` (blue-500) - General information
- **Success**: `#10b981` (emerald-500) - Confirmation states, completed actions
- **Purple Accent**: `#8b5cf6` (violet-500) - Child-related categories
- **Error**: `#f87171` (red-400) - Form validation errors

## Typography Scale

- **Hero**: 48px, weight 700 - Main payment amounts
- **Title**: 32px, weight 700 - Section headers
- **Heading**: 20px, weight 600 - Card titles
- **Body Large**: 16px, weight 500 - Important values
- **Body**: 14px, weight 400 - Standard text
- **Caption**: 12px, weight 400 - Helper text
- **Small**: 10px, weight 500 - Micro labels

## Component Patterns

### Smart Conversion Footer (SmartConversionFooter.tsx)

Single conversion card at bottom of results based on priority logic:

- **Priority 1**: Dispute Risk - Care percentage between 35-65% (amber card)
- **Priority 2**: High Value - Annual liability > $15,000 (blue card)
- **Priority 3**: Binding Agreement - Default fallback (gray card)
- Each card pre-fills inquiry form with specific complexity trigger
- Accessibility: Proper button roles, loading states, prevents double-tap
- Analytics tracking: Card variant and button clicks

### Special Circumstances Prompt (SpecialCircumstancesPrompt.tsx)

Interactive expandable section for users to identify complexity factors:

- **Header**: Always visible, tappable to expand/collapse
- **Categorized Checkboxes**: Grouped by urgency, income, child-related, and other factors
- **Visual Hierarchy**:
  - Urgent matters: Red (`#ef4444`)
  - Income issues: Amber (`#f59e0b`) with pulsing border animation
  - Child-related: Violet (`#8b5cf6`)
  - Other factors: Blue (`#3b82f6`)
- **Smart Button State**: Color changes based on highest priority selected reason
- **Forensic Accountant Note**: Contextual value-add when income complexity selected
- **Smooth Animations**: Spring-based expand/collapse, pulsing border for income section
- Analytics: Section toggle, checkbox selections, button clicks with reason counts

### Lawyer Inquiry Screen (LawyerInquiryScreen.tsx)

Full-screen inquiry form (mobile and web):

- **Location**: `src/features/lawyer-inquiry/LawyerInquiryScreen.tsx`
- **Form Sections**: Personal info, financial details, special circumstances, consent
- **Dynamic Fields**: Conditional fields based on selected special circumstances
- **Form Validation**: Real-time validation with error messages
- **Consent Checkbox**: Required with privacy policy link
- **Success State**: Thank you message after submission
- **Production-Ready**: Sanitization, error handling, loading states, accessibility labels

### Payment Cards

- Use blue gradient (`#2563eb`) for primary payment display
- Show annual amount prominently, secondary periods (monthly, fortnightly, daily) smaller
- Include clear payer → receiver relationship

### Data Tables

- Header row with `#94a3b8` text
- Alternating subtle backgrounds for readability
- Right-align numeric values
- Include help tooltips for technical terms

### Help Tooltips

- **What**: Brief definition of the term
- **Why**: Explanation of why it matters for the calculation
- Keep under 2 sentences each

## Spacing System

- **Micro**: 4px - Tight groups
- **Small**: 8px - Related items
- **Medium**: 12px - Card internal padding
- **Base**: 16px - Standard gap between sections
- **Large**: 20px - Card padding
- **XL**: 24px - Section separation

## Border Radius

- **Small**: 4px - Buttons, inputs
- **Medium**: 12px - Cards
- **Large**: 16px - Hero sections
- **XL**: 24px - Bottom sheet corners

## Animation Patterns

### Spring Animations

Used for natural, physics-based motion:

- **Modal Expand/Collapse**: tension: 65, friction: 11
- **CoA Section Expand**: Same spring values for visual consistency
- **Use Case**: Any expand/collapse interaction, slide-in panels

### Timing Animations

Used for continuous effects:

- **Border Pulse**: 1200ms duration per cycle (in → out → repeat)
- **Opacity Fade**: 300ms standard fade duration
- **Use Case**: Drawing attention, loading states

### Animation Best Practices

- **Performance**: Use `useNativeDriver: true` for transform and opacity
- **Layout**: Use `useNativeDriver: false` for height, width, borderWidth
- **Cleanup**: Always clean up animations in useEffect return function
- **Testing**: Test animations on both iOS and Android for consistency

## Responsive Design

### Platform Detection (`responsive.ts`)

- **isWeb**: Platform.OS === 'web'
- **isMobile**: Mobile breakpoint check
- **isDesktop**: Desktop breakpoint check
- **Breakpoints**: mobile < 768px, desktop >= 768px

### Web-Specific Patterns

- **Clickable Elements**: Apply `webClickableStyles` for proper cursor behavior
- **Input Styling**: Apply `webInputStyles` for native-like appearance
- **Responsive Layouts**: CalculatorForm adapts layout for desktop vs mobile
- **Modal vs Full-Screen**: Inquiry form uses full-screen on all platforms

### Platform-Specific UI

- **Mobile**: Full-screen modals, vertical stacking, touch-optimized spacing
- **Web**: Inline panels, horizontal layouts where appropriate, hover states
- **Shared**: Same color system, typography scale, component logic

## User Experience Principles

### Lead Generation Flow

The app is designed to convert parents into qualified leads for lawyers:

**Discovery Phase:**

1. Parent enters calculation details (incomes, children, care arrangements)
2. Live calculation provides instant results (debounced 300ms)
3. Results displayed with simple explanation and technical breakdown toggle

**Qualification Phase:** 4. Complexity detection runs automatically on every calculation 5. SmartConversionFooter displays single priority card (dispute risk, high value, or binding agreement) 6. Change of Assessment Prompt allows self-identification of complex factors

**Conversion Phase:** 7. "Get Legal Help" button opens inquiry form (full-screen mobile, inline web) 8. Form pre-populated with calculation data and complexity reasons 9. Lead saved to Supabase (encrypted) 10. **Secure Delivery**: Lawyer receives "Teaser" → Pays $50 → Receives **Secure Magic Link**

### Clarity Over Completeness

- Show simple explanation by default
- Hide technical details behind "View breakdown" option
- Use plain English before jargon

### Progressive Disclosure

- Start with "what you pay/receive"
- Then "why" (the story)
- Finally "how" (the math)

### Context Before Data

- Explain what a number means before showing it
- Example: "You earn 65% of combined income" NOT "Income %: 65"

## File Organization

### `/src/components`

- **CalculatorForm.tsx** - Input form with validations
- **CalculatorResults.tsx** - Results display (orchestrator)
- **ResultsSimpleExplanation.tsx** - Narrative explanation view
- **SpecialCircumstancesPrompt.tsx** - Interactive CoA reason selector with categories
- **SmartConversionFooter.tsx** - Single conversion card with priority-based variants
- **ChildRow.tsx** - Individual child input row with care arrangement picker
- **PeriodPicker.tsx** - Care period selector (week/fortnight/year)
- **HelpTooltip.tsx** - Reusable tooltip component

### `/src/utils`

- **child-support-calculations.ts** - Core calculation logic
- **child-support-constants.ts** - Government rates by year
- **cost-of-children-tables.ts** - Official cost tables
- **complexity-detection.ts** - Detects high-value cases (variance, court dates, zero payments, etc.)
- **special-circumstances.ts** - CoA reasons database with categories and priorities
- **zero-payment-detection.ts** - Identifies cases with $0 liability
- **analytics.ts** - **Google Analytics + Vercel Analytics** integration for user behavior tracking
- **supabase.ts** - Lead submission and database interaction
- **date-utils.ts** - Date parsing and validation utilities
- **responsive.ts** - Platform detection and responsive utilities

### `/src/types`

- **calculator.ts** - TypeScript interfaces

### `/app`

Expo Router file-based routing:

- **\_layout.tsx** - Root layout
- **(tabs)/** - Tab navigation group
  - **index.tsx** - Home/calculator screen
- **admin/** - Admin panel for lead management
  - **login.tsx** - Admin authentication
  - **dashboard.tsx** - Leads list and management
  - **lead/[id].tsx** - Individual lead detail view (Admin)
  - **Secure View route** - Planned (external lawyer access via magic link)
- **lawyer-inquiry.tsx** - Lead capture form screen
- **modal.tsx** - Generic modal wrapper

### `/docs`

- **DESIGN_SYSTEM.md** (this file) - Design patterns and architecture
- **CLAUDE.md** - AI assistant guidance and development workflow
- **BUSINESS_MODEL.md** - Business model canvas and revenue strategy
- **business-docs/** - Business strategy and roadmap documentation

## Australian Child Support Formula (8 Steps)

This app implements the official Services Australia formula:

1. **Calculate each parent's Child Support Income (CSI)**

   - Start with Adjusted Taxable Income (ATI)
   - Deduct Self-Support Amount (SSA) - amount to live on
   - Deduct cost of relevant dependents (other children)
   - Result = CSI (money available for child support)

2. **Calculate Combined CSI**

   - Add both parents' CSI together
   - This determines the total resources available

3. **Calculate Income Percentages**

   - Parent A's CSI ÷ Combined CSI = Income %
   - Parent B's CSI ÷ Combined CSI = Income %
   - Shows each parent's share of financial responsibility

4. **Calculate Care Percentages**

   - Based on nights per year with child
   - Rounded using specific rules (floor if <50%, ceil if ≥50%)

5. **Map Care % to Cost %**

   - 0-13%: 0% cost coverage
   - 14-34%: 24% (regular care)
   - 35-47%: 25-51% (shared care, linear)
   - 48-52%: 50% (equal shared care)
   - 53-65%: 51-76% (shared care, linear)
   - 66-86%: 76% (primary care)
   - 87-100%: 100% (sole care)

6. **Calculate Child Support %**

   - Income % - Cost % = Child Support %
   - Positive = you pay
   - Negative = you receive

7. **Calculate Cost of Children**

   - Look up from official Costs of Children tables
   - Based on combined CSI and number/ages of children
   - Formula: Fixed amount + (Rate × Income in bracket)

8. **Calculate Final Payment**
   - Child Support % × Cost of Children = Annual liability

### Special Formulas

**Formula 5: Non-Parent Carer with Overseas Parent (✅ IMPLEMENTED)**

When a non-parent carer (e.g., grandparent) applies and one parent lives in a non-reciprocating jurisdiction:

- **Income Doubling**: Available parent's CSI × 2 (recognizes child has two parents)
- **Cost Calculation**: Uses doubled income to calculate costs
- **Rate Halving**: Final rate × 0.5 (compensates for doubling)
- **Result**: Fair assessment using only one parent's income

**Implementation Status:**
- ✅ Core calculation engine (`src/utils/formula-5-calculator.ts`)
- ✅ Jurisdiction checker (`src/utils/jurisdiction-checker.ts`)
- ✅ Country selector UI component
- ✅ Complexity detection (flags for lead generation)
- ✅ 21 passing unit tests
- ⏳ Results breakdown display (in progress)

**Formula 6: Non-Parent Carer with Deceased Parent (📋 PLANNED)**

When a non-parent carer applies and one parent is deceased:
- Uses only surviving parent's income (no doubling)
- No halving of final rate
- See `/docs/business-docs/formulas/FORMULA_6_SPECIFICATION.md`
   - Apply minimum rates if applicable:
     - **FAR (Fixed Annual Rate)**: Low income, not on support
     - **MAR (Minimum Annual Rate)**: Very low income, on Centrelink support

## Change of Assessment (CoA) Reasons

The standard formula doesn't account for all situations. Parents can request adjustments under Section 117 of the Child Support (Assessment) Act 1989. Our app helps identify these factors.

### Categories and Visual Hierarchy

**1. Urgent Matters (Red #ef4444)**

- Priority 1-2 reasons requiring immediate attention
- Examples: Court dates within 14 days, DV orders, child safety concerns
- Button turns red when any urgent reason selected

**2. Income Issues (Amber #f59e0b)**

- Priority 2-3 reasons about income discrepancies
- Examples: Hidden assets, earning capacity, resources not reflected in ATI
- Special feature: Forensic accountant note when income complexity selected
- Pulsing border animation to draw attention

**3. Child-Related (Violet #8b5cf6)**

- Priority 3-4 reasons about child costs and special circumstances
- Examples: High medical costs, private school, disability support
- Maps to Parent B color scheme (violet accent)

**4. Other Factors (Blue #3b82f6)**

- Priority 4-5 reasons about unique situations
- Examples: High contact costs, new family expenses, property/spousal maintenance
- Maps to Parent A color scheme (blue accent)

## Development Guidelines

### Production Quality Standards

All code must be production-ready, not demo-quality:

- **Error Handling**: Try-catch blocks, graceful failure, user-friendly error messages
- **Input Validation**: Sanitize all user inputs, validate email/phone formats, length constraints
- **Loading States**: Disable buttons during async operations, show loading indicators
- **TypeScript**: No `any` types, explicit interfaces, proper null handling
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support where appropriate
- **Analytics**: Track user interactions (Google Analytics + Vercel Analytics)

### Lead Management System

**Database:** Supabase (PostgreSQL) hosted in Sydney region

- **leads** table with comprehensive fields including calculation data, complexity reasons, CoA selections
- Row Level Security (RLS) policies restrict access to authenticated admin only
- Soft delete pattern (deleted_at timestamp)

**Admin Panel:** Web-only interface at `/admin`

- Login required (Supabase auth)
- Dashboard view with filters (status, date range)
- Individual lead detail pages with full context
- Status management (new → contacted → qualified → paid → delivered → closed)
- Internal notes field for tracking lawyer conversations

**Privacy Compliance:**

- Explicit consent checkbox required on all inquiry forms
- Privacy policy published and linked from forms
- Data encrypted at rest (Supabase default)
- **Secure Magic Links:** Delivery method that prevents PII from sitting in email inboxes
- Audit trail via Supabase logs
- Can delete data on request (soft delete + hard delete capability)

### For AI Assistants

- Read DESIGN_SYSTEM.md first to understand patterns
- Check CLAUDE.md for development workflow and prompting guidance
- Check BUSINESS_MODEL.md to understand revenue model and target users
- Follow existing color/spacing/typography scales
- Keep narrative explanation simple (8th grade reading level)
- Technical details go in expandable sections
- Always include production requirements in generated code
