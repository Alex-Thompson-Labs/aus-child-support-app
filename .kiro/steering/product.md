---
inclusion: always
---

# Product Overview

Australian Child Support Calculator - B2B lead generation platform connecting parents with family law practitioners.

## What This Is
Free calculator implementing the official Services Australia 8-step formula with built-in complexity detection that identifies high-value cases for family law firms.

## Business Model
- **Revenue**: $50 per qualified lead (pay-per-lead model)
- **Alternative**: Marketing Retainer model for exclusive partners ($500/month, client-funded ads)
- **Privacy**: Leads delivered via Secure Magic Links (no PII in emails)
- **Target Market**: Family law firms in Australia (3-10 lawyers, major metro areas)

## Current Phase: 3A - Validation (January 2026)
**Status**: Proof Before Pitch - validating lead quality before scaling

**Validation Goals**:
- Generate 8-15 qualified leads via organic traffic
- Achieve 15%+ lead-to-consultation rate OR sign 1 Exclusive Partner
- Collect testimonials and build proof package
- **Revenue Target**: $0 (validation phase - learning over revenue)

**Dual Launch Strategy**:
1. **Organic Track**: Blog posts, Reddit, forums, SEO
2. **Partner Track**: Pitch exclusive partner model (firm funds $500 ads, zero financial risk)

## Key Conversion Flow
1. Parent uses calculator → instant results
2. Complexity detection identifies high-value cases (income variance, court dates, Change of Assessment)
3. Alert shown with "Get Legal Help" CTA
4. Inquiry form captures lead with consent
5. Lead saved to Supabase database (encrypted, Privacy Act compliant)
6. Admin reviews → sends teaser email to lawyer
7. Lawyer confirms interest → charged $50 → receives Secure Magic Link

## Entry Points
- **Main Calculator**: Standard flow through calculator
- **Direct Inquiry**: `/lawyer-inquiry?mode=direct&reason=X` (blog traffic, bypasses calculator)
- **Special Circumstances**: `/special-circumstances` (factor selection first)

## Critical Rules for AI Assistants
- **NEVER fabricate metrics**: Don't invent traffic numbers, conversion rates, or user counts
- **NEVER claim proven results**: This is Phase 3A validation - we're PROVING the model, not selling proven data
- **ALWAYS be transparent**: When creating outreach materials, clearly state this is a validation pilot
- **ASK for data**: If specific metrics are needed, ask the user rather than making assumptions
- **Validation context**: We have NO paying lawyers yet, NO proven conversion rates, NO historical lead data
- **What we DO have**: Working calculator, complexity detection, admin dashboard, database infrastructure

## Privacy & Data Handling

**Privacy Boundaries (CRITICAL):**

1. **Admin Internal View** (`/admin/lead/[id]`):
   - ✅ Can see full PII (name, email, phone) for quality vetting
   - ✅ 30-second quality check to filter fake names/spam
   - ❌ NEVER copy PII into teaser emails

2. **Teaser Email to Lawyers**:
   - ✅ Case summary (complexity, income, location)
   - ❌ NO PII (name, email, phone)
   - Purpose: Lawyer decides if lead is worth $50

3. **Secure Magic Link** (`/admin/view-lead/[token]`):
   - ✅ Full PII after lawyer pays $50
   - ✅ Time-limited access
   - ✅ Audit trail

**Workflow:**
1. Parent submits form → Saved to Supabase (Encrypted)
2. Admin sees full PII internally for quality check
3. Admin generates teaser (NO PII) → Sends to Lawyer
4. Lawyer responds "YES" → Charged $50
5. Admin generates Secure Magic Link → Lawyer views full PII

**Implementation Status:**
- ✅ Admin can view PII for vetting
- ✅ Teaser email template excludes PII
- ⏳ Secure Magic Link system (route exists, needs token generation)

## 🚨 Documentation Maintenance (MANDATORY)

**When you make ANY code changes, you MUST update relevant documentation.**

**Complete guide**: `/docs/AI_DOCUMENTATION_GUIDE.md`

**Quick reference after code changes**:
- Implemented a feature? → Update `/docs/business-docs/BUSINESS_MODEL.md` (📋 → ✅)
- Changed UI/components? → Update `/docs/DESIGN_SYSTEM.md`
- Added routes/screens? → Update `/docs/business-docs/USER_FLOW.md`
- Modified database? → Update `/docs/CLAUDE.md`

**Why this matters**: Documentation accuracy is critical. False completion claims or outdated docs cause confusion and wasted effort.

**See `/docs/CLAUDE.md` for detailed checklist and examples.**
