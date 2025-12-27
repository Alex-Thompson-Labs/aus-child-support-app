# Business Model Canvas

## Australian Child Support Calculator (CSC)

**Last Updated:** December 27, 2024  
**Current Status:** Phase 2 - Ready for lawyer outreach  
**Website:** auschildsupport.com

---

### Key Partners
- **Family law firms** (primary customers - small firms, 1-10 lawyers)
- **Payment processors** (Stripe - for monthly invoicing)
- **Technology infrastructure** (Supabase database, Netlify hosting)
- **Family law associations** (potential marketing channels)
- **Legal directories** (FindLaw, LawPath - for lawyer discovery)

### Key Activities
- **Lead generation** (parent acquisition via SEO and organic traffic)
- **Quality control** (manual lead review via admin dashboard)
- **Lawyer partnerships** (onboarding and relationship management)
- **Calculator maintenance** (algorithm updates for annual rate changes)
- **Database management** (secure lead storage and handover)
- **Compliance** (Privacy Act 1988, consent tracking, audit trails)
- **Customer support** (lawyer onboarding, lead quality issues)

### Key Resources
- **Child support calculation engine** (Australian 2024-2025 formula)
- **Web application** (auschildsupport.com - React Native Web)
- **Supabase database** (encrypted lead storage, RLS policies, Sydney region)
- **Admin dashboard** (lead management, quality control, status tracking)
- **Complexity detection system** (high value, court dates, Change of Assessment)
- **Privacy policy and compliance** (Privacy Act 1988 compliant)
- **Lawyer contact database** (286 family law firms in Australia)
- **Email templates** (outreach, partnership agreement, lead forwarding)
- **Brand and domain** (auschildsupport.com, Alex Thompson persona)

### Value Propositions

**For Parents (End Users):**
- **Free calculator** - No cost to use, no signup required
- **Accuracy** - Based on current Australian 2024-2025 legal guidelines
- **Transparency** - Clear breakdown of calculations with explanations
- **Complexity detection** - Identifies when legal help may be needed
- **Change of Assessment guidance** - 10 official grounds explained
- **24/7 availability** - Instant results without appointments
- **Privacy-first** - Consent required, secure data handling

**For Lawyers (Paying Customers):**
- **Pre-qualified leads** - Parents who already know they need help
- **High-value cases** - Complexity detection filters for valuable matters
- **Cost-effective** - $50 per lead vs $200-300 for Google Ads
- **No upfront costs** - Pay per lead, not monthly retainers
- **Complete information** - Full calculation history and Change of Assessment reasons
- **Secure handover** - Professional, Privacy Act compliant lead delivery
- **Low risk** - Only pay for leads they want to pursue

### Customer Relationships

**With Parents (End Users):**
- Self-service calculator (no account required)
- Privacy-focused (minimal data collection until inquiry)
- Consent-based inquiry process
- Educational alerts (complexity explained)
- No ongoing relationship (one-time use)

**With Lawyers (Paying Customers):**
- Onboarding via LinkedIn and email outreach
- Partnership agreement (terms, pricing, expectations)
- Weekly check-ins (lead quality, feedback)
- Monthly invoicing via Stripe
- Quality guarantee (refunds for poor leads if needed)
- Teaser email workflow (lawyer approves before payment)
- Long-term retention (ongoing lead flow)

### Channels

**Parent Acquisition (Traffic):**
- SEO (organic Google search for "child support calculator Australia")
- Direct URL sharing (auschildsupport.com)
- Social media (potential future - parent forums)
- Word of mouth (future)

**Lawyer Acquisition (Sales):**
- LinkedIn outreach (Alex Thompson profile)
- Cold email (286 family law firms database)
- Legal directories (FindLaw, LawPath listings - future)
- Professional referrals (lawyer-to-lawyer - future)
- Content marketing (thought leadership - future)

### Customer Segments

**Primary: Family Law Firms (B2B)**
- Small firms (1-10 lawyers)
- Located in Australia
- Need consistent lead flow
- Willing to pay per lead
- Want pre-qualified, high-value cases

**Secondary: Parents (End Users - Not Monetized Directly)**
- Separating/divorcing parents
- Shared care arrangements
- High-income earners (complexity triggers)
- Court dates approaching
- Change of Assessment scenarios
- Need to understand support obligations/entitlements

**Future Potential:**
- Mediators (may purchase leads for mediation services)
- Legal aid organizations (bulk licensing)
- Government agencies (policy research)

### Cost Structure

**Fixed Costs (Monthly):**
- Domain hosting (Netlify - $0 on free tier, ~$20-50 if upgraded)
- Supabase database (Sydney region - $0 on free tier, ~$25/month if upgraded)
- Email service (Gmail - free, or GSuite ~$10/month)
- Virtual phone number (~$10/month - Hushed/Burner)

**Variable Costs:**
- Stripe payment processing (2.9% + 30¢ per transaction)
- Time for lead quality control (~5 min per lead = $5-10 labor cost)
- Time for lawyer relationship management (~30 min per lawyer per month)

**Growth/Marketing Costs:**
- LinkedIn outreach (time only, no paid ads initially)
- Email outreach (time only, Mailchimp free tier)
- SEO content creation (time only initially)
- Paid ads (future - Google Ads, Facebook - if needed)

**Total Monthly Operating Costs:** 
- Phase 2: ~$50-100/month (mostly free tier services)
- Phase 3: ~$200-500/month (upgraded services, some marketing)
- Phase 4: ~$500-1000/month (full marketing, potential VA for admin)

