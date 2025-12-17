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

## Architecture

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
1. **DESIGN_SYSTEM.md** - Design patterns, color system, calculation formula explanation
2. **CHANGELOG.md** - Recent changes and reasoning
3. **CLAUDE.md** (this file) - AI assistant guidance

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
1. Update `DESIGN_SYSTEM.md` if adding new patterns
2. Document reasoning in `CHANGELOG.md`
3. Keep components < 300 lines (extract if larger)
4. Add TypeScript types for new data structures

#### Testing Changes
```bash
npm start          # Start Expo dev server
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser
```
