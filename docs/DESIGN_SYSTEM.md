# Design System & Architecture

## Overview
Child Support Calculator - React Native/Expo app following Australian Government Services Australia formula.

## Color Palette
- **Primary Background**: `#0f172a` (slate-900) - Main app background
- **Card Background**: `#1e293b` (slate-800) - Content cards
- **Accent**: `#2563eb` (blue-600) - Primary actions, hero sections
- **Borders**: `#334155` (slate-700) - Subtle dividers
- **Text Primary**: `#ffffff` - Main headings, values
- **Text Secondary**: `#94a3b8` (slate-400) - Labels, descriptions
- **Text Tertiary**: `#64748b` (slate-500) - Metadata

## Typography Scale
- **Hero**: 48px, weight 700 - Main payment amounts
- **Title**: 32px, weight 700 - Section headers
- **Heading**: 20px, weight 600 - Card titles
- **Body Large**: 16px, weight 500 - Important values
- **Body**: 14px, weight 400 - Standard text
- **Caption**: 12px, weight 400 - Helper text
- **Small**: 10px, weight 500 - Micro labels

## Component Patterns

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

## User Experience Principles

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

## Calculation Display Strategy

### Problem with Current Approach
Users see technical metrics (CSI, ATI, SSA, Cost %, CS %) without understanding:
1. What they mean
2. Why they matter
3. How they connect to the final payment

### Solution: Narrative Flow

**Step 1: Income Split**
- Show each parent's income in dollars
- Show percentage of total
- Use visual bar to compare

**Step 2: Care Split**  
- Show nights per fortnight (most intuitive for users)
- Convert to percentage
- Explain how this becomes "cost coverage"

**Step 3: The Gap**
- Highlight: Income % - Cost % = Payment %
- This is the KEY insight users need
- Make it visual (not just numbers)

**Step 4: Apply to Total Costs**
- Show the annual cost of children
- Apply the gap percentage
- Result = final payment

### Technical Breakdown (Expandable)
For users who want to verify:
- Full 8-step formula breakdown
- All intermediate calculations
- Reference values (SSA, FAR, MAR)
- Per-child liability details

## File Organization

### `/src/components`
- **CalculatorForm.tsx** - Input form with validations
- **CalculatorResults.tsx** - Results display (orchestrator)
- **ResultsSimpleExplanation.tsx** - NEW: Narrative explanation view
- **ResultsDetailedBreakdown.tsx** - Technical data tables
- **ChildRow.tsx** - Individual child input row
- **HelpTooltip.tsx** - Reusable tooltip component

### `/src/utils`
- **child-support-calculations.ts** - Core calculation logic
- **child-support-constants.ts** - Government rates by year
- **cost-of-children-tables.ts** - Official cost tables

### `/src/types`
- **calculator.ts** - TypeScript interfaces

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
   - Apply minimum rates if applicable:
     - **FAR (Fixed Annual Rate)**: Low income, not on support
     - **MAR (Minimum Annual Rate)**: Very low income, on Centrelink support

## Common Abbreviations

- **ATI**: Adjusted Taxable Income
- **CSI**: Child Support Income  
- **CCSI**: Combined Child Support Income
- **SSA**: Self-Support Amount
- **FAR**: Fixed Annual Rate
- **MAR**: Minimum Annual Rate
- **FTB**: Family Tax Benefit
- **MTAWE**: Male Total Average Weekly Earnings

## Development Guidelines

### When Adding Features
1. Update this DESIGN_SYSTEM.md
2. Document in CHANGELOG.md with date and reasoning
3. Keep components small and focused (< 300 lines)
4. Extract reusable logic to utils/
5. Add TypeScript types for all new data structures

### For AI Assistants
- Read DESIGN_SYSTEM.md first to understand patterns
- Check CHANGELOG.md to see recent changes
- Follow existing color/spacing/typography scales
- Keep narrative explanation simple (8th grade reading level)
- Technical details go in expandable sections
