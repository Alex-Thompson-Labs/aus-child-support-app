import Anthropic from 'https://esm.sh/@anthropic-ai/sdk?target=deno';

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response> | Response): void;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { fileBase64, mediaType } = await req.json();

    if (!fileBase64) {
      throw new Error('No file content provided');
    }

    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
    });

    const systemPrompt = `You are an expert Australian Family Law Court Order Interpreter. 
    
    GATEKEEPER RULE: VALIDATION FIRST
    Before extracting any data, you must analyze if the document is a specific, executed Court Order or Parenting Plan.

    CRITERIA FOR INVALID DOCUMENTS:
    1. Contains "Example", "Guide", "Brochure", "Template", or "Sample" in headers or watermarks.
    2. Uses generic names like "John Doe", "Jane Doe", "The Father", "The Mother" without specific party names.
    3. Lacks a Court File Number, Court Stamp, or Parties' Signatures (unless it is a specific draft tailored to parties).
    4. Is a general information sheet (e.g., from Legal Aid) rather than a legal instrument.

    IF INVALID:
    Return strictly this JSON format and STOP:
    {
      "error": "INVALID_DOCUMENT_TYPE",
      "reason": "Document appears to be a generic guide/template and not a specific court order."
    }

    IF VALID:
    Your goal is to extract the care arrangement rules from the provided document into a strict JSON format.

    CRITICAL: ELIMINATE THE 100% CARE ERROR
    The system is defaulting to 100% Mother because it fails to map the Father's specific overnight periods to the 14-day cycle correctly. You MUST provide a DENSE base_pattern with exactly 14 sequential entries.

    1. START DATE & DAY 1 ANCHOR:
       - Identify the "Commencement Date" (e.g., 14 January 2026).
       - Determine the weekday of that date (14 Jan 2026 is a WEDNESDAY).
       - Your "base_pattern" MUST start with Day 1 as WEDNESDAY. 
       - You MUST list exactly 14 objects, representing Day 1 to Day 14 without gaps.

    2. THE MIDNIGHT RULE (CRITICAL):
       - We only care about who has the child at 11:59 PM.
       - "Conclusion of school" / "After school": Receiving parent HAS the night.
       - "Commencement of school" / "Morning": Delivering parent does NOT have the night.
       - Example Mapping:
         * Week 1: Father has Wed Night and Thu Night. Mother has Fri Night.
         * Week 2: Father has Fri Night, Sat Night, and Sun Night. Mother has Mon Night.

    3. DENSE DATA REQUIREMENT:
       - For every day NOT explicitly mentioned as being with the Father, you MUST set "overnight_care_owner": "Mother".
       - This prevents the calculator from using carry-over logic that defaults to 100%.

    OUTPUT SCHEMA (Strict JSON Only):
    {
      "start_date": "YYYY-MM-DD",
      "cycle_length_days": 14,
      "primary_parent": "Mother",
      "base_pattern": [
        {
          "day_number": 1,
          "day_name": "Wednesday",
          "week_number": 1,
          "overnight_care_owner": "Father",
          "description": "From conclusion of school"
        }
        // ... continue for exactly 14 days
      ],
      "holiday_rules": {
        "christmas": { "applies": true, "rule_type": "alternating", "details": "Even years: Father from 3pm Xmas Eve to 11am Xmas Day" },
        "school_holidays": { "applies": true, "rule_type": "alternating_blocks", "details": "Week-about basis (7 nights each)" }
      }
    }

    Output ONLY the JSON object. No preamble or conversational text.
    `;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      temperature: 0,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Here is the court order. Extract the care schedule JSON. Output ONLY JSON.',
            },
            mediaType === 'application/pdf'
              ? {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: fileBase64,
                },
              }
              : {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType || 'image/jpeg',
                  data: fileBase64,
                },
              },
          ],
        },
      ],
    });

    // Safe extraction of text content
    const contentBlock = message.content[0];
    if (contentBlock.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const result = contentBlock.text;

    // Improved extraction to handle any conversational text before/after JSON
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : result;

    return new Response(cleanJson, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Analyze function error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});