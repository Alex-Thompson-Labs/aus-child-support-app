# Business Model Canvas

**Last Updated:** January 1, 2026
**Project:** Australian Child Support Calculator - B2B Lead Generation Platform
**Status:** Phase 3A - Proof Before Pitch (Validation Phase)

---

## Canvas Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BUSINESS MODEL CANVAS                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┬──────────────────────┬──────────────────────────────┐
│   KEY PARTNERS       │   KEY ACTIVITIES     │   KEY RESOURCES              │
├──────────────────────┼──────────────────────┼──────────────────────────────┤
│ • Family law firms   │ • Calculator         │ • Calculator web app         │
│   (lead buyers)      │   development &      │   (auschildsupport.com)      │
│                      │   maintenance        │                              │
│ • Supabase (database │ • Complexity         │ • Supabase database          │
│   infrastructure)    │   detection engine   │   (encrypted lead storage)   │
│                      │                      │                              │
│ • Make.com           │ • Lead qualification │ • Admin dashboard            │
│   (automation)       │   & validation       │   (lead management)          │
│                      │                      │                              │
│ • Stripe (payments)  │ • Secure Magic Link │ • Privacy policy &           │
│   (Phase 3B+)        │   generation         │   compliance framework       │
│                      │                      │                              │
│ • Google Ads         │ • Lawyer relationship│ • Domain & brand             │
│   (traffic -         │   management         │   (auschildsupport.com)      │
│   conditional)       │                      │                              │
│                      │ • Marketing & SEO    │ • Email infrastructure       │
│                      │   (organic traffic)  │   (alex@auschildsupport.com)│
│                      │                      │                              │
│                      │ • Lead quality       │ • Lawyer contact database    │
│                      │   assurance          │   (286 firms)                │
└──────────────────────┴──────────────────────┴──────────────────────────────┘

┌──────────────────────┬──────────────────────┬──────────────────────────────┐
│ VALUE PROPOSITIONS   │   CUSTOMER           │   CHANNELS                   │
│                      │   RELATIONSHIPS      │                              │
├──────────────────────┼──────────────────────┼──────────────────────────────┤
│ FOR PARENTS:         │ • Self-service       │ • Web app                    │
│                      │   calculator         │   (auschildsupport.com)      │
│ • Free, accurate     │   (no registration)  │                              │
│   child support      │                      │ • Organic search (SEO)       │
│   calculation        │ • Automated          │   (blog posts, content)      │
│                      │   complexity         │                              │
│ • Instant results    │   detection          │ • Blog chatbot widget        │
│                      │                      │   (blog.auschildsupport.com) │
│ • Privacy-first      │ • One-click lead     │                              │
│   (no data sold)     │   submission         │ • Social media (Reddit,      │
│                      │                      │   forums)                    │
│                      │                      │                              │
│                      │                      │ • Direct lawyer referrals    │
│                      │                      │   (if partner program)       │
│ FOR LAWYERS:         │ • Secure Portal      │                              │
│                      │   (Magic Link)       │ • Email outreach             │
│ • Pre-qualified,     │                      │   (LinkedIn, cold email)     │
│   warm leads         │ • Teaser email       │                              │
│                      │   workflow           │ • Partner co-branding        │
│ • $50 per qualified  │   (quality control)  │   (exclusive partner model)  │
│   lead (affordable)  │                      │                              │
│                      │                      │ • Admin dashboard            │
│ • Case complexity    │ • Manual lead        │   (for lawyer onboarding)    │
│   pre-identified     │   review (quality)   │                              │
│                      │                      │                              │
│ • High-value cases   │ • Monthly billing    │                              │
│   (court dates, CoA, │   (Stripe)           │                              │
│   shared care)       │                      │                              │
│                      │ • Responsive         │                              │
│ • Marketing Retainer │   support            │                              │
│   (We manage ads)    │                      │                              │
└──────────────────────┴──────────────────────┴──────────────────────────────┘

