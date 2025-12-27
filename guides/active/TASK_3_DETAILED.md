# Task 3: Lead Management System - Implementation Guide

**Based on Gemini AI consultation - Australian Privacy Act compliant approach**

---

## WHY DATABASE IS MANDATORY

You're trading in "Sensitive Information" under Privacy Act 1988. Email-only approach is:
- ❌ Insecure and not auditable
- ❌ Prone to data loss
- ❌ Not legally defensible
- ❌ Cannot handle deletion requests (Right to Erasure)
- ❌ No way to prove to lawyers when lead was generated

**Legal fact:** Small businesses (<$3M turnover) are usually exempt from Privacy Act, BUT businesses that "trade in personal information" (buying/selling leads) lose this exemption. **You must comply with Australian Privacy Principles (APPs).**

---

## THE MVP SOLUTION: "Wizard of Oz" Routing

**User experience:** Looks automated  
**Behind the scenes:** You manually vet and route leads

**Flow:**
1. Parent fills inquiry form
2. Data saves to secure database (Supabase)
3. YOU get email alert: "New Lead #105"
4. You review lead (check quality)
5. You send "teaser email" to lawyer (see below)
6. Lawyer replies "YES" → you charge them → release full details
7. Update lead status in database

---

## PHASE 1: Database Setup (1-2 hours with Claude Code)

### Step 1.1: Create Supabase Project

**Ask Claude Code (Opus + Plan mode):**

```
Set up Supabase database for Australian Privacy Act compliant lead management:

1. CREATE SUPABASE PROJECT
   - Sign up at supabase.com
   - Create new project (choose Sydney region for Australian data sovereignty)
   - Note the API URL and anon key

2. CREATE 'LEADS' TABLE
   Columns:
   - id: uuid (primary key, auto-generated)
   - created_at: timestamp (auto)
   - parent_name: text
   - parent_email: text  
   - parent_phone: text
   - location: text (suburb, state)
   - income_parent_a: numeric
   - income_parent_b: numeric
   - children_count: integer
   - annual_liability: numeric
   - complexity_reasons: text[] (array of complexity triggers)
   - coa_reasons: jsonb (Change of Assessment reasons with descriptions)
   - parent_message: text
   - preferred_contact: text
   - consent_given: boolean (REQUIRED - Privacy Act)
   - assigned_lawyer_id: text (nullable)
   - status: text (new, reviewing, sent, converted, lost)
   - sent_at: timestamp (nullable)
   - lawyer_response_at: timestamp (nullable)
   - notes: text (nullable)
   - deleted_at: timestamp (nullable - for soft delete)

3. ROW LEVEL SECURITY (RLS)
   - Enable RLS on leads table
   - Policy: Allow INSERT for anon users (form submissions)
   - Policy: Allow SELECT/UPDATE only for authenticated admin (you)
   - This prevents unauthorized access to lead data

4. UPDATE INQUIRY FORM
   - Install Supabase client: npm install @supabase/supabase-js
   - Initialize Supabase in app with API credentials
   - Add MANDATORY consent checkbox before submit button:
     Text: "I consent to my information being shared with legal practitioners for the purpose of consultation"
     - Must be checked to enable submit
     - Store as consent_given: true
   - On form submit:
     * Validate all fields
     * Save to Supabase leads table
     * Show success message
     * Clear form
     * Handle errors gracefully (network issues, etc.)

5. EMAIL NOTIFICATION SYSTEM
   - Use Supabase Edge Function OR
   - Use Make.com/Zapier webhook
   - When new lead inserted → send email to alex@auschildsupport.com
   - Email format:
     Subject: New Lead #[ID] - [Complexity]
     Body:
     Lead ID: [id]
     Location: [location]
     Liability: $[annual_liability]/year
     Complexity: [complexity_reasons]
     CoA Reasons: [coa_reasons if any]
     
     Review in admin panel: [link]
   - Do NOT include parent contact details in email (keep in database only)

SECURITY REQUIREMENTS:
- Use environment variables for Supabase keys
- Never expose anon key in git commits
- Validate and sanitize all inputs
- Encrypt data at rest (Supabase default)

Test the complete flow before moving to Phase 2.
```

**Done when:**
- [  ] Supabase project created
- [  ] Leads table created with all columns
- [  ] RLS policies configured
- [  ] Inquiry form saves to Supabase
- [  ] Email notifications working
- [  ] Test lead submitted successfully

