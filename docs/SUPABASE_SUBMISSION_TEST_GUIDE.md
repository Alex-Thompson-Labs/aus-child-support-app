# Supabase Lead Submission Test Guide

This guide provides comprehensive test scenarios to verify all data fields are correctly submitted to Supabase.

## Overview

The lead submission system captures data through the lawyer inquiry form and stores it in the `leads` table via the `submit-lead` edge function. Testing requires multiple form submissions to cover all conditional fields and data combinations.

---

## Test Scenarios

### Test 1: Standard Calculator Flow (Basic Fields)

**Purpose:** Test basic submission from calculator with minimal complexity

**Steps:**
1. Go to homepage calculator
2. Enter basic calculation:
   - Parent A Income: `$80,000`
   - Parent B Income: `$60,000`
   - Number of children: `2`
   - Child 1 care: Parent A `65%`, Parent B `35%`
   - Child 2 care: Parent A `65%`, Parent B `35%`
3. Click "Calculate"
4. In results, click "Speak to a Lawyer" (or similar CTA)
5. Fill inquiry form:
   - Name: `Test User 1`
   - Email: `test1@example.com`
   - Phone: `0412345678`
   - Postcode: `2000`
   - Message: `I need help understanding my assessment`
   - Check consent checkbox
6. Submit form

**Expected Supabase Fields:**
```json
{
  "parent_name": "Test User 1",
  "parent_email": "test1@example.com",
  "parent_phone": "0412345678",
  "location": "2000",
  "income_parent_a": 80000,
  "income_parent_b": 60000,
  "children_count": 2,
  "annual_liability": [calculated value],
  "payer_role": "you",
  "care_data": [
    {"index": 0, "careA": 65, "careB": 35},
    {"index": 1, "careA": 65, "careB": 35}
  ],
  "complexity_trigger": [array of triggers],
  "complexity_reasons": [],
  "financial_tags": null,
  "parent_message": "I need help understanding my assessment",
  "consent_given": true,
  "status": "new",
  "parenting_plan_status": null,
  "inquiry_type": null,
  "referer_url": null,
  "partner_id": null,
  "lead_score": [calculated],
  "score_category": [calculated],
  "scoring_factors": [array],
  "special_circumstances_data": null,
  "time_to_complete": [seconds]
}
```

---

### Test 2: Direct Mode with Special Circumstances

**Purpose:** Test direct inquiry mode with complexity reasons

**Steps:**
1. Go to `/lawyer-inquiry?mode=direct`
2. Fill form:
   - Name: `Test User 2`
   - Email: `test2@example.com`
   - Phone: `0423456789`
   - Postcode: `3000`
   - Manual Income Parent A: `$95,000`
   - Manual Income Parent B: `$45,000`
   - Manual Children Count: `1`
   - Select special circumstances:
     - ✅ "The other parent has income or assets not reflected in their tax return"
     - ✅ "I have a property settlement pending"
   - Message: `Need help with hidden income investigation`
   - Check consent
3. Submit form

**Expected Supabase Fields:**
```json
{
  "parent_name": "Test User 2",
  "parent_email": "test2@example.com",
  "parent_phone": "0423456789",
  "location": "3000",
  "income_parent_a": 95000,
  "income_parent_b": 45000,
  "children_count": 1,
  "annual_liability": 0,
  "payer_role": null,
  "care_data": null,
  "complexity_trigger": ["direct_inquiry"],
  "complexity_reasons": [
    "income_resources_not_reflected",
    "property_settlement"
  ],
  "financial_tags": null,
  "parent_message": "Need help with hidden income investigation",
  "consent_given": true,
  "special_circumstances_data": null,
  "partner_id": null
}
```

---

### Test 3: Financial Tags + Court Date

**Purpose:** Test financial tags and court date fields

**Steps:**
1. Complete calculator with high income variance:
   - Parent A Income: `$150,000`
   - Parent B Income: `$40,000`
   - Children: `3`
   - Care: 50/50 split for all children
2. Click through to inquiry form
3. Fill form:
   - Name: `Test User 3`
   - Email: `test3@example.com`
   - Phone: `0434567890`
   - Postcode: `4000`
   - Select special circumstances:
     - ✅ "The other parent chooses to earn less than they are capable of"
   - **Financial Tags** (should appear): Select:
     - ✅ `Cash Business`
     - ✅ `Refusing to Work`
   - **Court Date** (should appear): Select date 30 days from today
   - Message: `Urgent court preparation needed`
   - Check consent
