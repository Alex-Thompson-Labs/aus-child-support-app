# Sage Family Lawyers Pilot - Implementation Plan

**Target Send Date:** Thursday, January 1, 2026
**Estimated Total Time:** 8-10 hours
**Current Blockers:** Legal agreements, partner routing, secure delivery mechanism

---

## Phase 1: Legal & Compliance (3 hours)

### Task 1.1: Update Partnership Agreement

**File:** Partnership agreement template (to be created)
**Time:** 1.5 hours
**Owner:** You (manual editing)

**Changes Required:**

1.  **Add Marketing Retainer Clause:**

    - Partner pays **$500 AUD Marketing Retainer** upfront (invoiced via Stripe).
    - 100% of retainer is allocated to direct media spend (Google Ads).
    - Calculator provides weekly transparency reports on spend/performance.
    - **Critical:** Calculator retains ownership of the ad account and pixel data (to preserve learning).

2.  **Add Exclusivity Clause:**

    - Partner gets exclusive Melbourne CBD leads (postcodes 3000-3999) for 4 weeks.
    - Right of first refusal to extend partnership after pilot.

3.  **Update Delivery Method (Privacy First):**
    - Leads delivered via **Secure Magic Link** (Time-limited access URL).
    - **Strict Privacy Rule:** No raw PII (Name, Phone, Email) is ever sent in the notification email body.
    - Partner indemnifies Calculator against data breaches resulting from their mishandling of unlocked data.

**Deliverable:** Updated partnership agreement ready for DocuSign

### Task 1.2: Update Privacy Policy

**File:** `public/privacy-policy.html`
**Time:** 1 hour
**Owner:** You (manual HTML editing)

**Changes Required:**

1.  **Add "Secure Partner Referrals" section:**

    - Explain that data is shared with specific legal partners via encrypted, time-limited portals.
    - User data remains encrypted at rest and is only decrypted when the partner authenticates/accesses the secure link.

2.  **Add "Partner-Specific Referrals" subsection:**
    - Explain that `?partner=` URLs direct inquiries to specific firms.
    - Partner firm name will be clearly displayed on inquiry form before submission.

**Deliverable:** Updated privacy-policy.html deployed to Vercel

---

## Phase 2: Technical Implementation (4-5 hours)

### Task 2.1: Create Partner Configuration System

**Time:** 30 minutes
**Owner:** Claude Code

**Claude Code Prompt:**

```text
Create a partner configuration system for white-labeling the calculator.

File: src/config/partners.ts

Define a partner config structure that includes: name, email, branding colors, contact info, exclusivity region, and pilot dates.

Start with one partner: 'sage' (Sage Family Lawyers, Melbourne CBD).
```

### Task 2.2: Create Partner Detection Hook

**Time:** 45 minutes **Owner:** Claude Code

**Claude Code Prompt:**

Create a hook that detects partner IDs from URL parameters and persists them.

File: src/hooks/usePartner.ts

Requirements:

- Read ?partner= from URL
- Persist to localStorage
- Return the partner config object
- Auto-clear if pilot dates have passed

### Task 2.3: Update Theme System for Partner Branding

**Time:** 30 minutes **Owner:** Claude Code

**Claude Code Prompt:**

Update the theme system to support dynamic partner branding colors.

File: constants/theme.ts

If a partner is detected (via usePartner hook), override the default tint color with the partner's primary color.

### Task 2.4: Create Secure Lead Submission Function

**Time:** 1.5 hours **Owner:** Claude Code

**Claude Code Prompt:**

Create a lead submission utility that includes the partner ID in the payload.

File: src/utils/submit-lead.ts

The function should:

- Accept lead data
- POST to Supabase edge function: /submit-lead
- Include partner_id in payload
- Handle success/error

### Task 2.5: Create Supabase Edge Function (Secure Routing)

**Time:** 1.5 hours **Owner:** Claude Code

**Claude Code Prompt:**

Create a Supabase Edge Function that routes leads via Secure Magic Link.

File: supabase/functions/submit-lead/index.ts

Requirements:

- Accept POST requests with lead data
- Store lead in Supabase 'leads' table
- Generate a unique, time-limited access token (signed JWT or UUID) for viewing this specific lead
- Construct a "Magic Link": https://auschildsupport.com/admin/view-lead/[token] (route to be implemented)
- Route emails based on partner_id:
  - 'sage' → pross@sagefamilylawyers.com.au (CC: alex@auschildsupport.com)
