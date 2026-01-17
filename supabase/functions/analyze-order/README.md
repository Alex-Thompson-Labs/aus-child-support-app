# Court Order Analyzer - Gemini Implementation

This edge function uses **Google Gemini 2.0 Flash** to analyze court orders and extract care schedules.

## Cost Comparison

- **Gemini 2.0 Flash**: ~$0.00 per scan (free tier: 1,500 requests/day, 15 requests/minute)
- **Claude Sonnet**: ~$0.28 per scan

## Setup Instructions

### 1. Get Gemini API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Click "Get API Key" → "Create API key in new project"
3. Copy the key (starts with `AIza...`)

### 2. Add to Supabase Secrets

**Option A: Via Supabase Dashboard**
1. Go to your Supabase project → Settings → Edge Functions → Secrets
2. Add new secret:
   - Name: `GEMINI_API_KEY`
   - Value: Your API key from step 1

**Option B: Via CLI**
```bash
supabase secrets set GEMINI_API_KEY=your_api_key_here
```

### 3. Deploy the Function

```bash
supabase functions deploy analyze-order
```

## Technical Details

- **Model**: `gemini-2.0-flash`
- **JSON Mode**: Uses native `responseMimeType: 'application/json'` for reliable structured output
- **Vision Support**: Handles both PDFs and images (JPEG, PNG)
- **Two API Calls**: 
  1. Main analysis for care timeline extraction
  2. Text extraction for keyword/opportunity detection

## Free Tier Limits

| Metric | Limit |
|--------|-------|
| Requests per day | 1,500 |
| Requests per minute | 15 |
| Context window | 1M tokens |

More than enough for beta/production use at typical volumes.

## Testing

Test the function locally:

```bash
supabase functions serve analyze-order --env-file .env.local
```

Make sure your `.env.local` contains:
```
GEMINI_API_KEY=AIza...your-key-here
```

## Troubleshooting

### "GEMINI_API_KEY not set in environment"
- Ensure you've added the secret via Supabase Dashboard or CLI
- Redeploy the function after adding secrets

### Rate limit errors
- Free tier has 15 requests/minute limit
- If you hit this, consider upgrading to paid tier or implementing request queuing

### JSON parsing errors
- The function uses Gemini's native JSON mode which should prevent malformed responses
- If issues persist, check the raw response in logs
