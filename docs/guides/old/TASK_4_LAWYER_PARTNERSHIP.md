# Task 4: Lawyer Partnership Materials

**Time Estimate:** 2-3 hours  
**Priority:** TIER 2 - Important before outreach  
**Goal:** Create all materials needed to sign up and work with lawyers

---

## Overview

This task compiles all the templates and documents you need to onboard lawyers and operate the lead generation business. Everything is ready to use - just customize with your details.

---

## Part 1: Partnership Agreement (1 hour)

### What to Include

Create a simple one-page agreement covering:

**1. Service Description**
- "We operate auschildsupport.com - a free calculator that identifies parents who need legal help with complex child support cases"

**2. Pricing**
- "$50 per qualified lead"
- Lead = parent who clicked "Get Legal Help", filled inquiry form, meets complexity threshold

**3. Payment Terms**
- Monthly invoice via Stripe
- Net 14 days
- Auto-charge via Stripe Connect

**4. Territory**
- Specify service area: postcodes, suburbs, or city/state
- Example: "You receive leads from: Sydney metro (2000-2999), Newcastle (2300-2399)"

**5. Lead Definition**
- What qualifies as a billable lead
- Parent submitted inquiry form
- Met complexity threshold (high value, court date, special circumstances)
- Complete contact information provided

**6. Response Time**
- Lawyer must contact lead within 24 hours
- Reference "Australian Child Support Calculator" when contacting

