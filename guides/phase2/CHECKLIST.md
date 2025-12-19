# Phase 2: Pilot Program - Quick Checklist

**Duration:** 10 weeks  
**Goal:** 2-3 pilot firms, >20% consultation rate

---

## 🎯 PRE-START DECISIONS

- [ ] Choose target city: ________________
- [ ] Choose routing strategy: First-Come-First-Served ✅
- [ ] Set up tracking spreadsheet template
- [ ] Prepare cold email template

---

## WEEK 1-2: LAWYER RECRUITMENT (12 hours)

### Identify Target Firms (3 hours)
- [ ] Google search: "family lawyer [city]"
- [ ] Check Law Society directory
- [ ] Review Google ratings (4+ stars)
- [ ] Create spreadsheet with 10 firms
- [ ] Find contact info for each

### Cold Outreach (5 hours)- [ ] Customize email template for each firm
- [ ] Send 5 emails (Monday-Wednesday)
- [ ] Send 5 more emails (Thursday-Friday)
- [ ] Track responses in spreadsheet

### Phone Follow-Ups (4 hours)
- [ ] Call firms 3-4 days after email
- [ ] Use script from guide
- [ ] Schedule onboarding calls
- [ ] Goal: 2-3 firms signed by end of Week 2

**✅ Success:** 2-3 pilot firms committed

---

## WEEK 3-4: BUILD INFRASTRUCTURE (8 hours)

### Lead Brief System (2 hours)
- [ ] Create `src/utils/lead-brief-generator.ts`
- [ ] Implement `generateLeadBrief()` function
- [ ] Test with sample calculation data
- [ ] Send sample brief to yourself
- [ ] Show sample to pilot firms for feedback

### Email Forwarding (2 hours)
- [ ] Set up manual forwarding process
- [ ] Create forwarding email template
- [ ] Test: submit form → receive email → forward to firm
- [ ] Document process in notes

### Tracking System (2 hours)
- [ ] Create Google Sheet with tabs: Lead Tracker, Firm Performance, Weekly Stats- [ ] Set up formulas for conversion rates
- [ ] Share with pilot firms (view-only)

### End-to-End Test (1 hour)
- [ ] Submit test inquiry form
- [ ] Verify lead brief generates correctly
- [ ] Forward to pilot firm
- [ ] Update tracking sheet
- [ ] Confirm everything works

**✅ Success:** Can route leads to firms reliably

---

## WEEK 5-8: PILOT EXECUTION (10 hours)

### Weekly Rhythm (2.5 hours/week × 4 weeks)

**Every Monday:**
- [ ] Review leads from previous week
- [ ] Update tracking spreadsheet
- [ ] Calculate weekly stats

**Every Friday:**
- [ ] Send check-in email to each pilot firm
- [ ] Ask for status updates on leads
- [ ] Document feedback
- [ ] Make notes for next week's adjustments

### Iteration (1 hour/week × 4 weeks)
- [ ] Week 5: Monitor which triggers work best
- [ ] Week 6: Adjust thresholds based on feedback
- [ ] Week 7: Test adjusted triggers
- [ ] Week 8: Finalize optimal settings

**✅ Success:** 30+ leads sent, feedback collected
---

## WEEK 9-10: PILOT REVIEW (5 hours)

### Calculate Metrics (2 hours)
- [ ] Total leads generated
- [ ] Consultation booking rate (target: >20%)
- [ ] Client conversion rate (target: >5%)
- [ ] Avg response time from lawyers
- [ ] Lead quality ratings from lawyers
- [ ] Revenue generated for firms

### Create Presentation (2 hours)
- [ ] Build deck with pilot results
- [ ] Include lawyer testimonials/quotes
- [ ] Show conversion rates
- [ ] Calculate revenue generated
- [ ] Present pricing proposal

### Review Meetings (1 hour each firm)
- [ ] Schedule calls with each pilot firm
- [ ] Present results deck
- [ ] Discuss paid partnership
- [ ] Get pricing feedback
- [ ] Ask: "Would you continue?"

