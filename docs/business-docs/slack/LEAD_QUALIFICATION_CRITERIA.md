# Lead Qualification Criteria (The "Product" Definition)

**Last Updated:** January 1, 2026  
**Status:** Phase 3A - Validation  
**Product:** Australian Child Support Calculator (auschildsupport.com)

---

## Overview

This document defines what constitutes a **qualified lead** - the "product" we sell to family law firms for $50 each. It outlines automatic complexity detection criteria, manual review standards, quality thresholds, and examples of qualified vs unqualified leads.

**Purpose:** Ensure consistent lead quality, set expectations for lawyers, and guide manual review process.

---

## 1. Qualified Lead Definition

### 1.1 Core Definition

A **qualified lead** is a parent inquiry that meets ALL of the following criteria:

1. **Complexity Detected:** Automatic system flags indicate the case may benefit from legal review
2. **Inquiry Submitted:** Parent has completed the inquiry form with consent
3. **Manual Review Passed:** 30-second quality check confirms lead is worth pursuing
4. **Contact Information Valid:** Email and/or phone number provided and appears valid
5. **Consent Given:** Privacy consent checkbox checked (Privacy Act compliance)

**What We're Selling:** Pre-qualified, warm leads where complexity is already identified, reducing lawyer time spent on unqualified inquiries.

---

### 1.2 Lead Lifecycle

```
Parent Uses Calculator
    ↓
Complexity Detected (Automatic)
    ↓
"Get Legal Help" Alert Shown
    ↓
Parent Clicks Button → Inquiry Form
    ↓
Parent Submits Form (with consent)
    ↓
Lead Saved to Database
    ↓
Admin Reviews (30 seconds) → QUALITY CHECK
    ↓
[QUALIFIED] → Teaser Email to Lawyer
    ↓
Lawyer Accepts → Charged $50
    ↓
Full Details via Secure Magic Link
```

**Key Point:** Lead is only "qualified" after passing manual review. Automatic detection is the first filter, manual review is the final gate.

---

## 2. Automatic Complexity Detection

### 2.1 Detection Criteria

The system automatically detects complexity using the following criteria (in priority order):

#### Priority 1: Court Date Urgent (Highest Priority)

**Criteria:**

- Parent has selected a court date reason
- Court date is within 60 days (or any future date)
- **Urgency:** High
- **Alert:** "Court Date Approaching: [Date]"

**Why Qualified:**

- Time-sensitive legal matter
- Requires immediate professional preparation
- High conversion probability (urgent need)

**Example:**

- Court date: 15 Feb 2026 (45 days away)
- **Result:** ✅ Qualified (Priority 1)

---

#### Priority 2: Special Circumstances (Change of Assessment)

**Criteria:**

- Parent has selected one or more Change of Assessment reasons
- Reasons indicate complex income, child-related, or other factors
- **Urgency:** Medium to High (depending on reason priority)

**Change of Assessment Reasons (10 Official Grounds):**

| Reason ID                        | Label                                  | Category | Priority | Official Code     |
| -------------------------------- | -------------------------------------- | -------- | -------- | ----------------- |
| `income_resources_not_reflected` | Income/assets not in tax return        | Income   | 4        | 5.2.8 (Reason 8A) |
| `earning_capacity`               | Deliberately underemployed             | Income   | 5        | 5.2.9 (Reason 8B) |
| `school_fees`                    | Private school/special education costs | Child    | 6        | 5.2.3             |
| `special_needs`                  | Child special needs/high care costs    | Child    | 7        | 5.2.2, 5.2.3      |
| `contact_costs`                  | High travel costs for contact          | Child    | 8        | 5.2.1             |
| `property_settlement`            | Pending property settlement            | Other    | 3        | 5.2.11            |
| `child_resources`                | Child has own income/resources         | Other    | 10       | 5.2.4             |
| `duty_to_maintain`               | Duty to support another person         | Other    | 11       | 5.2.9, 5.2.10     |
| `court_*`                        | Court date (dynamic)                   | Urgent   | 1        | 5.2.11            |

**Why Qualified:**

