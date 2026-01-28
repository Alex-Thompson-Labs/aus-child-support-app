# Formula 4 Breakdown Implementation

## Overview

Formula 4 breakdown has been implemented following the same structure as Formula 3, with additional steps for NPC (non-parent carer) payment distribution.

**Formula 4 = Formula 3 + Formula 2 Combined**

## Step Structure

### Steps 1-6: Income and Percentage Calculations
- Same as Formula 3 (includes multi-case allowance using "Same Age" rule)
- Includes NPC in care and cost percentage calculations
- NPC income is excluded from CCSI calculation

### Step 7: Cost of the Children (COTC)
- Uses CCSI (parents' combined income only)
- Standard COTC table lookup

### Step 8: Child Support Payable Per Child
- Initial liability calculated using child support percentages
- Before multi-case cap and NPC distribution rules

### Step 9: Multi-case Cap
- Applies Formula 3 multi-case cap logic
- Caps total liability (including NPC payments) per child
- Uses solo child cost with preliminary CSI

### Step 10: NPC Payment Distribution
- Applies Formula 2 payment distribution rules:
  - **Rule 1**: Both parents positive → Both pay NPC
  - **Rule 2**: One positive, other negative with <35% care → Positive parent pays NPC only
  - **Rule 3**: One positive, other negative with ≥35% care → Positive parent pays both other parent AND NPC

### Step 11: Dual NPC Split (if applicable)
- Only shown when 2 non-parent carers receive payments
- Splits payment proportionally based on cost percentages
- Uses existing `DualNPCStep` component

### Step 12: Final Child Support Payable
- Final annual payment after all adjustments
- Shows annual rate breakdown
- Parent comparison card

## Files Created

### 1. `Formula4BreakdownView.tsx`
Main breakdown view component for Formula 4 assessments.

**Features:**
- Manages collapsible state for all 12 steps
- Conditionally shows Dual NPC step (Step 11)
- Integrates all step components
- Default expanded: Step 12 (Final payment)

### 2. `Formula4LiabilityStep.tsx`
Handles Steps 7-10 and 12 for Formula 4 liability calculations.

**Features:**
- Step 7: COTC calculation (reuses `CostOfChildrenStep`)
- Step 8: Initial liability per child
- Step 9: Multi-case cap application with visual indicators
- Step 10: NPC payment distribution with rule explanations
- Step 12: Final payment with annual rate breakdown

**Visual Highlights:**
- Shows which NPC payment rule applies for each child
- Displays payment arrows (Parent A → NPC, Parent A → Parent B, etc.)
- Highlights when multi-case caps are applied
- Color-coded sections for clarity

## Integration Points

### Existing Components Reused
- `IncomeStep` - Steps 1-3 (with multi-case allowance)
- `CareStep` - Step 4 (includes NPC care)
- `CostStep` - Steps 5-6 (includes NPC cost percentage)
- `CostOfChildrenStep` - Step 7 (COTC calculation)
- `DualNPCStep` - Step 11 (dual NPC split)
- `AnnualRateBreakdown` - Final payment summary
- `ParentComparisonCard` - Parent comparison
- `ZeroLiabilityNotice` - Zero payment notice

### New Components
- `Formula4BreakdownView` - Main view orchestrator
- `Formula4LiabilityStep` - Steps 7-10 & 12 handler

## Key Differences from Formula 3

| Aspect | Formula 3 | Formula 4 |
|--------|-----------|-----------|
| **NPC Involvement** | No | Yes |
| **Payment Recipients** | Parents only | Parents + NPC |
| **Step 10** | Final payment | NPC distribution rules |
| **Step 11** | N/A | Dual NPC split |
| **Step 12** | N/A | Final payment |
| **Complexity** | Medium-High | High |

## Usage Example

```typescript
import { Formula4BreakdownView } from '@/src/features/calculator/components/breakdown';

<Formula4BreakdownView
  results={calculationResults}
  formState={{ supportA: false, supportB: true }}
/>
```

## Visual Design

### Step 8: Initial Liability
- Shows calculation formula for each parent
- Displays cost per child × child support percentage
- Indicates when parent has no liability

### Step 9: Multi-case Cap
- Shows cap amount for each parent
- Explains cap formula (solo child cost × payment responsibility %)
- Visual indicator when cap is applied (✓ green text)
- Grayed out text when cap not applied

### Step 10: NPC Payment Distribution
- Rule explanation box with all 3 rules
- Highlights which rule applies for each child
- Payment breakdown with arrows:
  - Parent A → NPC: $X,XXX
  - Parent B → NPC: $X,XXX
  - Parent A → Parent B: $X,XXX

### Step 12: Final Payment
- Annual rate breakdown table
- Parent comparison card
- Clear indication of payer and payee

## Testing Considerations

### Test Scenarios
1. **Both parents multi-case, NPC primary carer**
   - Both parents pay NPC (Rule 1)
   - Multi-case caps apply to both

2. **One parent multi-case, shared care with NPC**
   - Parent A pays both Parent B and NPC (Rule 3)
   - Multi-case cap applies to Parent A only

3. **Dual NPC with multi-case**
   - Payment split between 2 NPCs
   - Multi-case adjustments for both parents

4. **MAR/FAR with multi-case and NPC**
   - Special rate caps across all cases
   - NPC payments included in cap calculation

## Implementation Status

✅ **Completed:**
- Formula4BreakdownView component
- Formula4LiabilityStep component
- Integration with existing step components
- Export from breakdown index

⏳ **Pending:**
- Formula 4 calculation engine (backend logic)
- Form UI for multi-case + NPC inputs
- Validation rules
- Unit tests
- Integration with main calculator flow

## Next Steps

1. **Backend Implementation:**
   - Implement `calculateFormula4()` function
   - Add multi-case allowance calculation
   - Add multi-case cap logic
   - Add NPC payment distribution rules

2. **Form UI:**
   - Add "Other cases" input fields
   - Add NPC care input fields
   - Add validation for Formula 4 scenarios

3. **Testing:**
   - Unit tests for Formula 4 calculations
   - Integration tests for breakdown display
   - Visual regression tests

4. **Documentation:**
   - Update DESIGN_SYSTEM.md with Formula 4 breakdown
   - Update PROJECT_KNOWLEDGE_BASE.md with implementation notes
   - Add Formula 4 examples to user documentation

## Notes

- Formula 4 is the most complex formula (combines Formula 2 + Formula 3)
- High complexity score for lead generation
- Always triggers "Get Legal Help" prompt
- Requires careful explanation in UI due to multiple payment streams

---

**Implementation Date:** January 29, 2026  
**Status:** UI Components Complete, Backend Pending
