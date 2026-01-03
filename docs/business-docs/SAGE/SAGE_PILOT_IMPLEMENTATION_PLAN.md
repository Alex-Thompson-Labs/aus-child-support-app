# Sage Family Lawyers Pilot - Implementation Plan

**Target Send Date:** Thursday, January 1, 2026  
**Estimated Total Time:** 8-10 hours  
**Current Blockers:** Legal agreements, partner routing, consent mechanism

---

## Phase 1: Legal & Compliance (3 hours)

### Task 1.1: Update Partnership Agreement

**File:** `docs/templates/LAWYER_PARTNERSHIP_AGREEMENT.md`  
**Time:** 1.5 hours  
**Owner:** You (manual editing)

**Changes Required:**

1. **Add Exclusivity Clause** after Section 5 (Service Area):
   - Partner gets exclusive Melbourne CBD leads (postcodes 3000-3999) for 4 weeks
   - After pilot, Partner has 7 days to extend at $50/lead rate
   - If Partner declines, exclusivity terminates
   - Make it clear this is pilot-only, not permanent territory lock

2. **Add Pilot Success Metrics** as new Section 7:
   - Minimum 3 qualified leads within 4 weeks
   - At least 50% of leads respond to initial contact
   - At least 1 lead books paid consultation
   - Disclaimer: conversion depends on Partner's intake process, not just lead quality

3. **Update Pricing Section 3** to clarify pilot model:
   - **Pilot (4 weeks):** $0 per lead (free testing period)
   - Maximum 20 leads during pilot
   - Partner provides feedback within 7 days of pilot end
   - **Post-Pilot:** $50/lead, billed monthly, net 14 days
   - Minimum: 10 leads/month OR $500/month minimum

4. **Add Indemnification Section 8:**
   - Calculator provides estimates only, not legal advice
   - Partner verifies all calculations before advising clients
   - Partner maintains $2M professional indemnity insurance
   - Partner indemnifies Calculator against claims from their legal services
   - Calculator indemnifies Partner against calculator errors/data breaches
   - 24-hour notification requirement for legal claims

5. **Add Lead Ownership Section 9:**
   - Partner keeps all leads delivered before termination
   - Partner can service those clients indefinitely
   - Calculator can't "claw back" terminated leads to competitors
   - Future leads (post-termination) can go to other partners
   - Partner must delete parent data within 90 days if requested

**Deliverable:** Updated partnership agreement ready for DocuSign

---

### Task 1.2: Update Privacy Policy

**File:** `privacy-policy.html`  
**Time:** 1 hour  
**Owner:** You (manual HTML editing)

**Changes Required:**

1. **Add "Legal Practitioner Referrals" section** under "Information Sharing":
   - We share inquiry form data with partner law firms
   - Shared data includes: name, email, phone, calculation details, legal questions
   - Only shared with: Licensed AU family lawyers, firms with signed DPA, lawyers in user's region
   - User rights: Explicit consent via checkbox, can withdraw anytime via privacy@auschildsupport.com, can request deletion within 30 days

2. **Add "Partner-Specific Referrals" subsection:**
   - Explain that `?partner=` URLs direct inquiries to specific firms
   - Partner firm name will be clearly displayed on inquiry form before submission
   - User consents to exclusive sharing with that partner

**Deliverable:** Updated privacy-policy.html deployed to Netlify

---

### Task 1.3: Update Consent Checkbox to be Partner-Aware

**Time:** 30 minutes  
**Owner:** Claude Code

**Claude Code Prompt:**

```
Update the consent checkbox in the lawyer inquiry form to dynamically display the partner name when a user arrives via a ?partner= URL parameter.

File: app/lawyer-inquiry.tsx

When a partner is detected:
- Change consent text to mention the partner's name specifically
- Add a partner badge showing "🤝 Exclusive referral partner: [Partner Name]"
- Update the form to use the partner's branding

Use the usePartner hook (which you'll create in the next task).
```

**Deliverable:** Dynamic consent checkbox with partner-specific text

---

## Phase 2: Technical Implementation (4-5 hours)

### Task 2.1: Create Partner Configuration System