┌──────────────────────┬──────────────────────────────────────────────────────┐
│   COST STRUCTURE     │   REVENUE STREAMS                                    │
├──────────────────────┼──────────────────────────────────────────────────────┤
│ FIXED COSTS:         │ PRIMARY:                                             │
│                      │                                                      │
│ • Domain & hosting   │ • $50 per qualified lead (Phase 3B+)                │
│   (~$50/year)        │   - One-time payment per lead                       │
│                      │   - Charged when lawyer accepts teaser              │
│ • Supabase (free     │   - Monthly billing via Stripe                      │
│   tier initially)    │                                                      │
│                      │ REVENUE PROJECTIONS:                                 │
│ • Email service      │                                                      │
│   (minimal)          │ Phase 3A (Jan 2026): $0 (validation)                │
│                      │                                                      │
| VARIABLE COSTS:      │ Phase 3B (Feb 2026): $2,000-3,000/month             │
│                      │   - 8-12 lawyers                                     │
│ • Marketing Retainer │   - 50+ leads/month                                  │
│   Ad Spend           │                                                      │
│   (Client-Funded)    │ Phase 4 (Months 3-6): $5,000-7,500/month            │
│                      │   - 20-30 lawyers                                    │
│                      │   - 100-150 leads/month                              │
│ • Lead validation    │                                                      │
│   time (manual       │ Phase 5 (Year 1): $10,000-15,000/month              │
│   review ~30 sec)    │   - 50+ lawyers                                      │
│                      │   - 200-300 leads/month                              │
│ • Email automation   │                                                      │
│   (Make.com free     │ FUTURE POTENTIAL:                                    │
│   tier)              │                                                      │
│                      │ • Premium lead tiers (higher value = higher price)   │
│ OPERATIONAL COSTS:   │                                                      │
│                      │ • Marketing Retainers (Monthly recurring service     │
│ • Development time   │   fee)                                               │
│   (ongoing           │                                                      │
│   maintenance)       │ • Volume discounts for high-volume law firms         │
│                      │                                                      │
│ • Lawyer outreach &  │ RISK MITIGATION:                                     │
│   relationship       │                                                      │
│   management         │ • 100% Lead Credit if lead doesn't convert to        │
│                      │   consultation (Credit System vs Cash Refund)        │
│                      │ • Quality guarantee (manual review before sending)   │
│ • Legal compliance   │                                                      │
│   (Privacy Act)      │                                                      │
└──────────────────────┴──────────────────────────────────────────────────────┘
```

---

## Detailed Breakdown by Section

### 1. KEY PARTNERS

**Family Law Firms (Primary Customers)**

- Lead buyers: Small firms (3-10 lawyers) in major metro areas
- Exclusive partners (Phase 3A): Firms paying **$500 Marketing Retainer**
- Validation partners (Phase 3A): 2-3 firms receiving free leads for feedback
- Target: 286 firms in contact database

**Technology Partners**

- **Supabase**: Database infrastructure, encrypted storage, RLS policies, Privacy Act compliance
- **Make.com**: Automation workflow (lead notifications, email triggers)
- **Stripe**: Payment processing (Phase 3B+)
- **Google Ads**: Traffic generation (**Account Owned by Platform**, funded by Partners)

**Strategic Partners**

- Legal compliance advisors (Privacy Act expertise)
- Web hosting providers (Vercel for deployment)

---

### 2. KEY ACTIVITIES

**Product Development**

- Maintain and improve calculator accuracy (Australian 2024-2025 formula)
- Enhance complexity detection algorithms
- Build and maintain admin dashboard
- Ensure mobile responsiveness and accessibility (WCAG compliance)

**Lead Generation & Qualification**

- Complexity detection: Identify high-value cases (court dates, Change of Assessment, shared care disputes)
- Lead qualification: Manual review (30 seconds per lead) for quality assurance
- Alert system: Show "Get Legal Help" CTAs at optimal moments

**Lead Management**

- Secure lead storage (Supabase database with encryption)
- **Secure Magic Link Generation**: Creating time-limited access tokens for viewing leads
- Lead routing: Teaser email workflow → Lawyer acceptance → Secure Link delivery
- Status tracking: new/reviewing/sent/converted/lost
- Billing automation: Monthly Stripe invoicing

**Marketing & Growth**

- SEO content (blog posts targeting child support queries)
- Blog chatbot widget (pre-calculator funnel on blog.auschildsupport.com)
- Direct inquiry links embedded in blog content (bypass calculator, route to inquiry form)
- Organic traffic generation (Reddit, forums, social media)
- Lawyer outreach (LinkedIn, cold email campaigns)
- **Retainer Management**: Optimizing Google Ads campaigns for exclusive partners

**Compliance & Legal**

- Privacy policy maintenance (auschildsupport.com/privacy)
- Consent tracking (mandatory checkbox on inquiry form)
- Data rights management (access, correction, deletion)
- Audit trail maintenance

---

### 3. KEY RESOURCES

**Digital Assets**

- **Calculator web app**: auschildsupport.com (React Native Web, deployed on Vercel)
- **Admin dashboard**: Password-protected lead management system (`/admin/login`)
- **Supabase database**: Encrypted lead storage with full calculation history
- **Domain & brand**: auschildsupport.com, professional email (alex@auschildsupport.com)
- **Ad Account Pixel Data**: The audience data and conversion history in the Google Ads account (Key Asset)

**Data & Information**

- **Lawyer contact database**: 286 family law firms (target market)
- **Calculation algorithms**: Australian child support formula (2024-2025)
- **Complexity detection rules**: High-value case identification logic
- **Lead tracking spreadsheets**: Lawyer Partners + Lead Tracker

**Intellectual Property**

- Complexity detection methodology
- Lead qualification framework
- Privacy-compliant data handling processes

**Human Resources**

- Founder/Developer (full-time)
- Legal compliance knowledge (Privacy Act 1988)
- Marketing & outreach capability

**Technology Stack**

- Expo/React Native (cross-platform development)
- Supabase (database, auth, RLS)
- Make.com (automation)
- Stripe (payments)
- **Google Analytics + Vercel Analytics** (analytics tracking)

---

### 4. VALUE PROPOSITIONS

**FOR PARENTS (End Users):**

1. **Free, Accurate Calculation**

   - No cost, no registration required
   - Official Australian 2024-2025 child support formula
   - Instant results with detailed breakdown

2. **Privacy-First Approach**

   - No data sold to third parties
   - Encrypted storage
   - Privacy Act compliant
   - Clear consent mechanism

3. **Complexity Awareness**
   - Automatic detection of high-value cases
   - Educates parents on when legal help may be needed
   - Reduces risk of missing important legal considerations

**FOR LAWYERS (Paying Customers):**

1. **Pre-Qualified, Warm Leads**

   - Leads already identified as needing legal help
   - Complexity pre-identified (court dates, CoA, shared care)
   - Higher conversion probability than cold leads

2. **Affordable Pricing**

   - $50 per qualified lead (market rate)
   - Lower cost than traditional advertising
   - Only pay when you accept the lead

3. **Quality Assurance**

   - Manual review before sending (30 seconds per lead)
   - Teaser email workflow (see case summary before committing)
   - Case details included (full calculation history)

4. **Low Competition**

   - Niche market (Australian family law only)
   - Limited number of lawyer partners
   - Early mover advantage

5. **Risk-Free Trial** (Phase 3A)
   - Free leads for validation partners
   - **Marketing Retainer Model**: You fund the ads, we do the work (zero management fee for pilot)
   - Proof before pitch approach

---

### 5. CUSTOMER RELATIONSHIPS

**FOR PARENTS:**

- **Self-Service**: No registration required, instant results
- **Automated Complexity Detection**: System identifies when legal help may be needed
- **One-Click Lead Submission**: Simple inquiry form with consent checkbox
- **Privacy Assurance**: Clear privacy policy, encrypted data storage

**FOR LAWYERS:**

- **Teaser Email Workflow**:
  - Step 1: Receive case summary (without parent contact details)
  - Step 2: Accept if interested → Pay $50
  - Step 3: Receive full parent details via **Secure Magic Link**
- **Manual Lead Review**: 30-second quality check before sending
- **Responsive Support**: Email communication, admin dashboard access
- **Monthly Billing**: Automated Stripe invoicing
- **Lead Credit Guarantee**: 100% Credit if lead doesn't convert to consultation
- **Partnership Options**:
  - Exclusive partner: Co-branded calculator, **Marketing Retainer**
  - Validation partner: Free leads for feedback (Phase 3A)

---

### 6. CHANNELS

**Parent Acquisition (Lead Generation):**

1. **Web App (Primary)**

   - auschildsupport.com
   - Direct access via URL
   - Mobile-responsive design

2. **Organic Search (SEO)**

   - Blog posts targeting child support queries
   - Content marketing strategy
   - Long-tail keyword optimization

3. **Social Media & Forums**

   - Reddit posts (relevant subreddits)
   - Online forums (parenting, family law discussions)
   - Community engagement

4. **Partner Co-Branding** (Phase 3A - Exclusive Partner Model)
   - Co-branded calculator ("Powered by [Firm Name]")
   - **Managed Google Ads** direct traffic to calculator
   - Regional exclusivity

**Lawyer Acquisition (Customer Acquisition):**

1. **Direct Outreach**

   - LinkedIn connections
   - Cold email campaigns (286 firms in database)
   - Professional networking

2. **Partner Program**

   - Exclusive partner pitch (firm pays **$500 Marketing Retainer**)
   - Validation partner program (free leads)

3. **Admin Dashboard**

   - Lawyer onboarding interface
   - Lead management access
   - Billing portal

4. **Email Communication**
   - Teaser email workflow
   - **Secure Magic Link** delivery
   - Monthly billing notifications

---

### 7. CUSTOMER SEGMENTS

**PRIMARY SEGMENT: Family Law Firms (B2B)**

**Target Profile:**

- **Size**: Small to medium firms (3-10 lawyers)
- **Location**: Major Australian metro areas (Sydney, Melbourne, Brisbane, Perth, Adelaide)
- **Practice Focus**: Family law, child support, divorce
- **Pain Points**:
  - High cost of acquiring clients through traditional advertising
  - Difficulty finding qualified leads
  - Time-consuming client acquisition
- **Decision Makers**: Partners, senior lawyers, firm managers
- **Budget**: Can afford $50 per lead (ROI-driven decision)

**Market Size:**

- 286 firms in contact database
- Target: 50+ active partners by Year 1
- Goal: 20-30 lawyers by Months 3-6

**SECONDARY SEGMENT: Parents (End Users / Lead Generators)**

**Target Profile:**

- **Demographics**: Australian parents navigating child support
- **Situations**:
  - High-value cases (court dates, Change of Assessment)
  - Shared care disputes
  - Complex financial situations
  - Need for legal advice
- **Behavior**: Seeking free calculators online, researching child support
- **Pain Points**:
  - Confusing child support formulas
  - Need to understand legal implications
  - When to seek professional help
- **Value**: Free tool, complexity awareness, optional legal connection

**Market Size:**

- Entire Australian parent population dealing with child support
- Goal: 200-300 qualified leads/month by Year 1
- Traffic: 50-100 calculator sessions/month (Phase 3A validation)

---

### 8. COST STRUCTURE

**FIXED COSTS:**

1. **Domain & Hosting**

   - Domain: auschildsupport.com (~$15/year)
   - Hosting: Vercel
   - **Total: ~$50/year**

2. **Database & Infrastructure**

   - Supabase: Free tier (initially)
   - Future: ~$25/month if scale requires upgrade
   - **Total: $0-25/month**

3. **Email Service**
   - Minimal cost (basic email provider)
   - **Total: ~$5/month**

**VARIABLE COSTS:**

1. **Marketing Retainer Ad Spend** (Client-Funded)

   - Partner pays $500 Retainer
   - 100% of retainer goes to Google Ads
   - **Risk: $0** (Client funds the spend)

2. **Payment Processing**

   - Stripe: 2.9% + $0.30 per transaction
   - On $50 lead: ~$1.75 per transaction
   - **Total: ~3.5% of revenue**

3. **Automation Tools**
   - Make.com: Free tier initially
   - Future: ~$10-20/month if scale requires
   - **Total: $0-20/month**

**OPERATIONAL COSTS:**

1. **Development Time**

   - Ongoing maintenance and improvements
   - Estimated: 10-20 hours/month
   - **Cost: Time investment (founder)**

2. **Lead Validation Time**

   - Manual review: 30 seconds per lead
   - 200 leads/month = ~100 minutes
   - **Cost: Time investment**

3. **Lawyer Outreach & Relationship Management**

   - LinkedIn, email campaigns
   - Partner onboarding
   - Estimated: 10-15 hours/month
   - **Cost: Time investment**

4. **Legal Compliance**
   - Privacy Act compliance
   - Privacy policy updates
   - Data rights management
   - **Cost: Time investment**

**TOTAL MONTHLY COSTS:**

- **Phase 3A**: ~$5-10/month (minimal infrastructure)
- **Phase 3B+**: ~$50-100/month (as scale increases)
- **Primary Cost**: Founder time investment (not monetary)

**Break-Even Analysis:**

- At $50/lead, need 1-2 leads/month to cover infrastructure costs
- Break-even is very low due to minimal fixed costs
- Primary investment is time, not capital

---

### 9. REVENUE STREAMS

**PRIMARY REVENUE: Per-Lead Pricing**

**Model: $50 per Qualified Lead**

**Process:**

1. Parent submits inquiry (complex case detected)
2. Lead saved to database (encrypted)
3. Admin reviews lead (30-second quality check)
4. Teaser email sent to lawyer (case summary, no contact details)
5. Lawyer responds "YES" → Charged $50 via Stripe
6. Full parent details sent via **Secure Magic Link**
7. Lawyer contacts parent independently
8. Monthly billing via Stripe (aggregated invoicing)

**Revenue Projections:**

**Phase 3A (January 2026) - Validation**

- Revenue: **$0** (validation phase)
- Goal: Prove concept with free leads
- Success Metric: 15%+ consultation rate OR 1 exclusive partner signed

**Phase 3B (February 2026) - First Revenue**

- Revenue: **$2,000-3,000/month**
- Assumptions: 8-12 paying lawyers, 50+ leads/month
- **Prerequisite**: Phase 3A validation succeeded

**Phase 4 (Months 3-6)**

- Revenue: **$5,000-7,500/month**
- Assumptions: 20-30 lawyers, 100-150 leads/month

**Phase 5 (Year 1)**

- Revenue: **$10,000-15,000/month**
- Assumptions: 50+ lawyers, 200-300 leads/month

**FUTURE REVENUE STREAMS:**

1. **Premium Lead Tiers** (Future)

   - Higher-value cases = Higher price ($75-100)
   - Court date urgent cases
   - High-income cases

2. **Marketing Retainers** (If model succeeds)

   - Monthly recurring service fee for managing ads
   - Regional exclusivity
   - Guaranteed lead volume

3. **Volume Discounts** (Future)

   - High-volume law firms (20+ leads/month)
   - Tiered pricing structure

4. **Add-On Services** (Future)
   - Lead analytics dashboard
   - Automated follow-up sequences
   - Integration with law firm CRMs

**RISK MITIGATION:**

- **100% Lead Credit**: If lead doesn't convert to consultation, lawyer gets a credit (keeps cash in system)
- **Quality Guarantee**: Manual review before sending (reduces bad leads)
- **Teaser Workflow**: Lawyer sees case summary before paying (reduces buyer's remorse)

---

## Key Success Metrics

### Phase 3A Validation (January 2026)

**Minimum Success:**

- 50-100 calculator sessions (organic traffic)
- 8-15 qualified leads generated
- 1 Exclusive Partner signed OR 2-3 validation lawyers receiving free leads
- 15%+ consultation rate (from validation leads)
- 2 lawyer testimonials collected
- Proof package created (case study, conversion metrics)
- Revenue: $0 (validation phase)

**Go/No-Go Decision:**

- If 15%+ consultation rate OR Exclusive Partner signed → Proceed to Phase 3B
- If <10% consultation rate → Adjust complexity filters, reconsider pricing, delay Phase 3B

### Phase 3B First Revenue (February 2026)

**Minimum Success:**

- 8+ active paying lawyers (using proof package)
- 50+ leads delivered
- $2,000+ monthly revenue
- <20% dispute rate
- Lawyer NPS > 0

**Strong Success:**

- 12+ active paying lawyers
- 80+ leads delivered
- $3,000+ monthly revenue
- <10% dispute rate
- Lawyer NPS > 30
- Lawyers asking for MORE leads

---

## Key Risks & Mitigations

| Risk                                        | Impact | Mitigation                                                                                                      |
| ------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| Validation fails (<10% consultation rate)   | High   | Validation-first approach (test with free leads before asking lawyers to pay)                                   |
| No Exclusive Partner interest               | Medium | Continue validation path with free leads, use organic leads for proof                                           |
| Lawyers won't pay $50/lead (Phase 3B)       | High   | Use proof package from Phase 3A, adjust price based on validation data ($25-35 if needed)                       |
| Lead quality too low (high refund rate)     | High   | Manual review before sending, tighten complexity thresholds, validate with free leads first                     |
| Not enough app traffic (insufficient leads) | Medium | Organic traffic generation, Exclusive Partner ads (if signed), conditional paid ads only if validation succeeds |
| Lawyers ghost after 1-2 leads               | Medium | Weekly check-ins, improve lead quality, validation reduces this risk (prove quality first)                      |
| Privacy Act compliance issues               | High   | ✅ RESOLVED - Database with proper consent, privacy policy, audit trails, deletion capability                   |

---

## Next Steps

### Phase 3A - Validation (January 2026)

**Week 1-2: Dual Launch**

- **Track A**: Organic traffic (blog posts with inline CTAs + chatbot widget, Reddit, forums, SEO) - 6-8 hours
- **Track B**: Exclusive Partner outreach (pitch 10-15 firms) - 6-8 hours
- Goal: 1 Exclusive Partner OR 2-3 validation lawyers

**Week 3-4: Execute Path**

- If Exclusive Partner: Setup co-branded calculator, configure Google Ads (**Managed Account**)
- If no partner: Add property settlement CoA reason, place free leads with validation lawyers

**Week 5-8: Scale & Document**

- Track conversion metrics, collect testimonials, build proof package
- Revenue target: $0 (validation phase)

### Phase 3B - First Revenue (February 2026)

_Only proceed if Phase 3A validation succeeded_

- Use proof package to sign 8-12 paying lawyers
- Deliver 50+ leads, generate first revenue ($2-3K)

---

**For current tasks, see:** `/docs/business-docs/BUSINESS_MODEL.md`