**7. Refund Policy**
- Duplicate leads (parent submitted twice) → full refund
- Unresponsive leads (parent doesn't answer after 3+ attempts) → case by case
- Wrong location (outside service area) → full refund
- Quality issues (didn't meet complexity threshold) → full refund

**8. Termination**
- Either party can terminate with 7 days notice
- Outstanding invoices remain due

### Template

```markdown
# LAWYER PARTNERSHIP AGREEMENT

**Between:**
- Australian Child Support Calculator (ABN: [to be added])
- [Lawyer Name], [Firm Name] (ABN: [lawyer's ABN])

**Date:** [Date]

## 1. SERVICE
We operate auschildsupport.com, a free child support calculator that identifies parents who need legal assistance with complex child support matters.

## 2. PARTNERSHIP
We will refer qualified leads to your firm. You agree to:
- Contact leads within 24 hours
- Reference "Australian Child Support Calculator" when contacting
- Provide professional legal consultation services

## 3. PRICING
- $50 per qualified lead
- Qualified lead = parent who submitted inquiry form, met complexity threshold, provided complete contact information

## 4. PAYMENT
- Monthly invoice via Stripe
- Net 14 days payment terms
- Auto-charge via Stripe Connect

## 5. SERVICE AREA
You will receive leads from: [specify postcodes/suburbs/regions]

## 6. REFUND POLICY
Full refund provided for:
- Duplicate leads
- Leads outside specified service area
- Leads not meeting complexity threshold
- Unresponsive leads (case by case basis)

## 7. TERMINATION
Either party may terminate with 7 days written notice. Outstanding invoices remain payable.

## 8. CONTACT
Questions: alex@auschildsupport.com

**Signatures:**

________________________
Australian Child Support Calculator
Date: ___________

________________________
[Lawyer Name], [Firm Name]
Date: ___________
```

**Save as:** `/docs/LAWYER_PARTNERSHIP_AGREEMENT.md`

---

## Part 2: Email Templates (1 hour)

### Template 1: Cold Outreach Email

**Subject:** Quick way to identify complex child support cases

```
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

Interested in receiving leads from [City/Region]? Reply and I'll send you the partnership agreement.

Best,
Alex Thompson
auschildsupport.com
[Phone]
```

---

### Template 2: Welcome Email (New Partner)

**Subject:** Welcome to Australian Child Support Calculator - Lead Partnership

```
Hi [Lawyer Name],

Welcome! You're now receiving family law leads from auschildsupport.com.

HOW IT WORKS:
1. Parents use our free calculator
2. Complex cases are flagged
3. Parent clicks "Get Legal Help" and fills inquiry form
4. I email you their details within 1 hour
5. You contact them within 24 hours
6. I bill you $50 per lead at month-end via Stripe

WHAT'S IN A LEAD:
- Parent's contact info
- Calculation summary
- Complexity flags
- Their message/questions
- Preferred contact times

GETTING STARTED:
1. Confirm your service area and preferred email
2. Set up Stripe (I'll send link)
3. You'll start receiving leads within 48 hours

Try the calculator: auschildsupport.com

Questions? Reply to this email.

Best,
Alex Thompson
```

---

### Template 3: Lead Forwarding Email

**Subject:** New Lead - [Complexity] - $[Liability]/year

```
Hi [Lawyer],

NEW LEAD DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: [Name]
Email: [Email]
Phone: [Phone]
Location: [Suburb, State]

CASE SUMMARY:
Annual Liability: $[Amount]
Complexity: [Reason]
Children: [Number], ages [Ages]

[If Change of Assessment reasons selected:]
CHANGE OF ASSESSMENT GROUNDS:
• [Reason 1]: [Description]
• [Reason 2]: [Description]

THEIR MESSAGE:
"[User's message]"

PREFERRED CONTACT:
[Availability]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT:
- Contact within 24 hours
- Reference "Australian Child Support Calculator"
- This lead will be billed at $50 on your next invoice

Questions? Reply to this email.
```

---

### Template 4: Monthly Invoice Email

**Subject:** Invoice for [Month] - [Number] Leads

```
Hi [Lawyer],

Your invoice for [Month] is ready.

SUMMARY:
• [Number] qualified leads delivered
• $[Amount] per lead
• Total: $[Total] (inc. GST)

PAYMENT:
This will auto-charge your Stripe account within 14 days.

LEAD BREAKDOWN:
[Date] - [Client Name] - $[Liability]/year - [Status]
[Date] - [Client Name] - $[Liability]/year - [Status]
...

Questions or issues with any leads? Reply within 7 days for review.

Invoice: [Stripe link]

Best,
Alex Thompson
```

---

### Template 5: Weekly Check-In Email

**Subject:** This Week's Leads - [Date]

```
Hi [Lawyer],

This week you received:
• [X] leads
• Average liability: $[Amount]
• Complexity scores: [Distribution]

Quick feedback (takes 30 seconds):
1. Lead quality: ⭐⭐⭐⭐⭐ (reply with 1-5 stars)
2. Getting right volume? Too many/too few/just right
3. Any issues?

Reply with your rating. Thanks!

Alex
```

---

## Part 3: Tracking Spreadsheets (30 minutes)

### Spreadsheet 1: Lawyer Partners Tracker

Create Google Sheet with these columns:

| Name | Firm | Email | Phone | State | Service Area | Stripe ID | Status | Joined | Leads Sent | Amount Owed | Last Invoice | Notes |
|------|------|-------|-------|-------|--------------|-----------|--------|--------|------------|-------------|--------------|-------|

**How to use:**
- Add new row for each lawyer
- Update "Leads Sent" after each lead forwarded
- Update "Amount Owed" monthly
- Update "Last Invoice" after billing
- Use "Status" to track: Active, Inactive, Suspended

---

### Spreadsheet 2: Lead Tracker

Create Google Sheet with these columns:

| Lead ID | Date | Parent Name | Email | Phone | Location | Complexity | Reason | Liability | CoA Reasons | Lawyer | Sent Date | Status | Response Time | Billable | Notes |
|---------|------|-------------|-------|-------|----------|------------|--------|-----------|-------------|--------|-----------|--------|---------------|----------|-------|

**Statuses:**
- New (just received)
- Sent (forwarded to lawyer)
- Contacted (lawyer reached parent)
- Booked (consultation scheduled)
- Converted (became client)
- Lost (parent didn't respond)
- Refunded (credit issued)

**How to use:**
- Add row for each inquiry form submission
- Update status as you get lawyer feedback
- Use for monthly billing (count "Billable = Yes" per lawyer)
- Track quality metrics (conversion rate, response time)

---

## Part 4: Operational Workflows (30 minutes)

### Workflow 1: Onboarding New Lawyer

**Steps:**
1. Send partnership agreement
2. Get signed agreement back (email PDF is fine)
3. Collect info:
   - Preferred email for leads
   - Service area (postcodes/suburbs)
   - Phone number
   - Stripe details
4. Send Stripe Connect onboarding link
5. Wait for Stripe confirmation
6. Send welcome email
7. Add to Lawyer Partners spreadsheet
8. Set status to "Active"
9. Send first test lead within 48 hours

**Time per lawyer:** 30-45 minutes

---

### Workflow 2: Processing Incoming Lead

**When inquiry form submitted:**

1. **Review (30 seconds)**
   - Complete contact info? ✓
   - Complexity legit? ✓
   - Location clear? ✓

2. **Assign lawyer (30 seconds)**
   - Check service area in Lawyer Partners sheet
   - Pick lawyer with fewest leads this month (balance workload)

3. **Send lead email (2 minutes)**
   - Use Template 3
   - Fill in all fields
   - Personalize if needed

4. **Log in tracker (1 minute)**
   - Add to Lead Tracker sheet
   - Status: "Sent"
   - Note: date, lawyer, details

5. **Follow up in 48 hours**
   - Check if status updated
   - If not: email lawyer "Did you contact [Parent]?"
   - Update status based on response

**Total time per lead:** 5 minutes

---

### Workflow 3: Month-End Billing

**Steps:**
1. Export Lead Tracker to count billable leads per lawyer
2. Generate invoice in Stripe for each lawyer
3. Send Template 4 (monthly invoice email)
4. Stripe auto-charges within 14 days
5. Update "Amount Owed" and "Last Invoice" in Lawyer Partners sheet
6. Handle any payment failures (email lawyer, retry charge)

**Time:** 2-3 hours for 10 lawyers

---

## Part 5: Quality Control Process (30 minutes)

### Weekly Lawyer Check-In

**Every Friday, send Template 5 to all active lawyers**

Track responses in a separate "Quality Feedback" sheet:

| Date | Lawyer | Quality Rating | Volume Feedback | Issues | Action Taken |
|------|--------|----------------|-----------------|--------|--------------|

**Red flags to watch for:**
- Quality rating < 3 stars
- "Too many leads" (risk of burnout)
- "Leads not in my area" (routing error)
- "Can't reach parents" (bad contact info)

**Actions:**
- <3 stars → Review complexity triggers
- Too many → Onboard another lawyer in that area
- Wrong area → Check service area settings
- Bad contact → Improve form validation

---

### Monthly Lawyer Satisfaction Call

**Once per month, call each lawyer (15 min each)**

Ask:
1. Overall satisfaction: 1-10?
2. Quality of leads: 1-10?
3. Is $50/lead fair pricing?
4. Would you recommend us?
5. What should we improve?

**Calculate NPS (Net Promoter Score):**
- 9-10 = Promoter
- 7-8 = Passive
- 0-6 = Detractor
- NPS = % Promoters - % Detractors

**Goal:** NPS > 0

---

## Part 6: Refund Policy Decision Tree

**When lawyer requests refund:**

```
Is lead a duplicate?
  → YES: Full refund, apologize
  → NO: Continue...

Is lead outside service area?
  → YES: Full refund, fix routing
  → NO: Continue...

Did lead not meet complexity threshold?
  → YES: Full refund, review triggers
  → NO: Continue...

Is parent unresponsive (lawyer tried 3+ times)?
  → YES: 50% refund or credit for next lead
  → NO: Continue...

Other issue?
  → Review case-by-case
  → Document decision for future reference
```

**Important:** Be generous with refunds in first 3 months to build trust.

---

## Completion Checklist

- [ ] Partnership agreement document created and saved
- [ ] All 5 email templates ready
- [ ] Lawyer Partners spreadsheet created
- [ ] Lead Tracker spreadsheet created
- [ ] Workflows documented
- [ ] Quality control process set up
- [ ] Refund policy decision tree reviewed

---

## Next Steps

**After completing this task:**
1. Review partnership agreement with AI for any legal issues
2. Test email templates by sending to yourself
3. Add test data to both spreadsheets
4. Practice the onboarding workflow with a friend/colleague
5. You're ready to start lawyer outreach (Task 5)

**Time investment:** 2-3 hours now saves 10+ hours of "figuring it out" later

---

**Last Updated:** Dec 27, 2024
