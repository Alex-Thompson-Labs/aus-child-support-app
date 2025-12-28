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

**IMPORTANT - Forensic Accountant Value-Add Note:**

For COA Reason 8 cases (income from self-employment/trusts/companies), we want to educate users about forensic accountants WITHOUT making them feel they can skip the lawyer.

When implementing the complexity detection alerts, add this educational note specifically for Reason 8:

**Primary message:** "Your ex may be hiding income through their business/trust structure."

**Value-add note (below primary message, smaller/lighter text):**
"Tip: Family lawyers who specialize in complex income cases may recommend a forensic accountant to investigate. These typically cost $5,000-$15,000 but can uncover hidden income worth 10-50x their fee. Your lawyer will advise if this is appropriate for your case."

**Styling for the value-add note:**
- Font size: slightly smaller than primary message
- Color: #94a3b8 (slate-400) - lighter than main text
- Margin: 8px separation from primary message
- Keep tone educational, not salesy
- Emphasize: "Your lawyer will advise" - keeps lawyers in control

This approach:
✓ Gives users more reasons to engage (conversion optimization)
✓ Educates about available tools (adds value)
✓ Prevents false impression they can skip lawyers (lawyers recommend the accountant)
✓ Sets realistic expectations (cost range upfront)

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

1. [x] Complete calculation → Results show
2. [x] Tap "Does this result seem unfair?" → Section expands
3. [x] See 10 CoA reasons grouped by priority (Urgent vs Common)
4. [x] Select 1 urgent reason → Button shows with red styling
5. [x] Select 1 normal reason → Button shows with blue styling
6. [x] Select multiple reasons → Button shows count "3 reasons selected"
7. [x] Tap button → Navigate to inquiry form
8. [x] See CoA reasons displayed in read-only card above form
9. [x] Submit form → Console.log shows CoA data
10. [x] PostHog tracks: hasCoAReasons, coaReasonCount, coaReasonIds

**Edge cases:**
- [x] Select 0 reasons → Button doesn't appear
- [x] Rapidly toggle checkboxes → No state corruption
- [x] Navigate back → Selected reasons persist
- [x] Invalid reason ID in data → Skipped gracefully

**Done when:**
- [x] Change of Assessment section added to results
- [x] 10 official reasons implemented
- [x] Complexity detection working
- [x] Inquiry form includes CoA data
- [x] All tested end-to-end
- [x] Analytics tracking working

---

### Task 2.6: Redesign Special Circumstances Messaging (TBD - Discussion needed)

**Settings:** Desktop Commander (discussion + planning), then Claude Code for implementation

**PROBLEM IDENTIFIED:**
Current approach lists 10 specific CoA reasons (5.2.1, 5.2.2, etc.) which makes it too obvious users could DIY this themselves. We're essentially handing them the instruction manual for filing Form A with Services Australia.

**STRATEGIC GOAL:**
Reframe the messaging to:
1. Use plain language that feels like outcomes/problems, not bureaucratic categories
2. Make lawyers seem necessary (gatekeepers to "adjustments")
3. Focus on the most common triggers (8A/8B by huge margin)
4. Avoid mentioning "change of assessment" explicitly
5. Increase lead quality by getting users who genuinely need help