**Time:** 30 minutes  
**Owner:** Claude Code

**Claude Code Prompt:**

```
Create a partner configuration system for white-labeling the calculator.

File: src/config/partners.ts

Define a partner config structure that includes: name, email, branding colors, contact info, exclusivity region, and pilot dates.

Start with one partner: 'sage' (Sage Family Lawyers, Melbourne CBD).

Make it easy to add more partners later by just adding entries to an object.
```

**Deliverable:** Partner configuration system

---

### Task 2.2: Create Partner Detection Hook

**Time:** 45 minutes  
**Owner:** Claude Code

**Claude Code Prompt:**

```
Create a hook that detects partner IDs from URL parameters and persists them across navigation.

File: src/hooks/usePartner.ts

Requirements:
- Read ?partner= from URL (web only, Platform.OS === 'web')
- Persist to localStorage so it survives page refreshes
- Return the partner config object (or null if no partner)
- Auto-clear expired/inactive partners based on pilot dates

Import the partner config from src/config/partners.ts
```

**Deliverable:** Partner detection and persistence logic

---

### Task 2.3: Update Theme System for Partner Branding

**Time:** 30 minutes  
**Owner:** Claude Code

**Claude Code Prompt:**

```
Update the theme system to support dynamic partner branding colors.

File: constants/theme.ts

If a partner is detected (via usePartner hook), override the default tint color with the partner's primary color.

Keep the existing static Colors export for backward compatibility.
```

**Deliverable:** Partner-aware theme system

---

### Task 2.4: Create Lead Submission Function with Partner Routing

**Time:** 1.5 hours  
**Owner:** Claude Code

**Claude Code Prompt:**

```
Create a lead submission utility that includes the partner ID in the payload.

File: src/utils/submit-lead.ts

The function should:
- Accept lead data (name, email, phone, calculation summary, message, consent)
- Get partner ID from localStorage (web) or default to 'default'
- POST to Supabase edge function: https://swcbcudasyiqhtkymcpy.supabase.co/functions/v1/submit-lead
- Include partner_id, source_url, submitted_at, and user_agent in payload
- Return success/error result with lead ID

Handle errors gracefully.
```

**Deliverable:** Lead submission utility

---

### Task 2.5: Create Supabase Edge Function for Email Routing

**Time:** 1.5 hours  
**Owner:** Claude Code

**Claude Code Prompt:**

```
Create a Supabase Edge Function that receives lead submissions and routes them to partners via email.

File: supabase/functions/submit-lead/index.ts

Requirements:
- Accept POST requests with lead data
- Validate consentGiven === true (return 400 if false)
- Store lead in Supabase 'leads' table (columns: name, email, phone, calculation_summary, message, partner_id, source_url, submitted_at)
- Route emails based on partner_id:
  - 'sage' → pross@sagefamilylawyers.com.au (CC: alex@auschildsupport.com)
  - 'default' → alex@auschildsupport.com
- Use Resend API for email delivery (env: RESEND_API_KEY)
- Email should include: contact info, calculation summary, complexity reasons, message
- Return JSON: {success: true, lead_id} or {error: message}

Create helper functions for email sending and HTML formatting.
```

**Deliverable:** Backend lead routing function

---

### Task 2.6: Update Lawyer Inquiry Form to Use Partner Context

**Time:** 45 minutes  
**Owner:** Claude Code

**Claude Code Prompt:**

```
Update the lawyer inquiry form to show partner branding and use the new lead submission flow.

File: app/lawyer-inquiry.tsx

When a partner is detected:
- Show partner name in form header
- Display partner badge with exclusive region
- Customize submit button text to mention partner
- Update success message to mention partner name and 24-hour contact promise

Use the usePartner hook and submitLead function you created.

Keep all functionality identical for non-partner users.
```

**Deliverable:** Partner-branded inquiry form

---

## Phase 3: Testing & Validation (1 hour)

### Task 3.1: Test Partner Detection Flow

**Time:** 15 minutes  
**Owner:** You (manual testing)

**Test Steps:**