- Indicates need for Change of Assessment application
- Requires legal expertise to navigate
- Often results in $5,000+ annual adjustment
- High-value cases for lawyers

**Example:**

- Selected: "Income/assets not in tax return" (Reason 8A)
- **Result:** ✅ Qualified (Priority 2, High urgency)

---

#### Priority 3: Shared Care Dispute

**Criteria:**

- Care percentage for any child is between 35-65%
- This is the "dispute zone" where care arrangements are often contested
- **Urgency:** Medium

**Why Qualified:**

- Care percentage disputes are common
- Requires legal expertise to resolve
- Often involves court proceedings

**Example:**

- Parent A: 40% care, Parent B: 60% care
- **Result:** ✅ Qualified (Priority 3)

---

#### Priority 4: High-Value Case

**Criteria:**

- Annual child support payment exceeds $15,000
- **Urgency:** Medium
- **Alert:** "High-Value Case: $[Amount]/year"

**Why Qualified:**

- High financial stakes justify legal review
- Verification recommended for large amounts
- Higher likelihood of retained client (can afford legal fees)

**Example:**

- Annual payment: $18,500
- **Result:** ✅ Qualified (Priority 4)

---

#### Priority 5: Binding Agreement Interest

**Criteria:**

- Parent has clicked "Discuss Agreements" button
- Indicates interest in binding child support agreement
- **Urgency:** Low to Medium

**Why Qualified:**

- Binding agreements require legal expertise
- Often involves property settlement considerations
- Higher-value legal work

**Example:**

- Parent clicked "Discuss Agreements" after calculation
- **Result:** ✅ Qualified (Priority 5)

---

### 2.2 Multiple Complexity Factors

**When Multiple Factors Detected:**

- System shows alert for highest-priority factor
- All factors are included in lead details
- **Higher Qualification:** Multiple factors = stronger lead

**Example:**

- High-value case ($18,500/year) + Income not reflected (Reason 8A)
- **Result:** ✅ Highly Qualified (Multiple factors)

---

## 3. Manual Review Criteria

### 3.1 Review Process

**Time Investment:** 30 seconds per lead

**Review Checklist:**

1. ✅ Complexity detected (automatic system flagged)
2. ✅ Inquiry form completed (all required fields)
3. ✅ Contact information valid (email/phone format correct)
4. ✅ Consent checkbox checked (Privacy Act compliance)
5. ✅ Case details make sense (no obvious errors or spam)
6. ✅ Change of Assessment reasons selected (if applicable)
7. ✅ Financial details provided (income, care arrangements)

---

### 3.2 Quality Standards

**Minimum Requirements (Must Pass All):**

<table>
<thead>
<tr>
<th>Criterion</th>
<th>Requirement</th>
<th>Why</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Complexity Detected</strong></td>
<td>At least one automatic flag</td>
<td>System must have identified complexity</td>
</tr>
<tr>
<td><strong>Contact Information</strong></td>
<td>Valid email OR phone number</td>
<td>Lawyer needs to contact parent</td>
</tr>
<tr>
<td><strong>Consent Given</strong></td>
<td>Privacy checkbox checked</td>
<td>Legal requirement (Privacy Act)</td>
</tr>
<tr>
<td><strong>Form Completion</strong></td>
<td>All required fields filled</td>
<td>Need basic case information</td>
</tr>
<tr>
<td><strong>No Spam/Errors</strong></td>
<td>Information appears legitimate</td>
<td>Filter out invalid submissions</td>
</tr>
</tbody>
</table>

**Quality Indicators (Nice to Have):**

<table>
<thead>
<tr>
<th>Indicator</th>
<th>Value</th>
<th>Notes</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Multiple Complexity Factors</strong></td>
<td>Higher value</td>
<td>Stronger lead, more likely to convert</td>
</tr>
<tr>
<td><strong>Court Date Urgent</strong></td>
<td>Highest priority</td>
<td>Time-sensitive, high conversion</td>
</tr>
<tr>
<td><strong>High-Value Case</strong></td>
<td>&gt;$15k annual</td>
<td>Can afford legal fees, higher retention</td>
</tr>
<tr>
<td><strong>Detailed Information</strong></td>
<td>Complete form</td>
<td>Better context for lawyer</td>
</tr>
<tr>
<td><strong>Change of Assessment Reasons</strong></td>
<td>Specific grounds selected</td>
<td>Clear legal path forward</td>
</tr>
</tbody>
</table>