**KEY INSIGHTS:**
- **Most common:** Reasons 8A & 8B (income/earning capacity issues) - need to be front and centre
- **Next tier:** Reason 3 (special needs/education costs)
- **Secondary:** Reasons 1, 2, 4 (travel costs, medical, transfers to child)
- **Skip:** Reason 7 (low income payers obviously can't afford legal help)

**DISCUSSION NEEDED WITH CLAUDE CODE:**
1. How to restructure the UI - checkboxes vs passive mention vs conditional trigger?
2. What copy/messaging makes lawyers seem necessary without being too obvious?
3. Should this be interactive or just informational?
4. How to track which approach converts better?

**NEXT STEPS:**
- [ ] Continue discussion with Claude Code in separate session
- [ ] Decide on implementation approach (Options 1, 2, or 3 from initial discussion)
- [ ] Draft actual copy/messaging
- [ ] Update Task 2.2 implementation based on new approach
- [ ] Update Task 2.3 to align with new messaging strategy
- [ ] Test different versions if needed (A/B test)

**CONTEXT FOR CLAUDE CODE:**
When you open Claude Code for this, reference this task and the uploaded screenshot showing the 10 CoA reasons. The goal is to make this feel less like a checklist and more like a natural conversation about complexity.

---

## ✅ STEP 3: Add Forensic Accountant Value-Add Note (Dec 26 - 15 min)

**Time:** 15 minutes  
**Goal:** Add educational note about forensic accountants for income suspicion cases (CoA Reason 8)

**Tool:** Claude Code  
**Model:** Sonnet 4.5 ✅  
**Thinking Mode:** Can turn OFF ⚪ (simple text addition)  
**Plan Mode:** Regular ✅ (single file edit)

---

### Claude Code Prompt:

```
Update the alert messaging for CoA Reason 8 (income suspicion) cases:

In src/utils/complexity-detection.ts, find the alert config for "Income not accurately reflected" or similar income-related triggers.

Add a two-part message structure:

PRIMARY MESSAGE (existing):
"Your ex may be hiding income through their business/trust structure."

VALUE-ADD NOTE (new - add below primary message):
"Tip: Family lawyers who specialize in complex income cases may recommend a forensic accountant to investigate. These typically cost $5,000-$15,000 but can uncover hidden income worth 10-50x their fee. Your lawyer will advise if this is appropriate for your case."

STYLING FOR VALUE-ADD NOTE:
- Render in LawyerAlert component below main message
- Font size: 13px (slightly smaller than primary message)
- Color: #94a3b8 (slate-400 - lighter than main text)
- Margin top: 8px (separate from primary message)
- Keep tone educational, not salesy

UPDATE LawyerAlert COMPONENT:
If the component doesn't support a secondary message, update it to accept an optional "tip" or "note" prop that renders below the main message with the styling above.

PRODUCTION REQUIREMENTS:
- Make the tip/note prop optional (not all alerts need it)
- Only show for relevant triggers (income suspicion cases)
- Proper TypeScript types
- Test that it renders correctly without breaking existing alerts
```

---

**Test it works:**
1. [ ] Complete calculation that triggers income suspicion (CoA Reason 8)
2. [ ] See alert with primary message + educational note
3. [ ] Verify styling: lighter color, smaller text, proper spacing
4. [ ] Verify other alerts (high value, court date) still work without the note

**Done when:**
- [ ] Educational note displays for income suspicion cases
- [ ] Styling looks clean and professional
- [ ] Other alerts unaffected
- [ ] No TypeScript errors

---

## ✅ STEP 4: Phase 1 Task 7 - End-to-End Testing (Dec 27-28)

**Time:** 2-3 hours  
**Goal:** Complete testing checklist

**Tool:** Your hands + the app (no AI needed!)  
**What you're doing:** Manual testing on iOS simulator/Android emulator  
**Verify:** All features work, no crashes, analytics firing correctly

---

### Full User Journey Test:

**Test 1: High Value Case**
1. [x] Enter calculation with >$15K liability
2. [x] See "High Value Case" alert
3. [x] Click "Get Legal Help"
4. [x] Fill inquiry form
5. [x] Submit successfully
6. [ ] Receive email with lead details
7. [x] All PostHog events fire correctly

**Test 2: Court Date Urgent**
1. [x] Enter calculation with court date in 2 weeks
2. [x] See "URGENT: Court Date Soon" alert (red border)
3. [x] Click button → form → submit
4. [ ] Email shows urgency flag
5. [ ] Analytics tracks urgency level

**Test 3: Shared Care Dispute**
1. [x] Enter 50/50 care split
2. [x] See shared care alert
3. [x] Complete flow
4. [x] Verify tracking

**Test 4: Change of Assessment - Urgent Reason**
1. [x] Complete calculation → See results
2. [x] Expand "Does this result seem unfair?" section
3. [x] Select "Income not accurately reflected" (urgent)
4. [x] See red "Request Legal Review" button
5. [x] Click → Navigate to inquiry form
6. [x] See urgent CoA reason displayed with ⚠️ icon
7. [x] Submit form
8. [ ] Email includes: "CHANGE OF ASSESSMENT GROUNDS (URGENT): Income not accurately reflected"
9. [ ] PostHog tracks: hasCoAReasons: true, hasUrgentReasons: true

**Test 5: Change of Assessment - Multiple Reasons**
1. [x] Complete calculation → See results
2. [x] Expand CoA section
3. [x] Select 3 reasons: "Private school fees", "High costs of contact", "Other income"
4. [x] See button show "3 reasons selected"
5. [x] Submit inquiry
6. [ ] Email shows all 3 reasons with descriptions
7. [x] PostHog tracks: coaReasonCount: 3

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

## ✅ STEP 4: Business Identity Setup (Dec 27-28)

**Time:** 3-4 hours  
**Goal:** Professional business presence for lawyer outreach (LinkedIn, business identity, professional image)

**Why this matters:** You need to look legitimate when reaching out to lawyers. An alias protects your privacy while building professional credibility.

---

### Task 4.1: Domain Registration & Business Email Setup (Dec 26 - 30 min + $20)

**DECISION MADE:** 
- Alias: **Alex Thompson**
- Business: **Australian Child Support Calculator**
- Domain: **childsupportcalc.com.au** (or backup if taken)

**Register Domain via VentraIP (10 minutes + $20/year):**

1. [ ] Go to https://ventraip.com.au
2. [ ] Search for: `childsupportcalc.com.au`
3. [ ] If taken, try backups in order:
   - `cscalculator.com.au`
   - `childsupportcalc.au`
   - `aussiecsc.com.au`
   - `csccalc.com.au`
4. [ ] Add to cart (1 year registration)
5. [ ] Create VentraIP account
6. [ ] Pay (~$20)
7. [ ] Select "Email Forwarding" when offered (FREE - included)

**Set Up Email Forwarding (5 minutes):**

1. [ ] In VentraIP dashboard → Email Forwarding
2. [ ] Create: `alex@childsupportcalc.com.au`
3. [ ] Forward to: Your real Gmail address
4. [ ] Save settings
5. [ ] Test: Send email to alex@childsupportcalc.com.au, verify it arrives in your Gmail

**Set Up "Send As" in Gmail (15 minutes):**

1. [ ] Open Gmail → Settings (gear) → See all settings
2. [ ] Go to "Accounts and Import" tab
3. [ ] Click "Add another email address"
4. [ ] Name: `Alex Thompson`
5. [ ] Email: `alex@childsupportcalc.com.au`
6. [ ] Uncheck "Treat as alias"
7. [ ] SMTP Settings (check VentraIP docs for exact values):
   - Server: `mail.ventraip.com.au`
   - Port: 587
   - Username: `alex@childsupportcalc.com.au`
   - Password: (create in VentraIP email settings)
8. [ ] Verify via email confirmation
9. [ ] Test: Send email FROM alex@childsupportcalc.com.au

**Create Email Signature:**

1. [ ] Gmail → Settings → General → Signature
2. [ ] Create new: "Alex Thompson Business"
3. [ ] Copy-paste:
   ```
   Alex Thompson
   Founder
   Australian Child Support Calculator
   
   E: alex@childsupportcalc.com.au
   P: [Phone - add after getting virtual number]
   W: www.childsupportcalc.com.au
   ```
4. [ ] Set as default for alex@childsupportcalc.com.au
5. [ ] Save

**Optional: Simple Landing Page (20 minutes):**

1. [ ] VentraIP Dashboard → Website Builder
2. [ ] Choose simple template
3. [ ] Create single page:
   - Headline: "Australian Child Support Calculator"
   - Subtext: "Free calculator helping parents understand their support obligations"
   - Contact: "For family lawyers: alex@childsupportcalc.com.au"
4. [ ] Publish to www.childsupportcalc.com.au

**Done when:**
- [ ] Domain registered and active
- [ ] Email forwarding working (test received)
- [ ] Gmail "Send As" working (test sent)
- [ ] Email signature created
- [ ] Optional: Landing page live

**Total Cost:** $20/year

---

### Task 4.2: AI Professional Headshot (Dec 26 - 45 min + $29)

**Take Selfies (15 minutes):**

Requirements: 5-10 photos of yourself
- [ ] Different angles (straight on, slight left, slight right)
- [ ] Different lighting (window light, indoor light)
- [ ] Different expressions (neutral, slight smile)
- [ ] Just face and shoulders
- [ ] Don't worry about background or clothes - AI will fix

**Pro tips:**
- Use natural light from a window
- Look directly at camera
- Relax your face
- Take more than you think you need (10-15 is fine)

**Upload to AI Service (30 minutes + $29):**

**Option A - HeadShot Pro (Recommended):**
1. [ ] Go to https://www.headshotpro.com
2. [ ] Create account
3. [ ] Upload your 5-10 selfies
4. [ ] Select style: "Corporate Professional" or "Business Headshot"
5. [ ] Pay $29 (one-time payment)
6. [ ] Wait 2 hours for AI to generate 100+ variations
7. [ ] Browse results and pick most professional/trustworthy one
8. [ ] Download high-resolution version

**Option B - Alternatives if HeadShot Pro unavailable:**
- ProfilePicture.ai ($15-20)
- Remini AI (free tier available)
- PhotoAI ($25)

**Option C - Free Canva Logo (if skipping AI headshot):**
1. [ ] Go to Canva.com (free account)
2. [ ] Search "LinkedIn profile picture" template
3. [ ] Create circle logo with "AT" or "Alex Thompson"
4. [ ] Use professional blue/grey colors (#2563eb blue, #64748b grey)
5. [ ] Download PNG

**What you're looking for:**
✓ Professional attire (suit/blazer or business casual)
✓ Clean/neutral background
✓ Slight smile or confident neutral expression
✓ Good lighting on face
✓ Approachable and trustworthy vibe

**Done when:**
- [ ] Professional headshot downloaded (or logo created)
- [ ] Image looks credible and professional
- [ ] File saved and ready to upload to LinkedIn

**Total Cost:** $29 (or $0 if using Canva logo)

---

### Task 4.3: Create LinkedIn Profile as Alex Thompson (Dec 26-27 - 1 hour)

**IMPORTANT:** Use the complete profile text from `/home/claude/alex_thompson_setup_guide.md`

**Create Account:**
1. [ ] Go to https://www.linkedin.com
2. [ ] Click "Join now"
3. [ ] Enter NEW email (not your personal one): _____________@gmail.com
4. [ ] Create password
5. [ ] **Name:** Alex Thompson
6. [ ] Complete signup

**Upload Photo:**
- [ ] Upload AI headshot (or Canva logo)

**Complete Profile (copy-paste from setup guide):**

1. [ ] **Headline:**
   ```
   Founder at Australian Child Support Calculator | Connecting Parents with Family Law Expertise
   ```

2. [ ] **Location:** Melbourne, Victoria, Australia (or your actual city)

3. [ ] **About section:** (see alex_thompson_setup_guide.md for full text)

4. [ ] **Experience - Add Position:**
   - Title: Founder
   - Company: Australian Child Support Calculator
   - Employment type: Self-employed
   - Start date: January 2025
   - Currently working: ✓ checked
   - Location: Australia
   - Description: (see setup guide)

5. [ ] **Projects - Add Project:**
   - Project name: Australian Child Support Calculator
   - Start: 2024
   - Currently working: ✓ checked
   - Description: (see setup guide)

6. [ ] **Skills - Add these 5:**
   - Family Law
   - Legal Technology
   - Lead Generation
   - Business Development
   - Software Development

7. [ ] **Education:** Leave blank (or "Self-taught" if forced)

**Privacy Settings:**
1. [ ] Settings & Privacy → Visibility
2. [ ] Edit public profile
3. [ ] Make visible: Name, headline, location, current position
4. [ ] Hide: Education, past experience, connections

**Add Contact Info:**
1. [ ] Profile → Contact Info
2. [ ] Add: alex@childsupportcalc.com.au
3. [ ] Add: [Virtual phone when you get it]
4. [ ] Add: www.childsupportcalc.com.au

**Done when:**
- [ ] Profile complete with all sections
- [ ] Photo uploaded
- [ ] Looks professional and credible
- [ ] Privacy settings configured
- [ ] Ready to send connection requests

---

### Task 4.4: Virtual Phone Number Setup (Dec 27 - 30 min + $12)

**Option 1: Prepaid SIM Card (Easiest for Australia):**

1. [ ] Go to Woolworths or Coles
2. [ ] Buy prepaid SIM card ($2)
3. [ ] Buy $10 recharge credit
4. [ ] Activate SIM
5. [ ] Add number to LinkedIn contact info
6. [ ] Add number to email signature
7. [ ] Test: Call the number from your real phone

**Option 2: Virtual Phone Service:**
- Hushed app (iOS/Android)
- Burner app
- Any AU virtual number service

**Option 3: Google Voice (requires VPN):**
1. [ ] Install VPN (set to USA)
2. [ ] Sign up for Google Voice
3. [ ] Get phone number
4. [ ] Forward to your real phone

**Done when:**
- [ ] Virtual phone number active
- [ ] Added to LinkedIn profile
- [ ] Added to email signature
- [ ] Tested and working

**Total Cost:** $12 (SIM + credit)

---

### Task 4.5: LinkedIn Warm-Up & Tracking (Dec 27-Jan 1 - 10 min/day)

**Create Tracking Spreadsheet:**

1. [ ] Open Google Sheets
2. [ ] Create new sheet: "LinkedIn Outreach Tracker"
3. [ ] Add columns:
   ```
   Date | Name | Firm | LinkedIn URL | State | Request Sent | Accepted | Date Accepted | Message Sent | Response | Status | Notes
   ```

**LinkedIn Warm-Up Schedule:**

**Dec 27 (Day 1):**
- [ ] Send 5 connection requests to NSW family lawyers
- [ ] Use message template from setup guide
- [ ] Track in spreadsheet

**Dec 28 (Day 2):**
- [ ] Send 5 connection requests
- [ ] Track in spreadsheet
- [ ] Check for acceptances

**Dec 29 (Day 3):**
- [ ] Send 8 connection requests
- [ ] Track in spreadsheet  
- [ ] Message anyone who accepted (use follow-up template from guide)

**Dec 30 (Day 4):**
- [ ] Send 10 connection requests
- [ ] Track in spreadsheet
- [ ] Message new acceptances

**Dec 31 (Day 5):**
- [ ] Send 10 connection requests
- [ ] Track in spreadsheet
- [ ] Message new acceptances
- [ ] Respond to any replies within 2 hours

**Jan 1 (Day 6):**
- [ ] Send 10 connection requests
- [ ] Track in spreadsheet
- [ ] Continue messaging accepted connections

**Jan 2+ (Launch):**
- [ ] Send 15 connection requests/day
- [ ] Add email outreach (5-10/day)
- [ ] Continue messaging and responding

**Finding NSW Lawyers:**

Method 1 - LinkedIn Search:
1. LinkedIn search bar
2. Search: "family lawyer NSW"
3. Filter: People, Location: New South Wales
4. Send to lawyers only (not paralegals/admins)

Method 2 - Use Your CSV:
1. Open family_law_contacts_full.csv
2. Filter: state = "NSW" AND linkedin != ""
3. Visit their LinkedIn profiles
4. Send connection requests

**Connection Request Template:**
```
Hi [First Name],

I've built a child support calculator that generates leads for family lawyers. Would you be open to a quick conversation about how we might work together?

Best,
Alex
```

**Follow-Up Message (1-2 days after acceptance):**
```
Thanks for connecting, [First Name]!

Quick context on what I'm building:

I send family lawyers pre-qualified leads when complex child support cases come through my calculator—things like high-value amounts, upcoming court dates, or change of assessment scenarios.

The model is straightforward: $50 per lead, sent via email with full case details (income, care split, complexity triggers, contact info). No software to install, no calendar integration needed.

I'm currently partnering with 3-5 family law firms across NSW and looking to add a few more.

Would this be relevant for your practice? Happy to send you an example of what a lead looks like.

Cheers,
Alex
```

**Done when:**
- [ ] Tracking spreadsheet set up and in use
- [ ] 48 connection requests sent by Jan 1
- [ ] 15-25 connections accepted (~50% rate)
- [ ] 10+ follow-up messages sent
- [ ] 2-5 conversations started
- [ ] Account warmed up for Jan 2 launch

**CRITICAL RULES:**
- ❌ Don't send >5-10/day in first week (ban risk)
- ❌ Don't use automation tools
- ❌ Don't copy-paste exact same message
- ✅ Personalize with first names
- ✅ Track everything
- ✅ Wait 1-2 days before follow-up message
- ✅ Respond within 2 hours if someone replies

---

**STEP 4 COMPLETE:**
By end of Dec 27, you should have:
- ✅ Domain registered: childsupportcalc.com.au
- ✅ Business email working: alex@childsupportcalc.com.au
- ✅ AI headshot created
- ✅ LinkedIn profile live as Alex Thompson
- ✅ Virtual phone number active
- ✅ First 5 connection requests sent
- ✅ Tracking spreadsheet created
- ✅ You ARE Alex Thompson now

**Total Investment:**
- Domain: $20/year
- AI Headshot: $29 one-time
- Phone: $12 one-time
- **Total: $61**



---

## ✅ STEP 5: Prepare Phase 2 Materials (Dec 29-31)

**Time:** 4-5 hours  
**Goal:** Have all docs ready so you can START emailing lawyers Jan 2nd

**Tool:** Desktop Commander (this chat) - better for writing docs than Claude Code  
**Model:** Sonnet 4.5 ✅  
**Thinking Mode:** Can turn OFF ⚪ (writing templates and spreadsheets)  
**Why use Desktop Commander:** Better for creating documents, templates, and planning materials

---

### Task 5.1: Partnership Agreement (1.5 hours)

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
- Task 4: Business identity setup (3-4 hours)

**Dec 28:**
- Finish Task 4: LinkedIn warm-up continues (5 requests/day)
- Start Task 5: Phase 2 materials

**Dec 29-30:**
- Complete Task 5: Partnership agreement, templates, spreadsheets
- Continue LinkedIn warm-up (5-10 requests/day)

**Dec 31:**
- Review everything, make final tweaks
- LinkedIn warm-up continues

**Jan 1:**
- Rest
- LinkedIn warm-up continues (now 10/day as account warms up)

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
- [ ] LinkedIn profile created with professional photo
- [ ] Business email and phone set up
- [ ] 35-50 LinkedIn connection requests sent (warming up account)

**Documentation Clean:**
- [ ] Deleted confusing/outdated files
- [ ] Created simple BUSINESS_MODEL.md
- [ ] All docs reflect current plan ($50/lead, manual routing)

**Business Identity:**
- [ ] Professional alias chosen
- [ ] LinkedIn profile live and active
- [ ] AI headshot or professional logo created
- [ ] Business email functioning
- [ ] Virtual phone number set up
- [ ] LinkedIn account warmed up (5-10 connections/day since Dec 27)

**Mental State:**
- [ ] Clear on what you're building
- [ ] Confident in the business model
- [ ] Ready to talk to lawyers
- [ ] Excited to start Phase 2!

---

## 🚀 LAUNCH DAY PLAN (Jan 2)

**Updated Strategy: LinkedIn + Email Hybrid**

**Morning (9am-12pm):**
- LinkedIn: Send 10-15 connection requests to NSW lawyers (account should be warmed up by now)
- Email: Send 5 personalized emails to NSW lawyers who DON'T have LinkedIn
- Use templates from Task 5.2

**Afternoon (1pm-4pm):**
- Message LinkedIn connections who accepted from previous week
- Reply to any email responses within 1 hour
- Send partnership agreement to interested lawyers

**Evening (5pm-7pm):**
- Track all responses in spreadsheet
- Update LinkedIn/email lists
- Plan tomorrow's outreach

**Day 2-7 (Jan 3-9):**
- LinkedIn: 10-15 requests/day
- Email: 5-10/day to non-LinkedIn lawyers
- Phone calls: 5/day to non-responders (optional but effective)

**Goal:** Get first 3-5 lawyers interested by end of week (Jan 2-9)

**Key Metrics to Track:**
- Connection requests sent
- Acceptance rate
- Messages sent
- Responses received
- Conversations started
- Partnership agreements sent
- Partnerships signed

---

**You have 10 days. Use them wisely. When lawyers return Jan 2, you'll be ready to GO.** 🎄🚀
