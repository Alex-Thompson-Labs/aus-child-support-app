# 6-8 Week Validation Plan: Proof Before Pitch (v2)

**Last Updated:** December 31, 2025

## Overview

This plan prioritizes **learning and proof-building** before lawyer outreach. The goal is to generate real parent inquiries, validate lead quality with 2-3 lawyers, and potentially secure one "Exclusive Partner" to fund Google Ads testing—all while spending $0 of your own money.

**Key Changes from v1:**

- Added "Exclusive Partner" parallel track (Marketing Retainer model)
- Refined lawyer targeting (small firms already running ads, not solo practitioners)
- Added property settlement wealth signal to COA reasons
- Removed ABN/business entity setup (premature)

---

## Week 1-2: Dual Launch - Organic Traffic + Exclusive Partner Outreach

**CRITICAL CHANGE: Start both tracks immediately. No reason to wait.**

### Track A: Generate Initial Organic Traffic (6-8 hours)

**Content Creation (3-4 hours):**

1. Write 3 targeted blog posts on auschildsupport.com:

   - "Child Support Calculator Australia: Estimate Your Payments in 60 Seconds"
   - "8 Situations Where Child Support Gets Complicated (And You Need Legal Help)"
   - "Child Support Formula Explained: Income, Care %, and Special Circumstances"

2. Answer 10-15 existing questions on these platforms:
   - Reddit: r/AusLegal, r/AusFinance (search "child support")
   - Whirlpool Forums: Relationships & Family Law section
   - Facebook: Join 3-5 Australian single parent groups

**Distribution Strategy (2-3 hours):**

1. Post calculator link on Reddit r/AusLegal as: "I built a free child support calculator - does this match your Services Australia estimate?" (Not promotional, genuinely asking for validation)
2. Answer Whirlpool threads from past 30 days mentioning child support calculations with: "I built a calculator that matches Services Australia's formula - happy to help you estimate"
3. In Facebook groups: Respond helpfully to posts asking about child support with calculator mention in comments (not standalone posts)

**SEO Quick Wins (1-2 hours):**

1. Submit sitemap to Google Search Console
2. Add Schema markup for Calculator (SoftwareApplication)
3. Create Google Business Profile for "Australian Child Support Calculator"
4. Get listed on Australian legal resource directories (free listings):
   - Lawpath resources section
   - LawAccess NSW community resources
   - Family Relationships Online

### Track B: Exclusive Partner Outreach (6-8 hours)

**PRIORITY TASK: This could eliminate need for your own ad spend entirely**

**Target Profile:**

