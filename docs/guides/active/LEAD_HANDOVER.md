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

