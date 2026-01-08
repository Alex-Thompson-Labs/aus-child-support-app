# Product Roadmap

**Last Updated:** January 1, 2026
**Status:** Phase 1 & 2 COMPLETE, Phase 3A - Validation (January 2026)
**Website:** auschildsupport.com

---

## 🎯 Roadmap Overview

This roadmap outlines the product development plan from MVP through scale. Each phase is validated before proceeding to the next, following a "proof before pitch" approach.

**Core Principle:** Validate demand and prove model before scaling features or investment.

---

## 📊 Phase Summary

| Phase        | Timeline     | Status         | Focus                            | Revenue Target |
| ------------ | ------------ | -------------- | -------------------------------- | -------------- |
| **Phase 1**  | Oct-Dec 2025 | ✅ COMPLETE    | MVP Calculator + Lead Capture    | $0             |
| **Phase 2**  | Dec 2025     | ✅ COMPLETE    | Admin Dashboard + Infrastructure | $0             |
| **Phase 3A** | Jan 2026     | 🔄 IN PROGRESS | Validation (Proof Before Pitch)  | $0             |
| **Phase 3B** | Feb 2026     | ⏳ PENDING     | First Paying Lawyers             | $2-3K/month    |
| **Phase 4**  | Months 3-6   | ⏳ PLANNED     | Growth & Optimization            | $5-7.5K/month  |
| **Phase 5**  | Year 1       | ⏳ PLANNED     | Scale & Automation               | $10-15K/month  |
| **Phase 6+** | Year 2+      | 💡 IDEATION    | Advanced Features & Expansion    | $20K+/month    |

---

## ✅ Phase 1: MVP Calculator + Lead Capture (COMPLETE)

**Timeline:** October - December 2025  
**Status:** ✅ COMPLETE (Dec 27, 2025)

### Features Delivered

**Core Calculator**

- ✅ Australian 2024-2025 child support formula implementation
- ✅ Income input (ATI for both parents)
- ✅ Care arrangement input (percentage, period-based)
- ✅ Relevant dependents input (under 13, 13+)
- ✅ Real-time calculation (300ms debounce)
- ✅ Detailed breakdown display (simple + technical toggle)
- ✅ Multiple period views (annual, monthly, fortnightly, daily)

**Complexity Detection**

- ✅ High-value case detection (annual liability thresholds)
- ✅ Court date urgency detection
- ✅ Shared care dispute detection (35-65% care range)
- ✅ Change of Assessment reason identification
- ✅ Smart alert system ("Get Legal Help" CTAs)

**Lead Capture**

- ✅ Inquiry form (contact details, case summary)
- ✅ Change of Assessment reason selection (10 official grounds)
- ✅ Consent checkbox (Privacy Act compliance)
- ✅ Lead submission to Supabase database
- ✅ Encrypted lead storage with full calculation history

**Platform & Infrastructure**

- ✅ React Native Web (Expo) - deployed on Vercel
- ✅ Mobile-responsive design (touch-optimized)
- ✅ Web app live at auschildsupport.com
- ✅ Privacy policy published
- ✅ Analytics tracking (**Google Analytics + Vercel Analytics**)

### Success Metrics Achieved

- ✅ Calculator accuracy verified against official CSA calculator
- ✅ End-to-end testing complete (lead capture → database)
- ✅ Mobile responsiveness verified
- ✅ Privacy Act compliance verified

---

## ✅ Phase 2: Admin Dashboard + Infrastructure (COMPLETE)

**Timeline:** December 2025  
**Status:** ✅ COMPLETE (Dec 27, 2025)

### Features Delivered

**Admin Dashboard**

- ✅ Secure login (Supabase Auth, password-protected)
- ✅ Lead list view with search/filter
- ✅ Lead status management (new/reviewing/sent/converted/lost)
- ✅ Full lead details view (all calculation data)
- ✅ Lawyer assignment tracking
- ✅ Notes and timestamp tracking
- ✅ Mobile-optimized for on-the-go management

**Database & Security**

- ✅ Supabase database (Sydney region)
- ✅ Encrypted lead storage
- ✅ Row Level Security (RLS) policies
- ✅ Privacy Act 1988 compliance (consent tracking, audit trails)
- ✅ Data deletion capability (privacy rights)

