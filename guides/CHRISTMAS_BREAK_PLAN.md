# Christmas Break Action Plan (Dec 24 - Jan 2)

**Goal:** Finish Phase 1 completely + Prepare Phase 2 materials  
**Timeline:** 10 days  
**Outcome:** Ready to email lawyers Jan 2nd

---

## 🗑️ STEP 1: Documentation Cleanup (30 min - DO THIS FIRST)

**Tool:** Claude Code  
**Model:** Sonnet 4.5 ✅  
**Thinking Mode:** Can turn OFF ⚪ (simple file deletions and removals)  
**Plan Mode:** Regular ✅ (straightforward operations)

---

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

## ✅ STEP 2: Finish Phase 1 - Change of Assessment Triggers (Dec 24-26)

**Time:** 4-5 hours  
**Goal:** Add post-result Change of Assessment prompt to trigger lawyer alerts

---

## 🤖 Claude Code Configuration for Step 2

### Recommended Settings:

**Model:** Sonnet 4.5 ✅
- **Why:** Standard React Native components, form state management
- **Cost:** ~$1-2 for all of Step 2
- **Don't use Opus:** Not needed for this work

**Thinking Mode:** Keep ON ✅
- **Why:** Complex state management, animation, multi-file changes
- **Cost:** Extra $0.50-1 for Step 2
- **Worth it:** YES - prevents bugs in state management

**Plan Mode by Task:**
- **Task 2.1 (Constants):** Regular mode ✅ - Simple file creation
- **Task 2.2 (UI Component):** Plan mode ✅ - Complex multi-state component with animations
- **Task 2.3 (Complexity Detection):** Regular mode ✅ - Straightforward logic updates
- **Task 2.4 (Inquiry Form):** Regular mode ✅ - Simple display component
- **Task 2.5 (Testing):** Regular mode ✅ - Manual testing, no code generation

**How to Check Your Mode:**
Look at the text below the input box in Claude Code:
- Regular mode: `? for shortcuts` or `1 line selected`
- Plan mode: `" plan mode on (shift+tab to cycle)`
- Press **Shift+Tab** to cycle between modes

**Accept Edits:** Keep OFF ✅
- **Why:** You want to review each change
- **This is NOT Plan Mode** - it's auto-approval of edits

---

## 🎯 WHY THIS APPROACH IS BETTER:
- ✅ User sees result FIRST → feels emotional impact → motivated to act
- ✅ Uses official Services Australia "Change of Assessment" language (credible)
- ✅ Teaches users the 10 official grounds for appeal (educational)
- ✅ Better lead quality: Lawyers get specific CoA reasons, not vague "special circumstances"
- ✅ Higher conversion: "This feels unfair!" is a stronger trigger than pre-calculation checkboxes
- ✅ Fear factor: "Would the other parent think this is unfair?" = defensive motivation

---

### 💡 CRITICAL: Production Code Reminder

**ALL prompts in this step follow production-quality standards:**
- ✅ Error handling for all failure cases
- ✅ Input validation and sanitization
- ✅ Loading states where needed
- ✅ Edge case handling
- ✅ Proper TypeScript types (no 'any')
- ✅ Accessibility labels where appropriate

**These are not suggestions - they are requirements.** Claude will build exactly what you ask for. If you don't ask for production quality, you'll get demo quality.

---

### Task 2.1: Add Change of Assessment Constants (30 min)

**Settings:** Sonnet 4.5, Thinking ON, Regular mode ✅

Ask Claude Code:
```
Create src/utils/change-of-assessment-reasons.ts with the 10 official Change of Assessment reasons from Services Australia:

1. Define ChangeOfAssessmentReason interface:
   - id: string (e.g., 'income_not_reflected')
   - label: string (user-facing text)
   - description: string (help tooltip text)
   - priority: number (1-10, for sorting alerts by urgency)

2. Export array CHANGE_OF_ASSESSMENT_REASONS with all 10 reasons:
   - Income not accurately reflected in ATI
   - High costs of child care (medical, disability, special needs)
   - High costs of contact (travel for visitation)
   - Private school fees
   - Supporting other children (relevant dependents)
   - Property settlement impacts capacity to pay
   - Business or partnership income not captured
   - Trust distributions not in ATI
   - Other substantial income (rental, investments, overseas)
   - Other special circumstances

3. Add helper function getCoAReasonById(id: string)
4. Add helper function getHighestPriorityReason(selectedIds: string[])

PRODUCTION REQUIREMENTS:
- Proper TypeScript types (no 'any')
- Handle invalid IDs gracefully (return null, don't crash)
- Add JSDoc comments for each reason explaining when it applies
- Make array immutable (readonly)
- Export type for use in other components

CRITICAL: Think about what could go wrong:
- What if someone passes an invalid ID?
- What if the array is accidentally mutated?
- What if selectedIds is empty or undefined?

Build production-ready code, not just a demo.
```

