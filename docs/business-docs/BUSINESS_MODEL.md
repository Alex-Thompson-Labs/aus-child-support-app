# Business Model (Current - December 2025)

**Last Updated:** December 31, 2025  
**Status:** Phase 1 & 2 COMPLETE, Phase 3A - Proof Before Pitch (Validation Phase)

---

## 🎯 THE MODEL

**Product:** Free child support calculator (auschildsupport.com) → Generates leads for family lawyers

**Revenue:** $50 per qualified lead (database-managed, secure handover)

**Target Market:** Family law firms in Australia (small businesses, 3-10 lawyers, major metro areas)

**Platform:** Web app at auschildsupport.com (React Native Web + mobile apps coming later)

---

## 💰 HOW MONEY FLOWS

### Standard Model (Phase 3B+ - Paying Lawyers):

1. **Parent uses calculator at auschildsupport.com** (free, no signup required)
2. **Complex case detected** → Alert shown ("High Value", "Court Date Urgent", "Change of Assessment", etc.)
3. **Parent clicks "Get Legal Help"** → Fills inquiry form with consent checkbox
4. **Lead saved to secure database** (Supabase - encrypted, Privacy Act compliant)
5. **You get email notification** (teaser only, not full details)
6. **You review lead in admin dashboard** (30 seconds - quality check)
7. **You send teaser email to lawyer** (case summary without parent contact details)
8. **Lawyer responds "YES"** → You charge them $50
9. **You send full parent details** (email/phone via secure handover)
10. **Lawyer contacts parent** (schedules consultation themselves)
11. **Monthly billing via Stripe** (automated invoicing)

### Exclusive Partner Model (Phase 3A - Client-Funded):

1. **Firm funds $500 Google Ads** (they control account, you manage campaigns)
2. **Co-branded calculator** ("Powered by [Firm Name]") for their region
3. **Parent uses calculator** → Sees firm branding
4. **Complex case detected** → Alert shown
5. **Parent submits inquiry** → Goes exclusively to partner firm
6. **All qualified leads in their city** → Sent to them for 4 weeks
7. **You manage ads, forward leads** → They get exclusive access
8. **If successful** → Discuss ongoing partnership fees
9. **If unsuccessful** → They've spent normal ad budget, no further obligation
10. **Zero financial risk for you** → They fund ads, you prove concept

---

## 📊 REVENUE PROJECTIONS

**Phase 3A Target (January 2026 - Validation):**

- 0 paying lawyers (validation phase)
- 1 Exclusive Partner (if successful) OR 2-3 validation lawyers (free leads)
- 8-15 qualified leads generated (organic traffic)
- **$0/month revenue** (learning over revenue - validation phase)

**Phase 3B Target (February 2026 - First Revenue):**

- 8-12 paying lawyers (using proof package from Phase 3A)
- 50+ leads/month
- **$2,000-3,000/month revenue**
- _Prerequisite: Phase 3A validation succeeded (15%+ consultation rate OR Exclusive Partner signed)_

**Phase 4 Target (Months 3-6):**

- 20-30 lawyers
- 100-150 leads/month
- **$5,000-7,500/month revenue**

**Phase 5 Target (Year 1):**

- 50+ lawyers
- 200-300 leads/month
- **$10,000-15,000/month revenue**

---

## ✅ CURRENT STATUS

### Phase 1: COMPLETE ✅

**What's Done:**

- ✅ Calculator built (Australian 2024-2025 formula)
- ✅ Complexity detection (high value, court date, shared care)
- ✅ Change of Assessment feature (10 official grounds)
- ✅ Alert system (shows "Get Legal Help" buttons)
- ✅ Inquiry form (collects parent details + CoA reasons)
- ✅ Consent checkbox (Privacy Act compliance)
- ✅ Supabase database integration (encrypted lead storage)
- ✅ Admin dashboard (login, lead list, search/filter, status management)
- ✅ Privacy policy created and published
- ✅ Analytics tracking (PostHog for mobile, web analytics TBD)
- ✅ End-to-end testing complete
- ✅ **Web app deployed at auschildsupport.com**
- ✅ Historical year selection removed (current rates only)

**Completed:** Dec 27, 2025

### Phase 3A: PROOF BEFORE PITCH (January 2026 - Validation Phase)

**Business Setup Progress:**

