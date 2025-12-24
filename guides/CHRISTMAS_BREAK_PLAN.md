# Christmas Break Action Plan (Dec 24 - Jan 2)

**Goal:** Finish Phase 1 completely + Prepare Phase 2 materials + Clean up confusing docs  
**Timeline:** 10 days (lawyers closed anyway)  
**Outcome:** Hit the ground running Jan 2nd with polished product

---

## 🗑️ STEP 1: Documentation Cleanup (30 min - DO THIS FIRST)

### Files to DELETE (outdated/confusing):
```bash
rm /Users/sammcdougal/d/csc/docs/MASTER_PLAN.md
rm /Users/sammcdougal/d/csc/docs/CHANGELOG.md
```

**Why delete these:**
- MASTER_PLAN.md: 1,626 lines of outdated info ($100 booking, calendar integration)
- CHANGELOG.md: Tracking changes you're not using
- Both contain old B2C → B2B pivot context that's confusing

### Code to REMOVE (irrelevant features):

**Remove Historical Year Selection:**
- This is a lead generation app - users only need CURRENT rates
- Historical calculations serve no business purpose
- Adds unnecessary complexity to UI

Ask Claude Code:
```
Remove historical year selection feature from the calculator:

1. In src/components/CalculatorForm.tsx:
   - Remove the year selection dropdown
   - Remove any year-related state

2. In src/hooks/useCalculator.ts:
   - Remove selectedYear from state
   - Always use current year (2024-2025)

3. In src/utils/calculator.ts:
   - Remove any year-based rate selection logic
   - Use only current 2024-2025 rates

4. Clean up any unused rate data for previous years

Production requirements:
- Remove ALL references to year selection
- Ensure calculations use current rates only
- Update any comments/documentation
- Test that calculations still work correctly
```

### Files to KEEP:
- ✅ `docs/DESIGN_SYSTEM.md` - UI colors, fonts, component patterns
- ✅ `docs/CLAUDE.md` - How to work with Claude Code effectively
- ✅ `docs/README.md` - Navigation guide
- ✅ `docs/PRICING_ANALYSIS_MANUAL_LEADS.md` - Why $50/lead works
- ✅ `guides/phase1/CHECKLIST.md` - Phase 1 implementation tasks
- ✅ `guides/phase1/TESTING.md` - Testing guide
- ✅ `guides/phase2/CHECKLIST.md` - Phase 2 implementation tasks (updated for manual routing)
- ✅ `guides/phase2/README.md` - Phase 2 strategy (updated for $50/lead)
- ✅ `guides/README.md` - Guide navigation
- ✅ `guides/TROUBLESHOOTING.md` - Common issues and fixes

### Create NEW Master Reference (15 min):

Create simple `BUSINESS_MODEL.md` with current state:

```markdown
# Business Model (Current - Dec 2024)

**Product:** Free child support calculator → Generates leads for family lawyers

**Revenue:** $50 per qualified lead (email-based, manual routing)

**How it works:**
1. Parent uses calculator (free)
2. Complex case detected → Alert shown
3. Parent clicks "Get Legal Help" → Fills inquiry form
4. You forward lead to lawyer via email
5. Lawyer contacts parent to schedule
6. You bill lawyer $50 at month-end

**Phase 1 Status:** 95% complete (need special circumstances fields + testing)

**Phase 2 Plan:** Onboard 8-12 lawyers, deliver 50+ leads, $2-3K/month revenue

**Key Docs:**
- Phase 1: `/guides/phase1/CHECKLIST.md`
- Phase 2: `/guides/phase2/CHECKLIST.md`
- Pricing: `/docs/PRICING_ANALYSIS_MANUAL_LEADS.md`
```

**Done when:**
- [ ] Deleted MASTER_PLAN.md and CHANGELOG.md
- [ ] Created simple BUSINESS_MODEL.md
- [ ] Documentation is clean and current

---

## ✅ STEP 2: Finish Phase 1 - Special Circumstances (Dec 24-26)

**Time:** 2-4 hours  
**Goal:** Add special circumstances fields to calculator

### Task 2.1: Add Form Fields (1 hour)

Ask Claude Code:
```
Add special circumstances fields to the calculator:

1. In src/components/CalculatorForm.tsx, add 3 new fields AFTER the children section:

SPECIAL CIRCUMSTANCES (optional):
- Checkbox: "This case involves private school fees"
- Checkbox: "There are significant medical expenses for the children"
- Checkbox: "Other special circumstances to mention to a lawyer"
- Text input (appears if "other" checked): 200 char limit

2. Update src/hooks/useCalculator.ts:
- Add to CalculatorFormState interface:
  * hasPrivateSchool: boolean
  * hasMedicalCosts: boolean
  * hasOtherCircumstances: boolean
  * otherCircumstancesDetail?: string

3. Style consistently with design system
4. All fields are OPTIONAL (not required)
5. Add help tooltips explaining each

Production requirements:
- Proper TypeScript types
- Validation on "other" field (max 200 chars)
- Clear labels and descriptions
```