1. Clear browser localStorage
2. Visit `http://localhost:8081/?partner=sage`
3. Verify partner branding appears (name, colors, badge)
4. Refresh page → verify partner persists
5. Navigate away and back → verify partner still active
6. Visit `http://localhost:8081/` (no param) → verify default state

**Pass Criteria:** Partner detection works and persists across navigation

---

### Task 3.2: Test Lead Submission End-to-End

**Time:** 20 minutes  
**Owner:** You (manual testing)

**Test Steps:**

1. Visit `http://localhost:8081/?partner=sage`
2. Fill out inquiry form with test data
3. Check consent box
4. Submit form
5. Verify:
   - Success message mentions "Sage Family Lawyers"
   - Lead appears in Supabase with partner_id='sage'
   - Email sent to pross@sagefamilylawyers.com.au (check Resend logs)
   - CC sent to alex@auschildsupport.com

**Pass Criteria:** Lead routes to correct partner email with all data

---

### Task 3.3: Test Privacy Policy and Consent Flow

**Time:** 10 minutes  
**Owner:** You (manual testing)

**Test Steps:**

1. Click "Read our Privacy Policy" link
2. Verify "Legal Practitioner Referrals" section exists
3. Try submitting form without consent → should block
4. Check consent → submit should work

**Pass Criteria:** Privacy policy accurate and consent validation working

---

### Task 3.4: Deploy to Production

**Time:** 15 minutes  
**Owner:** You (manual deployment)

```bash
npm run build:web
netlify deploy --prod
```

**Verify:**

1. `https://auschildsupport.com/?partner=sage` works
2. Partner branding displays correctly
3. Lead submission works end-to-end
4. Email delivery works in production

**Pass Criteria:** Production deployment successful

---

## Phase 4: Outreach Preparation (2 hours)

### Task 4.1: Finalize Partnership Agreement

**Time:** 30 minutes  
**Owner:** You (manual editing)

**Steps:**

1. Fill in missing details in `docs/templates/LAWYER_PARTNERSHIP_AGREEMENT.md`:
   - Your ABN (or remove if not applicable)
   - Pilot dates: Jan 6 - Feb 3, 2026
   - Sage's phone number (from their website)
2. Convert to PDF (use Pandoc or online converter)
3. Upload to DocuSign
4. Prepare signing link

**Deliverable:** Ready-to-sign partnership agreement

---

### Task 4.2: Research Sage's Actual Branding

**Time:** 30 minutes  
**Owner:** You (manual research)

**Steps:**

1. Visit https://sagefamilylawyers.com.au
2. Use DevTools to extract:
   - Primary brand color (hex code)
   - Accent color
   - Logo image
3. Get actual phone number from contact page
4. Update `src/config/partners.ts` with real values
5. Test branding at `localhost:8081/?partner=sage`

**Deliverable:** Accurate Sage branding in calculator

---

### Task 4.3: Draft Outreach Email

**Time:** 30 minutes  
**Owner:** You (manual writing)

**Email Template:**

```
Subject: Exclusive pilot: Pre-qualified child support leads for Sage Family Lawyers

Hi Paul,

I noticed Sage is running approximately 38 active ads on Google right now—easily the most active firm in the Melbourne market. That tells me you understand paid acquisition.

I've built a child support calculator (auschildsupport.com) that pre-qualifies complex cases before they ever contact a lawyer. Parents spend 10+ minutes calculating their liability and self-identify complexity factors (hidden income, self-employment, special circumstances).

I'm looking for one Melbourne firm to pilot an exclusive partnership.

The offer:
• I'll run a $500 test campaign pointing to a Sage-branded calculator
• You get 100% of the qualified leads for 4 weeks (Melbourne CBD exclusive)
• Zero upfront cost—I'm covering the ad spend to prove the model works
• After the pilot, we discuss ongoing arrangements if you're happy with lead quality

Why this works for Sage:
• Lower CPA: These aren't cold clicks—they've already identified as complex cases
• Exclusivity: Your competitors won't see these leads during the pilot
• No dev cost: You get a custom pre-qualification tool without building it

Are you open to a 10-minute demo to see the complexity detection in action?

Thanks,
Sam
auschildsupport.com
```

**Deliverable:** Polished email ready to send

---