4. Submit form

**Expected Supabase Fields:**
```json
{
  "parent_name": "Test User 3",
  "parent_email": "test3@example.com",
  "parent_phone": "0434567890",
  "location": "4000",
  "income_parent_a": 150000,
  "income_parent_b": 40000,
  "children_count": 3,
  "annual_liability": [calculated],
  "payer_role": "you",
  "care_data": [array of 3 children],
  "complexity_trigger": [triggers],
  "complexity_reasons": [
    "earning_capacity",
    "court_DD_MMM_YYYY"
  ],
  "financial_tags": ["Cash Business", "Refusing to Work"],
  "parent_message": "Urgent court preparation needed",
  "consent_given": true,
  "lead_score": [high score due to court date],
  "score_category": "Premium",
  "scoring_factors": ["court_date_urgent", "income_issues", ...]
}
```

---

### Test 4: Post-Separation Income (PSI) Fields

**Purpose:** Test conditional PSI fields

**Steps:**
1. Go to `/lawyer-inquiry?mode=direct`
2. Fill form:
   - Name: `Test User 4`
   - Email: `test4@example.com`
   - Phone: `0445678901`
   - Postcode: `5000`
   - Manual incomes and children
   - Select special circumstances:
     - ✅ "I have earned extra income (second job/overtime) since we separated"
   - **PSI Fields** (should appear):
     - Separation Date: Select date 18 months ago
     - Cohabited 6 months before separation: ✅ Yes
   - Message: `PSI exclusion claim`
   - Check consent
3. Submit form

**Expected Supabase Fields:**
```json
{
  "parent_name": "Test User 4",
  "parent_email": "test4@example.com",
  "parent_phone": "0445678901",
  "location": "5000",
  "income_parent_a": [value],
  "income_parent_b": [value],
  "children_count": [value],
  "annual_liability": 0,
  "payer_role": null,
  "care_data": null,
  "complexity_trigger": ["direct_inquiry"],
  "complexity_reasons": ["post_separation_income"],
  "financial_tags": null,
  "parent_message": "PSI exclusion claim",
  "consent_given": true,
  "special_circumstances_data": {
    "separation_date": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "cohabited_6_months": true
  },
  "partner_id": null
}
```

---

### Test 5: International Jurisdiction Fields

**Purpose:** Test conditional international fields

**Steps:**
1. Go to `/lawyer-inquiry?mode=direct`
2. Fill form:
   - Name: `Test User 5`
   - Email: `test5@example.com`
   - Phone: `0456789012`
   - Postcode: `6000`
   - Manual incomes and children
   - Select special circumstances:
     - ✅ "The other parent lives outside of Australia"
   - **International Fields** (should appear):
     - Other Parent Country: Select `New Zealand`
   - Message: `International case assistance`
   - Check consent
3. Submit form

**Expected Supabase Fields:**
```json
{
  "parent_name": "Test User 5",
  "parent_email": "test5@example.com",
  "parent_phone": "0456789012",
  "location": "6000",
  "income_parent_a": [value],
  "income_parent_b": [value],
  "children_count": [value],
  "annual_liability": 0,
  "payer_role": null,
  "care_data": null,
  "complexity_trigger": ["direct_inquiry"],
  "complexity_reasons": ["international_jurisdiction"],
  "financial_tags": null,
  "parent_message": "International case assistance",
  "consent_given": true,
  "special_circumstances_data": {
    "other_parent_country": "New Zealand"
  },
  "partner_id": null
}
```

---

### Test 6: Partner Attribution

**Purpose:** Test partner_id tracking

**Steps:**
1. Go to `/lawyer-inquiry?mode=direct&partner=sage`
2. Fill form with basic details:
   - Name: `Test User 6`
   - Email: `test6@example.com`
   - Phone: `0467890123`
   - Postcode: `2000`
   - Manual incomes and children
   - Message: `Partner referral test`
   - Check consent
3. Submit form

