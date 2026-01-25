# Formula 5 Implementation Summary

**Implementation Date:** January 25, 2026  
**Status:** ✅ Core Complete, ⏳ UI Polish Needed  
**Test Coverage:** 21/21 passing tests

---

## What is Formula 5?

Formula 5 is used when a **non-parent carer** (e.g., grandparent) applies for child support and one parent lives in a **non-reciprocating jurisdiction** (country without Australian child support agreement).

**Key Principle:** Doubles available parent's income to recognize child has two parents, then halves final rate to compensate.

---

## Implementation Components

### ✅ Core Calculation Engine

**File:** `src/utils/formula-5-calculator.ts`

**Functions:**
- `calculateFormula5()` - Main calculation function
- `validateFormula5Input()` - Input validation

**Features:**
- Income doubling and rate halving
- Multi-case allowance support
- Two-carer payment split
- Adult child exclusion (18+)
- Comprehensive error handling

**Test Coverage:** 21 passing tests in `src/utils/__tests__/formula-5-calculator.test.ts`

---

### ✅ Jurisdiction Checker

**File:** `src/utils/jurisdiction-checker.ts`

**Functions:**
- `checkJurisdictionStatus()` - Determines if country is reciprocating/excluded/non-reciprocating
- `getJurisdictionExplanation()` - Plain-language explanations
- `getJurisdictionGuidance()` - Detailed guidance for each status
- `shouldUseFormula5()` - Boolean check for Formula 5 eligibility

**Data Sources:**
- `RECIPROCATING_JURISDICTIONS` - 80+ countries with agreements
- `EXCLUDED_JURISDICTIONS` - 7 countries that cannot accept assessments

---

### ✅ UI Components

**Country Selector:** `src/components/ui/CountrySelector.tsx`
- Searchable dropdown with 195+ countries
- Real-time jurisdiction status badge
- Color-coded urgency indicators
- Accessibility compliant

**Non-Parent Carer Section:** `src/features/calculator/components/NonParentCarerSection.tsx`
- Overseas parent toggle
- Country selection
- Jurisdiction status display
- Expandable parent status options

---

### ✅ Integration

**Main Calculator:** `src/utils/calculateResults.ts`
- Formula 5 detection logic
- Automatic routing when non-reciprocating jurisdiction detected
- Fallback to standard formulas for reciprocating jurisdictions

**Complexity Detection:** `src/utils/complexity-detection.ts`
- Formula 5 cases automatically flagged as complex
- International jurisdiction scoring (+8 points)
- Custom alert messaging for Formula 5 results

---

## Lead Generation Integration

Formula 5 cases are **high-value leads** for lawyers:

**Complexity Score:** +8 points (International Jurisdiction)

**Alert Message:**
> "🌏 International Case: Verification Recommended
>
> This assessment uses Formula 5 because one parent lives in [country]. International child support cases have unique enforcement challenges. A family lawyer can help you understand your options and ensure the assessment is accurate."

**CTA:** "Get Legal Advice"

---

## User Flow

1. **Parent enables "Non-Parent Carer"** checkbox
2. **Parent selects "Is either parent living overseas?"**
3. **Parent selects country** from dropdown
4. **System checks jurisdiction status:**
   - **Reciprocating** → Standard Formula 1-4 applies
   - **Excluded** → Warning shown (court order may be needed)
   - **Non-Reciprocating** → Formula 5 applies
5. **Parent calculates** → Formula 5 result shown
6. **Complexity alert displayed** → "Get Legal Help" CTA
7. **Parent submits inquiry** → Lead captured with Formula 5 context

---

## What's Still Needed

### ⏳ Results Display Component

**File to create:** `src/features/calculator/components/breakdown/Formula5BreakdownCard.tsx`

**Should show:**
- Income doubling explanation with visual
- Cost calculation using doubled income
- Rate halving explanation
- Which parent is overseas (country name)
- Enforcement limitations disclaimer

### ⏳ Analytics Tracking

**Events to add:**
```typescript
analytics.track('formula_5_used', {
  country: overseasParentCountry,
  jurisdiction_status: 'non-reciprocating',
  annual_rate: result.annualRate,
});

analytics.track('formula_5_complexity_alert_shown', {
  country: overseasParentCountry,
});
```

### ⏳ Type Integration

**Issue:** Formula5Result needs proper integration with CalculationResults union type

**Current workaround:** Using `as any` cast in `calculateResults.ts`

**Proper solution:** Extend CalculationResults type or create discriminated union

---

## Testing

**Unit Tests:** `src/utils/__tests__/formula-5-calculator.test.ts`

**Coverage:**
- ✅ Input validation (5 tests)
- ✅ Income doubling (3 tests)
- ✅ Rate halving (2 tests)
- ✅ Multi-case scenarios (2 tests)
- ✅ Two-carer payment split (2 tests)
- ✅ Adult children exclusion (1 test)
- ✅ Periodic rates (1 test)
- ✅ Result metadata (2 tests)
- ✅ Edge cases (3 tests)

**All 21 tests passing** ✅

---

## Documentation Updated

- ✅ `docs/DESIGN_SYSTEM.md` - Added Formula 5 section
- ✅ `docs/business-docs/formulas/FORMULA_5_SPECIFICATION.md` - Marked as implemented
- ✅ This summary document created

---

## Business Impact

**Target Users:** Non-parent carers (grandparents, relatives) raising children with one parent overseas

**Lead Value:** High - International cases score +8 points (Premium category threshold: 10+)

**Competitive Advantage:** Most calculators don't support Formula 5 - serves underserved audience

**Complexity:** Always flagged for legal review - good lead generation opportunity

---

## Next Steps

1. **Create Formula5BreakdownCard component** (2-3 hours)
2. **Add analytics tracking** (30 minutes)
3. **Fix type integration** (1 hour)
4. **User testing** with non-parent carer scenarios
5. **Blog post** about Formula 5 for SEO/organic traffic

---

**Questions?** See `/docs/business-docs/formulas/FORMULA_5_SPECIFICATION.md` for detailed specification.