**Automation**

- ✅ Make.com integration (lead notifications)
- ✅ Email notification system (admin alerts)
- ✅ Webhook integration with Supabase

**Business Setup**

- ✅ Domain registered (auschildsupport.com)
- ✅ Email setup (alex@auschildsupport.com)
- ✅ LinkedIn profile created
- ✅ Lawyer contact database (286 firms)

### Success Metrics Achieved

- ✅ Admin dashboard fully functional and tested
- ✅ Lead management workflow operational
- ✅ Privacy compliance verified
- ✅ Business infrastructure ready

---

## 🔄 Phase 3A: Validation (Proof Before Pitch)

**Timeline:** January 2026 (8 weeks)  
**Status:** 🔄 IN PROGRESS  
**Goal:** Prove lead quality before asking lawyers to pay  
**Revenue Target:** $0 (validation phase)

### Features in Progress

**Marketing & Traffic Generation**

- ⏳ Blog posts (child support topics, SEO-optimized)
- ⏳ Reddit/forum engagement (parenting, family law communities)
- ⏳ SEO optimization (long-tail keywords)
- ⏳ Content marketing strategy

**Exclusive Partner Program (Retainer Model)**

- ⏳ Co-branded calculator ("Powered by [Firm Name]")
- ⏳ Regional exclusivity setup
- ⏳ **Marketing Retainer Setup:** Platform manages Google Ads for partner
- ⏳ Partner onboarding workflow

**Technical Upgrades (Privacy)**

- ⏳ **Secure Magic Link Implementation:** Generate time-limited tokens for lead viewing
- ⏳ **Secure Portal View:** Read-only page for lawyers to view lead details
- ⏳ Email notification update (Remove PII from email body)

**Validation & Metrics**

- ⏳ Conversion tracking (Lead→Consultation rate)
- ⏳ Lawyer feedback collection
- ⏳ Testimonial collection system
- ⏳ Proof package creation (case studies, metrics)

**Business Setup (Remaining)**

- ⏳ Virtual phone number
- ⏳ Stripe setup (for Retainer invoicing)

### Success Metrics (Phase 3A)

**Minimum Success (Go Decision):**

- ✅ 50-100 calculator sessions (organic traffic)
- ✅ 8-15 qualified leads generated
- ✅ 1 Exclusive Partner signed OR 2-3 validation lawyers receiving free leads
- ✅ 15%+ consultation rate (from validation leads)
- ✅ 2 lawyer testimonials collected
- ✅ Proof package created (case study, conversion metrics)

**No-Go Decision (Delay Phase 3B):**

- ❌ <10% consultation rate → Adjust complexity filters, reconsider pricing

### Timeline

**Week 1-2: Dual Launch**

- Track A: Organic traffic (blog posts, Reddit, forums, SEO) - 6-8 hours
- Track B: Exclusive Partner outreach (pitch 10-15 firms) - 6-8 hours
- Goal: 1 Exclusive Partner OR 2-3 validation lawyers

**Week 3-4: Execute Path**

- If Exclusive Partner: Setup co-branded calculator, configure Google Ads (**Managed Account**)
- If no partner: Property settlement CoA reason already implemented - place free leads with validation lawyers

**Week 5-8: Scale & Document**

- Track conversion metrics (Lead→Consultation rate)
- Collect testimonials from validation partners
- Build proof package (case studies, conversion dashboard)
- Refine complexity detection thresholds based on feedback

### Dependencies

- ⏳ Phase 3A validation must succeed (15%+ consultation rate OR Exclusive Partner signed) before proceeding to Phase 3B

---

## ⏳ Phase 3B: First Paying Lawyers

**Timeline:** February 2026 (Month 2)  
**Status:** ⏳ PENDING (conditional on Phase 3A success)  
**Goal:** Generate first revenue with paying lawyers  
**Revenue Target:** $2,000-3,000/month

### Planned Features

**Payment Integration**

- ⏳ Stripe integration (payment processing)
- ⏳ Automated invoicing (monthly billing)
- ⏳ Payment webhooks (status updates)
- ⏳ **Lead Credit System:** Automated crediting for disputed leads