**Expected Supabase Fields:**
```json
{
  "parent_name": "Test User 6",
  "parent_email": "test6@example.com",
  "parent_phone": "0467890123",
  "location": "2000",
  "income_parent_a": [value],
  "income_parent_b": [value],
  "children_count": [value],
  "annual_liability": 0,
  "payer_role": null,
  "care_data": null,
  "complexity_trigger": ["direct_inquiry"],
  "complexity_reasons": [],
  "financial_tags": null,
  "parent_message": "Partner referral test",
  "consent_given": true,
  "partner_id": "sage",
  "special_circumstances_data": null
}
```

---

### Test 7: Enrichment Flow (Hidden Income)

**Purpose:** Test enrichment factor submission

**Steps:**
1. Go to `/lawyer-inquiry?mode=direct&reason=hidden_income`
2. Fill form:
   - Name: `Test User 7`
   - Email: `test7@example.com`
   - Phone: `0478901234`
   - Postcode: `3000`
   - Manual Income A: `$120,000`
   - Manual Income B: `$35,000`
   - Manual Children: `2`
   - Message: `Hidden income investigation`
   - Check consent
3. Submit form
4. **Enrichment screen appears**:
   - Select additional factors:
     - ✅ "I have an upcoming court hearing"
     - ✅ "I have a property settlement pending"
   - Enter court date: 45 days from today
   - Click "Submit Additional Details"

**Expected Supabase Fields (Initial):**
```json
{
  "parent_name": "Test User 7",
  "parent_email": "test7@example.com",
  "parent_phone": "0478901234",
  "location": "3000",
  "income_parent_a": 120000,
  "income_parent_b": 35000,
  "children_count": 2,
  "annual_liability": 0,
  "payer_role": null,
  "care_data": null,
  "complexity_trigger": ["direct_inquiry"],
  "complexity_reasons": ["hidden_income"],
  "financial_tags": null,
  "parent_message": "Hidden income investigation",
  "consent_given": true,
  "partner_id": null
}
```

**Expected After Enrichment Update:**
```json
{
  "complexity_reasons": [
    "hidden_income",
    "court_DD_MMM_YYYY",
    "property_settlement"
  ],
  "annual_liability": [calculated from enrichment estimator],
  "payer_role": "you" or "other_parent"
}
```

---

### Test 8: Chatbot Data Fields

**Purpose:** Test chatbot qualification fields

**Steps:**
1. Go to `/lawyer-inquiry?mode=direct&hasParentingPlan=yes&assessmentType=change_of_assessment&returnTo=https://blog.example.com/article`
2. Fill form:
   - Name: `Test User 8`
   - Email: `test8@example.com`
   - Phone: `0489012345`
   - Postcode: `4000`
   - Manual incomes and children
   - Message: `Chatbot referral`
   - Check consent
3. Submit form

**Expected Supabase Fields:**
```json
{
  "parent_name": "Test User 8",
  "parent_email": "test8@example.com",
  "parent_phone": "0489012345",
  "location": "4000",
  "income_parent_a": [value],
  "income_parent_b": [value],
  "children_count": [value],
  "annual_liability": 0,
  "payer_role": null,
  "care_data": null,
  "complexity_trigger": ["direct_inquiry"],
  "complexity_reasons": [],
  "financial_tags": null,
  "parent_message": "Chatbot referral",
  "consent_given": true,
  "parenting_plan_status": "yes",
  "inquiry_type": "change_of_assessment",
  "referer_url": "https://blog.example.com/article",
  "partner_id": null
}
```

---

### Test 9: Combined PSI + International

**Purpose:** Test multiple conditional field groups together

**Steps:**
1. Go to `/lawyer-inquiry?mode=direct`
2. Fill form:
   - Name: `Test User 9`
   - Email: `test9@example.com`
   - Phone: `0490123456`
   - Postcode: `5000`
   - Manual incomes and children
   - Select special circumstances:
     - ✅ "I have earned extra income (second job/overtime) since we separated"
     - ✅ "The other parent lives outside of Australia"
   - **PSI Fields**:
     - Separation Date: 2 years ago
     - Cohabited 6 months: No
   - **International Fields**:
     - Other Parent Country: `United Kingdom`
   - Message: `Complex international PSI case`
   - Check consent
3. Submit form

