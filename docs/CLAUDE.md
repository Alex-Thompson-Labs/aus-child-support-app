# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm install          # Install dependencies
npx expo start       # Start development server
npx expo start --ios # Run on iOS simulator
npx expo start --android # Run on Android emulator
npx expo start --web # Run in web browser
npm run lint         # Run ESLint
```

## Environment Setup

**Before starting development:**
1. Copy `.env.example` to `.env`
2. Add your Posthog API key (sign up at https://posthog.com)
3. Other keys added as you reach Phase 2+ (email, database, Stripe)

```bash
cp .env.example .env
# Then edit .env and add your keys
```

**⚠️ NEVER commit `.env` to git** - It contains secrets and is in `.gitignore`

## Architecture

**🎯 BUSINESS MODEL:** This is a **B2B lead generation** app, not a B2C utility.
- Parents use FREE calculator
- Complexity triggers detect high-value cases (high variance, special circumstances, court dates)
- "Get Legal Help" buttons connect parents with lawyers
- Lawyers pay $20-50 per qualified lead
- Target: $3K-$300K/year revenue (see MASTER_PLAN.md for details)

This is an Expo/React Native app that implements an Australian Child Support Calculator ported from a Next.js web app.

### Routing
Uses **expo-router** with file-based routing. The `app/` directory defines routes:
- `app/_layout.tsx` - Root layout with theme provider and Stack navigation
- `app/(tabs)/` - Tab-based navigation group
- `app/(tabs)/index.tsx` - Home screen entry point (renders CalculatorScreen)

### Calculator Domain (`src/`)

**Screen & Components:**
- `src/screens/CalculatorScreen.tsx` - Main screen orchestrating form and results
- `src/components/CalculatorForm.tsx` - Input form for incomes, children, care arrangements
- `src/components/CalculatorResults.tsx` - Displays calculation output
- `src/components/ChildRow.tsx` - Individual child input row
- `src/components/HelpTooltip.tsx` - Help text component

**Business Logic:**
- `src/hooks/useCalculator.ts` - Central hook managing form state and calculations. Implements debounced (300ms) live calculation on input changes.
- `src/utils/child-support-calculations.ts` - Core calculation functions (getChildCost, care percentage conversions)
- `src/utils/child-support-constants.ts` - Year-indexed constants (FAR, MAR, SSA, MAX_PPS)
- `src/utils/cost-of-children-tables.ts` - Lookup tables for cost calculations

**Types:**
- `src/types/calculator.ts` - TypeScript interfaces for ChildInput, CalculationResults, FormErrors

### Key Patterns
- All styling uses React Native StyleSheet (not Tailwind) with slate color palette
- Form state managed via useState in useCalculator hook
- Calculations triggered reactively via useEffect with debouncing
- KeyboardAvoidingView wraps form for proper mobile keyboard handling

## 📚 Documentation for Developers & AI Assistants

### Key Files to Read First
1. **MASTER_PLAN.md** - Complete implementation roadmap for lawyer lead gen pivot (READ THIS FIRST!)
2. **DESIGN_SYSTEM.md** - Design patterns, color system, calculation formula explanation
3. **CHANGELOG.md** - Recent changes and reasoning
4. **CLAUDE.md** (this file) - AI assistant guidance
5. **guides/phase1/CHECKLIST.md** - Current week's tasks

### Current Project Phase
**Status:** Phase 1 - Validation (Week 1-2)  
**Goal:** Implement complexity triggers and "Get Legal Help" buttons to validate user demand  
**See:** `guides/phase1/CHECKLIST.md` for tasks

### 🤖 Recommended Claude Model by Phase

**Phase 1 (Validation) - Current:**
- **Use:** Sonnet 4.5 ✅
- **Why:** Standard React Native components, analytics integration, form building. Sonnet handles this perfectly.
- **Complexity:** Low-Medium (learning curve for developer, but straightforward code)
- **Tasks:** Analytics setup, complexity triggers, form screen, basic testing

**Phase 2 (Pilot Program):**
- **Use:** Sonnet 4.5 ✅
- **Why:** Lawyer recruitment, manual lead routing, Google Sheets/Airtable setup. Simple integrations.
- **Complexity:** Low (mostly manual processes, light automation)
- **Tasks:** Email templates, lead routing logic, lawyer dashboard (spreadsheet)

**Phase 3 (Monetization):**
- **Use:** Sonnet 4.5 ✅ (consider Opus for payment integration only)
- **Why:** Stripe integration is well-documented. Lead routing automation is straightforward.
- **Complexity:** Medium (payment security is important, but Stripe handles most of it)
- **Tasks:** Stripe setup, automated lead routing, service agreements, billing
- **When to use Opus:** If implementing custom payment logic or complex fraud detection

**Phase 4 (Scale):**
- **Use:** Sonnet 4.5 for most tasks, Opus for architecture decisions
- **Why:** Scaling is about optimization, not complexity. Sonnet handles 90% of this.
- **Complexity:** Medium-High (performance optimization, multi-system coordination)
- **Tasks:** Geographic expansion, lawyer dashboard (real app), ML for complexity scoring
- **When to use Opus:** 
  - Architectural refactoring for scale
  - Complex ML/AI features for lead scoring
  - Major performance optimization strategies
  - Multi-region deployment architecture

**General Guidance:**
- **Sonnet 4.5:** Default for all implementation work, debugging, learning questions
- **Opus:** Only for high-stakes architectural decisions, complex multi-system design, or when stuck >2 hours on same problem
- **Developer is React Native beginner:** Sonnet's clearer, more commented code is better for learning

**Cost Reality:**
- Entire Phase 1 with Sonnet 4.5: ~$1-2
- Same work with Opus: ~$4-6
- You'll iterate a lot as a beginner, so cost efficiency matters

### 🚨 CRITICAL: Creating New Phase Guides

**When developer completes a phase and requests next phase guides:**

1. **Read the current phase status** from MASTER_PLAN.md
2. **Extract relevant sections** for the new phase from MASTER_PLAN.md
3. **Create** `guides/phaseN/CHECKLIST.md` with:
   - Outcome-based tasks (not time-based)
   - Difficulty ratings (Easy/Medium/Hard) based on developer's skill level
   - Realistic time estimates
   - Claude Code prompts for each task
   - Step-by-step breakdowns for complex tasks
   - Beginner tips and common pitfalls
   - **Recommended Claude model** at the top (use guidance from "Recommended Claude Model by Phase" section)

4. **Update** `guides/README.md` to reference the new phase
5. **Update** MASTER_PLAN.md to mark the phase as active
6. **Provide** a summary of what changed and where to start

**Example phase guide header:**
```markdown
# Phase 2: Pilot Program - Implementation Guide