### Decision Point (30 min)
- [ ] Review all feedback
- [ ] Calculate business viability
- [ ] Decide: GO to Phase 3 or PIVOT?
- [ ] Document decision reasoning

**✅ Success:** 1+ firm wants to pay, positive feedback

---

## 📊 KEY METRICS TO TRACK

- Leads per week: _____
- Consultation rate: ____% (target: >20%)
- Client conversion: ____% (target: >5%)
---

## ✅ PHASE 2 SUCCESS CRITERIA

- [ ] 2+ pilot firms completed 3 months
- [ ] 30+ total leads delivered
- [ ] >20% consultation booking rate
- [ ] >5% client conversion rate
- [ ] 1+ firm says "I'd pay for this"
- [ ] Positive feedback on lead quality
- [ ] Clear path to monetization

---

## 🎯 IMMEDIATE NEXT ACTION

**Right now, do this:**

1. [ ] Choose your target city: ________________
2. [ ] Open Google and search "family lawyer [city]"
3. [ ] Create spreadsheet with first 5 firms
4. [ ] Customize email template
5. [ ] Send first email TODAY

**Don't overthink it. Just start.** 🚀

---

See IMPLEMENTATION_GUIDE.md for detailed instructions, email templates, and scripts.


---

## 📧 EMAIL TEMPLATES

### Cold Email Template

```
Subject: Free Family Law Leads in [City] - 3 Month Pilot

Hi [First Name],

I'm Sam, creator of the Child Support Calculator app launching next month in [City].

THE OPPORTUNITY:
We help parents calculate child support. When we detect complex cases 
(high-value, special circumstances), we connect them with local family lawyers.

I'm running a 3-month pilot with 2-3 firms in [City] and I'd like to send 
you qualified leads for FREE.

WHY THIS WORKS:
✓ Pre-qualified: Users calculated their case (income, care details)
✓ High-intent: They clicked "Get Legal Help" - not cold traffic
✓ Complete data: Full calculation brief upfront (saves your time)
✓ No cost: Free pilot, no contracts, no obligation

WHAT I NEED FROM YOU:
• Accept leads via email (simple forwarding for now)
• 15-minute weekly check-ins to discuss lead quality
• Track which leads convert to consultations/clients
• After 3 months, discuss paid partnership if successful

PILOT EXPECTATIONS:
• 5-15 leads per month (based on current app usage)
• Complexity score 2-5 stars (pre-screened)
• Average case value: $15,000-30,000 annual liability

NO RISK. NO COST. Just qualified leads delivered to your inbox.

Interested? Reply and I'll send you a sample lead brief.

Best regards,
Sam
[Your phone/email]
```


### Phone Follow-Up Script

```
"Hi [Name], it's Sam from Child Support Calculator. 
I sent you an email last week about our pilot program. 
Did you get a chance to look at it?"

[If yes, interested]
"Great! Let me send you a sample lead brief so you can see 
what you'd receive. Can we schedule a 15-minute call this 
week to discuss?"

[If yes, but skeptical]
"I totally understand - you probably get lots of these offers. 
What makes this different is we're giving you leads for FREE 
for 3 months. No contracts, no risk. If the quality is bad, 
you can drop out anytime. Would you be open to trying one 
or two leads?"

[If no/busy]
"No worries! Can I follow up with you in a month when the 
app launches?"
```

### Weekly Check-In Email

```
Subject: Weekly Pilot Check-In - Week [N]

Hi [Lawyer Name],

Quick update on this week's leads:

LEADS SENT:
• Lead #[X]: [Name], $[amount] liability
  Status: _______________
  
• Lead #[Y]: [Name], $[amount] liability
  Status: _______________

QUESTIONS:
1. Have you contacted these leads?
2. Any consultations booked?
3. Quality feedback?
4. What can we improve?

YOUR STATS:
• Total leads: [N]
• Consultation rate: [X]%
• Signed clients: [N]

Reply with updates when you can!

Thanks,
Sam
```


