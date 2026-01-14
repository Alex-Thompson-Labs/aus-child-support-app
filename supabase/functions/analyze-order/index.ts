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
    Your goal is to extract the **RULES** of the care arrangement into a strict JSON format.
    
    DO NOT CALCULATE TOTALS. DO NOT COUNT NIGHTS. ONLY EXTRACT RULES.

    KEY CONCEPTS:
    1. **Anchor Date**: The date the cycle begins (Commencement Date or Date of Signing). This is critical for determining Week 1 vs Week 2.
    2. **Midnight Rule**: We care about who has the child at 11:59PM.
    3. **Cycle**: Typically 14 days (Fortnightly).

    CRITICAL: DENSE 14-DAY GRID REQUIREMENT
    You MUST generate an array of EXACTLY 14 objects in base_pattern, representing Day 1 to Day 14 of the fortnight.
    DO NOT skip any days. If a day is not explicitly mentioned in the order, assign it to the primary_parent.
    
    COMMENCEMENT DATE ALIGNMENT:
    - Find the "Commencement Date" or "Orders start from" date in the document.
    - Determine what day of the week that date falls on.
    - Day 1 of the cycle starts on that weekday. Example: If orders commence on Wednesday 15th January, then Day 1 = Wednesday.
    - Week 1 = Days 1-7, Week 2 = Days 8-14.
    
    DAY NAME FORMAT:
    - day_name MUST be the full English day name in Title Case: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    - week_number MUST be an integer: 1 or 2 (not strings)

    OUTPUT SCHEMA (Strict JSON):
    {
      "start_date": "YYYY-MM-DD", // The specific commencement date. CRITICAL.
      "cycle_length_days": 14,
      "primary_parent": "Mother" | "Father", // Who has care when not specified?
      "base_pattern": [
        // EXACTLY 14 entries, one for each day. NO GAPS.
        {
          "day_number": 1, // Sequential 1-14
          "day_name": "Wednesday", // Full name, Title Case (matches start_date weekday for day 1)
          "week_number": 1, // Integer: 1 or 2
          "overnight_care_owner": "Mother" | "Father", // Who has the child at 11:59PM?
          "description": "With Mother" // Optional context
        },
        // ... continue for all 14 days
      ],
      "holiday_rules": {
        "christmas": {
            "applies": boolean,
            "rule_type": "alternating" | "split" | "fixed" | "none", 
            "details": "Father even years, Mother odd years" 
        },
        "school_holidays": {
            "applies": boolean,
            "rule_type": "half_half" | "alternating_blocks" | "none",
            "details": "Half of all holidays"
        } 
      }
    }

    EXTRACTION RULES:
    - **Base Pattern**: If the order says "Father has alternate weekends from Fri 3pm to Sun 5pm", then:
      - Fri night: Father
      - Sat night: Father
      - Sun night: Mother (because he returns child at 5pm, so Mother has 11:59pm)
    - **Filling Gaps**: For any day not mentioned, assign overnight_care_owner to primary_parent.
    - **Start Date**: Look for "Commencing on...", "Orders start from...". If not found, use the Date of Orders.
    - **Changeover Days**: If Father picks up at 3pm Friday and returns Sunday 5pm, Friday and Saturday nights are Father's, Sunday night is Mother's.
    
    VALIDATION BEFORE OUTPUT:
    - Verify base_pattern has exactly 14 entries
    - Verify day_number runs 1 through 14 sequentially
    - Verify week_number is 1 for days 1-7, and 2 for days 8-14
    - Verify all day_name values are valid English weekday names in Title Case
    `;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Here is the court order. Extract the care schedule JSON.',
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
    const cleanJson = result
      .replace(/^```json\n?/, '')
      .replace(/\n?```$/, '')
      .trim();

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
