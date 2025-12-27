# Phase 2: Week-by-Week Implementation Checklist

**Goal:** Onboard 8-12 lawyers, deliver 50+ qualified leads, generate first revenue  
**Duration:** 6-8 weeks  
**Target Revenue:** $1,500-3,000/month (30-60 leads × $50/lead)

**CRITICAL:** Complete tasks in order. Each week builds on the previous.

---

## BEFORE YOU START

### Prerequisites from Phase 1
- [ ] Phase 1 complete (Tasks 0-7 done)
- [ ] Complexity detection working (alerts show for high value cases, court dates, etc.)
- [ ] Analytics tracking working (PostHog events firing)
- [ ] Inquiry form built and functional
- [ ] **5+ lawyers from Phase 1 Task 0 ready to onboard**

### IMPORTANT: We're Using Manual Lead Routing

**NO calendar integration needed!**

We're using the inquiry form you already built in Phase 1. When a parent submits:
1. They fill out name, email, phone, preferred times
2. System emails you the lead details
3. You forward to appropriate lawyer (by location/specialty)
4. Lawyer responds directly to parent to schedule
5. You track outcome in spreadsheet

**Why this works:**
- ✅ Zero additional dev work (form already exists)
- ✅ Lawyers just need email (no tech setup)
- ✅ You control quality (can review before sending)
- ✅ Get to revenue in days, not weeks
- ✅ No "tech is broken" complaints from lawyers

**Pricing:** $50 per qualified lead (not $100 per booking)

---

## WEEK 1: Lawyer Onboarding & Lead Routing Setup

**Goal:** Onboard 3-5 lawyers, set up lead tracking  
**Time:** 8-10 hours  
**Outcome:** Ready to receive and route leads

### Day 1: Email Templates & Agreement (3 hours)

**Task 1.1: Lawyer Partnership Agreement** (1.5 hours)

Create simple one-page agreement covering:
- Service: "We operate auschildsupport.com - a free calculator that identifies parents who need legal help with complex child support cases"
- Pricing: "$50 per lead"
- Payment: "Monthly invoice via Stripe, net 14 days"
- Lead definition: "Parent who clicked 'Get Legal Help', filled inquiry form, meets complexity threshold"
- Territory: "You receive leads from [postcode/city]"
- Response time: "You must contact lead within 24 hours"
- Refund: "If lead is duplicate or unresponsive, we'll credit your account"

Save as: `docs/LAWYER_PARTNERSHIP_AGREEMENT.md`

**Task 1.2: Welcome Email Template** (1 hour)

Create template for new lawyer partners:

```
Subject: Welcome to Australian Child Support Calculator - Lead Partnership

Hi [Lawyer Name],

Welcome! You're now receiving family law leads from our calculator at auschildsupport.com.

HOW IT WORKS:
1. Parents use our free calculator to understand their child support
2. Complex cases are flagged (high value, court dates, special circumstances)
3. Parent clicks "Get Legal Help" and fills inquiry form
4. We send you their details via email within 1 hour
5. You contact them directly within 24 hours
6. We bill you $50 per lead at month-end via Stripe

WHAT'S IN A LEAD:
- Parent's contact info (name, email, phone)
- Calculation summary (liability amount, income, care split)
- Complexity flags (what makes this case worth legal help)
- Their message/questions
- Preferred contact times

GETTING STARTED:
1. Set up your Stripe account: [link]
2. Confirm your service area and preferred email for leads
3. Reply confirming you're ready
4. You'll start receiving leads within 48 hours

Try the calculator yourself: auschildsupport.com

Questions? Reply to this email.

Best,
Alex Thompson
auschildsupport.com
```

**Task 1.3: Lead Email Template** (30 min)

Create template for sending leads to lawyers:

```
Subject: New Lead - [Complexity] - $[Liability]/year

Hi [Lawyer],

NEW LEAD DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Client: [Name]
Email: [Email]
Phone: [Phone]
Location: [Suburb, State]

CASE SUMMARY:
Annual Liability: $[Amount]
Complexity: [High/Medium] - [Reason]
Children: [Number], ages [Ages]

THEIR MESSAGE:
"[User's message from inquiry form]"

PREFERRED CONTACT TIMES:
[User's availability]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT:
- Contact them within 24 hours
- Reference "Child Support Calculator" when you call
- This lead will be billed at $50 on your next invoice

[Link to full calculation details]

Reply to this email if there's any issue with this lead.
```