- ✅ Domain registered (auschildsupport.com)
- ✅ Email setup (alex@auschildsupport.com)
- ✅ LinkedIn profile created (Alex Thompson)
- ✅ AI headshot created
- ✅ Database infrastructure (Supabase - leads table, RLS policies)
- ✅ Admin dashboard (fully functional and tested)
- ✅ Privacy policy (created and published)
- ✅ Tracking spreadsheets (Lawyer Partners + Lead Tracker)
- ⏳ Virtual phone number (getting next week)
- ⏳ Stripe setup (for Phase 3B, not needed for validation)

**Validation Plan (Dual Launch - Week 1-2):**

- **Track A: Organic Traffic** - Blog posts, Reddit, forums, SEO (6-8 hours)
- **Track B: Exclusive Partner Outreach** - Pitch 10-15 firms to fund $500 Google Ads (6-8 hours)
- Goal: 1 Exclusive Partner signed OR 2-3 validation lawyers receiving free leads

**Validation Execution (Week 3-8):**

- If Exclusive Partner: Setup co-branded calculator, configure their Google Ads
- If no partner: Add property settlement CoA reason, place free leads with validation lawyers
- Track conversion metrics: Lead→Consultation rate, Consultation→Retained rate
- Collect testimonials, build proof package
- Revenue target: $0 (validation phase)

**Timeline:** Validation Jan 2026, first revenue Feb 2026 (only if validation succeeded)

---

## 🔑 KEY DECISIONS MADE

### Database-First Approach: REQUIRED

- **Rejected:** Email-only lead routing
- **Why rejected:** Not compliant with Privacy Act 1988, no audit trail, can't handle deletion requests, insecure
- **Using:** Supabase database with encrypted storage, RLS policies, audit trails
- **Benefit:** Legal compliance, professional appearance, secure data handling

### Teaser Email Workflow: YES

- **Using:** Send case summary to lawyers first (without parent contact details)
- **Why:** Lawyer can't contact parent for free, you maintain control, professional appearance
- **Flow:** Teaser → Lawyer confirms interest → Charge $50 → Send full details

### Calendar Integration: NO

- **Rejected:** Calendly/Google Calendar API integration
- **Why:** Too complex, scares lawyers, delays launch
- **Using:** Simple email forwarding after payment (manual routing)

### Pricing: $50 per Lead

- **Rejected:** $100 per booking (requires calendar integration)
- **Rejected:** Pay-per-client (illegal fee-sharing in Australia)
- **Chosen:** $50 per qualified email lead
- **Why:** Market rate, simple tracking, no disputes

### Validation-First Approach: PROOF BEFORE PITCH

- **Rejected:** Sign paying lawyers immediately without proof of lead quality
- **Chosen:** Validate with free leads first, then pitch with proof package
- **Why:** Reduces financial risk, proves model before asking lawyers to pay, enables Exclusive Partner track (client-funded ads = zero risk)
- **Phase 3A:** Free leads to 2-3 validation lawyers OR 1 Exclusive Partner (firm funds $500 ads)
- **Phase 3B:** Only proceed to paying lawyers if validation shows 15%+ consultation rate OR Exclusive Partner signed

### Launch Strategy: Manual First, Automate Later

- **Phase 3A:** Manual lead routing via admin dashboard (validation)
- **Phase 3B+:** Manual lead routing (proven demand)
- **Phase 4+:** Build automated system if volume justifies it
- **Why:** Validate demand before building, prove quality before scaling

---

## 🛠️ TECHNICAL INFRASTRUCTURE

### Database & Security

- **Platform:** Supabase (Sydney region, free tier)
- **Leads Table:** Encrypted storage with full calculation history
- **Authentication:** Admin-only access via Supabase Auth
- **Security:** Row Level Security (RLS) policies
- **Compliance:** Privacy Act 1988 compliant (consent tracking, audit trails, deletion capability)

### Admin Dashboard

- **Access:** `/admin/login` (password protected)
- **Features:**
  - Lead list with search/filter
  - Status management (new/reviewing/sent/converted/lost)
  - Full lead details view
  - Lawyer assignment tracking
  - Notes and timestamp tracking
- **Mobile-optimized:** Works on phone for on-the-go management

### Privacy & Legal

- **Privacy Policy:** Published at auschildsupport.com/privacy
- **Consent Mechanism:** Checkbox on inquiry form (mandatory)
- **Data Rights:** Access, correction, deletion requests supported
- **Audit Trail:** All lead access and status changes logged

### Lead Management Workflow