### Task 4.4: Prepare Demo Script

**Time:** 30 minutes  
**Owner:** You (manual planning)

**Demo Call Outline (10 minutes):**

**Minutes 0-2: Hook**

- "The problem with 'child support lawyer' keywords: you're paying $10-15/click for people who just want DHS phone numbers."

**Minutes 2-5: Demo the Calculator**

- Share screen: auschildsupport.com/?partner=sage
- Show "Powered by Sage Family Lawyers" branding
- Walk through Change of Assessment screen
- Explain complexity flagging ("Self Employed", "Hidden Income")

**Minutes 5-7: Show Lead Quality**

- Show example lead email (mock beforehand)
- Compare to generic "I need help" inquiry

**Minutes 7-9: Pilot Structure**

- 4-week exclusive pilot, Melbourne CBD
- I fund $500 in Google Ads
- You get every lead, zero cost
- If 3+ qualified consults, we discuss ongoing pricing

**Minute 10: Close**

- "Does that structure make sense?"
- Send partnership agreement same day

**Objection Handling:**

- "How do I know leads are real?" → "Free pilot. You risk nothing."
- "What's your take rate?" → "$50/lead post-pilot. 20-30% of your current CPA."
- "Why only Melbourne?" → "One firm per city. Right of first refusal if it works."

**Deliverable:** Demo script with objection handling

---

## Phase 5: Pre-Flight Checklist (30 minutes)

### Final Checks Before Sending Email

**Owner:** You (manual verification)

**Technical:**

- [ ] `auschildsupport.com/?partner=sage` works in production
- [ ] Partner branding displays correctly
- [ ] Test lead submission works end-to-end
- [ ] Email routing delivers to correct address
- [ ] Privacy policy updated and deployed

**Legal:**

- [ ] Partnership agreement has all required clauses
- [ ] Exclusivity terms clear (Melbourne CBD, 4 weeks, right of first refusal)
- [ ] Pilot pricing clear ($0 for pilot, $50/lead post-pilot)
- [ ] Indemnification sections present
- [ ] Agreement uploaded to DocuSign

**Outreach:**

- [ ] Email drafted and proofread
- [ ] Demo script prepared
- [ ] Sage's phone number obtained
- [ ] Calendar blocked for demo calls
- [ ] Partnership agreement PDF ready

**Go/No-Go Decision:**

- All boxes checked → Send Wednesday 10am AEDT
- Missing technical → Delay to Thursday
- Missing legal → Do not send (legal exposure)

---

## Timeline

| Day                 | Tasks                                     | Hours     |
| ------------------- | ----------------------------------------- | --------- |
| **Mon Dec 30**      | Phase 1 (Legal) + Phase 2 Tasks 2.1-2.3   | 5 hours   |
| **Tue Dec 31**      | Phase 2 Tasks 2.4-2.6 + Phase 3 (Testing) | 4 hours   |
| **Wed Jan 1**       | Phase 4 (Outreach) + Phase 5 (Checks)     | 2.5 hours |
| **Thu Jan 2, 10am** | **SEND EMAIL**                            | -         |
| **Fri-Mon Jan 3-6** | Follow-up, demo calls                     | -         |
| **Mon Jan 6**       | Pilot start (if signed)                   | -         |

---

## Risk Mitigation

**If Paul says yes before technical ready:**

- Reply: "Fantastic! Let me finalize the Sage-branded calculator. Demo call Thursday? I'll have the partnership agreement ready."
- Buys you 48 hours

**If technical fails in production:**

- Demo on localhost as backup
- "Updating production server, let me show you staging"

**If he asks for references:**

- "This is new—you'd be the first Melbourne firm. That's why it's a free pilot. I need to prove it works as much as you do."

**If he counters with different terms:**

- Listen, take notes
- "Let me think about that and get back to you by end of day"
- Don't negotiate live

---

## Success Metrics

**Email sent:** Thursday, January 2, 10am AEDT  
**Demo booked:** By Monday, January 6  
**Agreement signed:** By Monday, January 6  
**Pilot live:** Week of January 6-10  
**First lead:** Within 7 days of pilot start

If Paul doesn't respond, move to next firm (Clancy & Triado) with same playbook.