---

### 3.3 What Gets Filtered Out

**Automatic Rejection (Not Qualified):**

| Reason                     | Example                      | Why Rejected             |
| -------------------------- | ---------------------------- | ------------------------ |
| **No Complexity Detected** | Simple case, no flags        | Doesn't need legal help  |
| **Invalid Contact Info**   | Email: "test@test.com"       | Cannot contact parent    |
| **No Consent**             | Consent checkbox not checked | Privacy Act violation    |
| **Incomplete Form**        | Missing required fields      | Insufficient information |
| **Spam/Test**              | Obvious test submission      | Not a real inquiry       |
| **Zero Payment Case**      | No child support payable     | No legal work needed     |

**Manual Rejection (During Review):**

<table>
<thead>
<tr>
<th>Reason</th>
<th>Example</th>
<th>Why Rejected</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Obvious Errors</strong></td>
<td>Income: $999,999,999</td>
<td>Data entry error, not real case</td>
</tr>
<tr>
<td><strong>Duplicate Submission</strong></td>
<td>Same email submitted twice</td>
<td>Already processed</td>
</tr>
<tr>
<td><strong>Outside Scope</strong></td>
<td>Not child support related</td>
<td>Wrong type of case</td>
</tr>
<tr>
<td><strong>Insufficient Detail</strong></td>
<td>Vague or incomplete information</td>
<td>Cannot assess case value</td>
</tr>
</tbody>
</table>

---

## 4. Lead Scoring & Prioritization

### 4.1 Lead Score Calculation

**Scoring Formula (Internal Use):**

| Factor                            | Points | Notes                            |
| --------------------------------- | ------ | -------------------------------- |
| **Court Date Urgent**             | +10    | Highest priority, time-sensitive |
| **Property Settlement**           | +8     | High-value legal work            |
| **Income Issues (Reason 8A/8B)**  | +7     | Complex, often high-value        |
| **High-Value Case (>$15k)**       | +6     | Can afford legal fees            |
| **Multiple Complexity Factors**   | +5     | Stronger lead                    |
| **Special Circumstances (Other)** | +4     | Moderate complexity              |
| **Shared Care Dispute**           | +3     | Common but valuable              |
| **Binding Agreement Interest**    | +2     | Additional legal work            |

**Lead Score Ranges:**

- **10+ Points:** Premium lead (consider $75-100 pricing in Phase 4+)
- **7-9 Points:** High-value lead (strong qualification)
- **4-6 Points:** Standard qualified lead ($50)
- **2-3 Points:** Low-value lead (may still qualify, lower priority)

---

### 4.2 Lead Prioritization

**Priority Order (When Multiple Leads Available):**

1. **Court Date Urgent** (within 30 days)
2. **High-Value + Income Issues** (>$15k + Reason 8A/8B)
3. **Property Settlement** (Reason 10)
4. **High-Value Case** (>$15k, no other factors)
5. **Income Issues** (Reason 8A/8B, standard value)
6. **Special Circumstances** (Other CoA reasons)
7. **Shared Care Dispute** (35-65% care)
8. **Binding Agreement Interest** (Low priority)

**Delivery Strategy:**

- Premium leads (10+ points) → Premium lawyers OR premium pricing
- High-value leads (7-9 points) → Top-tier lawyers first
- Standard leads (4-6 points) → Standard distribution
- Low-value leads (2-3 points) → Lower priority, may batch

---

## 5. Examples: Qualified vs Unqualified

### 5.1 Qualified Lead Examples

**Example 1: Court Date Urgent (Premium Lead)**

```
Complexity Detected:
- Court date: 15 Feb 2026 (45 days away)
- Priority: 1 (Urgent)

Case Details:
- Annual payment: $12,000
- Parent A income: $80,000
- Parent B income: $50,000
- 2 children, 50/50 care

Contact: Valid email, phone provided
Consent: ✅ Checked

Score: 10 points (Premium)
Status: ✅ QUALIFIED
```