1. Parent submits inquiry → Saved to database
2. Email notification sent to admin (teaser only)
3. Admin reviews in dashboard → Quality check
4. Admin generates teaser email template
5. Lawyer responds → Admin charges $50
6. Admin sends full details via secure handover
7. Lead status updated → Tracking for billing

---

## 📁 KEY DOCUMENTS

### Active Tasks

- **Current work:** `/docs/guides/active/REMAINING_TASKS.md` (what to do now)

### Implementation Guides (Reference)

- **Phase 1:** `/docs/guides/old/phase1/` (complete - archived)
- **Phase 2:** `/docs/guides/old/phase2/` (reference for templates)

### Strategy Docs

- **Partnership Agreement:** `/docs/templates/LAWYER_PARTNERSHIP_AGREEMENT.md`
- **Web Deployment:** `/docs/guides/active/WEB_DEPLOYMENT_GUIDE.md`
- **Design System:** `/docs/DESIGN_SYSTEM.md`

### Data & Tracking

- **Lawyer Contacts:** `/data/family_law_contacts_full.csv` (286 firms)

---

## 🎯 SUCCESS METRICS

### Phase 3A Minimum Success (Validation - January 2026):

- 50-100 calculator sessions (organic traffic)
- 8-15 qualified leads generated
- 1 Exclusive Partner signed OR 2-3 validation lawyers receiving free leads
- 15%+ consultation rate (from validation leads)
- 2 lawyer testimonials collected
- Proof package created (case study, conversion metrics)
- Revenue: $0 (validation phase)

### Phase 3B Minimum Success (First Revenue - February 2026):

- 8+ active paying lawyers (using proof package)
- 50+ leads delivered
- $2,000+ monthly revenue
- <20% refund rate
- Lawyer NPS > 0
- _Prerequisite: Phase 3A validation succeeded_

### Phase 3B Strong Success:

- 12+ active paying lawyers
- 80+ leads delivered
- $3,000+ monthly revenue
- <10% refund rate
- Lawyer NPS > 30
- Lawyers asking for MORE leads

---

## ⚠️ WHAT COULD GO WRONG

**Risk 1:** Validation fails (<10% consultation rate)  
**Mitigation:** ✅ VALIDATION-FIRST APPROACH - Test with free leads before asking lawyers to pay, adjust complexity filters, reconsider pricing model

**Risk 2:** No Exclusive Partner interest  
**Mitigation:** Continue validation path with free leads, use organic leads for proof, spend own budget only if validation succeeds

**Risk 3:** Lawyers won't pay $50/lead (Phase 3B)  
**Mitigation:** Use proof package from Phase 3A, adjust price based on validation data ($25-35 if needed), show ROI math

**Risk 4:** Lead quality too low (high refund rate)  
**Mitigation:** Manual review before sending, tighten complexity thresholds, validate with free leads first

**Risk 5:** Not enough app traffic (insufficient leads)  
**Mitigation:** Organic traffic generation, Exclusive Partner ads (if signed), conditional paid ads only if validation succeeds

**Risk 6:** Lawyers ghost after 1-2 leads  
**Mitigation:** Weekly check-ins, improve lead quality, validation reduces this risk (prove quality first)

**Risk 7:** Privacy Act compliance issues  
**Mitigation:** ✅ RESOLVED - Database with proper consent, privacy policy, audit trails, deletion capability

---

## 🚀 NEXT STEPS

### Phase 3A - Validation (January 2026)

**Week 1-2: Dual Launch**

- **Track A:** Organic traffic (blog posts, Reddit, forums, SEO) - 6-8 hours
- **Track B:** Exclusive Partner outreach (pitch 10-15 firms) - 6-8 hours
- Goal: 1 Exclusive Partner OR 2-3 validation lawyers

**Week 3-4: Execute Path**

- If Exclusive Partner: Setup co-branded calculator, configure their Google Ads
- If no partner: Add property settlement CoA reason, place free leads with validation lawyers

**Week 5-8: Scale & Document**

- Track conversion metrics, collect testimonials, build proof package
- Revenue target: $0 (validation phase)

### Phase 3B - First Revenue (February 2026)

_Only proceed if Phase 3A validation succeeded_

- Use proof package to sign 8-12 paying lawyers
- Deliver 50+ leads, generate first revenue ($2-3K)

---

**For current tasks, see:** `/guides/active/ACTIVE_TASKS.md`
