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