**Done when:**
- [ ] Agreement document created
- [ ] Welcome email template ready
- [ ] Lead email template ready

---

### Day 2-3: Onboard First 3 Lawyers (4-5 hours)

**Task 1.4: Personal Onboarding Calls** (3-4 hours)

Call 3 lawyers from your Phase 1 Task 0 list:

**Call script:**
```
"Hi [Name], it's Alex Thompson from Australian Child Support Calculator. 

I wanted to follow up - the calculator is now live at auschildsupport.com. Have you had a chance to try it?

[If yes]: Great! So you've seen how it flags complex cases. I'm now connecting those parents with local lawyers for $50 per qualified lead.

[If no]: Let me walk you through it quickly - [give 30-second demo while they look at site]

Here's how the partnership works:
- Parent uses calculator and it detects complexity (high value, court dates, special circumstances)
- They click "Get Legal Help" and fill out inquiry form
- I email you their contact details with full case summary
- You contact them directly to schedule consultation
- I bill you $50 per lead at end of month

No calendar integration, no software to learn, no tech setup. Just qualified leads to your inbox.

Want to start? I can send you the partnership agreement right now."
```

**Key change:** Reference the live website immediately - it establishes credibility and gives them something tangible to evaluate.

**For each lawyer who says yes:**
1. Email them the partnership agreement
2. Get their preferred:
   - Email address for leads
   - Service area (postcode/suburbs)
   - Specialties (if any)
3. Help them set up Stripe Connect
4. Send welcome email
5. Add to tracking spreadsheet

**Task 1.5: Create Lawyer Tracking Spreadsheet** (1 hour)

Create Google Sheet: `Lawyer Partners`

Columns:
- Name
- Firm Name  
- Email
- Phone
- State/City
- Service Area (postcodes)
- Stripe Account ID
- Status (Active/Inactive)
- Date Joined
- Leads Sent (running count)
- Amount Owed
- Last Invoice Date
- Notes

Add your 3 lawyers to the sheet.

**Done when:**
- [ ] 3 lawyers signed agreement
- [ ] All have Stripe accounts connected
- [ ] All added to tracking spreadsheet
- [ ] You have their preferred email for leads

---

### Day 4-5: Lead Tracking System (2-3 hours)

**Task 1.6: Lead Tracking Spreadsheet** (1.5 hours)

Create Google Sheet: `Lead Tracker`

Columns:
- Lead ID (auto-increment)
- Date Received
- Parent Name
- Parent Email
- Parent Phone
- Location
- Complexity Score (1-5)
- Complexity Reason (high value, court date, etc.)
- Annual Liability
- Lawyer Assigned
- Date Sent to Lawyer
- Status (Sent/Contacted/Booked/Converted/Lost)
- Lawyer Response Time (hours)
- Notes
- Billable? (Yes/No)

**Task 1.7: Inquiry Form Email Routing** (1 hour)

Update your Phase 1 inquiry form to:
1. Send confirmation email to parent
2. Send lead details to YOU (not directly to lawyer yet)
3. Include all data needed for lead email template

You'll manually review and forward to lawyers (ensures quality).

**Task 1.8: Test Complete Flow** (30 min)

1. Submit test inquiry through your app
2. Verify you receive email with lead details
3. Forward to one test lawyer using your template
4. Add to lead tracker spreadsheet
5. Mark as "Test - Do Not Bill"

**Done when:**
- [ ] Lead tracker spreadsheet created
- [ ] Inquiry form emails coming to you
- [ ] Test lead successfully sent to lawyer
- [ ] Lawyer confirmed they received it

---

## WEEK 2: Scale to 8-12 Lawyers

**Goal:** Onboard 5-9 more lawyers  
**Time:** 6-8 hours  
**Outcome:** 8-12 active lawyers, ready for volume

### Day 1-3: Bulk Lawyer Outreach (4-5 hours)

**Task 2.1: Email Campaign - Batch 1 (NSW)**

You have 111 NSW firms from your scrape. Send to first 50:

**Email Template:**
```
Subject: Quick way to identify complex child support cases

Hi [Lawyer Name],

I've built a calculator at auschildsupport.com that helps Australian parents understand their child support assessments.

The interesting part for family lawyers: it automatically flags cases that need professional help - things like income departures, care percentage disputes, or special circumstances that trigger Change of Assessment.

When it identifies a complex case, I can refer that lead to your firm for $50 per qualified referral.

Try the calculator yourself: auschildsupport.com

How it works:
✓ Parent uses calculator (free, no signup)
✓ Complex case detected → they click "Get Legal Help"
✓ I email you their details with full case summary
✓ You contact them directly to schedule consultation
✓ $50 per lead, billed monthly via Stripe
✓ No software to learn, no calendar integration

Interested in receiving leads from [City/Region]? Reply and I'll send you the partnership agreement.

Best,
Alex Thompson
auschildsupport.com
[Phone]
```

Send 50 emails on Monday/Tuesday.

**Important:** Always include the live link early in the email - it's your credibility proof.

**Task 2.2: Follow-Up Calls** (2-3 hours)

For firms that respond with interest:
- Call within 24 hours
- Walk through partnership
- Send agreement
- Set up Stripe
- Add to tracking sheet

**Goal:** Onboard 3-5 more lawyers from this batch

**Done when:**
- [ ] 50 emails sent (NSW batch 1)
- [ ] 5-10 responses received
- [ ] 3-5 lawyers onboarded
- [ ] Total active lawyers: 6-8

---

### Day 4-5: Second Batch (2 hours)

**Task 2.3: Email Campaign - Batch 2 (VIC)**

Send to 50 VIC firms using same template (adjust location).

**Task 2.4: Process Responses**

Onboard 2-4 more lawyers from VIC batch.

**Done when:**
- [ ] 50 VIC emails sent
- [ ] 2-4 more lawyers onboarded  
- [ ] Total active lawyers: 8-12

---

## WEEK 3: First Leads & Payment Setup

**Goal:** Deliver first 10 leads, set up billing  
**Time:** 8-10 hours  
**Outcome:** Leads flowing, payment infrastructure ready

### Day 1-2: Deliver First Leads (3-4 hours)

**Task 3.1: Process Real Leads**

When inquiry form submissions come in:

1. **Review lead quality** (30 seconds each)
   - Is complexity legit?
   - Contact info complete?
   - Location matches lawyer territory?

2. **Assign to lawyer** (based on location)
   - Check tracking sheet for service areas
   - Try to distribute evenly

3. **Send lead email** (use your template)
   - Personalize with lawyer's name
   - Include all parent details
   - Set clear expectations

4. **Log in tracker**
   - Add to Lead Tracker spreadsheet
   - Status: "Sent"
   - Date sent, lawyer assigned

5. **Follow up in 48 hours**
   - Did lawyer contact parent?
   - Update status: "Contacted" or "No Response"
   - If no response: ask why

**Goal:** Send 10 leads this week

**Task 3.2: Quality Control** (1 hour)

After first 10 leads sent:
- Call 2-3 lawyers: "How was lead quality?"
- Call 2-3 parents: "Did lawyer contact you?"
- Document feedback
- Adjust complexity triggers if needed

**Done when:**
- [ ] 10 leads sent to lawyers
- [ ] All logged in tracker
- [ ] Feedback collected
- [ ] Quality verified

---

### Day 3-4: Stripe Invoicing Setup (3-4 hours)

**Task 3.3: Set Up Stripe Connect** (2 hours)

Follow Stripe docs to set up:
1. Create Stripe Connect account
2. Generate onboarding links for lawyers
3. Test charging connected account

**Task 3.4: Invoice Template** (1 hour)

Create invoice template in Stripe:

```
INVOICE

From: [Your Business Name]
To: [Lawyer Name], [Firm Name]

Invoice Period: [Start Date] - [End Date]

Line Items:
- [Number] qualified leads × $50 = $[Total]

Subtotal: $[Total]
GST (10%): $[GST]
Total Due: $[Total + GST]

Payment Terms: Net 14 days
Payment Method: Stripe (auto-charge)

Lead Details:
[List each lead with: Date, Client Name, Status]

Questions? Email: [your email]
```