**Lawyer Onboarding**

- ⏳ Lawyer signup process
- ⏳ Terms of service acceptance (Privacy Agreement)
- ⏳ Payment method setup
- ⏳ Lawyer profile management

**Lead Routing Enhancements**

- ⏳ Manual lead routing (proven demand before automation)
- ⏳ Teaser email template system
- ⏳ Lead acceptance workflow (lawyer confirmation → payment)
- ⏳ **Secure Portal Scaling:** Robust access controls for multiple lawyers

**Quality Assurance**

- ⏳ Enhanced lead review process (30-second check)
- ⏳ Quality scoring improvements
- ⏳ **Dispute Resolution Workflow:** Managing credit requests
- ⏳ Lead quality feedback loop

**Analytics & Reporting**

- ⏳ Lawyer dashboard (lead history, conversion metrics)
- ⏳ Revenue tracking and reporting
- ⏳ Conversion rate analytics
- ⏳ Dispute rate monitoring

### Success Metrics (Phase 3B)

**Minimum Success:**

- ✅ 8+ active paying lawyers (using proof package from Phase 3A)
- ✅ 50+ leads delivered
- ✅ $2,000+ monthly revenue
- ✅ <20% dispute rate
- ✅ Lawyer NPS > 0

**Strong Success:**

- ✅ 12+ active paying lawyers
- ✅ 80+ leads delivered
- ✅ $3,000+ monthly revenue
- ✅ <10% dispute rate
- ✅ Lawyer NPS > 30
- ✅ Lawyers asking for MORE leads

### Dependencies

- ✅ Phase 3A validation succeeded (15%+ consultation rate OR Exclusive Partner signed)
- ⏳ Proof package created (case studies, testimonials, conversion metrics)
- ⏳ Stripe account setup

---

## ⏳ Phase 4: Growth & Optimization

**Timeline:** Months 3-6 (March - June 2026)  
**Status:** ⏳ PLANNED  
**Goal:** Scale to 20-30 lawyers, optimize conversion  
**Revenue Target:** $5,000-7,500/month

### Planned Features

**Traffic Scaling**

- ⏳ Enhanced SEO strategy (content expansion)
- ⏳ Social media presence (LinkedIn, Facebook)
- ⏳ Referral program (word-of-mouth)
- ⏳ **Managed Paid Ads:** Scaling the Retainer Model

**Calculator Enhancements**

- ⏳ Multi-year support (historical calculations if needed)
- ⏳ Scenario planning tool (compare different arrangements)
- ⏳ Export to PDF (calculation summary)
- ⏳ Share functionality (send to co-parent)

**Lead Quality Optimization**

- ⏳ Advanced complexity scoring (ML-based if volume justifies)
- ⏳ Lead segmentation (court date urgent, high-value, CoA)
- ⏳ Premium lead tiers ($75-100 for high-value cases)
- ⏳ Lead quality analytics dashboard

**Lawyer Features**

- ⏳ Lead preferences (case types, regions)
- ⏳ Lead volume controls (max leads per month)
- ⏳ Automated lead routing (if manual routing becomes bottleneck)
- ⏳ Lawyer analytics dashboard (conversion rates, ROI)

**Process Automation**

- ⏳ Automated teaser email sending (if volume justifies)
- ⏳ Automated lead handover (after payment confirmed)
- ⏳ Automated follow-up sequences
- ⏳ Monthly billing automation (refinement)

### Success Metrics (Phase 4)

**Target Metrics:**

- ✅ 20-30 active paying lawyers
- ✅ 100-150 leads/month
- ✅ $5,000-7,500/month revenue
- ✅ <15% dispute rate
- ✅ Lawyer NPS > 20
- ✅ 20%+ consultation rate (improved from Phase 3B)

### Dependencies

- ✅ Phase 3B successful (8+ lawyers, $2K+ revenue)
- ⏳ Proof of demand for automation (manual routing becoming bottleneck)

---

## ⏳ Phase 5: Scale & Automation

**Timeline:** Year 1 (Months 7-12, July - December 2026)  
**Status:** ⏳ PLANNED  
**Goal:** Scale to 50+ lawyers, automate operations  
**Revenue Target:** $10,000-15,000/month

