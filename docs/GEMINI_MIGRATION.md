# Court Order Scanner: Claude → Gemini Migration

## Summary
Migrated court order scanner from **Claude Sonnet 4.5** to **Google Gemini 2.0 Flash** to reduce costs by ~99%.

## Cost Comparison

| Metric | Claude Sonnet 4.5 | Gemini 2.0 Flash | Savings |
|--------|-------------------|------------------|---------|
| Per scan | $0.28 | $0.00 (free tier) | 99% |
| 100 scans/month | $28 | $0 | 100% |
| 500 scans/month | $140 | $0 | 100% |
| 1,000 scans/month | $280 | $0 | 100% |
| 5,000 scans/month | $1,400 | $37.50 | 97% |

## Free Tier Limits
- **1,500 requests per day** (45,000/month)
- **15 requests per minute**
- More than enough for beta phase

## Migration Steps

### 1. Get Gemini API Key
1. Visit: https://aistudio.google.com/app/apikey
2. Click "Get API Key" → "Create API key in new project"
3. Copy the key (starts with `AIza...`)

### 2. Update Supabase Secrets

**Option A: Via Supabase Dashboard**
1. Go to your Supabase project
2. Settings → Edge Functions → Secrets
3. Add new secret:
   - Name: `GEMINI_API_KEY`
   - Value: Your API key from step 1

**Option B: Via Supabase CLI**
```bash
supabase secrets set GEMINI_API_KEY=AIza...your-key-here
```

### 3. Deploy Updated Function
```bash
cd supabase/functions/analyze-order
supabase functions deploy analyze-order
```

### 4. Test
Upload a test court order at: https://auschildsupport.com/court-order-tool

### 5. Remove Old API Key (Optional)
Once confirmed working, you can remove the old `ANTHROPIC_API_KEY` secret to clean up.

## Technical Changes

### Files Modified
- `supabase/functions/analyze-order/index.ts` - Replaced Anthropic SDK with Google Generative AI
- `supabase/functions/analyze-order/deno.json` - Updated dependencies
- `.env.example` - Updated API key documentation

### Key Differences
1. **API Structure**: Gemini uses simpler API (single `generateContent` call vs Claude's messages API)
2. **JSON Mode**: Gemini has native JSON output mode (`responseMimeType: 'application/json'`)
3. **File Handling**: Gemini uses `inlineData` format for base64 files

### Prompt Compatibility
The exact same prompt works with both models - no changes needed to the core logic.

## Model Capabilities

### Gemini 2.0 Flash Strengths
- ✅ Excellent vision/OCR quality
- ✅ Strong reasoning for structured tasks
- ✅ Fast response times (~10-15 seconds)
- ✅ Native JSON output mode
- ✅ Handles complex instructions well

### Potential Limitations
- ⚠️ Slightly less sophisticated reasoning than Claude Sonnet 4.5
- ⚠️ May struggle with extremely complex edge cases
- ⚠️ Less tested on Australian legal documents

## Monitoring & Fallback

### Monitor Quality
Track validation errors in your admin dashboard:
- If validation failure rate > 10%, consider hybrid approach
- Check user feedback via "Report an issue" link

### Hybrid Fallback (Future)
If quality issues arise at scale, implement:
```typescript
// Try Gemini first (free/cheap)
const result = await gemini.analyze(document);

// Fallback to Claude if confidence low
if (result.confidence < 0.8 || !validateTimeline(result.timeline)) {
  const result = await claude.analyze(document);
}
```

This would give you:
- 70-80% handled by Gemini (free)
- 20-30% escalated to Claude ($0.28)
- Average cost: ~$0.06 per scan (78% savings)

## Rollback Plan

If you need to revert to Claude:

1. Restore old code:
```bash
git checkout HEAD~1 supabase/functions/analyze-order/
```

2. Re-add Anthropic API key:
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

3. Redeploy:
```bash
supabase functions deploy analyze-order
```

## Questions?
Contact: alex@auschildsupport.com.au
