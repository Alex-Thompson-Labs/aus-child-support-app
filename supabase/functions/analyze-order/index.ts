import Anthropic from 'https://esm.sh/@anthropic-ai/sdk?target=deno';

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response> | Response): void;
};

/**
 * VIC School Term Dates for 2026, 2027, 2028
 * Used to inject school holiday context into the LLM prompt
 */
const TERM_DATES: Record<number, { VIC: Array<{ start: string; end: string }> }> = {
  2026: {
    VIC: [
      { start: '2026-01-27', end: '2026-04-02' },
      { start: '2026-04-20', end: '2026-06-26' },
      { start: '2026-07-13', end: '2026-09-18' },
      { start: '2026-10-05', end: '2026-12-18' }
    ]
  },
  2027: {
    VIC: [
      { start: '2027-01-28', end: '2027-03-25' },
      { start: '2027-04-12', end: '2027-06-25' },
      { start: '2027-07-12', end: '2027-09-17' },
      { start: '2027-10-04', end: '2027-12-17' }
    ]
  },
  2028: {
    VIC: [
      { start: '2028-01-28', end: '2028-03-31' },
      { start: '2028-04-18', end: '2028-06-30' },
      { start: '2028-07-17', end: '2028-09-22' },
      { start: '2028-10-09', end: '2028-12-21' }
    ]
  }
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
    const { fileBase64, mediaType, year = 2026 } = await req.json();

    if (!fileBase64) {
      throw new Error('No file content provided');
    }

    // Select term dates for the requested year (default to 2026 if not available)
    const selectedYear = TERM_DATES[year] ? year : 2026;
    const termDates = TERM_DATES[selectedYear].VIC;

    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
    });

    // Build school term dates context for the prompt
    const termDatesContext = termDates
      .map((term, i) => `Term ${i + 1}: ${term.start} to ${term.end}`)
      .join('\n    ');

    // Derive school holiday periods from gaps between terms
    const holidayPeriods: string[] = [];
    holidayPeriods.push(`Summer Holiday: ${selectedYear}-01-01 to ${termDates[0].start} (before Term 1)`);
    for (let i = 0; i < termDates.length - 1; i++) {
      const holidayStart = termDates[i].end;
      const holidayEnd = termDates[i + 1].start;
      holidayPeriods.push(`Holiday ${i + 1}: ${holidayStart} to ${holidayEnd} (between Term ${i + 1} and ${i + 2})`);
    }
    holidayPeriods.push(`Summer Holiday: ${termDates[termDates.length - 1].end} to ${selectedYear}-12-31 (after Term 4)`);
    const holidayContext = holidayPeriods.join('\n    ');

    const systemPrompt = `You are an expert Australian Family Law Court Order Interpreter.

GATEKEEPER RULE:
1. If the document is a Template, Guide, or Brochure -> Return {"error": "INVALID_DOCUMENT_TYPE"}
2. If valid -> Generate a PRECISE care timeline for ${selectedYear}.

You have been provided with the OFFICIAL School Calendar. You MUST apply different rules to these exact ranges:
[TERM DATES] -> Apply "TERM PATTERN" (see extraction rules below)
    ${termDatesContext}

[HOLIDAY DATES] -> Apply "HOLIDAY PATTERN" (see extraction rules below)
    ${holidayContext}

CRITICAL INSTRUCTION - THE "TWO-MODE" RULE:
Court orders typically have TWO distinct modes. You must extract them separately and apply them strictly to their respective dates.
1. THE TERM PATTERN: Usually complex (e.g., "Week 1: Wed-Fri, Week 2: Fri-Mon").
   - **WARNING**: Do NOT apply "Week-about" or "50/50" to Term Time unless explicitly stated.
   - **WARNING**: "Until Friday Morning" means the block ENDS at 09:00. It does **NOT** include Friday night.
   - **MATH CHECK**: Wed afternoon to Fri morning is 2 NIGHTS (Wed, Thu). It is NOT 3 nights.

2. THE HOLIDAY PATTERN: Usually simple (e.g., "Week-about" or "Half intervals").
   - Only apply this to the [HOLIDAY DATES] listed above.

TIMELINE GENERATION RULES:
1. Start at "${selectedYear}-01-01T00:00" and end at "${selectedYear}-12-31T23:59".
2. NO GAPS. End time of Block A must match Start time of Block B.
3. "Morning" / "School starts" = T09:00. "After School" = T15:00. "Midday" = T12:00.
4. "Week 1" and "Week 2" in Term Time refer to a fortnightly cycle that repeats during the Term.

OUTPUT SCHEMA (JSON ONLY):
You must include a "logic_check" field to prove you extracted the correct patterns.

{
  "logic_check": {
    "term_pattern_extracted": "User summary of term pattern (e.g. Father has Wed-Fri and Fri-Mon / 5 nights per fortnight)",
    "holiday_pattern_extracted": "User summary of holiday pattern (e.g. Week about / 7 nights each)",
    "term_nights_count_per_fortnight": 5
  },
  "timeline": [
    ["${selectedYear}-01-01T00:00", "${selectedYear}-01-27T09:00", "M", "holiday"],
    ["${selectedYear}-01-27T09:00", "${selectedYear}-01-28T15:00", "M", "base"],
    ...
  ],
  "year": ${selectedYear},
  "primary_parent": "M"
}
`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      temperature: 0,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Here is the court order. Generate a complete care timeline for ${selectedYear}. Output ONLY JSON.`,
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