---

## 📊 GOOGLE SHEETS TRACKING TEMPLATE

### Sheet 1: Lead Tracker

| Lead ID | Date | Name | Email | Phone | Postcode | Annual $ | Complexity | Firm | Status | Updated | Notes |
|---------|------|------|-------|-------|----------|----------|------------|------|--------|---------|-------|
| LEAD001 | Dec 20 | John S. | john@... | 04... | 3000 | $18,450 | 4/5 | Firm A | Consultation booked | Dec 23 | Fast response |

**Status values:**
- Lead sent
- Contacted by lawyer
- Consultation booked
- Consultation completed
- Client signed
- Not interested
- No response

### Sheet 2: Firm Performance

| Firm Name | Leads | Contacted | Consultations | Clients | Consult Rate | Convert Rate |
|-----------|-------|-----------|---------------|---------|--------------|--------------|
| Firm A | 8 | 6 | 4 | 1 | 50% | 12.5% |

**Formulas:**
- Consultation Rate = Consultations / Leads Received
- Conversion Rate = Clients Signed / Leads Received

### Sheet 3: Weekly Summary

| Week | Leads Sent | New Consultations | New Clients | Total Revenue Generated |
|------|------------|-------------------|-------------|------------------------|
| 1 | 5 | 1 | 0 | $0 |
| 2 | 8 | 2 | 1 | $3,500 |


---

## 🎤 PILOT REVIEW PRESENTATION OUTLINE

### Slide 1: Pilot Overview
- Duration: [Start date] - [End date]
- Firms in pilot: [N]
- Total leads delivered: [N]

### Slide 2: Your Results ([Firm Name])
- Leads received: [N]
- Consultations booked: [N] ([X]%)
- Clients signed: [N] ([Y]%)
- Revenue from these clients: ~$[X],000

### Slide 3: What You Told Us
[Quote 1 from lawyer]
[Quote 2 from lawyer]

### Slide 4: What We Learned
- High-variance cases convert best ([X]%)
- Court date urgency gets fastest response ([N] hours avg)
- Lead briefs save you [N] minutes per inquiry

### Slide 5: Next Steps - Pricing Proposal

**The Future Model (Phase 3+):**
- **Pay-Per-Consultation-Booked:** $100 per confirmed booking
- Users select time slot on your calendar
- Platform handles scheduling, verification (OTP), booking confirmation
- You only pay for confirmed appointments (not raw leads)
- ROI: $100 fee vs $400/hour consultation rate = 4:1 minimum
- No "bad lead" disputes - calendar booking = verified intent

**Why This Model (vs Pay-Per-Lead):**
- ✅ Regulatory safe: "Marketing fee" not "referral commission"
- ✅ No scheduling friction: Meeting already booked on your calendar
- ✅ Higher quality: Users who book appointments have verified intent
- ✅ Fraud prevention: OTP verification, booking deposits eliminate no-shows

**Evolution to Hybrid (Phase 4+):**
- Premium Partner: $149/month subscription + $50 per booking (50% discount)
- Pay-As-You-Go: $100 per booking (no monthly fee)

Would you continue at $100 per booked consultation?


---

## 🚨 TROUBLESHOOTING

### Problem: Can't find lawyers to contact
**Solution:**
- Google "[city] law society directory"
- LinkedIn search: "family lawyer [city]"
- Check lawyers.com.au
- Ask in local business networking groups

### Problem: No email responses (0/10)
**Solution:**
- Follow up with phone calls (3-4 days after email)
- Try different subject lines
- Send on Tuesday mornings (best open rates)
- Make email shorter, more direct

### Problem: Lawyers say "too busy"
**Solution:**
- Emphasize "no work required" - just receive emails
- Offer to call them instead of asking for meetings
- Reduce commitment to 1 month trial

### Problem: Low lead quality (lawyers complaining)
**Solution:**
- Ask: "What specific data would make leads better?"
- Adjust complexity thresholds in app
- Add more qualifying questions to inquiry form
- Interview users to understand their needs better

