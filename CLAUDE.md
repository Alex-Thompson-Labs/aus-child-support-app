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