### Planned Features

**Advanced Lead Routing**

- ⏳ Automated lead distribution (ML-based matching)
- ⏳ Geographic routing (by city/region)
- ⏳ Specialty routing (Change of Assessment experts, high-value case specialists)
- ⏳ Load balancing (fair distribution across lawyers)

**Premium Features**

- ⏳ Premium lead tiers ($75-100 for urgent/high-value cases)
- ⏳ Exclusive lead access (lawyer can pay premium for exclusive lead)
- ⏳ Lead volume guarantees (monthly packages)
- ⏳ White-label options (for large firms)

**Platform Enhancements**

- ⏳ Mobile apps (iOS + Android) - if web traffic justifies
- ⏳ Lawyer CRM integration (API for law firm systems)
- ⏳ Advanced analytics (conversion funnels, ROI tracking)
- ⏳ A/B testing framework (optimize conversion rates)

**Marketing & Growth**

- ⏳ **Platform-Wide Ads:** Platform funds ads from margin
- ⏳ Partnership programs (law school partnerships, legal associations)
- ⏳ Content marketing expansion (blog, guides, resources)
- ⏳ Referral program expansion

**Operations Automation**

- ⏳ Fully automated lead routing (manual review only for edge cases)
- ⏳ Automated quality assurance (ML-based scoring)
- ⏳ Automated billing and invoicing
- ⏳ Customer support automation (chatbot, FAQs)

### Success Metrics (Phase 5)

**Target Metrics:**

- ✅ 50+ active paying lawyers
- ✅ 200-300 leads/month
- ✅ $10,000-15,000/month revenue
- ✅ <12% dispute rate
- ✅ Lawyer NPS > 30
- ✅ 25%+ consultation rate
- ✅ Automated operations (90%+ leads processed automatically)

### Dependencies

- ✅ Phase 4 successful (20+ lawyers, $5K+ revenue)
- ⏳ Volume justifies automation (manual routing becoming bottleneck)
- ⏳ Proven demand for premium features

---

## 💡 Phase 6+: Advanced Features & Expansion

**Timeline:** Year 2+ (2027+)  
**Status:** 💡 IDEATION (future exploration)  
**Goal:** Expand market, advanced features  
**Revenue Target:** $20,000+/month

### Potential Features (Not Yet Validated)

**Market Expansion**

- 💡 Other Australian states/regions (if model proves scalable)
- 💡 Other legal areas (property settlement, divorce, etc.)
- 💡 International expansion (NZ, UK - similar legal systems)

**Advanced Features**

- 💡 AI-powered case analysis (predict outcomes, suggest strategies)
- 💡 Document generation (automated legal documents)
- 💡 Virtual consultations (integrated video calls)
- 💡 Payment processing (handle child support payments)

**Platform Evolution**

- 💡 Marketplace model (parents compare lawyers, lawyers bid on leads)
- 💡 Subscription model (lawyers pay monthly for lead access)
- 💡 SaaS model (white-label calculator for law firms)
- 💡 API platform (lawyers integrate calculator into their websites)

**Strategic Partnerships**

- 💡 Integration with legal software providers
- 💡 Partnership with legal aid organizations
- 💡 Educational partnerships (law schools, training providers)

### Dependencies

- ✅ Phase 5 successful (50+ lawyers, $10K+ revenue)
- ⏳ Market validation for expansion
- ⏳ Regulatory approval (if expanding to other areas)
- ⏳ Technical feasibility (advanced features)

---

## 🎯 Feature Prioritization Framework

### How We Decide What to Build

**Priority 1: Revenue-Enabling Features**

- Directly enables paying customers
- Examples: Payment integration, lawyer onboarding, **Secure Portal**

**Priority 2: Revenue-Increasing Features**

- Increases conversion rates or lead volume
- Examples: Traffic scaling, lead quality optimization, premium tiers

**Priority 3: Efficiency Features**

- Reduces operational overhead
- Examples: Automation, analytics, quality assurance

**Priority 4: Nice-to-Have Features**

- Enhances user experience but not critical
- Examples: Mobile apps, advanced analytics, export features

### Decision Criteria