### Problem: No consultations after 30 leads
**Solution:**
- Ask lawyers: "Why aren't these converting?"
- Review what triggers are firing most
- May need to target different lawyer types
- Consider if leads are actually reaching decision-makers

### Problem: Can't generate enough app users
**Solution:**
- Post in more Australian parenting forums
- Reddit: r/AusFinance, r/AusLegal
- Facebook groups for single parents
- Consider small paid ads ($50-100)


---

## 📝 DECISION FRAMEWORK (End of Week 10)

### GO TO PHASE 3 IF:
- ✅ At least 1 pilot firm wants to pay
- ✅ Consultation rate >15% (even if conversion is low)
- ✅ Lawyers gave positive feedback
- ✅ You have ideas to improve lead quality
- ✅ Generated at least 30 leads total

**Next:** Build automated routing, implement billing, scale to 10+ firms

---

### ITERATE PHASE 2 (1-2 more months) IF:
- ⚠️ Some validation but needs work
- ⚠️ Consultation rate 10-15%
- ⚠️ Mixed feedback from lawyers
- ⚠️ Only 15-25 leads generated

**Next:** Adjust triggers, extend pilot, improve quality

---

### PIVOT IF:
- ❌ Zero consultations after 60 leads
- ❌ All lawyers say "not interested in paying"
- ❌ Consultation rate <10%
- ❌ Can't generate enough app users

**Consider:**
- Different lawyer types (divorce vs custody specialists)
- B2C subscription model instead
- White-label for law firms
- Partner with existing legal services

---

### SHUTDOWN IF:
- ❌ No path to monetization
- ❌ Fundamentally broken model
- ❌ Better opportunities elsewhere

**That's OK!** You learned valuable skills and validated what DOESN'T work.


---

## 📧 BULK RECRUITMENT EMAIL TEMPLATE

### Subject Line Options (Pick One):
1. "Free Family Law Leads - Child Support Cases in [City]"
2. "Pre-Qualified Child Support Leads for [City] Family Lawyers"
3. "New Lead Generation Opportunity - Family Law (3 Month Free Trial)"

### Email Body:

```
Subject: Free Family Law Leads - Child Support Cases in [City]

Hi [Firm Name] Team,

I'm Sam, creator of the Child Support Calculator app launching in January 2025.

THE OPPORTUNITY:
Parents use our app to calculate child support payments. When we detect 
complex cases (high-value disputes, special circumstances, court dates), 
we connect them with local family lawyers.

I'm offering a 3-month free trial to select [City] firms.

WHAT YOU GET:
✓ Pre-qualified leads with full calculation data
✓ High-intent clients (they requested legal help)
✓ Complete brief: income, care arrangement, complexity flags
✓ Geographic targeting (only [City] cases)

WHAT IT COSTS:
• FREE for 3 months (no payment, no contracts)
• After trial: $100 per booked consultation (Pay-Per-Consultation-Booked model)
• Your choice whether to continue after trial

HOW IT WORKS:
1. You reply with interest → I add you to our system
2. When a lead comes in from [City], you get an email
3. You contact the client (or don't - your choice)
4. No obligations, cancel anytime

EXPECTED VOLUME:
• 5-15 leads per month during trial (varies by demand)
• Average case value: $15,000-30,000 annual liability
• Complexity-screened (high-value cases only)

TIME COMMITMENT:
• Sign up: 1 minute (reply to this email)
• Per lead: 5-10 minutes to review brief + contact client
• No meetings, no onboarding calls, no hassle

NEXT STEP:
Reply with:
- Your preferred contact email
- Your phone number (optional)
- Confirm you service [City] area

That's it! First leads arrive in mid-January.

Questions? Just reply to this email.

Best regards,
Sam McDougal
Child Support Calculator
[Your phone]
[Your email]

P.S. Limited to 3 firms per city. First-come-first-served.
```

---

## 💰 PRICING & REVENUE MODEL