# Executive Summary: Sage Family Lawyers Partnership Pitch

## What We Do

We built a free online child support calculator for Australian parents. When someone uses it, they enter their income, custody arrangement, and number of children. The calculator applies the official Australian government formula to show what their monthly child support payment should be.

The key insight: **Some child support cases are simple, others are complex.** Complex cases need lawyers. Simple cases don't.

## How We Identify Complex Cases

The calculator has built-in complexity triggers that automatically detect high-value cases:

**Automatic triggers (we detect these from the calculation):**

- **High income cases** (payer earning $150k+) — these families can afford legal representation and often have disputes
- **Shared care arrangements** (35-65% custody split) — these trigger special formula adjustments that parents often get wrong

**Self-reported triggers (user selects these):**

- **Self-employed payer** (can manipulate reported income)
- **Income from trusts or companies** (easy to hide assets)
- **Recent court date approaching** (urgent legal need)
- **Special circumstances** (disability, high costs, earning capacity changes)

These self-reported reasons are called "Change of Assessment" grounds—official reasons the Australian government allows parents to challenge the standard formula.

When someone hits any of these triggers, we flag them as a qualified lead and offer to connect them with a family law firm. That's where we generate revenue.

## The Sage Family Lawyers Opportunity

**Who they are:** Melbourne family law firm running 38 active Google Ads for child support keywords. They're spending $10-15 per click to attract parents searching for help.

**The problem they have:** Most people clicking their ads just want free information (the DHS phone number, basic formulas). Only a small fraction actually need—and can afford—a lawyer. They're paying for a lot of wasted clicks.

**Our solution:** We pre-qualify the leads before they ever contact the law firm.

## The Partnership Model

**The offer to Sage:**

- We run Google Ads ($500 budget, we pay) pointing to a calculator branded as "Powered by Sage Family Lawyers"
- Users spend 10-15 minutes calculating their child support
- If they identify as complex (self-employed, hidden income, court dates), we flag them as qualified
- They submit their contact info with consent to be contacted by Sage
- Lead goes directly to Sage's inbox with full calculation breakdown
- Sage gets **exclusive access** to all Melbourne CBD leads for 4 weeks (their competitors don't see these)
- **Cost to Sage during pilot: $0**

**After the pilot (if they like the quality):**

- They pay $50 per qualified lead
- We estimate 10-20 leads/month for Melbourne
- Their typical client is worth $3,000-10,000 in legal fees
- Their current cost per client acquisition via Google Ads: $300-500
- **Our leads would cut their acquisition cost by 80-90%**

## Why This Works

**For the law firm:**

- They only pay for people who have already self-identified as complex cases
- The person has spent 10+ minutes engaged (high intent signal)
- They see the full calculation before calling, so they can prioritize high-value cases
- No development cost—we built the tool, we just white-label it for them

**For us:**

- One partner at $50/lead × 15 leads/month = $750/month recurring
- Five partners across major cities = $3,750/month
- The calculator is already built—we just route leads to different firms based on geography
- Scalable: 440+ Australian family law firms already identified and scraped

**For parents:**

- They get a free, accurate calculator (we use the official government formula)
- If they're complex, they get connected to a qualified lawyer who understands their situation
- If they're simple, they just use the calculation and handle it themselves

## The Pitch

**Email to Paul Ross (Sage's Principal):** "I noticed you're running 38 ads on Google. I built a tool that pre-qualifies child support leads before they contact you. Want a free 4-week exclusive pilot?"

**Demo call (10 minutes):** Show the calculator with Sage branding, walk through how complexity detection works, show sample lead email

**Close:** Partnership agreement ready to sign, ads can start within 48 hours

## Why Sage Specifically

- **Highest ad spend in Melbourne** (38 active campaigns = they understand digital acquisition)
- **"Challenger" firm** (mid-sized, hungry for growth, less bureaucratic than huge firms)
- **Direct access to decision-maker** (Paul Ross is the Principal, not buried in procurement)

If Sage validates the model, we use the exact same playbook to pitch the next 440 firms. This is proof of concept for a repeatable B2B business, not a one-off deal.