**Build When:**

- ✅ Directly enables revenue (Phase 3B payment integration)
- ✅ Validated demand (lawyers asking for feature)
- ✅ Volume justifies automation (manual process becoming bottleneck)
- ✅ Competitive necessity (competitors have it, losing deals)

**Don't Build When:**

- ❌ No validated demand ("wouldn't it be cool if...")
- ❌ Volume doesn't justify it (automation for <10 leads/month)
- ❌ Delays revenue generation (nice-to-have that slows Phase 3B)
- ❌ Adds complexity without clear ROI

---

## 📈 Success Metrics by Phase

### Phase 3A (Validation)

- **Primary:** 15%+ consultation rate OR Exclusive Partner signed
- **Secondary:** 50-100 calculator sessions, 8-15 qualified leads
- **Go/No-Go:** Proceed to Phase 3B if primary metric achieved

### Phase 3B (First Revenue)

- **Primary:** $2,000+ monthly revenue, 8+ paying lawyers
- **Secondary:** <20% dispute rate, Lawyer NPS > 0
- **Go/No-Go:** Continue to Phase 4 if primary metrics achieved

### Phase 4 (Growth)

- **Primary:** $5,000+ monthly revenue, 20+ lawyers
- **Secondary:** <15% dispute rate, Lawyer NPS > 20, 20%+ consultation rate
- **Go/No-Go:** Continue to Phase 5 if primary metrics achieved

### Phase 5 (Scale)

- **Primary:** $10,000+ monthly revenue, 50+ lawyers
- **Secondary:** <12% dispute rate, Lawyer NPS > 30, 25%+ consultation rate, 90%+ automation
- **Go/No-Go:** Explore Phase 6+ if primary metrics achieved

---

## 🚨 Risk Mitigation

### Technical Risks

**Risk:** Platform can't handle scale  
**Mitigation:** Start with manual processes, automate only when volume justifies (proven demand first)

**Risk:** Lead quality degrades at scale  
**Mitigation:** Maintain manual review (30 seconds per lead) until volume forces automation, then ML-based scoring

**Risk:** Database costs increase significantly  
**Mitigation:** Monitor usage, optimize queries, upgrade tier only when necessary

### Business Risks

**Risk:** Not enough leads generated  
**Mitigation:** Dual-track approach (organic + Exclusive Partner), conditional paid ads only if ROI proven

**Risk:** Lawyers won't pay $50/lead  
**Mitigation:** Validation-first approach (free leads prove quality before asking lawyers to pay), adjust price based on feedback

**Risk:** Competition enters market  
**Mitigation:** First-mover advantage, focus on quality over speed, build network effects (more lawyers = more parents trust platform)

**Risk:** Privacy Act compliance issues
**Mitigation:** ✅ RESOLVED - **Secure Magic Link** architecture, database-first approach, audit trails, deletion capability

---

## 🔄 Review Process

### Monthly Reviews (Phases 3A-4)

- Review metrics vs targets
- Identify blockers and risks
- Adjust roadmap if needed
- Collect feedback from lawyers and parents

### Quarterly Reviews (Phase 5+)

- Strategic review (are we on track for year-end goals?)
- Feature prioritization (what should we build next?)
- Market analysis (competition, opportunities)
- Financial review (revenue, costs, profitability)

### Phase Transition Reviews

- Before proceeding to next phase, review:
  - Did we achieve success metrics?
  - Are dependencies met?
  - Is the market ready?
  - Do we have resources (time, money, capability)?

---

## 📞 Roadmap Contact

**Questions about the roadmap?**  
Email: alex@auschildsupport.com  
Website: auschildsupport.com

**Current Phase:** Phase 3A - Validation (January 2026)  
**Next Milestone:** Phase 3A validation complete → Phase 3B launch (February 2026)

---

**For related documentation:**

- `/docs/business-docs/BUSINESS_MODEL.md` - Business model and revenue projections
- `/docs/business-docs/BUSINESS_MODEL_CANVAS.md` - Business Model Canvas
- `/docs/business-docs/VALUE_PROPOSITION_CANVAS.md` - Value Proposition Canvas
- `/docs/business-docs/ONE_PAGER.md` - Executive summary