### Phase 1-2: FREE PILOT (3 months)
**Price:** $0
**Why:** Validating booking demand and lawyer conversion rates
**What we're testing:**
- Will lawyers pay $100 per booked consultation? (Phase 3+)
- What's the booking completion rate? (target: >40%)
- What's the consultation → client conversion rate? (target: >20%)
- What data do lawyers need in the booking brief?

### Phase 3: PAID MODEL - Pay-Per-Consultation-Booked

**CHOSEN MODEL:** Pay-Per-Consultation-Booked (Option 3 from PRICING_STRATEGY_ANALYSIS.md)

**How It Works:**
```
User completes calculation
    ↓
Triggers "Get Legal Help" button
    ↓
Submits inquiry form (with OTP verification)
    ↓
Selects time slot on lawyer's calendar (Calendly/Google Calendar integration)
    ↓
Booking confirmed → Lawyer charged $100
    ↓
Lawyer receives email with booking brief + calendar invite
    ↓
Consultation occurs (lawyer bills $400/hour)
```

**Pricing:**
- **$100 per confirmed consultation booking**
- Charged when: User selects time slot AND confirms via OTP verification
- NOT charged per lead, per conversation, or per client signed

**Why This Model (vs Pay-Per-Lead):**

1. **Regulatory Compliance:**
   - Classified as "marketing and administrative fee" (NOT "referral commission")
   - Simplified disclosure: "We use a booking platform that charges us an administrative fee"
   - ASCR Rule 12.4.3 compliant (no referral fee disclosure burden)
   - Fee-sharing prohibition NOT triggered

2. **Fraud Prevention:**
   - Booked calendar slots = verified intent (vs bot-filled forms)
   - Mobile OTP verification prevents fake submissions
   - Honeypot fields catch automated bots
   - Optional: $20-50 user booking deposit (refundable) eliminates no-shows

3. **Lawyer Value:**
   - Confirmed meetings save 15-30 minutes of "phone tag" per lead
   - Platform handles scheduling friction = immediate administrative ROI
   - $100 fee vs $400/hour billable rate = 4:1 minimum ROI
   - No "bad lead" disputes (calendar API logs = proof of delivery)

4. **Quality Over Quantity:**
   - Higher price point ($100 vs $50) justifies lower volume
   - Focus on high-intent users who complete booking (not just form submissions)
   - Lawyers prefer 10 quality bookings over 30 unvetted phone numbers

**How Lawyers Are Charged:**
```
Monthly invoice:
"December 2024 Consultation Bookings

Date       Client Name    Postcode    Amount
Dec 5      John S.        3000        $100.00
Dec 8      Sarah M.       3001        $100.00
Dec 12     Michael L.     3002        $100.00

Subtotal:                              $300.00
GST (10%):                             $30.00
TOTAL:                                 $330.00

Note: This fee is for marketing and administrative booking
services. Not a referral fee."
```

### Phase 4: Hybrid Model Evolution (Option 5)

**Activation Criteria:**
- Phase 3 operating for 6+ months
- 15+ law firms paying consistently
- Lawyer feedback: "I want more bookings" or "Can I get priority?"

**Tier 1: Premium Partner**
- Monthly subscription: **$149/month**
- Reduced booking fee: **$50 per consultation** (50% discount)
- Benefits: Priority routing, market data access, unlimited bookings at reduced rate
- Break-even: 3 bookings/month

**Tier 2: Pay-As-You-Go**
- No monthly fee
- Standard booking fee: **$100 per consultation**
- Benefits: Flexible, no commitment

---

## 💵 REVENUE MODEL COMPARISON

### Why Pay-Per-Consultation (NOT Pay-Per-Lead or Pay-Per-Client)

**vs Pay-Per-Lead ($50):**
- ❌ High fraud risk (bots, fake forms, competitor sabotage)
- ❌ "Tyre-kicker" fatigue (lawyers waste time calling unqualified leads)
- ❌ Lawyer must spend 15-30 min per lead on phone tag
- ✅ **Pay-Per-Consultation:** Booked appointment = verified intent, no scheduling friction

