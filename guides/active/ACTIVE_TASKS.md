# ACTIVE TASKS - Complete Before Launch

**Last Updated:** Dec 27, 2024  
**Status:** Pre-launch preparation  
**Goal:** Ready to start lawyer outreach by Dec 28-29

---

## ✅ COMPLETED (Don't need to do these)

- Domain registered (auschildsupport.com)
- Email setup (alex@auschildsupport.com)
- AI headshot created
- LinkedIn profile created for Alex Thompson
- Calculator fully built and tested
- Change of Assessment feature implemented
- End-to-end testing complete
- Historical year selection removed
- Web platform dependencies installed

---

## 🚧 IN PROGRESS (Being worked on right now)

### Web App Deployment
**Status:** Claude Code is optimizing for web now  
**ETA:** 30-60 minutes  

**Remaining steps after Claude Code finishes:**
1. Test web app in browser (verify calculator works)
2. Build production version: `npx expo export --platform web`
3. Deploy to Netlify:
   - Go to netlify.com/drop
   - Drag `dist/` folder
   - Get temporary URL
4. Point auschildsupport.com to Netlify (follow Netlify DNS instructions)
5. Verify site is live at auschildsupport.com

**Reference:** `/docs/WEB_DEPLOYMENT_GUIDE.md`

---

## 📋 TASKS TO DO (In priority order)

### TIER 1: CRITICAL - Do These First (2-3 hours total)

#### Task 1: Get Virtual Phone Number (30 min, $12)
**Why:** Need phone number for LinkedIn and email signature  
**Options:**
- Buy prepaid SIM at Woolworths/Coles ($2 SIM + $10 credit)
- OR use virtual phone app (Hushed, Burner)

**Steps:**
1. Get phone number
2. Add to LinkedIn profile contact info
3. Add to Gmail signature
4. Test it works

**Cost:** $12

---

#### Task 2: Update Business Documentation (30 min)
**Why:** BUSINESS_MODEL.md may have outdated info  

**Steps:**
1. Review `/docs/BUSINESS_MODEL.md`
2. Verify it reflects current strategy:
   - Web app at auschildsupport.com
   - $50 per lead (not $100 per booking)
   - Manual email routing (not calendar integration)
   - Lead generation business model
3. Update any outdated sections
4. Remove any references to old B2C plans

**Done when:** BUSINESS_MODEL.md is accurate and current

---

#### Task 3: Design Lead Routing Workflow (1 hour - DECISION NEEDED)
**Why:** Unclear how inquiries get from app → you → lawyers  

**Critical questions to answer:**
1. When someone fills inquiry form, what happens?
   - Does it email you?
   - Store in database?
   - Both?
2. What data is collected/stored?
3. How do you forward to lawyers?
   - Manual copy/paste into Gmail?
   - Semi-automated template system?
   - Fully automated?
4. Where does data live?
   - Just in emails?
   - Spreadsheet?
   - Database?
5. Privacy/compliance considerations?
   - Storing sensitive data (names, emails, phone, financial info)
   - How long do you keep it?
   - Need privacy policy?

**PROMPT FOR AI CONSULTATION:**
```
I'm building a lead generation business where parents fill out an inquiry form in my calculator app, and I need to route these leads to family lawyers.

Current setup: React Native app with inquiry form that collects:
- Name, email, phone
- Calculation details (income, liability, complexity triggers)
- Their message/questions
- Change of Assessment reasons (if selected)

Business model: I forward leads to lawyers via email and charge $50 per lead.

Questions:
1. What's the simplest way to implement this lead routing system?
2. Should inquiries be stored in a database or just emailed to me?
3. How should I forward leads to lawyers (manual vs automated)?
4. What are the privacy/compliance considerations with storing parent data?
5. Do I need a privacy policy on the website?
6. What's the MVP approach vs the ideal long-term solution?

Recommend an implementation approach that:
- Gets me to revenue fastest (manual is OK initially)
- Is legally compliant
- Can scale to 50+ leads/month
- Doesn't require complex infrastructure initially
```

**Tools to consult:**
- Claude (via claude.ai)
- ChatGPT
- Or ask Claude Code for technical implementation

**Done when:** You have a clear plan for how leads flow from app → you → lawyers

---

