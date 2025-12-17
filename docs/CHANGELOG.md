# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### 2024-12-17 - Results Display Redesign ✅ COMPLETED
**Problem**: Current breakdown shows technical data (CSI, ATI, Cost %, CS %) without explaining what they mean or how they connect to the final payment. Users were confused.

**Solution**: Created two-tier explanation system:
1. **Simple Explanation (Default)**: Narrative flow showing:
   - Step 1: Income Split (visual bar, percentages)
   - Step 2: Care Split (visual bar, care time)
   - Step 3: The Gap (highlighted - KEY INSIGHT)
   - Step 4: Total Child Costs (from govt tables)
   - Step 5: Your Payment (final calculation)

2. **Technical Breakdown (Toggle)**: Existing detailed tables for verification

**Files Created**:
- `DESIGN_SYSTEM.md` - Design patterns, color system, calculation formula documentation
- `CHANGELOG.md` - This file
- `src/components/ResultsSimpleExplanation.tsx` - NEW narrative explanation component (395 lines)

**Files Modified**:
- `src/components/CalculatorResults.tsx` - Added toggle between simple/detailed views

**Key Design Decisions**:
- Show story first, math second (progressive disclosure)
- Use visual bars to compare income and care splits
- Highlight "The Gap" as the key insight (income % - cost % = payment %)
- Plain English explanations (no jargon by default)
- Special rate notices (FAR/MAR) shown when applicable
- Mobile-first responsive design

**Component Architecture**:
```
CalculatorResults (orchestrator)
├── Collapsed Card (bottom sheet)
├── Expanded Modal
    ├── Hero Section (payment amount)
    ├── Toggle (Simple ↔ Detailed)
    ├── ResultsSimpleExplanation (NEW)
    └── Technical Tables (existing)
```

**For Future AI Helpers**:
- Read `DESIGN_SYSTEM.md` first - contains color palette, typography, spacing system
- Follow progressive disclosure pattern: simple → detailed
- Keep narrative explanations at 8th grade reading level
- Use visual elements (bars, badges) to reinforce concepts
- Technical details belong in expandable sections

---

## Earlier Work

### Initial Implementation
- Basic 8-step Australian child support formula
- Year selector (2020-2025)
- Multiple children support
- Relevant dependents
- Care percentage calculations
- FAR/MAR rate applications
- Live calculation with debouncing
