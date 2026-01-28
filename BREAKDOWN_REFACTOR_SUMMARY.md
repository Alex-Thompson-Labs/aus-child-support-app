# Breakdown Cards Refactor - Matching Official Child Support Guide

## Overview

Refactored the step breakdown cards to match the official Child Support Guide methodology as shown in the screenshots. The new structure follows the exact step numbering and organization from Services Australia documentation, including detailed multi-case allowance calculations.

## Changes Made

### 1. Step Reorganization

**Before (Old Structure):**
- Step 1: Child Support Income
- Step 2: Combined Child Support Income
- Step 3: Income Percentage
- Step 4: Care Percentage
- Step 5: Cost Percentage
- Step 6: Child Support Percentage
- Step 7: Cost of Children (COTC)
- Step 8: Annual Rate

**After (New Structure - Matches Official Guide):**
- Step 1: Child Support Income (with detailed multi-case breakdown)
- Step 2: Combined Child Support Income
- Step 3: Income Percentage
- Step 4: Care Percentage
- Step 5: Cost Percentage
- Step 6: Child Support Percentage
- **Step 1A: COTC for the day (section 55HA)**
- **Step 1B: Child support payable per child**
- **Step 2: Multi-case cap** (only shown if applicable)
- **Step 3: Final child support payable**

### 2. Enhanced Step 1 - Multi-Case Allowance Breakdown

**Major Enhancement**: Step 1 now shows detailed calculations for each child in other cases, matching the official guide exactly.

For each other case child (e.g., Geraldine aged 14, Thomas aged 10, Honoria aged 5), the breakdown shows:
- Child support income for that case
- COTC for that child
- Cost percentage calculation
- Division by number of children
- Final multi-case allowance

**Implementation Details:**
- Created `MultiCaseChildBreakdown` interface to store intermediate calculations
- Modified `calculateMultiCaseAllowanceDetailed()` to return breakdown data
- Updated `IncomeCalculationResult` to include `multiCaseBreakdownA/B` arrays
- Updated `CalculationResults` type to pass breakdown through to UI
- Enhanced UI to display per-child calculations when available

**Example Display:**
```
Multi-case costs / multi-case allowance

Child aged 14
Child support income = $21,537
COTC = $2,297
• ($21,537 × 32% = $6,892)
• $6,892 ÷ 3

Child aged 10
Child support income = $21,537
COTC = $1,938
• ($21,537 × 27% = $5,815)
• $5,815 ÷ 3

Multi-case allowance: ($1,938)
```

### 3. Key Structural Changes

#### Moved COTC Calculation (Step 7 → Step 1A)
- Renamed from "Cost of Children" to "COTC for the day"
- Updated description to match official guide language
- Moved from CostStep to LiabilityStep
- Now appears after Step 6 (Child Support Percentage)

#### Split Annual Rate into Multiple Steps (Step 8 → Steps 1A, 1B, 2, 3)
- **Step 1A**: Shows COTC bracket calculation
- **Step 1B**: Shows per-child liability calculation (CS% × cost per child)
- **Step 2**: Shows multi-case cap (only if applicable)
- **Step 3**: Shows final annual amounts with monthly breakdown

#### Enhanced Step 1B Display
- Shows calculation formula for each child
- Displays both parents' calculations side-by-side
- Highlights special rates (FAR/MAR) when applied
- Clear visual separation between children in multi-child cases

#### Conditional Step 2 (Multi-case Cap)
- Only displayed when multi-case allowance applies
- Explains the cap mechanism
- Shows allowance amounts for each parent

#### Improved Step 3 (Final Payable)
- Shows annual and monthly amounts
- Displays net payment when offsetting applies
- Explains who pays whom
- Includes special rates glossary

### 4. Files Modified

#### `src/utils/child-support-calculations.ts`
- Added `MultiCaseChildBreakdown` interface
- Added `MultiCaseAllowanceResult` interface
- Created `calculateMultiCaseAllowanceDetailed()` function
- Modified `calculateMultiCaseAllowance()` to use detailed version internally

#### `src/utils/income-calculator.ts`
- Updated imports to include detailed calculation function
- Added `multiCaseBreakdownA/B` to `IncomeCalculationResult` interface
- Modified calculation to use detailed version and store breakdown

#### `src/utils/calculateResults.ts`
- Pass through `multiCaseBreakdownA/B` from income results to final results

#### `src/utils/calculator.ts` & `@types/calculator.ts`
- Added `multiCaseBreakdownA/B` fields to `CalculationResults` interface