### TIER 2: IMPORTANT - Do Before Outreach (3-4 hours total)

#### Task 4: Create Lawyer Partnership Agreement (1 hour)
**Why:** Need this to sign up lawyers  

**What to include:**
- Service description (lead generation from auschildsupport.com)
- Pricing ($50 per lead)
- Payment terms (monthly invoice via Stripe, net 14 days)
- Lead definition (what counts as a billable lead)
- Territory (which areas they cover)
- Response time expectation (contact within 24 hours)
- Refund policy (duplicates, unresponsive leads)

**Template location:** `/guides/phase2/CHECKLIST.md` (Week 1, Day 1, Task 1.1)

**Steps:**
1. Review template in phase2 guide
2. Customize for your business
3. Save as: `/docs/LAWYER_PARTNERSHIP_AGREEMENT.md`
4. Optional: Convert to PDF for professional look

**Done when:** Agreement document ready to send to lawyers

---

#### Task 5: Create Email Templates (1 hour)
**Why:** Need these for lawyer communication  

**Templates needed:**
1. **Cold outreach email** (to lawyers you're approaching)
2. **Welcome email** (when lawyer signs up)
3. **Lead forwarding email** (when you send them a lead)
4. **Monthly invoice email** (end of month billing)
5. **Weekly check-in email** (quality feedback loop)

**Template locations:** `/guides/phase2/CHECKLIST.md` (Week 1 tasks) and updated in this file

**NEW TEMPLATES (updated with web app):**

**1. Cold Outreach Email:**
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

Interested in receiving leads from [City/Region]? Reply and I'll send you the partnership agreement.

Best,
Alex Thompson
auschildsupport.com
[Phone]
```

**2. Welcome Email:**
```
Subject: Welcome to Australian Child Support Calculator - Lead Partnership

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

**3. Lead Forwarding Email:**
```
Subject: New Lead - [Complexity] - $[Liability]/year

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

**Steps:**
1. Copy templates above
2. Save in Gmail as drafts or in a doc
3. Customize placeholders for your info
4. Test sending one to yourself

**Done when:** All 5 templates ready to use

---

#### Task 6: Create Operational Tracking Spreadsheets (1 hour)
**Why:** Need to track lawyers and leads for billing and quality  

**Spreadsheet 1: Lawyer Partners Tracker**

Create Google Sheet with columns:
- Name
- Firm Name
- Email (for leads)
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

**Spreadsheet 2: Lead Tracker**

Create Google Sheet with columns:
- Lead ID (auto-increment)
- Date Received
- Parent Name
- Parent Email
- Parent Phone
- Location
- Complexity Score (1-5)
- Complexity Reason
- Annual Liability
- Change of Assessment Reasons (if any)
- Lawyer Assigned
- Date Sent to Lawyer
- Status (Sent/Contacted/Booked/Converted/Lost)
- Lawyer Response Time (hours)
- Billable? (Yes/No)
- Notes

**Steps:**
1. Create 2 new Google Sheets
2. Set up columns as above
3. Add conditional formatting (color code status, highlight overdue)
4. Share with yourself (bookmark links)

**Done when:** Both spreadsheets created and ready to use

---

#### Task 7: Set Up Stripe for Billing (30 min)
**Why:** Need to collect payments from lawyers  

**Steps:**
1. Go to stripe.com/au
2. Create business account
3. Verify identity (may take 1-2 days)
4. Set up Stripe Connect (for lawyer accounts)
5. Create invoice template
6. Test creating/sending invoice

**Reference:** Phase 2 guide has details (Week 3, Task 3.3)

**Note:** Can start outreach before Stripe is fully verified - just need it working before first month-end billing

**Done when:** Stripe account created and invoice template ready

---

### TIER 3: STRATEGIC DECISIONS - Consult AI Before Doing (30 min each)

#### Decision 1: Landing Page vs Calculator-Only
**Question:** Should auschildsupport.com be:
- Option A: Just the calculator (direct to app)
- Option B: Landing page → calculator
- Option C: Landing page with calculator embedded

**PROMPT FOR AI:**
```
I have a web app (child support calculator) deployed at auschildsupport.com.

Should I:
A) Make the domain go directly to the calculator (no landing page)
B) Create a landing page first with "Try Calculator" button
C) Embed the calculator in a landing page with marketing copy