**Expected Supabase Fields:**
```json
{
  "parent_name": "Test User 9",
  "parent_email": "test9@example.com",
  "parent_phone": "0490123456",
  "location": "5000",
  "income_parent_a": [value],
  "income_parent_b": [value],
  "children_count": [value],
  "annual_liability": 0,
  "payer_role": null,
  "care_data": null,
  "complexity_trigger": ["direct_inquiry"],
  "complexity_reasons": [
    "post_separation_income",
    "international_jurisdiction"
  ],
  "financial_tags": null,
  "parent_message": "Complex international PSI case",
  "consent_given": true,
  "special_circumstances_data": {
    "separation_date": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "cohabited_6_months": false,
    "other_parent_country": "United Kingdom"
  },
  "lead_score": [high score],
  "score_category": "Premium",
  "scoring_factors": [
    "post_separation_income",
    "international_jurisdiction",
    "multiple_complexity"
  ]
}
```

---

### Test 10: Maximum Complexity (All Fields)

**Purpose:** Test submission with maximum data

**Steps:**
1. Complete calculator with complex scenario:
   - Parent A Income: `$180,000`
   - Parent B Income: `$25,000`
   - Children: `3`
   - Care: Mixed percentages (e.g., 70/30, 40/60, 50/50)
2. Click through to inquiry form
3. Fill form:
   - Name: `Test User 10`
   - Email: `test10@example.com`
   - Phone: `0401234567`
   - Postcode: `6000`
   - Select ALL applicable special circumstances:
     - ✅ Post-separation income
     - ✅ Income resources not reflected
     - ✅ Earning capacity
     - ✅ School fees
     - ✅ Special needs
     - ✅ Property settlement
     - ✅ International jurisdiction
   - **Financial Tags**: Select all:
     - ✅ Cash Business
     - ✅ Refusing to Work
     - ✅ Hidden Assets
     - ✅ Family Trusts
     - ✅ Other
   - **Court Date**: 15 days from today
   - **PSI Fields**:
     - Separation Date: 1 year ago
     - Cohabited 6 months: Yes
   - **International Fields**:
     - Other Parent Country: `United States`
   - Message: `Maximum complexity test case with all possible fields populated`
   - Check consent
4. Submit form

**Expected Supabase Fields:**
```json
{
  "parent_name": "Test User 10",
  "parent_email": "test10@example.com",
  "parent_phone": "0401234567",
  "location": "6000",
  "income_parent_a": 180000,
  "income_parent_b": 25000,
  "children_count": 3,
  "annual_liability": [calculated],
  "payer_role": "you",
  "care_data": [array of 3 children with mixed care],
  "complexity_trigger": [multiple triggers],
  "complexity_reasons": [
    "post_separation_income",
    "income_resources_not_reflected",
    "earning_capacity",
    "school_fees",
    "special_needs",
    "property_settlement",
    "international_jurisdiction",
    "court_DD_MMM_YYYY"
  ],
  "financial_tags": [
    "Cash Business",
    "Refusing to Work",
    "Hidden Assets",
    "Family Trusts",
    "Other"
  ],
  "parent_message": "Maximum complexity test case with all possible fields populated",
  "consent_given": true,
  "special_circumstances_data": {
    "separation_date": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "cohabited_6_months": true,
    "other_parent_country": "United States"
  },
  "lead_score": [very high score],
  "score_category": "Premium",
  "scoring_factors": [
    "court_date_urgent",
    "international_jurisdiction",
    "property_settlement",
    "post_separation_income",
    "income_issues",
    "high_value_case",
    "multiple_complexity",
    "special_circumstances",
    "shared_care_dispute"
  ],
  "time_to_complete": [seconds]
}
```

---

## Verification Checklist

After running all tests, verify in Supabase:

### Core Fields (All Tests)
- [ ] `parent_name` - Sanitized string
- [ ] `parent_email` - Sanitized email
- [ ] `parent_phone` - Sanitized phone or null
- [ ] `location` - Postcode or null
- [ ] `consent_given` - Always true
- [ ] `status` - Always "new"
- [ ] `created_at` - Auto-generated timestamp