### Task 2.2: Update Complexity Detection (1 hour)

Ask Claude Code:
```
Update src/utils/complexity-detection.ts to use special circumstances:

1. In detectComplexity():
   - Set specialCircumstances = true if ANY of these are checked:
     * formData.hasPrivateSchool
     * formData.hasMedicalCosts
     * formData.hasOtherCircumstances

2. In getAlertConfig(), update specialCircumstances message:
   - If hasPrivateSchool: "Private school fees require a Binding Agreement"
   - If hasMedicalCosts: "Medical costs may qualify as special circumstances"
   - If hasOtherCircumstances: "Special circumstances may require legal review"
   - If multiple: "Multiple special circumstances detected"

3. Include details in lead brief for lawyers
```

### Task 2.3: Update Inquiry Form Email (30 min)

Make sure special circumstances data is included in the email you receive when parent submits inquiry.

### Task 2.4: Test Complete (30 min)

- [ ] Add private school fees → See alert
- [ ] Add medical costs → See alert  
- [ ] Add other circumstances → See alert
- [ ] Submit inquiry form → Email includes special circumstances
- [ ] Analytics tracks special_circumstances flag

**Done when:**
- [ ] Special circumstances fields added to calculator
- [ ] Complexity detection working
- [ ] Inquiry form includes data
- [ ] All tested end-to-end

---

## ✅ STEP 3: Phase 1 Task 7 - End-to-End Testing (Dec 27-28)

**Time:** 2-3 hours  
**Goal:** Complete testing checklist

### Full User Journey Test:

**Test 1: High Value Case**
1. [ ] Enter calculation with >$15K liability
2. [ ] See "High Value Case" alert
3. [ ] Click "Get Legal Help"
4. [ ] Fill inquiry form
5. [ ] Submit successfully
6. [ ] Receive email with lead details
7. [ ] All PostHog events fire correctly

**Test 2: Court Date Urgent**
1. [ ] Enter calculation with court date in 2 weeks
2. [ ] See "URGENT: Court Date Soon" alert (red border)
3. [ ] Click button → form → submit
4. [ ] Email shows urgency flag
5. [ ] Analytics tracks urgency level

**Test 3: Shared Care Dispute**
1. [ ] Enter 50/50 care split
2. [ ] See shared care alert
3. [ ] Complete flow
4. [ ] Verify tracking

**Test 4: Special Circumstances**
1. [ ] Check "private school fees"
2. [ ] See special circumstances alert
3. [ ] Complete flow
4. [ ] Email includes "hasPrivateSchool: true"

**Test 5: No Triggers**
1. [ ] Enter simple calculation ($5K liability, no court date, no special circumstances)
2. [ ] NO alert should show
3. [ ] No "Get Legal Help" button
4. [ ] Just normal results

**Edge Case Tests:**
- [ ] Submit form with invalid email → Validation error
- [ ] Submit form without name → Validation error
- [ ] Enter court date in past → Should not trigger urgent
- [ ] Enter court date >30 days → Should not trigger urgent
- [ ] Turn off wifi → Error handling works gracefully

**PostHog Verification:**
- [ ] All 5 events appear in dashboard
- [ ] Properties are correct
- [ ] Funnel shows complete path

**Done when:**
- [ ] All tests pass
- [ ] No crashes or errors
- [ ] Analytics working perfectly
- [ ] Ready for real users

---

## ✅ STEP 4: Prepare Phase 2 Materials (Dec 29-31)

**Time:** 4-5 hours  
**Goal:** Have all docs ready so you can START emailing lawyers Jan 2nd

### Task 4.1: Partnership Agreement (1.5 hours)

Create `docs/LAWYER_PARTNERSHIP_AGREEMENT.md`:

```markdown
# Lawyer Partnership Agreement

**Effective Date:** January 2, 2025  
**Between:** [Your Business Name] ("Platform") and [Lawyer Name] ("Partner")

## Services
Platform will send Partner pre-qualified family law leads via email.

## Lead Definition
A "Lead" is defined as a parent who:
- Completed child support calculation
- Triggered complexity threshold (high value, court date, special circumstances)
- Clicked "Get Legal Help" button
- Completed inquiry form with valid contact information
- Passed Platform quality review

## Pricing
- **$50 per lead** sent to Partner
- Billed monthly via Stripe
- Payment due within 14 days of invoice

## Territory
Partner receives leads from: [Postcode/City/Region]

## Partner Obligations
- Contact leads within 24 hours of receipt
- Provide professional legal services
- Maintain appropriate credentials and insurance
- Report any lead quality issues within 48 hours

## Refund Policy
Platform will credit Partner's account if:
- Lead is duplicate of previous lead
- Lead provided incorrect contact information
- Lead outside agreed territory
- Lead does not meet complexity threshold

No refunds for:
- Leads who don't respond to Partner's contact attempts
- Leads who choose not to engage services
- Leads who don't convert to paying clients

## Data Privacy
- Partner agrees to Platform privacy policy
- Lead data used only for client acquisition
- No sharing with third parties
- Secure storage required

## Term & Termination
- Either party may terminate with 30 days written notice
- Outstanding invoices remain due
- No leads sent during notice period

## Signatures

Platform: _________________ Date: _______

Partner: _________________ Date: _______
```

### Task 4.2: Email Templates (1 hour)

Create `docs/EMAIL_TEMPLATES.md`:

**Template 1: Lawyer Welcome Email**
```
Subject: Welcome - Partnership Confirmed

Hi [Lawyer Name],

Welcome to [Platform Name]! You're now set up to receive family law leads.

HOW IT WORKS:
You'll receive emails like this when a lead is available:

"New Lead - High Value Case - $18,450/year"
Client: Sarah M.
Location: Melbourne, VIC
Contact: sarah@email.com, 0412 XXX XXX
...

GETTING STARTED:
✓ Partnership agreement signed
✓ Stripe connected for billing
✓ Service area: [Your Area]

You should receive your first lead within 48 hours.

Questions? Just reply to this email.

Thanks,
[Your Name]
[Phone]
```

**Template 2: Lead Email to Lawyer**
```
Subject: New Lead - [Complexity] - $[Liability]/year

Hi [Lawyer],

NEW LEAD DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Client: [Name]
Email: [Email]
Phone: [Phone]
Location: [Suburb, State, Postcode]

CASE SUMMARY:
Annual Liability: $[Amount]
Payer: [Parent A/B]
Complexity: [High/Medium] - [Trigger reason]
Children: [Number], ages [Ages]

SPECIAL CIRCUMSTANCES:
[If any: Private school fees / Medical costs / Other]

THEIR MESSAGE:
"[User's message from form]"

PREFERRED CONTACT TIMES:
[Their availability]

FULL DETAILS:
Income Split: [A: $X, B: $Y]
Care Split: [A: X%, B: Y%]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTION REQUIRED:
→ Contact within 24 hours
→ Mention "Child Support Calculator" when you call

This lead will be billed at $50 on your next invoice.

Reply if there's any issue with this lead.
```

**Template 3: Monthly Invoice Email**
```
Subject: Monthly Invoice - [Month] - $[Amount] Due

Hi [Lawyer],

Your invoice for [Month] is ready.

SUMMARY:
Leads delivered: [X]
Total: $[Amount]

INVOICE:
View and pay: [Stripe invoice link]
Due date: [Date]

LEAD BREAKDOWN:
[Date] - [Client Name] - $50
[Date] - [Client Name] - $50
...

Questions about any leads? Reply within 48 hours.

Thanks,
[Your Name]
```

**Template 4: Weekly Check-In**
```
Subject: This Week's Leads - [Date Range]

Hi [Lawyer],

Quick update on your leads this week:

LEADS SENT: [X]
- [Brief summary of each]

TOTAL THIS MONTH: [X] leads ($[Amount])

Quick question: How's the quality? Reply with:
1-5 stars: ⭐⭐⭐⭐⭐

Any issues or feedback? Let me know.

Thanks,
[Your Name]
```

### Task 4.3: Tracking Spreadsheets (1 hour)

**Create Google Sheet: "Lawyer Partners"**

Columns:
```
Name | Firm | Email | Phone | State | Service Area | Stripe ID | Status | Joined | Leads Sent | Amount Owed | Last Invoice | Notes
```

**Create Google Sheet: "Lead Tracker"**

Columns:
```
ID | Date | Parent Name | Email | Phone | Location | Complexity | Liability | Lawyer | Date Sent | Status | Billable | Notes
```

Add dropdown for Status:
- Sent
- Contacted
- Booked
- Converted
- Lost
- Refunded

### Task 4.4: Lawyer Outreach Email (30 min)

Draft email for 286 firms:

```
Subject: Pre-Qualified Family Law Leads - [State]

Hi [Firm Name],

I've built a child support calculator that Australian parents use to understand their support obligations.

When complex cases arise (high-value, court dates, disputes), I connect them with local family lawyers.

I'm looking for 3-5 [State] firms to partner with.

WHAT YOU GET:
✓ Pre-qualified leads via email
✓ Full case details (income, care, complexity)
✓ $50 per lead, billed monthly
✓ No software or calendar integration required

WHAT I NEED:
• Email address for leads
• Service area (suburbs/regions)
• Stripe account for billing

This is not a "pay per appointment" or "pay per client" model. 
You pay $50 when I send you the lead email. Simple.

Interested? Reply and I'll send the partnership agreement.

[Your Name]
[Phone]
[Website]
```

**Done when:**
- [ ] Partnership agreement created
- [ ] All email templates ready
- [ ] Tracking spreadsheets set up
- [ ] Outreach email drafted and refined

---

## ✅ STEP 5: Optional Polish (Jan 1-2)

**Time:** 2-4 hours (if you want)  
**Goal:** Make calculator as good as possible

### Option A: App Store Deployment (Recommended)

**Publish to iOS and Android stores in parallel with finishing Phase 1!**

See detailed guide: `/guides/APP_STORE_DEPLOYMENT.md`

**Quick summary:**
- Day 1: Create app icon, screenshots, privacy policy (30 min)
- Day 2: Build and submit iOS (1 hour)
- Day 3: Build and submit Android (45 min)
- Wait 3-7 days for approval (meanwhile finish Phase 1)
- By Jan 2-5: Live on both stores!

**Why do this now:**
- Takes 1-2 weeks for approval anyway
- Lawyers can see/download the app
- Professional credibility
- SEO/discovery in app stores

### Option B: UI Polish (If Skipping App Stores)

Polish Tasks (Pick What Matters to You):

- [ ] Improve calculator UI styling (any rough edges?)
- [ ] Add more help tooltips (explain complexity better)
- [ ] Test on Android device (if you have one)
- [ ] Improve loading states and animations
- [ ] Add "Share results" feature (nice to have)
- [ ] Write better breakdown explanations
- [ ] Add FAQ section to app (optional)

**OR just relax. Phase 1 is functionally complete.**

---

## 📅 TIMELINE SUMMARY

**Dec 24 (Today):**
- Delete outdated docs (30 min)
- Create BUSINESS_MODEL.md (15 min)
- Start Task 2.1: Add special circumstances fields (1 hour)

**Dec 25 (Christmas):**
- Take the day off OR finish special circumstances if you want

**Dec 26 (Boxing Day):**
- Complete Task 2: Special circumstances (remaining 1-2 hours)

**Dec 27:**
- Task 3: End-to-end testing (2-3 hours)

**Dec 28:**
- Finish any remaining testing
- Start Task 4: Phase 2 materials

**Dec 29-30:**
- Complete Task 4: Partnership agreement, templates, spreadsheets

**Dec 31:**
- Review everything, make final tweaks

**Jan 1:**
- Rest

**Jan 2 (LAUNCH DAY):**
- Send first batch of 50 lawyer emails (NSW)
- Phase 2 officially begins!

---

## ✅ SUCCESS CHECKLIST

By Jan 2, you should have:

**Phase 1 Complete:**
- [ ] Special circumstances fields added
- [ ] All complexity triggers working
- [ ] Full end-to-end testing done
- [ ] Analytics verified in PostHog
- [ ] No bugs or crashes

**Phase 2 Ready:**
- [ ] Partnership agreement created
- [ ] Email templates ready (4 templates)
- [ ] Tracking spreadsheets set up (2 sheets)
- [ ] Lawyer outreach email drafted
- [ ] 286 firm emails ready to send

**Documentation Clean:**
- [ ] Deleted confusing/outdated files
- [ ] Created simple BUSINESS_MODEL.md
- [ ] All docs reflect current plan ($50/lead, manual routing)

**Mental State:**
- [ ] Clear on what you're building
- [ ] Confident in the business model
- [ ] Ready to talk to lawyers
- [ ] Excited to start Phase 2!

---

## 🚀 LAUNCH DAY PLAN (Jan 2)

**9am:**
- Send first batch: 50 NSW lawyer emails
- Use template from Task 4.4

**Throughout day:**
- Monitor responses
- Reply within 1 hour to interested lawyers
- Send partnership agreement to anyone who responds

**Evening:**
- Track responses in spreadsheet
- Plan batch 2 for Jan 3

**Goal:** Get first 3 lawyers signed by end of week (Jan 2-6)

---

**You have 10 days. Use them wisely. When lawyers return Jan 2, you'll be ready to GO.** 🎄🚀