**Recommended Model:** Sonnet 4.5 ✅
**Why:** Simple integrations, mostly manual processes, well-documented APIs

**Goal:** Sign 2-3 pilot law firms and prove lead quality
**Success Metric:** >20% consultation rate, >5% client conversion rate
```

### 🚨 CRITICAL: Update MASTER_PLAN.md as You Work
**Whenever you complete a task from MASTER_PLAN.md, you MUST:**
1. Mark checklist items as complete: `- [x]` with strikethrough and date
2. Update the "RECENT UPDATES" section at the top with what was done
3. Update Phase status if moving to next phase
4. Document any deviations or learnings

**Example:**
```markdown
### ✅ Completed Today (December 18, 2024)
- **Complexity Detection**: Added logic to detect high-value cases
  - Created `src/utils/complexity-detection.ts`
  - Integrated into CalculatorResults component
  - Tested with 5 sample calculations
```

**Why this matters:** MASTER_PLAN.md is the single source of truth for project progress. Keeping it updated ensures continuity across AI sessions and helps the developer track what's done.

### Recent Improvements (Dec 2024)
We redesigned the results display to make calculations clearer:
- Added **Simple Explanation** view (narrative, visual)
- Kept **Technical Breakdown** view (detailed tables)  
- Users can toggle between both views

### For AI Assistants Working on This Codebase

#### Understanding the Calculation
The app implements the official Australian child support 8-step formula from Services Australia.
Read the full explanation in `DESIGN_SYSTEM.md` under "Australian Child Support Formula".

Key concepts:
- **CSI (Child Support Income)**: ATI - SSA - relevant dependents
- **Income %**: Your share of combined income
- **Cost %**: Credit for care time (derived from care nights)
- **The Gap**: Income % - Cost % = Payment %

#### Component Structure
```
src/
├── components/
│   ├── CalculatorForm.tsx          # Input form
│   ├── CalculatorResults.tsx       # Results orchestrator
│   ├── ResultsSimpleExplanation.tsx # NEW: Narrative view
│   ├── ChildRow.tsx                # Individual child input
│   └── HelpTooltip.tsx             # Reusable tooltip
├── hooks/
│   └── useCalculator.ts            # Calculation logic
├── utils/
│   ├── child-support-calculations.ts # Core formulas
│   ├── child-support-constants.ts   # Government rates
│   └── cost-of-children-tables.ts   # Official cost tables
└── types/
    └── calculator.ts               # TypeScript types
```

#### Design System
All colors, spacing, and typography are documented in `DESIGN_SYSTEM.md`.
Please follow existing patterns:
- Primary: `#2563eb` (blue-600)
- Background: `#0f172a` (slate-900)
- Cards: `#1e293b` (slate-800)

#### Making Changes
1. **Check MASTER_PLAN.md first** - See what phase/task you're working on
2. Update `DESIGN_SYSTEM.md` if adding new patterns
3. Document reasoning in `CHANGELOG.md`
4. **Update MASTER_PLAN.md** - Mark tasks complete, add to "RECENT UPDATES"
5. Keep components < 300 lines (extract if larger)
6. Add TypeScript types for new data structures

#### Testing Changes
```bash
npm start          # Start Expo dev server
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser
```