---

## PHASE 2: Admin Dashboard (1-2 hours with Claude Code)

### Step 2.1: Create Admin Interface

**Ask Claude Code:**

```
Create mobile-friendly admin dashboard to manage leads:

1. AUTHENTICATION (SIMPLE)
   - Use Supabase Auth
   - Email/password login screen
   - Only alex@auschildsupport.com can log in
   - Session timeout after 1 hour
   - Logout button

2. LEADS LIST SCREEN
   Features:
   - Show all leads (newest first)
   - Card view with:
     * Lead ID + date
     * Parent name (first name only for privacy)
     * Location
     * Annual liability
     * Status badge (color-coded)
     * Tap to view details
   
   Filters:
   - Status (all, new, reviewing, sent, converted, lost)
   - Location (state dropdown)
   - Sort by: date, liability amount
   
   Search:
   - By parent name or email

3. LEAD DETAIL SCREEN (tap a lead)
   Sections:
   - Parent Information (name, email, phone)
   - Case Details (income, children, liability)
   - Complexity Reasons (list with icons)
   - CoA Reasons (if selected, with descriptions)
   - Parent's Message
   - Status + Notes
   
   Actions (buttons at bottom):
   - "Generate Teaser Email" → copy to clipboard
   - "Mark as Sent" → updates status to 'sent', sets sent_at timestamp
   - "Add Notes" → text input field
   - "Mark Converted" / "Mark Lost"
   - "Delete Lead" → soft delete (sets deleted_at, hides from list)

4. TEASER EMAIL GENERATOR
   When "Generate Teaser Email" tapped:
   - Create email template:
     ```
     Subject: New Qualified Lead - Change of Assessment (Reason [X])
     
     Details:
     Issue: [primary complexity reason]
     Est. Liability: $[amount]/year
     Location: [suburb, state]
     [If CoA reasons: "CoA Grounds: [reason]"]
     [If urgent: "Urgency: High"]
     
     Interested? Reply YES to purchase this lead for $50.
     Lead ID: #[id]
     ```
   - Copy to clipboard
   - Show toast: "Email template copied"
   - You paste into Gmail and send manually

5. SECURITY
   - Admin screens only accessible after login
   - Check auth on every screen load
   - Redirect to login if session expired
   - Never log parent details to console

Keep UI simple and mobile-friendly (you'll use on phone).
Use existing app's design system (colors, fonts, components).
```

**Done when:**
- [  ] Admin login working
- [  ] Leads list displays correctly
- [  ] Filters and search working
- [  ] Lead detail screen shows all data
- [  ] Teaser email generator works
- [  ] Status updates save to database
- [  ] Mobile-friendly and easy to use

---

## PHASE 3: Privacy Policy (30 minutes)

### Step 3.1: Purchase Template (DO NOT write yourself)

**Options:**

**Option A: TermsFeed (Recommended)**
- Cost: $50 one-time
- Australian Privacy Act compliant
- Customizable for your business
- Link: termsfeed.com

**Option B: iubenda**
- Cost: $27/month
- Includes Australian Privacy Act template
- Auto-updates when laws change
- Link: iubenda.com

**Option C: Free (Generic)**
- privacypolicies.com
- Less tailored, but legally compliant
- You'll need to customize heavily

### Step 3.2: Required Sections

Your privacy policy MUST state:

1. **What data collected:**
   - Personal info (name, email, phone)
   - Financial info (income amounts)
   - Family info (children, care arrangements)
   - Assessment details (child support calculations)

2. **How used:**
   - Providing child support assessment
   - Forwarding to legal practitioners
   - Billing and administration

3. **Third-party sharing:**
   - "We sell your information to family law practitioners"
   - "Lawyers may contact you directly"
   - "We use Supabase for data storage"

4. **User rights:**
   - Right to access your data
   - Right to correct errors
   - Right to deletion (within 30 days)
   - Right to complain to OAIC (Office of Australian Information Commissioner)

5. **Data retention:**
   - "Leads kept for 12 months"
   - "Deleted data removed within 30 days"

6. **Security measures:**
   - "Encrypted storage"
   - "Access controls"
   - "Regular backups"

7. **Contact for privacy requests:**
   - alex@auschildsupport.com
   - Response within 14 days