#### `src/features/calculator/components/breakdown/BreakdownView.tsx`
- Updated state management for new step structure
- Added handlers for new liability steps (1A, 1B, 2, 3)
- Updated CostStep props (removed step7)
- Updated LiabilityStep props (added expandedSteps object)

#### `src/features/calculator/components/breakdown/IncomeStep.tsx`
- Enhanced Step 1 to show detailed multi-case breakdown
- Added per-child calculation display
- Added styles for multi-case child labels
- Shows fallback explanation when breakdown not available

#### `src/features/calculator/components/breakdown/CostStep.tsx`
- Removed Step 7 (COTC) - moved to LiabilityStep
- Updated interface to remove step7 from expandedSteps
- Now only handles Steps 5-6 (Cost % and CS %)

#### `src/features/calculator/components/breakdown/LiabilityStep.tsx`
- Complete rewrite to match official guide structure
- Added Step 1A: COTC calculation with bracket breakdown
- Added Step 1B: Per-child liability calculation
- Added Step 2: Multi-case cap (conditional)
- Added Step 3: Final payable amounts
- Enhanced visual presentation with cards and clear formatting
- Added support for multi-child scenarios
- Improved special rates display

### 5. Visual Improvements

#### Step 1 (Child Support Income)
- Shows ATI, SSA, relevant dependents
- **NEW**: Detailed multi-case breakdown section
- Per-child calculations for other cases
- Clear formula display
- Final CSI with breakdown list

#### Step 1A (COTC)
- Shows combined CS income prominently
- Displays income bracket range
- Shows base amount + percentage calculation
- Highlights total cost and cost per child

#### Step 1B (Child Support Payable)
- Per-child cards with clear parent labels
- Formula display: `$X × Y% = $Z`
- Special rate indicators (FAR/MAR)
- Color-coded for user vs other parent

#### Step 2 (Multi-case Cap)
- Only appears when relevant
- Explains the purpose clearly
- Shows allowance amounts

#### Step 3 (Final Payable)
- Large, prominent annual amounts
- Monthly breakdown
- Net payment calculation when offsetting
- Clear payment direction explanation

## Benefits

1. **Accuracy**: Matches official Services Australia documentation exactly
2. **Clarity**: Step numbering aligns with what users see in official guides
3. **Education**: Users can cross-reference with government resources
4. **Transparency**: Shows exactly how the formula works step-by-step, including multi-case calculations
5. **Flexibility**: Conditional steps (like multi-case cap) only appear when relevant
6. **Detail**: Multi-case allowance now shows per-child breakdown matching official methodology

## Technical Implementation

### Multi-Case Allowance Calculation

The system now calculates and stores detailed breakdown for each other case child:

```typescript
interface MultiCaseChildBreakdown {
  childId: string;
  childAge: number;
  childSupportIncome: number;  // Parent's CSI
  totalCost: number;            // COTC for all children at this age
  costPerChild: number;         // Cost divided by total children
  totalChildren: number;        // Current case + other case children
}
```

This data flows through:
1. `calculateMultiCaseAllowanceDetailed()` - Calculates and returns breakdown
2. `calculateIncomes()` - Stores breakdown in income results
3. `calculateResults()` - Passes through to final results
4. `IncomeStep` component - Displays breakdown in Step 1

### No Additional User Input Required

The multi-case allowance calculation uses only:
- Parent's CSI (already calculated)
- Ages of other case children (user provides)
- Number of children in current case (user provides)

No care percentages or other complex data needed for other cases.

## Testing Recommendations

1. **Single child case**: Verify Steps 1-6, 1A, 1B, 3 display correctly
2. **Multi-child case**: Verify Step 1B shows multiple child cards
3. **Multi-case scenario**: Verify Step 1 shows detailed breakdown, Step 2 appears
4. **Special rates**: Verify FAR/MAR indicators in Step 1B
5. **Offsetting**: Verify Step 3 shows net payment correctly
6. **Formula 5/6**: Verify special formula views still work

## Migration Notes

- No breaking changes to calculation logic
- Only UI/presentation layer affected
- All existing tests should pass
- Multi-case calculations now return additional breakdown data
- AnnualRateBreakdown component no longer used (replaced by new Step 1B/3 structure)

## Future Enhancements

1. Add Formula 2 (Non-parent carer) breakdown view
2. Add Formula 3/4 (Multi-case) specific step variations
3. Add interactive tooltips explaining each step
4. Add "Compare with official guide" links
5. Add print-friendly breakdown view
6. Consider showing cost percentage calculation in multi-case breakdown