---

### Task 2.2: Add Change of Assessment UI Component (1.5-2 hours)

**Settings:** Sonnet 4.5, Thinking ON, **PLAN MODE** ✅ (Press Shift+Tab until you see "" plan mode on")

Ask Claude Code:
```
Update src/components/CalculatorResults.tsx to add Change of Assessment prompt AFTER the results display:

1. Add state management:
   - selectedReasons: string[] (IDs of selected CoA reasons)
   - showCoASection: boolean (collapsed by default, expand when user taps)

2. Add UI section after main results, styled as a card:

   Header (always visible, tappable to expand):
   "⚖️ Does this result seem unfair?"
   "...or do you expect the other parent would think it's unfair?"
   
   Subtext: 
   "Cases with these factors often benefit from legal review"
   
   When expanded:
   - Map over CHANGE_OF_ASSESSMENT_REASONS
   - Render each as a checkbox with label + help icon
   - Help icon shows description tooltip
   - Group by priority (urgent vs normal)
   
   Visual hierarchy:
   - High priority reasons (1-3) in red/orange group labeled "⚠️ URGENT"
   - Normal reasons (4-10) in blue group labeled "📋 Common"
   
   Bottom:
   - Show count: "X reasons selected"
   - Button: "Request Legal Review" (only if ≥1 selected)
   - Secondary text: "Free consultation, no obligation"

3. Button behavior:
   - Track analytics: 'coa_reasons_selected' with selectedReasons array
   - Navigate to lawyer inquiry form
   - Pass selectedReasons + calculation data as params

PRODUCTION REQUIREMENTS:
- Proper TypeScript types for all state
- Smooth expand/collapse animation (use Animated API)
- Handle rapid checkbox toggling without state corruption
- Validate at least 1 reason selected before showing button
- Add accessibility labels (ARIA) for screen readers
- Disable button during navigation (prevent double-tap)
- Show loading state if navigation is slow
- Handle undefined/null formData gracefully

STYLING (match design system):
- Card background: #1e293b (slate-800)
- Border: #334155 (slate-700)
- Urgent section border: #ef4444 (red-500)
- Header text: #ffffff, 18px, weight 600
- Checkbox labels: #e2e8f0 (slate-200), 14px
- Help icon: #94a3b8 (slate-400)
- Button: #2563eb (blue-600), or #ef4444 if urgent reasons selected
- Border radius: 12px
- Padding: 20px

CRITICAL: Think about what could go wrong:
- What if user rapidly toggles all 10 checkboxes?
- What if they select 0 reasons and try to submit?
- What if navigation.navigate fails?
- What if selectedReasons becomes undefined?
- What if user expands/collapses rapidly?
- How do you prevent double-button-press?

Build production-ready code, not just a demo.
```

---

### Task 2.3: Update Complexity Detection (45 min)

**Settings:** Sonnet 4.5, Thinking ON, Regular mode ✅

Ask Claude Code:
```
Update src/utils/complexity-detection.ts to use Change of Assessment reasons:

1. Add to ComplexityFormData interface:
   - selectedCoAReasons?: string[] (optional)

2. Update detectComplexity():
   - Set specialCircumstances = true if formData.selectedCoAReasons.length > 0
   - Handle undefined gracefully (treat as empty array)
   - Add console.log for debugging which reasons selected

3. Update getAlertConfig() for special circumstances:
   - Import getHighestPriorityReason from change-of-assessment-reasons
   - Get the highest priority reason from selected list
   - Use reason-specific message based on priority:
   
   Priority 1-3 (URGENT):
   "⚠️ URGENT: [Reason] Detected"
   "This requires immediate legal review before proceeding."
   urgency: 'high'
   
   Priority 4-10 (NORMAL):
   "📋 Change of Assessment: [Reason]"
   "Cases with [reason] often benefit from legal review."
   urgency: 'medium'
   
   Multiple reasons:
   "[X] Factors Affecting Fairness Detected"
   "Multiple Change of Assessment grounds apply to your case."
   urgency: based on highest priority reason

4. Create lead data object for lawyers:
   - Include array of selected CoA reason labels (not IDs)
   - Include description of each reason for context
   - Format for email template:
     ```
     CHANGE OF ASSESSMENT GROUNDS:
     1. Income not accurately reflected (priority: URGENT)
        → Tax return doesn't reflect current earnings
     2. Private school fees (priority: Normal)
        → Education costs beyond standard calculation
     ```

PRODUCTION REQUIREMENTS:
- Proper TypeScript types for all functions
- Handle undefined formData.selectedCoAReasons gracefully
- Handle empty array (no reasons selected)
- Don't crash if reason ID is invalid
- Sanitize reason labels before including in lead data
- Add console.log for debugging which alert triggered
- Unit test with edge cases:
  * selectedCoAReasons is undefined
  * selectedCoAReasons is empty []
  * selectedCoAReasons has 1 urgent reason
  * selectedCoAReasons has 1 normal reason
  * selectedCoAReasons has mix of urgent + normal
  * selectedCoAReasons has invalid ID

CRITICAL: Think about what could go wrong:
- What if selectedCoAReasons is undefined?
- What if it contains invalid IDs?
- What if it's an empty array?
- What if getHighestPriorityReason returns null?
- How do you prevent XSS in reason labels?
- What if multiple URGENT reasons are selected?

Build production-ready code, not just a demo.
```

---

### Task 2.4: Update Inquiry Form to Include CoA Data (30 min)

**Settings:** Sonnet 4.5, Thinking ON, Regular mode ✅

Ask Claude Code:
```
Update src/screens/LawyerInquiryScreen.tsx to display and submit Change of Assessment reasons:

1. Accept route params:
   - selectedCoAReasons: string[] (from previous screen)
   - Pass through from CalculatorResults navigation

2. Display CoA reasons in read-only summary card ABOVE the inquiry form:
   
   Card title: "📋 Change of Assessment Grounds Selected"
   
   List each reason with:
   - Icon based on priority (⚠️ for urgent, 📋 for normal)
   - Reason label
   - Reason description (smaller text)
   
   Example:
   ```
   📋 CHANGE OF ASSESSMENT GROUNDS SELECTED
   
   ⚠️ Income not accurately reflected
      Tax return doesn't reflect current earnings
   
   📋 Private school fees
      Education costs beyond standard calculation
   ```

3. Include in lead data object when form submitted:
   - Add changeOfAssessmentReasons array
   - Include both labels and descriptions
   - Format for lawyer email (see Task 2.3 format)

4. Update analytics tracking:
   - Event: 'inquiry_submitted'
   - Properties:
     * hasCoAReasons: boolean
     * coaReasonCount: number
     * coaReasonIds: string[]
     * hasUrgentReasons: boolean

PRODUCTION REQUIREMENTS:
- Handle undefined selectedCoAReasons gracefully (show nothing)
- Handle empty array (show nothing, don't show empty card)
- Validate reason IDs before displaying (skip invalid ones)
- Sanitize reason text before displaying/submitting
- Add error handling if analytics.track fails
- Don't crash if route params are missing
- Show loading state while submitting

STYLING (match design system):
- Card background: #1e293b (slate-800)
- Border: #334155 (slate-700), or #ef4444 (red) if urgent reasons
- Reason label: #ffffff, 15px, weight 600
- Description: #94a3b8 (slate-400), 13px
- Icon: #ef4444 (urgent) or #3b82f6 (normal)
- Padding: 16px
- Border radius: 12px
- Margin bottom: 20px (space before form)

CRITICAL: Think about what could go wrong:
- What if selectedCoAReasons is undefined?
- What if it contains invalid reason IDs?
- What if navigation params are corrupted?
- What if the card takes up too much screen space?
- How do you handle very long reason descriptions?
- What if analytics is blocked?

Build production-ready code, not just a demo.
```

### Task 2.5: Test Complete (45 min)

**Settings:** Manual testing - no Claude Code needed

**Test the full Change of Assessment flow:**

1. [ ] Complete calculation → Results show
2. [ ] Tap "Does this result seem unfair?" → Section expands
3. [ ] See 10 CoA reasons grouped by priority (Urgent vs Common)
4. [ ] Select 1 urgent reason → Button shows with red styling
5. [ ] Select 1 normal reason → Button shows with blue styling
6. [ ] Select multiple reasons → Button shows count "3 reasons selected"
7. [ ] Tap button → Navigate to inquiry form
8. [ ] See CoA reasons displayed in read-only card above form
9. [ ] Submit form → Console.log shows CoA data
10. [ ] PostHog tracks: hasCoAReasons, coaReasonCount, coaReasonIds

**Edge cases:**
- [ ] Select 0 reasons → Button doesn't appear
- [ ] Rapidly toggle checkboxes → No state corruption
- [ ] Navigate back → Selected reasons persist
- [ ] Invalid reason ID in data → Skipped gracefully

**Done when:**
- [ ] Change of Assessment section added to results
- [ ] 10 official reasons implemented
- [ ] Complexity detection working
- [ ] Inquiry form includes CoA data
- [ ] All tested end-to-end
- [ ] Analytics tracking working

---

## ✅ STEP 3: Phase 1 Task 7 - End-to-End Testing (Dec 27-28)

**Time:** 2-3 hours  
**Goal:** Complete testing checklist

**Tool:** Your hands + the app (no AI needed!)  
**What you're doing:** Manual testing on iOS simulator/Android emulator  
**Verify:** All features work, no crashes, analytics firing correctly

---

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

**Test 4: Change of Assessment - Urgent Reason**
1. [ ] Complete calculation → See results
2. [ ] Expand "Does this result seem unfair?" section
3. [ ] Select "Income not accurately reflected" (urgent)
4. [ ] See red "Request Legal Review" button
5. [ ] Click → Navigate to inquiry form
6. [ ] See urgent CoA reason displayed with ⚠️ icon
7. [ ] Submit form
8. [ ] Email includes: "CHANGE OF ASSESSMENT GROUNDS (URGENT): Income not accurately reflected"
9. [ ] PostHog tracks: hasCoAReasons: true, hasUrgentReasons: true

**Test 5: Change of Assessment - Multiple Reasons**
1. [ ] Complete calculation → See results
2. [ ] Expand CoA section
3. [ ] Select 3 reasons: "Private school fees", "High costs of contact", "Other income"
4. [ ] See button show "3 reasons selected"
5. [ ] Submit inquiry
6. [ ] Email shows all 3 reasons with descriptions
7. [ ] PostHog tracks: coaReasonCount: 3

**Test 6: Defensive Motivation (Fear Factor)**
1. [ ] Enter calculation where THEY would pay
2. [ ] See result: "You will receive $X/year"
3. [ ] Read: "...or do you expect the other parent would think it's unfair?"
4. [ ] Select reasons they might use to challenge
5. [ ] Get defensive consultation ("protect my entitlement")

**Test 7: No Triggers**
1. [ ] Enter simple calculation ($5K liability, no court date, no CoA selected)
2. [ ] NO alert should show initially
3. [ ] CoA section still available (collapsed)
4. [ ] User can expand and select reasons if they want
5. [ ] If they select reasons → lawyer alert triggers

**Edge Case Tests:**
- [ ] Submit form with invalid email → Validation error
- [ ] Submit form without name → Validation error
- [ ] Enter court date in past → Should not trigger urgent
- [ ] Enter court date >30 days → Should not trigger urgent
- [ ] Select 0 CoA reasons → No button, no alert
- [ ] Select 10 CoA reasons → All show in form, email readable
- [ ] Navigate back from inquiry form → CoA selections preserved
- [ ] Rapidly toggle CoA checkboxes → No crashes, smooth updates
- [ ] Turn off wifi → Error handling works gracefully

**PostHog Verification:**
- [ ] All events appear in dashboard
- [ ] CoA reason IDs tracked correctly
- [ ] Urgent vs normal reasons distinguished
- [ ] Properties are correct
- [ ] Funnel shows complete path

**Done when:**
- [ ] All tests pass
- [ ] No crashes or errors
- [ ] Analytics working perfectly
- [ ] Change of Assessment flow working end-to-end
- [ ] Ready for real users

---

## ✅ STEP 4: Prepare Phase 2 Materials (Dec 29-31)

**Time:** 4-5 hours  
**Goal:** Have all docs ready so you can START emailing lawyers Jan 2nd

**Tool:** Desktop Commander (this chat) - better for writing docs than Claude Code  
**Model:** Sonnet 4.5 ✅  
**Thinking Mode:** Can turn OFF ⚪ (writing templates and spreadsheets)  
**Why use Desktop Commander:** Better for creating documents, templates, and planning materials

---

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