**Task 3.5: Test Billing** (1 hour)

1. Create test invoice for one lawyer
2. Send via Stripe
3. Verify they can see it
4. Process test payment
5. Confirm accounting works

**Done when:**
- [ ] Stripe Connect configured
- [ ] All lawyers connected to Stripe
- [ ] Test invoice sent and paid
- [ ] Billing system working

---

## WEEK 4: Optimize & Scale

**Goal:** Increase lead volume, improve conversion  
**Time:** 6-8 hours  
**Outcome:** 20+ leads delivered, system running smoothly

### Task 4.1: Drive More App Traffic (3 hours)

**Now that you have a professional web app**, promote it more confidently:

Post calculator link (auschildsupport.com) in:
- 5 more Reddit communities (r/AusLegal, r/AusFinance parenting threads)
- 10 Facebook parenting groups (Australian focused)
- Australian family law forums
- Single parent support groups
- Your personal network (now you can proudly share it)

**Pitch:** "I built a free calculator to help Australian parents understand child support - auschildsupport.com"

Goal: Get 200+ calculations this week (vs 100 last week)

**The web app makes marketing easier:**
- Professional URL (not "download our app")
- Works on any device (no app store friction)
- Instant access (no install required)
- Sharable (people can text the link)
- Credible (real website = real business)

**Task 4.2: Send Batch 3 Emails (2 hours)

Send 50 more lawyer emails (QLD batch).

Onboard 1-2 more if needed.

**Task 4.3: Improve Lead Quality** (1 hour)

Review your leads in tracker:
- Which triggers generated best leads?
- Any complaints from lawyers?
- Any refund requests?

Adjust complexity detection if needed.

**Task 4.4: Weekly Lawyer Check-In** (2 hours)

Email all 8-12 lawyers:

```
Subject: This Week's Leads - [Date]

Hi [Lawyer],

This week you received:
• [X] leads
• Average liability: $[Amount]
• Complexity scores: [Distribution]

Quick feedback:
1. How's the lead quality? (1-5 stars)
2. Are you getting too many? Too few?
3. Any issues?

Reply with your rating. Thanks!
```

**Done when:**
- [ ] 20+ total leads sent (cumulative)
- [ ] Batch 3 emails sent (QLD)
- [ ] Feedback collected from all lawyers
- [ ] Lead quality improvements implemented

---

## WEEK 5-6: Revenue & Optimization

**Goal:** First month-end billing, 50+ total leads  
**Time:** 8-10 hours  
**Outcome:** Revenue flowing, system proven

### Task 5.1: Month-End Billing (3 hours)

**Process:**
1. Export Lead Tracker to count billable leads per lawyer
2. Generate invoices in Stripe (one per lawyer)
3. Email lawyers: "Your invoice is ready"
4. Auto-charge via Stripe Connect
5. Follow up on any failed payments

**Expected Revenue:**
- 8 lawyers × 5 leads each = 40 leads
- 40 × $50 = $2,000
- Minus refunds/credits: ~$1,800

**Task 5.2: Handle Edge Cases** (2 hours)

You'll encounter:
- **Duplicate leads:** Parent submitted twice → Refund one
- **Unresponsive parent:** Lawyer couldn't reach them → Decide case-by-case
- **Wrong location:** Lead outside service area → Refund
- **Too low quality:** Didn't meet complexity → Refund

Document your refund policy based on these real cases.

**Task 5.3: Lawyer Satisfaction Survey** (2 hours)

Call each lawyer (15 min each):

Ask:
1. "Overall satisfaction: 1-10?"
2. "Quality of leads: 1-10?"
3. "Is $50/lead fair pricing?"
4. "Would you pay more? Less?"
5. "Would you recommend us to other lawyers?"
6. "What should we improve?"

**Calculate NPS Score:**
- Promoters (9-10): %
- Passives (7-8): %
- Detractors (0-6): %
- NPS = % Promoters - % Detractors

**Goal:** NPS > 0 (positive)

**Task 5.4: Metrics Dashboard** (1 hour)

Create simple tracking doc:

**Monthly Metrics:**
- Total leads sent
- Leads per lawyer (avg)
- Revenue generated
- Refund rate
- Lawyer NPS score
- Lead-to-consultation rate (from lawyer feedback)
- Lead-to-client rate (from lawyer feedback)

**Done when:**
- [ ] First invoices sent and paid
- [ ] $1,500+ revenue collected
- [ ] Lawyer NPS calculated
- [ ] Metrics dashboard created

---

## WEEK 7-8: Scale & Improve

**Goal:** Reach 50+ total leads, refine system  
**Time:** 6-8 hours  
**Outcome:** Proven model, ready for Phase 3

### Task 7.1: Continue Lead Flow (ongoing)

- Deliver 10-15 leads/week
- Maintain <24 hour routing time
- Keep quality high

### Task 7.2: Email More Lawyers If Needed (2-3 hours)

If you have capacity for more lawyers:
- Send batch 4 (SA/WA/ACT firms)
- Onboard 2-3 more
- Max out at 15 total lawyers

### Task 7.3: Optimize Complexity Detection (2 hours)

Based on 50+ leads of data:
- Which triggers perform best?
- Which generate complaints?
- Adjust thresholds
- Add new triggers if patterns emerge

### Task 7.4: Build Lawyer Dashboard (Optional, 3 hours)

Simple web page where lawyers can:
- View their lead history
- See current month's billing
- Download invoices
- Update their preferences

OR skip this for Phase 3.

**Done when:**
- [ ] 50+ total leads delivered
- [ ] 2 month-end billing cycles complete
- [ ] $3,000+ total revenue generated
- [ ] Lawyer retention: >80%
- [ ] System running with <5 hours/week maintenance

---

## PHASE 2 COMPLETE CHECKLIST

### Week 1: Foundation
- [ ] Partnership agreement created
- [ ] Email templates ready
- [ ] 3 lawyers onboarded
- [ ] Lead tracking spreadsheet created
- [ ] Test lead sent successfully

### Week 2: Scale
- [ ] 50 NSW emails sent
- [ ] 50 VIC emails sent
- [ ] 8-12 total lawyers onboarded
- [ ] All lawyers have Stripe connected

### Week 3: First Leads
- [ ] 10 leads delivered
- [ ] Quality feedback collected
- [ ] Stripe invoicing set up
- [ ] Test invoice paid

### Week 4: Optimize
- [ ] 20+ total leads delivered
- [ ] Batch 3 emails sent (QLD)
- [ ] Weekly lawyer check-ins sent
- [ ] Lead quality improvements made

### Week 5-6: Revenue
- [ ] First monthly invoices sent
- [ ] $1,500+ revenue collected
- [ ] Lawyer NPS calculated (goal: >0)
- [ ] Refund policy documented
- [ ] Metrics dashboard created

### Week 7-8: Prove Model
- [ ] 50+ total leads delivered
- [ ] 2 billing cycles complete
- [ ] $3,000+ total revenue
- [ ] Lawyer retention >80%
- [ ] <5 hours/week maintenance time

---

## PHASE 2 SUCCESS METRICS

**Minimum Success (proceed to Phase 3):**
- ✅ 8+ active lawyers
- ✅ 50+ leads delivered
- ✅ $1,500+ monthly revenue
- ✅ Lawyer NPS > 0
- ✅ Refund rate <20%

**Strong Success (scale aggressively):**
- ✅ 12+ active lawyers
- ✅ 80+ leads delivered
- ✅ $3,000+ monthly revenue
- ✅ Lawyer NPS > 30
- ✅ Refund rate <10%
- ✅ Lawyers asking "can I get MORE leads?"

---

## WHEN PHASE 2 IS DONE

**You've achieved:**
- ✅ Proven business model (lawyers pay for leads)
- ✅ Real revenue flowing ($1,500-3,000/month)
- ✅ System that works (manual but functional)
- ✅ Happy lawyers (NPS > 0)
- ✅ Repeatable process (<5 hours/week to run)

**Next step:**

Tell me "Phase 2 complete!" and share:
- Total leads delivered
- Total revenue generated
- Lawyer NPS score
- Refund rate
- Key learnings

Then I'll create **Phase 3: Growth & Automation** 🚀

(Target: 20+ lawyers, $8K-12K/month, automated routing, premium tier)
