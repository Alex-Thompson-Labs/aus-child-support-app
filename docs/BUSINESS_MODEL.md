# Business Model (Current - December 2024)

**Last Updated:** December 27, 2024  
**Status:** Phase 1 COMPLETE, Phase 2 preparation in progress

---

## 🎯 THE MODEL

**Product:** Free child support calculator (auschildsupport.com) → Generates leads for family lawyers

**Revenue:** $50 per qualified lead (email-based, manual routing)

**Target Market:** Family law firms in Australia (small businesses, 1-10 lawyers)

**Platform:** Web app at auschildsupport.com (React Native Web + mobile apps coming later)

---

## 💰 HOW MONEY FLOWS

1. **Parent uses calculator at auschildsupport.com** (free, no signup required)
2. **Complex case detected** → Alert shown ("High Value", "Court Date Urgent", "Change of Assessment", etc.)
3. **Parent clicks "Get Legal Help"** → Fills inquiry form
4. **You receive lead via email** (with all case details)
5. **You review lead** (30 seconds - quality check)
6. **You forward to lawyer via email** (using template)
7. **Lawyer contacts parent** (schedules consultation themselves)
8. **You bill lawyer $50** (at end of month via Stripe)

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
- ⏳ Virtual phone number (getting next week)
- ⏳ Partnership agreement (to create)
- ⏳ Email templates (to create)
- ⏳ Tracking spreadsheets (to create)
- ⏳ Stripe setup (to do)

**Launch Plan:**
- Onboard 8-12 lawyers via LinkedIn + email outreach
- Lead with live web demo (auschildsupport.com)
- Deliver 50+ qualified leads
- Generate first revenue ($2-3K)
- Validate $50/lead pricing

**Timeline:** Start outreach late Dec 2024, first revenue Jan-Feb 2025

---

## 🔑 KEY DECISIONS MADE

### Calendar Integration: NO
- **Rejected:** Calendly/Google Calendar API integration
- **Why:** Too complex, scares lawyers, delays launch
- **Using:** Simple email forwarding (manual routing)

### Pricing: $50 per Lead
- **Rejected:** $100 per booking (requires calendar integration)
- **Rejected:** Pay-per-client (illegal fee-sharing in Australia)
- **Chosen:** $50 per qualified email lead
- **Why:** Market rate, simple tracking, no disputes

### Launch Strategy: Manual First, Automate Later
- **Phase 2:** Manual lead routing (you forward emails)
- **Phase 3:** Build automated system if volume justifies it
- **Why:** Get to revenue fast, validate demand before building

---

## 📁 KEY DOCUMENTS

### Active Tasks
- **Current work:** `/guides/active/ACTIVE_TASKS.md` (what to do now)

### Implementation Guides (Reference)
- **Phase 1:** `/guides/reference/phase1/` (complete - archived)
- **Phase 2:** `/guides/reference/phase2/` (reference for templates)

### Strategy Docs
- **Web Deployment:** `/docs/WEB_DEPLOYMENT_GUIDE.md`
- **Pricing Analysis:** `/docs/PRICING_ANALYSIS_MANUAL_LEADS.md`
- **Design System:** `/docs/DESIGN_SYSTEM.md`

### Data
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

---

## 🚀 NEXT STEPS

**Right now:** Complete Tier 1 tasks in `/guides/active/ACTIVE_TASKS.md`  
**This week:** Finish business setup (phone, docs, spreadsheets)  
**Next week:** Start lawyer outreach (LinkedIn + email)  
**January:** First lawyer partnerships and leads

---

**For current tasks, see:** `/guides/active/ACTIVE_TASKS.md`
