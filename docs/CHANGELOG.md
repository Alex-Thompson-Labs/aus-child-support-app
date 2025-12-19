# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### 2024-12-20 - Pricing Model Finalized: Pay-Per-Consultation-Booked ✅ COMPLETED
**Major Change**: After comprehensive regulatory analysis, selected **Option 3 (Pay-Per-Consultation-Booked)** as final pricing model

**Strategic Decision:**
- **Chosen Model:** Pay-Per-Consultation-Booked at $100 per confirmed appointment
- **Evolution Path:** Transition to Hybrid Model (Option 5) in Phase 4: $149/month subscription + $50/booking
- **Rationale:**
  - **Regulatory Compliance:** Classified as "marketing fee" not "referral commission" (ASCR Rule 12.4.3)
  - **Fraud Prevention:** Booked calendar slots verify intent, booking deposits eliminate no-shows
  - **Lawyer Adoption:** Removes scheduling friction, $100 fee negligible vs $400/hour lawyer rate
  - **Quality Over Quantity:** Higher price point justifies lower volume, better targeting

**Rejected Models:**
- **Option 4 (Pay-Per-Client-Signed):** FATAL FLAW - violates ASCR Rule 12 fee-sharing prohibition
- **Option 1 (Pay-Per-Lead):** High fraud risk, "tyre-kicker" fatigue, lower perceived value
- **Option 2 (Pay-Per-Conversation):** Technical complexity (VoIP), lawyer availability friction

**Files Updated:**
- `docs/PRICING_STRATEGY_ANALYSIS.md` - Added decision record section
- `docs/CLAUDE.md` - Updated business model pricing reference
- `docs/PHASE_1_2_UPDATES.md` - Rewritten pricing section with Pay-Per-Consultation model
- `guides/phase1/CHECKLIST.md` - Added cross-reference to pricing analysis
- `guides/phase2/README.md` - Added pricing model explanation section
- `guides/PRICING_IMPLEMENTATION_GUIDE.md` - NEW comprehensive technical implementation guide

**Implementation Details:**
- Phase 1-2: FREE pilot (calendar integration, booking validation)
- Phase 3: Launch at $100/booking with fraud prevention stack (OTP, honeypot, IP tracking)
- Phase 4: Hybrid model for scale ($149/month + $50/booking for subscribers)

**Reference Documentation:**
See `docs/PRICING_STRATEGY_ANALYSIS.md` for full regulatory compliance analysis, unit economics, and comparative scoring of all 5 pricing options.

---

### 2024-12-19 - Phase 1 & 2 Strategic Planning ✅ COMPLETED
**Planning Phase**: Explored lawyer recruitment and lead routing approaches

**Note:** This entry documents strategic planning and exploration of pay-per-lead model. The final pricing model decision (pay-per-consultation) was finalized on December 20, 2024 after comprehensive regulatory analysis. See Dec 20 entry above.

**Strategic Changes**:
- Lawyer recruitment moved from Phase 2 to Phase 1 Task 0
- Full lead routing system now built in Phase 1 (not fake doors)
- Round-robin distribution model selected (fair, simple, automated)
- Pay-per-lead-sent pricing model chosen over pay-per-conversion
- Phase 2 becomes scaling phase (10→20 firms) instead of pilot

**Files Updated**:
- `guides/phase1/CHECKLIST.md` - Added Task 0: Bulk Lawyer Recruitment
- `guides/phase2/CHECKLIST.md` - Added bulk email template, pricing model, revenue projections
- `docs/PHASE_1_2_UPDATES.md` - Complete summary of all changes

**New Content Added**:
- Bulk recruitment email template (cold outreach to 40 firms)
- Pricing tiers: $50 standard, $100 premium, $150 urgent leads
- Revenue model: Pay-per-lead-sent (not pay-per-conversion)
- Round-robin routing algorithm documentation
- ROI calculation for lawyers (700% ROI at 10% conversion)

**Key Decisions Made**:
1. **Lead Distribution**: Round-robin (fair rotation) beats auction or user-choice models
2. **Pricing**: Pay-per-lead-sent ($50) beats pay-per-conversion (simpler, less disputes)
3. **Recruitment**: Bulk email 40 firms upfront (2.5 hours) beats slow one-by-one approach
4. **Geography**: Start with 4 cities (Melb/Syd/Bris/Perth) for broader coverage

**Rationale**:
- Building fake doors is misleading to users (ethical issue)
- Full flow provides real conversion data immediately (faster learning)
- Recruiting upfront filters efficiently (responders = partners, rest = cold-call list)
- Lawyers don't mind waiting 2-3 weeks after sign-up (no expectation management needed)

**For Future Development**:
- Phase 1 now includes all lead infrastructure (brief generator, routing, tracking)
- Phase 2 focuses on scaling (10→20 firms) and preparing monetization
- Phase 3 will implement Stripe billing and exclusive territory pricing

---

### 2024-12-19 - Phase 2 Implementation Guide ✅ COMPLETED
**Goal**: Create comprehensive Phase 2 (Pilot Program) documentation and starter code

**Files Created**:
- `guides/phase2/README.md` - Phase 2 overview and quick start
- `guides/phase2/CHECKLIST.md` - Week-by-week checklist (10 weeks)
- `guides/phase2/IMPLEMENTATION_GUIDE.md` - Detailed guide with examples and templates
- `src/utils/lead-brief-generator.ts` - Lead brief formatting utility for lawyers

**What Phase 2 Covers**:
1. **Lawyer Recruitment** (Weeks 1-2): Find and sign 2-3 pilot firms
2. **Infrastructure** (Weeks 3-4): Build manual lead routing system
3. **Pilot Execution** (Weeks 5-8): Send leads, gather feedback, iterate
4. **Review** (Weeks 9-10): Calculate metrics, present results, decide next steps

**Key Features**:
- Manual-first approach (no premature automation)
- Complete email templates and scripts
- Google Sheets tracking system
- Lead brief generator with TypeScript types
- Success criteria: >20% consultation rate, >5% client conversion

**Design Philosophy**:
- Validation before automation (stay lean)
- Build relationships before tech (lawyers need trust)
- Measure everything (data-driven decisions)
- Fail fast if model doesn't work

**For Future Development**:
- Phase 2 focuses on BUSINESS validation, not technical work
- Only 1 new code file (lead-brief-generator.ts)
- Most work is outreach, relationship management, tracking
- Success = proving lawyers will pay for leads

**Next Steps After Phase 2**:
- If validated: Phase 3 (Monetization + Scale)
- If needs work: Extend pilot with adjustments
- If fails: Pivot or learn from failure

---

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