### Step 3.3: Publish Policy

1. Add to website:
   - Footer link on auschildsupport.com
   - "/privacy" page

2. Link from app:
   - Below consent checkbox: "Read our Privacy Policy"
   - Opens in web browser
   - In app settings screen

3. Update consent text:
   - "I consent to my information being shared with legal practitioners as described in the Privacy Policy"

**Done when:**
- [  ] Privacy policy purchased/generated
- [  ] Published at auschildsupport.com/privacy
- [  ] Linked from inquiry form
- [  ] Linked from app settings
- [  ] Consent checkbox updated

---

## PHASE 4: Secure Handover Method (15 minutes setup)

### The Problem
After lawyer pays $50, you need to send them parent's contact details. **DON'T email in plain text** - it's insecure.

### Option A: Password-Protected PDF (Simplest)

**Tools needed:**
- Adobe Acrobat (has free trial)
- OR use PDFtk (free command-line tool)

**Process:**
1. After lawyer pays, generate PDF with lead details
2. Set password on PDF
3. Email PDF to lawyer
4. Send password via SMS or separate email
5. Lawyer unlocks PDF and contacts parent

**Ask Claude Code:**
```
Add "Export Lead as PDF" function to admin panel:
- Generate PDF with all lead details
- Use react-native-pdf or similar library
- Format professionally
- Include: parent contact, case summary, CoA reasons
```

### Option B: Temporary Secure Link (Better, more work)

**Process:**
1. After lawyer pays, generate unique link
2. Link shows lead details
3. Link expires after 24 hours
4. Requires lawyer to enter email to access

**Implementation:** Add to Phase 3 (later, after revenue flowing)

### Option C: Encrypted Email (If lawyer has PGP)

Most lawyers won't have this. Skip unless specifically requested.

**Recommended:** Start with Option A (password-protected PDF)

**Done when:**
- [  ] Can generate PDF from lead
- [  ] Can set password on PDF
- [  ] Tested end-to-end handover

---

## TESTING CHECKLIST

Before going live:

**Database:**
- [  ] Lead saves to Supabase
- [  ] All fields populated correctly
- [  ] RLS policies prevent unauthorized access
- [  ] Soft delete works (deleted_at set)

**Notifications:**
- [  ] Email alert arrives when new lead submitted
- [  ] Email has correct lead ID and summary
- [  ] Doesn't expose parent contact details

**Admin Panel:**
- [  ] Login works
- [  ] Leads list loads
- [  ] Filters work
- [  ] Lead detail shows all data
- [  ] Teaser email generator copies to clipboard
- [  ] Status updates save
- [  ] Notes save

**Privacy:**
- [  ] Consent checkbox required
- [  ] Privacy policy published
- [  ] Privacy policy linked from form
- [  ] Can't submit without consent

**Handover:**
- [  ] PDF generation works
- [  ] Password protection works
- [  ] PDF has all needed data

---

## COST BREAKDOWN

- Supabase: **$0** (free tier handles 500+ leads/month)
- Privacy Policy: **$50** (TermsFeed one-time)
- PDF tools: **$0** (free options available)

**Total: $50**

---

## TIMELINE

- Phase 1 (Database): 1-2 hours
- Phase 2 (Admin Panel): 1-2 hours  
- Phase 3 (Privacy Policy): 30 minutes
- Phase 4 (Handover): 15 minutes
- Testing: 30 minutes

**Total: 4-6 hours over 1-2 days**

---

## LEGAL COMPLIANCE CHECKLIST

Before accepting first lead:

- [  ] Privacy policy published
- [  ] Consent mechanism working
- [  ] Data encrypted at rest
- [  ] Can delete data on request
- [  ] Audit trail exists (Supabase logs)
- [  ] Data stored in Australia (Supabase Sydney region)
- [  ] Secure handover method implemented

**If all checked:** You're compliant with Australian Privacy Principles (APPs)

---

## WHAT NOT TO DO

❌ Don't email parent details in plain text
❌ Don't store data in spreadsheets only
❌ Don't give lawyer full details before payment
❌ Don't write your own privacy policy
❌ Don't skip the consent checkbox
❌ Don't use weak passwords for admin access
❌ Don't commit API keys to Git

---

**Next:** After this is implemented, you can start lawyer outreach with confidence that you're legally compliant and professionally set up.