### Calculation Fields
- [ ] `income_parent_a` - Number (0 in direct mode)
- [ ] `income_parent_b` - Number (0 in direct mode)
- [ ] `children_count` - Integer
- [ ] `annual_liability` - Number (0 in direct mode, calculated in standard)
- [ ] `payer_role` - "you", "other_parent", or null
- [ ] `care_data` - Array of objects or null

### Complexity Fields
- [ ] `complexity_trigger` - Array of strings
- [ ] `complexity_reasons` - Array of reason IDs
- [ ] `financial_tags` - Array of strings or null

### Conditional Fields
- [ ] `special_circumstances_data` - JSONB object or null
  - [ ] `separation_date` - ISO date string
  - [ ] `cohabited_6_months` - Boolean
  - [ ] `other_parent_country` - String

### Chatbot Fields
- [ ] `parenting_plan_status` - String or null
- [ ] `inquiry_type` - String or null
- [ ] `referer_url` - String or null

### Partner Attribution
- [ ] `partner_id` - String or null

### Lead Scoring
- [ ] `lead_score` - Number
- [ ] `score_category` - String
- [ ] `scoring_factors` - Array of strings

### Metadata
- [ ] `time_to_complete` - Number (seconds)
- [ ] `parent_message` - String (never null)

### Edge Function Behavior
- [ ] Magic link token generated
- [ ] `magic_link_token_hash` stored
- [ ] Notification email sent (check inbox)
- [ ] Partner email routing (Test 6)

---

## Database Queries for Verification

```sql
-- View all test submissions
SELECT 
  id,
  parent_name,
  parent_email,
  created_at,
  complexity_reasons,
  financial_tags,
  special_circumstances_data,
  partner_id,
  lead_score,
  score_category
FROM leads
WHERE parent_email LIKE 'test%@example.com'
ORDER BY created_at DESC;

-- Check enrichment updates (Test 7)
SELECT 
  id,
  parent_name,
  complexity_reasons,
  annual_liability,
  payer_role
FROM leads
WHERE parent_email = 'test7@example.com';

-- Verify PSI data structure (Test 4, 9, 10)
SELECT 
  id,
  parent_name,
  special_circumstances_data->>'separation_date' as separation_date,
  special_circumstances_data->>'cohabited_6_months' as cohabited_6_months
FROM leads
WHERE special_circumstances_data IS NOT NULL
  AND special_circumstances_data ? 'separation_date';

-- Verify international data (Test 5, 9, 10)
SELECT 
  id,
  parent_name,
  special_circumstances_data->>'other_parent_country' as country
FROM leads
WHERE special_circumstances_data IS NOT NULL
  AND special_circumstances_data ? 'other_parent_country';

-- Check partner attribution (Test 6)
SELECT 
  id,
  parent_name,
  partner_id
FROM leads
WHERE partner_id IS NOT NULL;

-- Verify lead scoring
SELECT 
  id,
  parent_name,
  lead_score,
  score_category,
  scoring_factors
FROM leads
WHERE parent_email LIKE 'test%@example.com'
ORDER BY lead_score DESC;
```

---

## Notes

1. **Phone Number Sanitization**: Phone numbers are sanitized to remove spaces, dashes, and parentheses
2. **Email Sanitization**: Emails are trimmed and lowercased
3. **String Sanitization**: All text inputs are trimmed
4. **Court Date Format**: Dynamic court dates are stored as `court_DD_MMM_YYYY` (e.g., `court_12_Jan_2026`)
5. **Time Tracking**: `time_to_complete` measures from calculator start to submission
6. **Lead Scoring**: Automatically calculated based on complexity factors
7. **Enrichment**: Only triggered for specific inquiry types (`hidden_income`, `binding_agreement`)
8. **Partner Routing**: Email notifications route to partner-specific addresses when `partner_id` is present

---

## Common Issues to Check

- [ ] Missing `parent_message` (should never be null - database constraint)
- [ ] Incorrect `payer_role` mapping (Parent A = "you", Parent B = "other_parent")
- [ ] `care_data` structure (must have `index`, `careA`, `careB` keys)
- [ ] `special_circumstances_data` null when conditional fields shown
- [ ] Court date not appended to `complexity_reasons`
- [ ] Financial tags not saved when selected
- [ ] Partner ID not passed through URL params
- [ ] Lead score not calculated
- [ ] Time tracking not working
- [ ] Enrichment not updating existing lead