- Email Content:
  - Subject: "New High-Value Lead: [CoA Reason]"
  - Body: "A new complex case has been detected. Complexity: [Reason]. Income Gap: [Amount]. Click below to view secure details."
  - CTA Button: "View Full Details (Secure Portal)"
- **SECURITY:** No raw name/phone/email in the email body.

### Task 2.6: Create "Secure View" Page

**Time:** 1 hour **Owner:** Claude Code

**Claude Code Prompt:**

Create a secure, read-only page to view a specific lead.

File: app/admin/view-lead/[token].tsx (to be created)

Requirements:

- Validate the token from the URL (fetch from Supabase edge function or verify JWT)
- If valid: Display full lead details (Name, Phone, Email, Calculation Summary)
- If invalid/expired: Show "Access Expired" message
- Styling: Simple, clean, printable
- Add a "Call Client" button (tel link) and "Email Client" button (mailto link)

### Task 2.7: Update Inquiry Form Success Message

**Time:** 30 minutes **Owner:** Claude Code

**Claude Code Prompt:**

Update the lawyer inquiry form success state.

File: app/lawyer-inquiry.tsx

When a partner is detected:

- Update success message: "Your details have been securely encrypted and sent to Sage Family Lawyers via our protected portal. They will contact you within 24 hours."
- Display Partner Badge: "🔒 Secured by AusChildSupport"

## Phase 3: Testing & Validation (1 hour)

### Task 3.1: Test Partner Detection

1.  Visit /?partner=sage.

2.  Verify Sage branding (Colors, Logo, Name).

### Task 3.2: Test Secure Delivery Flow

1.  Submit a test lead.

2.  Check your email (acting as Sage).

3.  **Verify:** Email does NOT contain PII.

4.  Click the "View Full Details" link.

5.  **Verify:** Browser opens the Secure View page and displays the correct data.

### Task 3.3: Deploy

1.  npm run build:web

2.  vercel --prod

## Phase 4: Outreach Preparation (2 hours)

### Task 4.1: Setup Stripe Invoice

**Time:** 30 minutes **Owner:** You

1.  Create a Product in Stripe: "Marketing Retainer - Pilot".

2.  Price: $500 AUD (One-time).

3.  Generate a Payment Link to have ready for the call.

### Task 4.2: Draft "Retainer" Pitch Email

**Time:** 30 minutes **Owner:** You

**Template:**

Subject: Exclusive pilot: Pre-qualified child support leads for Sage Family Lawyers

Hi Paul,

I noticed Sage is running ~38 active ads on Google right now—you're clearly the most active firm in Melbourne.

I've built a child support calculator (auschildsupport.com) that filters "tire kickers" before they contact a lawyer. It uses "Change of Assessment" logic to flag complex cases (Self-Employed, Hidden Income, etc.).

I'm looking for one Melbourne firm to pilot an exclusive "Sponsored Results" partnership.

**The Pilot:**

- You pay a **$500 Marketing Retainer** (100% goes to ad spend).
- I manage the ads in my specialized account (targeting your region).
- I rebrand the calculator as "Powered by Sage Family Lawyers".
- You get 100% of the qualified leads via our **Secure Privacy Portal**.

Are you open to a 10-minute demo to see the complexity filter work?

Thanks,
Sam

### Task 4.3: Prepare Demo Script (Focus: Security & Ease)

**Time:** 30 minutes

**Key Points to Hit:**

1.  **"You don't do the work":** emphasize you handle the ad account and pixels.

2.  **"Privacy First":** Show the "Secure View" page. Explain how this protects them from data liability.

3.  **"Retainer Model":** Explain the $500 is for media spend, not your pocket.

## Phase 5: Pre-Flight Checklist

- [ ] /?partner=sage works in production.

- [ ] Secure Magic Link emails are arriving.

- [ ] "View Lead" page works and shows data.

- [ ] Stripe Payment Link for $500 is ready.

- [ ] Partnership Agreement (PDF) includes Retainer & Privacy clauses.

**Go/No-Go Decision:**

- Do not send email until the **Secure View** page is live and tested. Sending broken links destroys trust immediately.