**vs Pay-Per-Client ($300-500):**
- ❌ **FATAL FLAW:** Violates ASCR Rule 12 fee-sharing prohibition
- ❌ Requires lawyers to disclose "I paid $500 for your business" (erodes trust)
- ❌ Attribution nightmare (no API to verify retainer signing)
- ❌ Lawyers can under-report to avoid payment
- ✅ **Pay-Per-Consultation:** Regulatory safe, transparent, verifiable

**Technical Requirements for Phase 3:**
- Calendar integration (Calendly API or Google Calendar API)
- Stripe payment infrastructure
- Fraud prevention stack (OTP, honeypot fields, IP tracking)
- Lawyer dashboard (bookings, invoices, disputes)

**See:** `docs/PRICING_STRATEGY_ANALYSIS.md` for full regulatory analysis and `guides/PRICING_IMPLEMENTATION_GUIDE.md` for technical implementation details.

---

## 🔐 HOW IS THIS POLICED?

### System of Record:
**You have:**
- Email logs (proof lead was sent)
- Timestamp (when they received it)
- Lead details (they can't deny receiving it)

### Monthly Billing Process:
1. **Week 5 of each month:** Generate invoice
2. **Invoice shows:** 
   - Date each lead was sent
   - Lead ID number
   - Brief preview (first 2 lines)
   - Cost per lead
   - Total due
3. **Send invoice** via email (Stripe Invoice or manual)
4. **Payment due:** 14 days

### If They Dispute:
**Lawyer:** "I didn't get this lead"
**You:** "Here's the email log showing it was sent to you@firm.com on Dec 15 at 2:34pm"
**Lawyer:** "Oh right, I remember now" or "That went to spam"
**You:** "I can resend it, but invoice stands"

### If They Don't Pay:
1. **Week 1:** Send reminder
2. **Week 2:** Turn off their access (no more leads)
3. **Week 3:** Collections or write it off

**Reality:** Most lawyers will pay. $300-1,000/month is small for firms billing $30k+ annually per client.

---

## 💰 PRICING STRATEGY

### Phase 1-2 (Months 1-3): FREE PILOT
- Build calendar booking infrastructure
- Validate booking completion rates (target: >40%)
- Gather consultation → client conversion data
- Get testimonials

### Phase 3 (Months 4-9): PAY-PER-CONSULTATION-BOOKED
**Price:** $100 per confirmed booking
**Why:** Regulatory safe, higher quality, no scheduling friction
**Goal:** Convert 2-3 pilot firms to paid, scale to 10+ firms

### Phase 4 (Months 10+): HYBRID MODEL
**Tier 1:** $149/month subscription + $50 per booking (Premium Partner)
**Tier 2:** $100 per booking (Pay-As-You-Go)
**Justification:** You have proof of booking → consultation → client conversion
**Present it:** "Average booking → consultation rate 80%+, average client value $3,000-10,000"

**ROI for lawyers (Phase 3):**
```
Lawyer receives 10 bookings/month = $1,000 cost
Lawyer bills: 10 × $400/hour = $4,000 (consultation revenue alone)
3-4 convert to clients (30-40% rate)
1-2 clients signed × $3,000-10,000 = $3,000-20,000 (matter revenue)

Total revenue: $4,000 (consultations) + $6,500 avg (matters) = $10,500
ROI: $10,500 revenue - $1,000 cost = $9,500 profit
950% ROI
```

**ROI for lawyers (Phase 4 Premium Partner):**
```
Subscription: $149/month
10 bookings × $50 = $500
Total cost: $649/month

vs Pay-As-You-Go: $1,000/month
Savings: $351/month (35% discount)

Same revenue outcomes, lower CAC
```

---

## 📊 REVENUE PROJECTIONS (Updated for Pay-Per-Consultation-Booked)

### Conservative (4 bookings/month, 10 firms):
- 4 bookings × $100 = $400/month per firm
- × 10 firms = $4,000/month
- **Annual: $48,000**

### Moderate (44 bookings/month total, 10 firms):
- 44 bookings × $100 = $4,400/month
- **Annual: $52,800**

### Optimistic Hybrid (200 bookings/month, 20 Premium Partners):
- 20 firms × $149/month = $2,980 (baseline MRR)
- 200 bookings × $50 = $10,000
- Total: $12,980/month
- **Annual: $155,760**

### Maximum Scale (360 bookings/month, 30 Premium Partners):
- 30 firms × $149 = $4,470/month
- 360 bookings × $75 avg (blended) = $27,000
- Total: $31,470/month
- **Annual: $383,640**

---

## 🎯 WHAT TO TELL LAWYERS IN TRIAL

### During Free Trial (Phase 2):
"After the 3-month pilot, we'll transition to a Pay-Per-Consultation-Booked model at $100 per confirmed booking.

Here's why this beats traditional lead generation:
- You only pay for CONFIRMED appointments on your calendar
- No phone tag, no "bad leads" - the meeting is already scheduled
- $100 fee vs your $400/hour consultation rate = 4:1 ROI minimum
- 30-40% of consultations typically convert to clients ($3k-10k matters)
- Regulatory safe: classified as 'marketing fee' not 'referral commission'

So if you receive 10 bookings/month ($1,000 cost), you'd typically:
- Bill $4,000 in consultations ($400/hour × 10)
- Sign 3-4 clients ($12,000 average matter revenue)
- Total revenue: $16,000
- Net profit: $15,000"

### At End of Trial (Pitch):
"Over 3 months, you received:
- 12 booked consultations (40% booking completion rate from 30 inquiries)
- 10 consultations attended (83% attendance - 2 no-shows)
- 3 clients signed (30% conversion rate)

Your outcomes:
- Consultation revenue: $4,000 (10 × $400/hour)
- Matter revenue: $15,000 (3 clients × $5,000 avg)
- Total revenue: $19,000

Cost would have been: $1,200 (12 bookings × $100)
Your net profit: $17,800

Want to continue at $100 per booked consultation?"

---

## 🚨 DECISION MADE: PAY-PER-CONSULTATION-BOOKED

After comprehensive regulatory analysis (see `docs/PRICING_STRATEGY_ANALYSIS.md`), we chose **Pay-Per-Consultation-Booked** over other models:

**Pay-Per-Consultation-Booked (CHOSEN):**
✅ Regulatory safe ("marketing fee" not "referral commission")
✅ No scheduling friction (meeting already booked on calendar)
✅ Higher quality (booking = verified intent)
✅ No "bad lead" disputes (calendar API logs = proof)
✅ Lawyer ROI: $100 fee vs $400/hour consultation = 4:1
✅ Fraud prevention built-in (OTP, booking deposits)
❌ Requires calendar integration (technical complexity)

**Pay-Per-Lead (Rejected):**
❌ High fraud risk (bots, fake forms)
❌ "Tyre-kicker" fatigue for lawyers
❌ Lawyer must spend 15-30 min on phone tag per lead
❌ Lower perceived value ($50 vs $100)
✅ Simpler to implement initially

**Pay-Per-Client-Signed (FATAL FLAW - Rejected):**
❌ **Violates ASCR Rule 12 fee-sharing prohibition**
❌ Requires disclosure: "I paid $500 for your business" (erodes trust)
❌ Attribution nightmare (no API to verify retainer signing)
❌ Lawyers can under-report to avoid payment
✅ Lawyers love it (no risk)
✅ Can charge more ($300-500)

**Final Decision:** Pay-Per-Consultation-Booked at $100.

**Why:** Regulatory compliance + quality + lawyer value > implementation simplicity. The calendar integration work pays off in sustainable, defensible revenue.

**See:** `docs/PRICING_STRATEGY_ANALYSIS.md` for full analysis and `guides/PRICING_IMPLEMENTATION_GUIDE.md` for technical implementation details.

---

