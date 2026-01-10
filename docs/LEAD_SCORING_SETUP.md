# Lead Scoring System - Database Setup

## Required Database Migration

You need to run the SQL migration to add scoring columns to your `leads` table in Supabase.

### Migration File Location

The migration SQL is located at:
```
/Users/sammcdougal/d/csc/supabase/migrations/add_lead_scoring.sql
```

### How to Apply the Migration

**Option 1: Supabase Dashboard (Recommended)**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `add_lead_scoring.sql`
4. Paste and run the SQL

**Option 2: Supabase CLI**
```bash
cd /Users/sammcdougal/d/csc
supabase db push
```

### What the Migration Does

Adds three new columns to the `leads` table:
- `lead_score` (INTEGER) - Calculated priority score (0-30+ range)
- `score_category` (TEXT) - Category: "Premium", "High-Value", "Standard", or "Low-Value"
- `scoring_factors` (TEXT[]) - Array of factor IDs that contributed to the score

Also creates an index on `lead_score` for efficient querying and sorting.

### Verification

After running the migration, verify the columns were added:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND column_name IN ('lead_score', 'score_category', 'scoring_factors');
```

Should return 3 rows showing the new columns.

---

## Testing the Scoring System

### Manual Testing Checklist

1. **Submit a lead with court date** (should score 10+ points)
   - Use lawyer inquiry form
   - Select "upcoming court hearing" special circumstance
   - Enter a date within 30 days
   - Expected: Premium or High-Value category

2. **Submit a lead with property settlement** (should score 8+ points)
   - Select "property settlement pending"
   - Expected: High-Value category

3. **Submit a lead with income issues** (should score 7+ points)
   - Select "income/resources not reflected"
   - Choose "Hidden Assets" or "Cash Business" tags
   - Expected: High-Value category

4. **Submit a standard lead** (should score 4-6 points)
   - Use special circumstances without urgency flags
   - Expected: Standard category

5. **Check database**
   - Query the `leads` table after each submission
   - Verify `lead_score`, `score_category`, and `scoring_factors` are populated

```sql
SELECT 
  parent_email,
  lead_score,
  score_category,
  scoring_factors,
  created_at
FROM leads
ORDER BY created_at DESC
LIMIT 5;
```

### Console Logging

When running in development mode, you'll see console logs like:
```
[LawyerInquiry] Lead score calculated: {
  score: 10,
  category: 'Premium',
  factors: ['court_date_urgent']
}
```

---

## Scoring Logic Reference

### Point Values

| Factor | Points | Trigger Condition |
|--------|--------|-------------------|
| Court Date Urgent | 10 | Court date within 30 days |
| Property Settlement | 8 | `property_settlement_pending` in special circumstances |
| Income Issues | 7 | "Hidden Assets" or "Cash Business" in financial tags |
| High-Value Case | 6 | Annual liability > $15,000 |
| Multiple Complexity | 5 | 3+ special circumstances |
| Special Circumstance | 4 | Each other special circumstance |
| Shared Care Dispute | 3 | Any child with 35-65% care |
| Binding Agreement | 2 | Interest in binding agreement (future feature) |

### Score Categories

- **10+ points**: Premium (priority 1)
- **7-9 points**: High-Value (priority 2)
- **4-6 points**: Standard (priority 3)
- **2-3 points**: Low-Value (priority 4)
- **0-1 points**: Unscored

---

## Future Enhancements

1. **Add binding agreement field** to inquiry form (currently hardcoded to `false`)
2. **Lead distribution system** using scores to route leads to lawyers
3. **Admin dashboard** showing score distribution and trends
4. **Dynamic pricing** based on lead score (Phase 4+)
