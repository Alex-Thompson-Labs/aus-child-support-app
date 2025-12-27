# Business Model (Current - December 2024)

**Last Updated:** December 24, 2024  
**Status:** Phase 1 95% complete, Phase 2 starts January 2025

---

## 🎯 THE MODEL

**Product:** Free child support calculator for Australian parents → Generates leads for family lawyers

**Revenue:** $50 per qualified lead (email-based, manual routing)

**Target Market:** Family law firms in Australia (small businesses, 1-10 lawyers)

---

## 💰 HOW MONEY FLOWS

1. **Parent uses calculator** (free, no signup required)
2. **Complex case detected** → Alert shown ("High Value", "Court Date Urgent", etc.)
3. **Parent clicks "Get Legal Help"** → Fills inquiry form
4. **You review lead** (30 seconds - quality check)
5. **You forward to lawyer via email** (with all case details)
6. **Lawyer contacts parent** (schedules consultation themselves)
7. **You bill lawyer $50** (at end of month via Stripe)

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
- ✅ Calculator built (Australian 2020-2025 formula)
- ✅ Complexity detection (high value, court date, shared care)
- ✅ Alert system (shows "Get Legal Help" buttons)
- ✅ Inquiry form (collects parent details)
- ✅ Analytics tracking (PostHog events)
- ✅ **Web app live at auschildsupport.com**

**Timeline:** Complete Dec 27, 2024

### Phase 2: READY TO START (Jan 2)
**Plan:**
- Onboard 8-12 lawyers via email outreach **with live demo**
- Deliver 50+ qualified leads
- Generate first revenue ($2-3K)
- Validate $50/lead pricing
- Build lawyer relationship management process

**New Strategy:** Lead with working product
- Email includes link to live calculator
- Lawyers can test it themselves immediately
- Demonstrates credibility and professionalism
- Shortens sales cycle (proof over promises)

**Timeline:** 6-8 weeks (Jan-Feb 2025)

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

### Implementation Guides
- **Phase 1:** `/guides/phase1/CHECKLIST.md`
- **Phase 2:** `/guides/phase2/CHECKLIST.md`
- **Christmas Plan:** `/CHRISTMAS_BREAK_PLAN.md`

### Strategy Docs
- **Pricing Analysis:** `/docs/PRICING_ANALYSIS_MANUAL_LEADS.md`
- **Design System:** `/docs/DESIGN_SYSTEM.md`
- **Claude Guide:** `/docs/CLAUDE.md`

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

**Dec 24-27:** Finish Phase 1 (special circumstances, testing)  
**Dec 28-31:** Prepare Phase 2 materials (agreements, templates, spreadsheets)  
**Jan 1:** Rest  
**Jan 2:** START Phase 2 (email first 50 lawyers)

---

**Questions? Check `/CHRISTMAS_BREAK_PLAN.md` for detailed action items.**