- Family law firms with 3-10 lawyers
- Already running Google Ads (search "family lawyer [Melbourne/Sydney/Brisbane]" - note who's advertising)
- Located in major metro areas (Melbourne, Sydney, Brisbane)
- NOT premium CBD firms (they don't need help with leads)

**Research firms (2-3 hours):**

1. Google Search: "family lawyer Melbourne" → Identify 10-15 firms running ads
2. Visit their websites → Find partner or senior associate name
3. LinkedIn search: Confirm they're decision-makers
4. Document: Firm name, contact name, email, practice focus

**Send outreach emails (1 hour):**

Subject: Exclusive pilot: Pre-qualified child support leads for [Firm Name]

Hi [Name],

I've built a child support calculator (auschildsupport.com) that identifies complex cases requiring legal help. I'm looking for one firm in [City] to pilot an exclusive partnership.

**The Deal:**

- You pay a $500 Marketing Retainer (100% goes to ad spend)
- I spend this budget in **my** Google Ads account targeting **your** region (fully transparent reporting)
- I rebrand the calculator as "Powered by [Firm Name]" for your region
- All qualified child support leads in [City] go exclusively to you for 4 weeks via **Secure Magic Link**
- If it works, we discuss ongoing fees. If not, you've spent ad budget you'd spend anyway

**Why this works:**

- Zero risk beyond normal ad spend
- Exclusivity - competitors don't get the same leads
- You get a custom pre-qualification tool without building it

Open to a 15-min call to demo the calculator?

Sam
auschildsupport.com

**Send to 10-15 firms. Target: 2-4 responses requesting demos.**

**Demo calls (3-4 hours over 2 weeks):**

When they respond, schedule 15-min Zoom:

1. Screen share the calculator - show how complexity detection works
2. Explain CoA reasons = pre-qualification (filters out tire-kickers)
3. Walk through: Parent uses calculator → sees "complex" → fills inquiry form → goes to them
4. Show them that while you manage the ads, they get full transparency on spend/clicks.
5. Ask: "Would you be willing to pilot this for 4 weeks with a $500 marketing retainer?"

**Success metric: 1 firm agrees to pilot by end of Week 2**

### Combined Success Metrics (Both Tracks)

- **Track A:** 50-100 calculator sessions, 5-10 inquiry completions
- **Track B:** 2-4 demo calls scheduled, 1 firm interested in pilot
- At least one path showing traction

### Failure Signals

- **Track A:** Zero traffic after 2 weeks = content not reaching audience
- **Track B:** Zero responses to outreach = pitch wrong or targeting wrong firms
- Both tracks dead = need to rethink approach entirely

### Time Investment

**Total: 12-16 hours over 2 weeks**

- Track A: 6-8 hours (organic traffic)
- Track B: 6-8 hours (partner outreach and demos)

---

## Week 3-4: Execute Partner Pilot OR Refine Validation Path

**Decision point: This week's actions depend on Week 1-2 Exclusive Partner results**

### If Exclusive Partner Signed (Priority Path)

**Setup co-branded experience (3-4 hours):**

1. Create region-specific landing page variation:

   - Add "[Firm Name] Partner" badge to calculator header
   - Update inquiry form: "This referral goes to [Firm Name]"
   - Add firm's logo (get from their website or request)

2. Configure Google Ads (In YOUR Account):

   - Set daily budget: $15-20/day ($500 total / 30 days) from the retainer funds
   - Create 3-5 ad variations targeting "child support calculator australia"
   - Set up conversion tracking (inquiry form submissions)
   - Geographic targeting: 20km radius around their office

3. Test end-to-end flow:
   - Run test searches
   - Complete test inquiry
   - Verify firm receives **Secure Magic Link** email notification

**Ongoing management (2-3 hours/week):**

- Monitor ad performance daily
- Send weekly report to partner: spend, clicks, leads generated
- Forward all leads within 24 hours via Secure Magic Link with context (CoA reasons, income bracket, urgency)
- Track their feedback on lead quality

**Continue organic traffic efforts (4-5 hours):**

- Keep answering Reddit/forum questions
- Monitor early organic leads
- Use any organic leads for validation lawyers (if you found any in Week 1-2)

**Success metric: Partner ads running by end of Week 3, first leads flowing by Week 4**

---

### If No Exclusive Partner Yet (Validation Path)

**Verify property settlement feature (already implemented):**

The property settlement special circumstance is already implemented in `/src/utils/special-circumstances.ts`:

- ID: `property_settlement`
- Priority: 3 (high priority)
- Official codes: `['5.2.11']`
- Category: 'other'

**Why this matters:**

- Signals wealth (they have assets to divide)
- Signals active legal matter (already in the system)
- Signals urgency (settlement timelines)
- Official CoA Reason 5.2.11 (property settlements affecting capacity)

**Note:** This feature is already live in the calculator, no code changes needed.

**Find validation lawyers (8-10 hours):**

**Target: 2-3 lawyers willing to receive free leads for feedback**

**Where to find them:**

1.  Google "family lawyer \[Melbourne/Sydney\]" → firms running ads

2.  LinkedIn: Search those firms → Find partners or senior associates

3.  Law Society directories: Cross-reference firm size (3-10 lawyers)

**The Pitch (email):**

Subject: Quick feedback on child support lead quality?

Hi [Name],

I've built a child support calculator (auschildsupport.com) that's starting to generate parent inquiries in [City]. Before I scale this, I need to understand what actually makes a lead valuable to practitioners.

Would you be willing to receive 3-5 inquiries over the next few weeks (completely free) and give me honest feedback on whether they're worth your time? I'm specifically trying to learn:

- What information you need to evaluate a case quickly

- What distinguishes a serious inquiry from a tire-kicker

- Whether these convert to consultations

No strings attached - I'm in pure learning mode and happy to send referrals elsewhere if the quality isn't there.

Interested in helping? Happy to jump on a 10-min call to explain more.

Sam

**Send to 15-20 lawyers, expect 2-4 responses, need 2-3 to commit**

**Continue Exclusive Partner outreach (2-3 hours):**

- Send 5-10 more pitches to new firms

- Follow up with firms from Week 1-2 who didn't respond

- Goal: Still trying to land a partner even while validating organically

**Success Metrics:**

- Property settlement CoA reason deployed and visible in calculator

- 2-3 validation lawyers agree to receive free leads

- 15-20 inquiry form completions from organic traffic (cumulative from Week 1-4)

- 1+ Exclusive Partner demo call scheduled (still pursuing this path)

**Failure Signals:**

- <10 inquiries total after 4 weeks = organic won't scale, need paid ads

- Zero validation lawyers respond = pitch needs work

- Zero Exclusive Partner interest after 20+ outreach emails = wrong firms or offer not compelling

### Time Investment

- **If Partner Signed:** 9-12 hours (setup + management + organic)

- **If Validation Path:** 11-14 hours (code update + lawyer outreach + organic + continued partner pursuit)

---

## Week 5-6: Scale Whichever Path Is Working

**By now you know which experiment is working. Double down on that.**

### If Exclusive Partner Ads Running (Best Case Scenario)

**Optimize campaign performance (3-4 hours/week):**

- Review ad metrics: CTR, cost-per-click, conversion rate
- Pause underperforming ads, scale winners
- Adjust targeting if leads are coming from wrong geography
- A/B test ad copy variations

**Lead quality management (2-3 hours/week):**

- Forward all leads to partner within 24 hours via **Secure Magic Link**

- Track which CoA reasons correlate with partner's feedback

- Weekly check-in call: "Which leads converted? What made them good/bad?"

- Refine complexity detection based on partner's conversion patterns

**Document everything for proof package:**

- Leads generated per week

- Partner's consultation booking rate

- Partner's feedback quotes

- Cost per lead from their ads

**Continue organic traffic (2 hours/week):**

- Answer new Reddit/forum posts

- Any organic leads still go to partner (exclusivity agreement)

**Success metric: Partner books 2+ consultations from ads, wants to continue in February**

---

### If Validation Lawyer Path (No Partner Yet)

**Place free leads with validation lawyers (2-3 hours/week):**

Each high-quality lead comes in → send within 24 hours:

Hi [Lawyer],

New referral from the child support calculator:

**View Full Details:** [Secure Magic Link]
**Income Bracket:** [Band]
**Complexity Factors:** [List CoA reasons selected, highlight property settlement if checked]
**Situation:** "[Their free text description]"
**Urgency:** [Their selection]

**Why flagged as complex:** [Your 1-sentence assessment based on CoA reasons]

Let me know if this converts to a consultation - I'm tracking quality to improve the referral criteria.

Thanks, Sam

**Track in spreadsheet:**

- Date sent

- Lawyer name

- Lead details (CoA reasons, income, urgency)

- Lawyer feedback received (Y/N)

- Consultation booked (Y/N)

- Client retained (Y/N)

**Follow-up sequence per lead:**

1.  **Day 3:** "Did you contact \[Lead Name\]? Initial feedback on quality?"

2.  **Day 10:** "Did this convert to a consultation? If not, what was the issue?"

3.  **Day 30:** "If they consulted, did they retain you?"

**After each lawyer receives 3-5 leads, schedule 15-min call:**

1.  "Of the \[X\] leads I sent, how many were worth your time?"

2.  "What separated the good ones from bad ones?"

3.  "What information was missing that you needed?"

4.  "If paying $50/lead, what would make them worth it?"

5.  "What conversion rate would you need to justify buying leads?"

6.  "Would you pay for leads like \[specific good example\]?"

**Continue Exclusive Partner pursuit (2-3 hours/week):**

- Send 5 more pitches to new firms

- Follow up with previous demo calls

- If any firm shows interest, prioritize setup

**Success Metrics:**

- 10+ leads sent to validation lawyers

- 15%+ consultation rate (2-3 consultations from 10-15 leads)

- 1+ consultation converts to retained client

- Detailed feedback from 2-3 lawyers

- OR: Exclusive Partner finally signs (switch to that path)

**Failure Signals:**

- <5% consultation rate = leads are garbage, complexity filter broken

- Lawyers stop responding after first lead = quality worse than expected

- Lawyers say "fine but wouldn't pay" = business model fundamentally flawed

- Still zero Exclusive Partner interest = that path is dead

### Time Investment

- **If Partner Path:** 7-9 hours/week

- **If Validation Path:** 6-10 hours/week

---

## Week 7-8: Document Results + Execute Winning Path

### If Exclusive Partner Landed (Client-Funded Path)

**Execute client-funded pilot:**

1.  Set up co-branded calculator landing page (2-3 hours)

2.  Configure Google Ads with their budget ($500 cap)

3.  Send all leads exclusively to partner firm

4.  Track conversion weekly with partner

**Build proof package from pilot results (4-5 hours):**

- Document lead volume generated

- Track consultation and retention rates

- Collect testimonial from partner firm

- Use data to pitch additional firms in February

**This path = zero financial risk, real market validation**

### If No Exclusive Partner (Validation-Only Path)

**Data Analysis (3-4 hours)**

**Calculate these metrics from Experiment A:**

1.  Lead→Consultation rate: \[X\] consultations ÷ \[Y\] leads sent = Z%

2.  Consultation→Retained rate: \[X\] retained ÷ \[Y\] consultations = Z%

3.  Lead→Retained rate: \[X\] retained ÷ \[Y\] leads sent = Z%

4.  Average time to contact lead (from lawyer feedback)

5.  Most common CoA factors in converted leads

6.  Income correlation (do higher income leads convert better?)

**Identify patterns:**

- Which types of cases converted best?

- What information was most valuable to lawyers?

- What red flags predict non-conversion?

**Build Proof Package (4-5 hours)**

**Create one-page case study PDF:**

**Title:** "Child Support Calculator Lead Quality Report: 6-Week Trial Results"

**Contents:**

- Number of leads generated organically

- Number sent to family lawyers for evaluation

- Conversion metrics (lead→consult→retained rates)

- Sample lead profile (anonymized) with lawyer outcome

- Direct lawyer quotes: "\[Lawyer Name\], \[Firm\], \[City\]: 'The leads were well-qualified. I booked 2 consultations from 4 referrals, and retained 1 client worth $3,500 in fees.'"

- Cost comparison: "At 20% consultation rate, a $50 lead costs $250 per consultation. If 50% of consultations retain at $3,000 average, ROI = $500 per retained client."

**Get testimonial quotes from validation lawyers:**

Email: "Thanks for being part of the trial. Would you be comfortable with me using a quote from you when I approach other lawyers? Something like: '[Your feedback about lead quality]' - [Your Name], [Firm]"

Aim for 1-2 solid testimonials.

### Refine Lead Quality Criteria (2-3 hours)

Based on what actually converted:

1. Update CoA prompt emphasis based on conversion patterns
2. Document "ideal lead profile" for future filtering
3. Identify which CoA reasons correlate with lawyer conversion

### Create Lawyer Pitch Deck (3-4 hours)

**Only create this if validation succeeded (15%+ consultation rate)**

**Slide 1:** Problem - "Solo practitioners waste time on unqualified family law inquiries"

**Slide 2:** Solution - "Pre-qualified child support leads from parents actively seeking legal help"

**Slide 3:** How it works - "Free calculator→CoA complexity detection→qualified parent inquiries→sent to you within 24 hours via Secure Link"

**Slide 4:** Trial results - "[Your conversion metrics]"

**Slide 5:** Testimonials - "[Lawyer quotes]"

**Slide 6:** Pricing - "$50 per lead, no setup fees, cancel anytime" OR "$35 per lead based on conversion data"

**Slide 7:** Guarantee - "**100% Lead Credit.** If a lead is invalid or disconnected, I'll credit your account instantly and provide a replacement."

### Success Metrics

- **If Exclusive Partner:** Ads running, leads flowing, partner satisfied

- **If Validation Only:** 15%+ lead→consultation rate, 2 testimonials, clear ideal customer profile

- Understanding of whether $50/lead pricing is viable or needs adjustment

### Failure Signals

- <10% consultation rate = model doesn't work, leads too cold

- No lawyers willing to provide testimonial = they didn't find value

- Wide variance in conversion between lawyers = quality inconsistent

### Time Investment

12-15 hours total (less if Exclusive Partner path, more if building proof package)

---

## Traffic Reality Check: What's Achievable in 6 Weeks?

**Realistic organic traffic (zero budget):**

- Week 1-2: 30-80 sessions

- Week 3-4: 80-150 sessions (Reddit/forum posts gaining traction)

- Week 5-6: 100-200 sessions (SEO starting to kick in)

- Week 7-8: 150-250 sessions

**Total 6-week traffic: 500-800 sessions**

**Conversion to inquiry form: 2-4%**

- Low end: 500 × 2% = 10 inquiries

- High end: 800 × 4% = 32 inquiries

**Quality filter pass rate (CoA complexity): 40-60%**

- Low end: 10 × 40% = 4 qualified leads

- High end: 32 × 60% = 19 qualified leads

**Realistic outcome: 8-15 qualified leads to distribute**

This is enough to validate if you get 2-3 lawyers on board. Each receives 3-5 leads. If conversion is good, you have proof.

**If Exclusive Partner lands:** Their $500 ads budget generates additional 4-6 leads for them specifically (tracked in your analytics).

---

## When to Spend Your $1000-1500 Budget

**DO NOT spend on Google Ads in Weeks 1-8.**

**Only spend budget if:**

1.  Week 8 results show 15%+ consultation rate from organic leads

2.  You have 1-2 lawyer testimonials

3.  You've identified clear "qualified lead" criteria

4.  No Exclusive Partner materialized (otherwise they're funding ads)

**Then allocate in February:**

- $800-1000: Google Ads targeting "child support calculator Australia"

- $200-300: Freelance writer for 3-5 additional SEO blog posts

- $100-200: Paid listings on legal directories

**If Exclusive Partner works:** Don't spend your budget at all. Use their pilot data to sign more partners in February using the Retainer Model.

---

## Viability Thresholds

**Minimum conversion rates to justify business:**

**Lawyer's math:**

- Pays $50 per lead

- Needs 1 retained client per 5 leads to break even (assuming $3,000 avg case value, 50% profit margin)

- Therefore: 20% lead→retained rate required

**Your math:**

- Lead→consultation: 15% minimum (industry standard)

- Consultation→retained: 50% minimum (typical for family law)

- Combined: 15% × 50% = 7.5% lead→retained rate

**This doesn't work at $50/lead.** Lawyer needs 20%, you're delivering 7.5%.

**To hit viability:**

- Need 40% lead→consultation rate (very high, requires excellent CoA filtering) + 50% retained rate = 20% end-to-end

- Or lower pricing to $25-35 per lead to match 7.5% economics

**Be prepared to discover:**

- $50/lead is too expensive for the conversion rate you achieve

- You need to charge $25-35 to make economics work for lawyers

- Or you need performance pricing (only charge for consultations booked, not leads sent)

---

## Pivot Triggers

**If by Week 4:**

- <5 qualified leads captured → Paid ads required, organic won't scale fast enough

- Zero validation lawyers found → Pitch needs refinement or wrong audience

- Lawyers ghost after receiving first lead → Quality worse than expected

**If by Week 6:**

- <10% consultation rate → Lead quality filter broken or wrong cases

- Lawyers say "wouldn't pay for these" → Business model fundamentally flawed

- High consultation rate but zero retentions → Borderline cases lawyers can't help

- No Exclusive Partner interest after 10 pitches → Wrong firms or offer not compelling

**If by Week 8:**

- Can't get 2 testimonials → No proof to pitch other lawyers

- Conversion data shows unprofitable unit economics → Need to rethink pricing model

- Lawyers want to pay per consultation, not per lead → Different business model required (performance-based)

---

## What Success Looks Like

**End of Week 8, you have ONE of these outcomes:**

### Outcome A: Exclusive Partner Success

- 1 firm running pilot with their $500 retainer

- 4-10 leads sent to them from ads

- 1-2 consultations booked (proves concept)

- Partner willing to continue in February

- Zero dollars spent from your budget

- **You own the ad account data and pixel history**

### Outcome B: Validation Success (No Exclusive Partner)

- 8-15 leads sent to 2-3 validation lawyers

- 15-25% consultation rate (2-4 consultations booked)

- 1-2 retained clients across all lawyers

- 2 lawyer testimonials confirming lead quality

- Clear documentation of what makes a lead "qualified"

- One-page case study showing conversion metrics

- Understanding of whether $50/lead is viable or needs $25-35 pricing

**Either outcome is enough to:**

- Approach 10-15 new lawyers in February with credible data

- Spend $1000 on Google Ads with confidence (if Exclusive Partner didn't happen)

- Negotiate pricing based on actual conversion rates

- Avoid wasting money on a model that doesn't convert

---

## Key Differences from Original Plan

**What changed:**

1.  **Added Exclusive Partner track (Retainer Model)** - eliminates financial risk, retains data asset

2.  **Changed lawyer target** - small firms (3-10 lawyers) already running ads, not hungry solos

3.  **Added property settlement CoA reason** - captures wealth signal

4.  **Made budget spend conditional** - only if validation succeeds AND no partner funds it

5.  **Switched to Lead Credits** - protects cash flow vs cash refunds

**What stayed the same:**

- Organic traffic focus first

- Free lead placement for validation

- Detailed conversion tracking

- Building proof before pitching at scale

**This plan prioritizes learning over revenue. You make $0 in these 8 weeks. But you gain certainty about whether this business works AND potentially get a client to fund your ads testing.**

```

```