**Why Qualified:** Time-sensitive, requires immediate legal preparation, high conversion probability.

---

**Example 2: High-Value + Income Issues (High-Value Lead)**

```
Complexity Detected:
- High-value case: $18,500/year (>$15k threshold)
- Income not reflected: Reason 8A selected
- Priority: 2 (High)

Case Details:
- Annual payment: $18,500
- Parent A income: $120,000 (reported)
- Parent B income: $45,000
- Parent suspects hidden income (cash business)
- 2 children, 60/40 care

Contact: Valid email provided
Consent: ✅ Checked

Score: 13 points (Premium)
Status: ✅ QUALIFIED
```

**Why Qualified:** High financial stakes, complex income situation, likely Change of Assessment application, high-value case.

---

**Example 3: Shared Care Dispute (Standard Lead)**

```
Complexity Detected:
- Shared care dispute: 40/60 care (within 35-65% range)
- Priority: 3 (Medium)

Case Details:
- Annual payment: $8,500
- Parent A income: $65,000
- Parent B income: $55,000
- 1 child, 40/60 care (disputed)

Contact: Valid email, phone provided
Consent: ✅ Checked

Score: 3 points (Standard)
Status: ✅ QUALIFIED
```

**Why Qualified:** Care percentage in dispute zone, common legal issue, standard qualification.

---

### 5.2 Unqualified Lead Examples

**Example 1: No Complexity Detected**

```
Complexity Detected:
- None (no automatic flags)
- Annual payment: $6,000 (<$15k threshold)
- Simple case, no special circumstances

Status: ❌ NOT QUALIFIED
Reason: No complexity detected - case doesn't need legal help
```

**Why Not Qualified:** Simple case, no legal complexity, parent doesn't need lawyer.

---

**Example 2: Invalid Contact Information**

```
Complexity Detected:
- High-value case: $16,000/year
- Priority: 4 (Medium)

Case Details:
- Valid financial information
- Contact: "test@test.com" (invalid email)
- Phone: Not provided

Status: ❌ NOT QUALIFIED
Reason: Invalid contact information - cannot contact parent
```

**Why Not Qualified:** Cannot deliver lead to lawyer (no valid contact method).

---

**Example 3: No Consent Given**

```
Complexity Detected:
- Income not reflected: Reason 8A
- Priority: 2 (High)

Case Details:
- Valid information, valid contact
- Consent: ❌ Not checked

Status: ❌ NOT QUALIFIED
Reason: Privacy consent not given - Privacy Act violation
```

**Why Not Qualified:** Legal requirement - cannot share data without consent.

---

**Example 4: Zero Payment Case**

```
Complexity Detected:
- None (zero payment case)
- Annual payment: $0
- Both parents on income support

Status: ❌ NOT QUALIFIED
Reason: Zero payment case - no legal work needed
```

**Why Not Qualified:** No child support payable, no legal work for lawyer.

---

## 6. Quality Assurance Process

### 6.1 Review Workflow

**Step 1: Automatic Detection**

- System flags complexity during calculation
- Alert shown to parent
- Parent clicks "Get Legal Help"

**Step 2: Form Submission**

- Parent completes inquiry form
- System validates required fields
- Lead saved to database

**Step 3: Manual Review (30 seconds)**

- Admin opens lead in dashboard
- Reviews complexity flags
- Checks contact information
- Verifies consent
- Assesses case details

**Step 4: Qualification Decision**

- ✅ **Qualified:** Send teaser email to lawyer
- ❌ **Not Qualified:** Mark as "rejected", no charge to lawyer

**Step 5: Delivery**

- Teaser email sent (case summary, no contact details)
- Lawyer accepts → Charged $50
- Full details via Secure Magic Link

---

### 6.2 Quality Metrics

**Target Metrics (Phase 3A Validation):**

