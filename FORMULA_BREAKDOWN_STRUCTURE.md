# Formula Breakdown Structure

## Formula 1 (Standard Two-Parent) - Steps 1-8

**Steps 1-3: Income Calculation** (IncomeStep.tsx)
- Step 1: Child Support Income
- Step 2: Combined Child Support Income
- Step 3: Income Percentage

**Step 4: Care Percentage** (CareStep.tsx)

**Steps 5-6: Cost Calculations** (CostStep.tsx)
- Step 5: Cost Percentage (per child if multiple)
- Step 6: Child Support Percentage

**Step 7: Cost of Children** (CostStep.tsx)
- Bracket calculation showing COTC

**Step 8: Annual Rate** (LiabilityStep.tsx)
- Final liability calculation
- Uses AnnualRateBreakdown component
- Shows per-child breakdown and special rates

---

## Formula 3 (Multi-Case) - Steps 1-10

**Steps 1-6: Same as Formula 1**
- Income, care, cost, and percentage calculations
- Step 1 includes multi-case cost breakdown

**Steps 7-10: Liability with Multi-Case Cap** (Formula3LiabilityStep.tsx)
- Step 7: Cost of Children (COTC)
- Step 8: Child Support Payable (per child)
- Step 9: Multi-Case Cap (conditional - only if payer has multi-case)
- Step 10: Final Child Support Payable

---

## Formula 5 (Non-Reciprocating Jurisdiction)

Uses dedicated Formula5BreakdownView.tsx with 9 steps including income doubling.

---

## Formula 6 (Deceased Parent)

Uses dedicated Formula6BreakdownView.tsx with single parent income calculations.

---

## Routing Logic (BreakdownView.tsx)

1. Check for multi-case allowance → Formula3BreakdownView
2. Check for Formula 5 flag → Formula5BreakdownView
3. Check for Formula 6 flag → Formula6BreakdownView
4. Default → Standard BreakdownView (Formula 1)

---

## Key Files

- `BreakdownView.tsx` - Router for all formulas
- `IncomeStep.tsx` - Steps 1-3 (shared by all formulas)
- `CareStep.tsx` - Step 4 (shared by all formulas)
- `CostStep.tsx` - Steps 5-7 (shared by Formulas 1, 3)
- `LiabilityStep.tsx` - Step 8 (Formula 1 only)
- `Formula3BreakdownView.tsx` - Complete view for Formula 3
- `Formula3LiabilityStep.tsx` - Steps 7-10 for Formula 3
- `Formula5BreakdownView.tsx` - Complete view for Formula 5
- `Formula6BreakdownView.tsx` - Complete view for Formula 6
- `AnnualRateBreakdown.tsx` - Shared component for final payment display