Context:
- Target audience: Parents needing child support help
- Business model: Lead generation (connect parents to lawyers)
- Want to maximize conversions to using calculator
- Also want to look professional for lawyer outreach
- Limited time/resources (solo founder)

What's the best approach for:
1. User experience (parents finding and using calculator)
2. Credibility (lawyers checking out my business)
3. SEO (being found in Google)
4. Simplicity (MVP approach)

Give recommendation with reasoning.
```

**After decision:** Update WEB_DEPLOYMENT_GUIDE.md with chosen approach

---

#### Decision 2: Privacy Policy Required?
**Question:** Do you legally need a privacy policy?

**PROMPT FOR AI:**
```
I'm building a lead generation service in Australia (auschildsupport.com) that:
- Collects parent data (name, email, phone, financial info about child support)
- Forwards this data to family lawyers
- Charges lawyers $50 per lead

Questions:
1. Do I legally need a privacy policy on the website?
2. What must it cover?
3. Are there Australian-specific privacy laws I need to comply with?
4. Can I use a template or need a lawyer to draft it?
5. Where should it be linked (footer, form, both)?

Give me the legal requirements and recommended approach.
```

**After decision:** Create privacy policy if needed, add to website

---

### TIER 4: OPTIONAL - Can Do Later (After first leads)

#### Optional Task 1: Audit and Archive Old Guides
**Why:** Reduce confusion from outdated docs  

**Files to review:**
- `/guides/CHRISTMAS_BREAK_PLAN.md` - Check if still relevant
- `/guides/DAILY CHECKLIST 26 DEC - 2 JAN.md` - Archive if dates passed
- `/guides/ALEX_THOMPSON_SETUP.md` - Archive (setup complete)
- `/guides/phase1/` - Archive (Phase 1 complete)
- `/guides/phase2/` - Keep but mark as "reference only"

**Steps:**
1. Create `/guides/archive/` folder
2. Move completed guides there
3. Keep only active guides in main folder

---

#### Optional Task 2: Create Lawyer Onboarding Checklist
**Why:** Standardize how you onboard each lawyer  

**Checklist items:**
- Send partnership agreement
- Get signed agreement back
- Collect service area info
- Set up Stripe Connect
- Send welcome email
- Add to Lawyer Partners spreadsheet
- Set status to "Active"
- Send test lead within 48 hours

---

## 📊 LAUNCH READINESS CHECKLIST

### Before You Can Start Outreach:
- [x] Web app live at auschildsupport.com
- [ ] Virtual phone number obtained
- [ ] Business docs up to date (BUSINESS_MODEL.md)
- [ ] Lead routing workflow designed
- [ ] Partnership agreement created
- [ ] Email templates created
- [ ] Tracking spreadsheets created
- [ ] Stripe account created (can be verifying)

### Nice to Have (But Can Start Without):
- [ ] Stripe fully verified (need by month-end billing)
- [ ] Privacy policy (if required)
- [ ] Landing page decision made
- [ ] Old guides archived

---

## 🚀 AFTER COMPLETING TIER 1 & TIER 2

You'll be ready to:
1. Start LinkedIn connection requests (5-10/day warm-up)
2. Send cold emails to lawyers
3. Have conversations with interested lawyers
4. Sign up first 3-5 partners
5. Start receiving and routing leads

**Timeline estimate:**
- Tier 1 tasks: 2-3 hours (can do today)
- Tier 2 tasks: 3-4 hours (can do tomorrow)
- Ready to launch: Dec 28-29

---

## 📝 NOTES & WARNINGS

### OUTDATED CONTENT WARNING
The following guides may have outdated info (references to old plans):
- CHRISTMAS_BREAK_PLAN.md - Check tasks carefully, some reference $100 booking model
- Phase2 CHECKLIST.md - Recently updated but verify against current model

### GUIDE DEPENDENCIES
- This file (ACTIVE_TASKS.md) is your source of truth
- Reference other guides for templates/details only
- If conflict between guides, this file wins

### QUESTIONS/BLOCKERS
If you hit any questions or blockers:
1. Consult AI (Claude, ChatGPT, etc.)
2. Use prompts provided in decision tasks
3. Document decision and update this file

---

**Last Updated:** Dec 27, 2024 by Claude after questionnaire with Sam