| Metric                | Target | Notes                               |
| --------------------- | ------ | ----------------------------------- |
| **Acceptance Rate**   | 60-80% | Lawyers accept qualified leads      |
| **Consultation Rate** | 15%+   | Leads convert to consultations      |
| **Dispute Rate**      | <20%   | Leads that get Lead Credit          |
| **Rejection Rate**    | 10-20% | Leads rejected during manual review |

**Quality Indicators:**

- High acceptance rate = Good qualification
- High consultation rate = Strong lead quality
- Low dispute rate = Accurate qualification
- Appropriate rejection rate = Good filtering

---

### 6.3 Continuous Improvement

**Feedback Loop:**

1. **Lawyer Feedback:** Collect feedback on lead quality (Phase 3A+)
2. **Conversion Tracking:** Monitor Lead→Consultation rate
3. **Dispute Analysis:** Review disputed leads, identify patterns
4. **Threshold Adjustment:** Refine complexity detection thresholds
5. **Review Process Refinement:** Improve manual review checklist

**Iteration Cycle:**

- Weekly review of metrics (Phase 3A)
- Monthly threshold adjustments (if needed)
- Quarterly process review (Phase 4+)

---

## 7. Lead Information Delivered to Lawyers

### 7.1 Teaser Email (Before Payment)

**Content (No PII):**

- Case summary (complexity flags, annual payment)
- Change of Assessment reasons (if applicable)
- Financial overview (income ranges, care arrangements)
- Urgency indicators (court date, high-value)
- **No contact details** (parent email/phone not included)

**Purpose:** Lawyer can assess case value before committing to pay.

---

### 7.2 Full Lead Details (After Payment)

**Content (Via Secure Magic Link):**

- Full parent contact information (email, phone)
- Complete calculation history
- All financial details (exact income, care percentages)
- Change of Assessment reasons (with official codes)
- Complexity flags (all detected factors)
- Submission timestamp
- Full inquiry form responses

**Purpose:** Lawyer has everything needed to contact parent and assess case.

---

## 8. Lead Credit Policy

### 8.1 When Lead Credit is Issued

**100% Lead Credit Issued If:**

- Lead doesn't convert to consultation (parent doesn't respond or declines)
- Contact information is invalid (email bounces, phone disconnected)
- Case is outside lawyer's practice area (rare, should be caught in review)
- Duplicate lead (same parent, already contacted)

**No Credit Issued If:**

- Parent had consultation but didn't retain lawyer
- Lawyer didn't follow up in timely manner
- Case was valid but lawyer chose not to pursue

**Purpose:** Risk mitigation for lawyers, ensures quality guarantee.

---

## 9. Key Takeaways

### 9.1 Qualification Summary

✅ **Qualified Lead Must Have:**

1. Complexity detected (automatic system)
2. Valid contact information
3. Privacy consent given
4. Complete inquiry form
5. Passes manual review (30 seconds)

❌ **Not Qualified If:**

1. No complexity detected
2. Invalid contact information
3. No consent given
4. Incomplete form
5. Spam/test submission
6. Zero payment case

---

### 9.2 Quality Standards

**Minimum:** All 5 qualification criteria must pass

**Target Metrics:**

- 60-80% acceptance rate (lawyers accept leads)
- 15%+ consultation rate (leads convert)
- <20% dispute rate (quality guarantee)

**Continuous Improvement:**

- Weekly metric review
- Monthly threshold adjustments
- Quarterly process refinement

---

### 9.3 What We're Selling

**To Lawyers:**

> "Pre-qualified, warm leads where complexity is already identified. You get case summary before paying, full details after payment, and 100% Lead Credit if it doesn't convert to consultation."

**Value Proposition:**

- Saves time (complexity pre-identified)
- Reduces risk (Lead Credit guarantee)
- Higher conversion (pre-qualified, warm leads)
- Affordable ($50 vs $100-300 per click)

---

**For related documentation:**

- `/docs/business-docs/BUSINESS_MODEL.md` - Business model overview
- `/docs/business-docs/GO_TO_MARKET_STRATEGY.md` - GTM strategy
- `/src/utils/complexity-detection.ts` - Technical implementation
- `/src/utils/special-circumstances.ts` - Change of Assessment reasons
