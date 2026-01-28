# Step 7 & Step 9 Implementation Summary

## Overview
Fixed missing Step 7 (Cost of the Child) in Formula 1/2/4 breakdown and added Step 9 for dual non-parent carer payment splits.

## Issues Fixed

### 1. Missing Step 7 in Standard Breakdown
**Problem:** The breakdown was jumping from Step 6 (Child Support Percentage) directly to Step 8 (Annual Rate), skipping Step 7 (Cost of the Child).

**Solution:** Created new `CostOfChildrenStep` component that displays:
- Combined Child Support Income used for calculation
- Income bracket information
- Base amount and rate calculations
- Total cost of children
- Cost per child (when multiple children)

### 2. Missing Step 9 for Dual NPC Cases
**Problem:** When 2 non-parent carers receive child support, there was no explanation of how the payment is split between them.

**Solution:** Created `DualNPCStep` component that shows:
- Payment split between NPC 1 and NPC 2
- Each carer's percentage share
- Official Services Australia example
- Parent contributions when both parents paying

## What Was Implemented

### New Component: CostOfChildrenStep
**File:** `src/features/calculator/components/breakdown/CostOfChildrenStep.tsx`

Displays Step 7 showing:
- Combined income used for cost calculation
- Bracket breakdown (base + rate × income in bracket)
- Total cost of children
- Per-child cost breakdown

### New Component: DualNPCStep
**File:** `src/features/calculator/components/breakdown/DualNPCStep.tsx`

Displays Step 9 showing:
- Payment split between two NPCs
- Percentage shares based on cost percentages
- Official example from Services Australia guide
- Parent contribution breakdown

## Integration Points

### Formula 1/2/4 (Standard) - BreakdownView
- **Step 7:** Cost of the Child (NEW)
- **Step 8:** Annual Rate
- **Step 9:** Dual NPC Split (conditional)

### Formula 3 (Multi-case) - Formula3BreakdownView  
- **Step 7:** Cost of Children
- **Step 8:** Child support payable per child
- **Step 9:** Multi-case cap
- **Step 10:** Final child support payable
- **Step 11:** Dual NPC Split (conditional)

### Formula 5 (Non-reciprocating) - Formula5BreakdownView
- **Step 4:** Cost of Children (COTC)
- **Step 5:** Calculate Rate (with halving)
- **Step 6:** Multi-case Cap (conditional)
- **Step 7:** Annual Rate (conditional)
- **Step 8:** Non-Parent Carer Payment
- **Step 9:** Dual NPC Split (conditional)

### Formula 6 (Deceased parent) - Formula6BreakdownView
- **Step 4:** Cost of Children (COTC)
- **Step 5:** Calculate Rate (no halving)
- **Step 6:** Multi-case Cap (conditional)
- **Step 7:** Annual Rate (conditional)
- **Step 8:** Non-Parent Carer Payment
- **Step 9:** Dual NPC Split (conditional)

## Official Example Included (Step 9)

The DualNPCStep component includes the complete example from the Services Australia guide:

**Scenario:**
- Adrianna and Kevin have one child Tullia
- Martin (NPC 1): 45% care → 45% cost percentage
- Tatjana (NPC 2): 40% care → 35% cost percentage  
- Kevin: 15% care → 24% cost percentage (not entitled to receive)
- Child costs: $1,000
- Adrianna pays: $500
- Kevin pays: $260
- Total payable: $760

**Split Calculation:**
- Martin's share: 45% ÷ (45% + 35%) = 56.25% → $428
- Tatjana's share: 35% ÷ (45% + 35%) = 43.75% → $333

## Files Modified

1. `src/features/calculator/components/breakdown/CostOfChildrenStep.tsx` (NEW)
2. `src/features/calculator/components/breakdown/DualNPCStep.tsx` (NEW)
3. `src/features/calculator/components/breakdown/BreakdownView.tsx`
4. `src/features/calculator/components/breakdown/Formula3BreakdownView.tsx`
5. `src/features/calculator/components/breakdown/Formula5BreakdownView.tsx`
6. `src/features/calculator/components/breakdown/Formula6BreakdownView.tsx`
7. `src/features/calculator/components/breakdown/index.ts`
8. `src/utils/formula-6-calculator.ts` (TypeScript fix)

## Testing Checklist

**Step 7 (Cost of the Child):**
- [ ] Verify Step 7 appears between Step 6 and Step 8 in Formula 1/2/4
- [ ] Check bracket information displays correctly
- [ ] Confirm total cost and per-child cost calculations
- [ ] Test with single and multiple children

**Step 9 (Dual NPC Split):**
- [ ] Verify Step 9 appears only when both `paymentToNPC1` and `paymentToNPC2` > 0
- [ ] Check payment split calculations match percentages
- [ ] Confirm example text displays correctly
- [ ] Test on all formula types (1, 3, 5, 6)
- [ ] Verify expand/collapse functionality
- [ ] Check responsive layout on mobile

**General:**
- [x] TypeScript compilation (✅ PASSED)
- [ ] Visual regression testing
- [ ] Accessibility testing

## Edge Cases Handled

1. **Single child:** Shows total cost only (no per-child breakdown)
2. **Multiple children:** Shows both total and per-child costs
3. **Single NPC:** Step 9 hidden (existing Step 8 sufficient)
4. **Zero payments:** Step 9 hidden (no split to show)
5. **Both parents paying:** Shows parent contribution breakdown in Step 9
6. **Formula-specific numbering:** Adapts step numbers per formula

## Future Enhancements

- Add visual percentage bar showing split ratio in Step 9
- Include per-child breakdown if multiple children in Step 9
- Add link to Services Australia guide section
- Consider adding calculator for users to test different care percentages
- Add tooltips explaining bracket calculations in Step 7
