# Court Order Analyzer - Gemini Implementation

## Overview
This edge function uses **Google Gemini 2.0 Flash** to analyze court orders and extract care schedules.

## Cost Comparison
- **Previous (Claude Sonnet 4.5)**: ~$0.28 per scan
- **Current (Gemini 2.0 Flash)**: ~$0.00 per scan (free tier: 1,500 requests/day)
- **Savings**: ~99% cost reduction

## Setup

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key (free tier includes 1,500 requests/day)

### 2. Add to Supabase Secrets
```bash
# Using Supabase CLI
supabase secrets set GEMINI_API_KEY=your_api_key_here

# Or via Supabase Dashboard
# Project Settings > Edge Functions > Secrets
# Add: GEMINI_API_KEY = your_api_key_here
```

### 3. Deploy
```bash
supabase functions deploy analyze-order
```

## API Limits (Free Tier)
- **Rate Limit**: 15 requests per minute
- **Daily Limit**: 1,500 requests per day
- **Input**: Up to 4M tokens per request
- **Output**: Up to 8,192 tokens per request

For production scale (>1,500 scans/day), you'll need to upgrade to paid tier:
- **Paid**: $0.075 per 1M input tokens, $0.30 per 1M output tokens
- Still ~95% cheaper than Claude

## Model Details
- **Model**: `gemini-2.0-flash-exp`
- **Temperature**: 0 (deterministic)
- **Output Format**: JSON (enforced via `responseMimeType`)

## Testing
```bash
# Test locally
supabase functions serve analyze-order

# Test with curl
curl -X POST http://localhost:54321/functions/v1/analyze-order \
  -H "Content-Type: application/json" \
  -d '{"fileBase64": "...", "mediaType": "application/pdf", "year": 2026}'
```

## Monitoring
Check usage at: https://aistudio.google.com/app/apikey (click on your key)
