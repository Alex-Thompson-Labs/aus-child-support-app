# Phase 4: Secure Handover Method

**Time estimate:** 15 minutes setup

---

## The Problem

After lawyer pays $50, you need to send them parent's contact details. **DON'T email in plain text** - it's insecure.

---

## Option A: Password-Protected PDF (Simplest)

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

---

## Option B: Temporary Secure Link (Better, more work)

**Process:**
1. After lawyer pays, generate unique link
2. Link shows lead details
3. Link expires after 24 hours
4. Requires lawyer to enter email to access

**Implementation:** Add to Phase 3 (later, after revenue flowing)

---

## Option C: Encrypted Email (If lawyer has PGP)

Most lawyers won't have this. Skip unless specifically requested.

---

## Recommendation

**Start with Option A (password-protected PDF)**

---

## Done When

- [  ] Can generate PDF from lead
- [  ] Can set password on PDF
- [  ] Tested end-to-end handover


# Testing Checklist - Lead Management System

**Before going live, verify all items below.**

---

## Database Testing

- [  ] Lead saves to Supabase
- [  ] All fields populated correctly
- [  ] RLS policies prevent unauthorized access
- [  ] Soft delete works (deleted_at set)

---

## Notifications Testing

- [  ] Email alert arrives when new lead submitted
- [  ] Email has correct lead ID and summary
- [  ] Doesn't expose parent contact details

---

## Admin Panel Testing

- [  ] Login works
- [  ] Leads list loads
- [  ] Filters work
- [  ] Lead detail shows all data
- [  ] Teaser email generator copies to clipboard
- [  ] Status updates save
- [  ] Notes save

---

## Privacy Testing

- [  ] Consent checkbox required
- [  ] Privacy policy published
- [  ] Privacy policy linked from form
- [  ] Can't submit without consent

---

## Handover Testing

- [  ] PDF generation works
- [  ] Password protection works
- [  ] PDF has all needed data

---

## Legal Compliance Checklist

**Before accepting first lead, verify:**

- [  ] Privacy policy published
- [  ] Consent mechanism working
- [  ] Data encrypted at rest
- [  ] Can delete data on request
- [  ] Audit trail exists (Supabase logs)
- [  ] Data stored in Australia (Supabase Sydney region)
- [  ] Secure handover method implemented

**If all checked:** You're compliant with Australian Privacy Principles (APPs)

---

## What NOT to Do

❌ Don't email parent details in plain text  
❌ Don't store data in spreadsheets only  
❌ Don't give lawyer full details before payment  
❌ Don't write your own privacy policy  
❌ Don't skip the consent checkbox  
❌ Don't use weak passwords for admin access  
❌ Don't commit API keys to Git  

---

## Status

- Start: [Date when testing begins]
- Complete: [Date when all items checked]