### Revenue Streams

**Primary Revenue: B2B Lead Generation**
- **$50 per qualified lead** (paid by lawyers)
- Manual lead review ensures quality
- Teaser email workflow (lawyer approves before paying)
- Monthly invoicing via Stripe
- Refund policy for poor quality leads

**Revenue Projections:**

*Phase 2 (Months 1-2):*
- 8-12 active lawyer partners
- 40-60 leads/month delivered
- **$2,000-3,000/month** ($24K-36K annual)

*Phase 3 (Months 3-6):*
- 20-30 active lawyer partners
- 100-150 leads/month delivered
- **$5,000-7,500/month** ($60K-90K annual)

*Phase 4 (Year 1):*
- 50+ active lawyer partners
- 200-300 leads/month delivered
- **$10,000-15,000/month** ($120K-180K annual)

**Future Revenue Streams (Not Implemented):**
- Premium calculator features (detailed reports)
- Professional licenses (bulk access for law firms)
- Subscription service (parents with ongoing changes)
- API access (integration with legal software)
- Educational courses (family law basics)
- Affiliate partnerships (financial planning, counseling)

---

## Implementation Notes

### Current Status (December 27, 2024)

**✅ COMPLETE:**
- Web app deployed at auschildsupport.com
- Calculator with 2024-2025 Australian formula
- Complexity detection (high value, court dates, Change of Assessment)
- Inquiry form with consent checkbox
- Supabase database (encrypted, RLS policies, Sydney region)
- Admin dashboard (lead management, quality control)
- Privacy policy (Privacy Act 1988 compliant)
- Email templates (outreach, partnership, lead forwarding)
- Lawyer contact database (286 firms)
- Tracking spreadsheets (partners and leads)

**⏳ IN PROGRESS:**
- Web app deployment finalization
- Privacy policy attachment to web app

**📋 NEXT STEPS:**
- Virtual phone number (next week)
- Stripe setup (before first billing)
- LinkedIn/email outreach to first 8-12 lawyers
- First revenue: January-February 2025

---

## Key Strategic Decisions

### Why Database-First Approach?
**Rejected:** Email-only lead routing  
**Chosen:** Supabase database with secure storage  
**Reason:** Privacy Act 1988 compliance requires audit trails, consent tracking, deletion capability, and secure data handling. Professional appearance matters for B2B.

### Why $50 Per Lead (Not Per Booking)?
**Rejected:** $100 per confirmed booking  
**Chosen:** $50 per qualified lead  
**Reason:** Avoids complex calendar integration, simpler tracking, market rate for legal leads, immediate launch capability, no disputes about "no-shows."

### Why Manual Lead Review?
**Rejected:** Automated lead routing  
**Chosen:** Manual quality control via admin dashboard  
**Reason:** Ensures lead quality, builds lawyer trust, prevents refunds, allows personalization, sustainable at <100 leads/month.

### Why Teaser Email Workflow?
**Process:** Send case summary → Lawyer confirms interest → Charge $50 → Send full details  
**Reason:** Lawyer can't contact parent for free, you maintain control, professional appearance, reduces disputes.

---

## Competitive Advantages

1. **Complexity Detection System**
   - Identifies high-value cases automatically
   - Change of Assessment feature (10 official grounds)
   - Better lead quality than generic contact forms

2. **Privacy-First Approach**
   - Full Privacy Act 1988 compliance
   - Professional appearance for lawyer partnerships
   - Audit trails and secure handover process

3. **Database Infrastructure**
   - Complete calculation history stored
   - Manual quality control before sending
   - Reduces lawyer risk of poor leads

4. **Low Barrier to Entry (Parents)**
   - Free calculator, no signup required
   - Higher conversion to inquiry vs paid tools

5. **Cost-Effective for Lawyers**
   - $50 per lead vs $200-300 Google Ads cost per click
   - Pre-qualified leads (parents already know they need help)
   - No monthly retainers or upfront costs

---

## Critical Success Factors

### Phase 2 (Months 1-2):
- **Lawyer acquisition:** Onboard 8-12 active partners
- **Lead quality:** <20% refund rate
- **Revenue validation:** $2,000+ per month
- **Relationship building:** Weekly check-ins, responsiveness

### Phase 3 (Months 3-6):
- **Scale partnerships:** 20-30 active lawyers
- **Traffic growth:** SEO ranking improvements
- **Lead volume:** 100+ leads per month
- **Profitability:** Revenue exceeds costs by 10x

### Long-term Success:
- **Lawyer retention:** Partners stay for 12+ months
- **Word-of-mouth growth:** Lawyers refer other lawyers
- **Brand recognition:** Known as go-to calculator in Australia
- **Expansion potential:** Add mediators, financial planners, counselors

---

## Risk Mitigation

| Risk | Likelihood | Mitigation Strategy | Status |
|------|------------|---------------------|--------|
| Lawyers won't pay $50/lead | Medium | Test with 3 lawyers first, adjust pricing | Ready to test |
| Lead quality too low | Medium | Manual review, tighten complexity triggers | ✅ Implemented |
| Insufficient app traffic | High | SEO focus, parent forum marketing | Ongoing |
| Privacy Act compliance issues | Low | ✅ Full compliance implemented | ✅ Complete |
| Lawyers ghost after 1-2 leads | Medium | Weekly check-ins, quality improvements | Process ready |
| Payment disputes | Low | Teaser email workflow, clear refund policy | ✅ Implemented |
