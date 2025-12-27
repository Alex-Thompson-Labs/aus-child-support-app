# Business Model (Current - December 2024)

**Last Updated:** December 27, 2024  
**Status:** Phase 1 COMPLETE, Phase 2 infrastructure COMPLETE, ready for lawyer outreach

---

## 🎯 THE MODEL

**Product:** Free child support calculator (auschildsupport.com) → Generates leads for family lawyers

**Revenue:** $50 per qualified lead (database-managed, secure handover)

**Target Market:** Family law firms in Australia (small businesses, 1-10 lawyers)

**Platform:** Web app at auschildsupport.com (React Native Web + mobile apps coming later)

---

## 💰 HOW MONEY FLOWS

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

---

## 📊 REVENUE PROJECTIONS

**Phase 2 Target (First 2 months):**
- 8-12 lawyers
- 40-60 leads/month
- **$2,000-3,000/month revenue**

**Phase 3 Target (Months 3-6):**
- 20-30 lawyers
- 100-150 leads/month
- **$5,000-7,500/month revenue**

**Phase 4 Target (Year 1):**
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

**Completed:** Dec 27, 2024

### Phase 2: IN PREPARATION (Starting late Dec/early Jan)
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
- ⏳ Partnership agreement
- ⏳ Email templates
- ⏳ Stripe setup (to do)

**Launch Plan:**
- Onboard 8-12 lawyers via LinkedIn + email outreach
- Lead with live web demo (auschildsupport.com)
- Deliver 50+ qualified leads
- Generate first revenue ($2-3K)
- Validate $50/lead pricing

**Timeline:** Ready for outreach Dec 28-29, first revenue Jan-Feb 2025

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

### Launch Strategy: Manual First, Automate Later
- **Phase 2:** Manual lead routing via admin dashboard
- **Phase 3:** Build automated system if volume justifies it
- **Why:** Get to revenue fast, validate demand before building

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

### Phase 2 Minimum Success:
- 8+ active lawyers
- 50+ leads delivered
- $2,000+ monthly revenue
- <20% refund rate
- Lawyer NPS > 0

### Phase 2 Strong Success:
- 12+ active lawyers
- 80+ leads delivered
- $3,000+ monthly revenue
- <10% refund rate
- Lawyer NPS > 30
- Lawyers asking for MORE leads

---

## ⚠️ WHAT COULD GO WRONG

**Risk 1:** Lawyers won't pay $50/lead  
**Mitigation:** Test with 3 lawyers first, adjust price if needed

**Risk 2:** Lead quality too low (high refund rate)  
**Mitigation:** Manual review before sending, tighten complexity thresholds

**Risk 3:** Not enough app traffic (insufficient leads)  
**Mitigation:** Marketing push to parent forums/groups

**Risk 4:** Lawyers ghost after 1-2 leads  
**Mitigation:** Weekly check-ins, improve lead quality, offer trial period

**Risk 5:** Privacy Act compliance issues  
**Mitigation:** ✅ RESOLVED - Database with proper consent, privacy policy, audit trails, deletion capability

---

## 🚀 NEXT STEPS

**Right now:** Finalize Tier 2 tasks in `/guides/active/ACTIVE_TASKS.md` (phone, partnership agreement, email templates, Stripe)  
**This week:** Start lawyer outreach (LinkedIn + email)  
**Next week:** Onboard first 3-5 lawyers  
**January:** Deliver first leads, generate first revenue

---

**For current tasks, see:** `/guides/active/ACTIVE_TASKS.md`
