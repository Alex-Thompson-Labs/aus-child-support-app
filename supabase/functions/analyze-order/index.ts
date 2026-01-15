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
    const termDatesYear1 = TERM_DATES[selectedYear].VIC;
    const termDatesYear2 = TERM_DATES[selectedYear + 1]?.VIC || [];

    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
    });

    // Build school term dates context for the prompt (include both years for 2-year timelines)
    let termDatesContext = `Year ${selectedYear}:\n    ` + termDatesYear1
      .map((term, i) => `Term ${i + 1}: ${term.start} to ${term.end}`)
      .join('\n    ');
    
    if (termDatesYear2.length > 0) {
      termDatesContext += `\n\n  Year ${selectedYear + 1}:\n    ` + termDatesYear2
        .map((term, i) => `Term ${i + 1}: ${term.start} to ${term.end}`)
        .join('\n    ');
    }

    // Derive school holiday periods from gaps between terms (Year 1)
    const holidayPeriods: string[] = [];
    holidayPeriods.push(`${selectedYear} Summer Holiday: ${selectedYear}-01-01 to ${termDatesYear1[0].start} (before Term 1)`);
    for (let i = 0; i < termDatesYear1.length - 1; i++) {
      const holidayStart = termDatesYear1[i].end;
      const holidayEnd = termDatesYear1[i + 1].start;
      holidayPeriods.push(`${selectedYear} Holiday ${i + 1}: ${holidayStart} to ${holidayEnd} (between Term ${i + 1} and ${i + 2})`);
    }
    holidayPeriods.push(`${selectedYear} Summer Holiday: ${termDatesYear1[termDatesYear1.length - 1].end} to ${selectedYear}-12-31 (after Term 4)`);
    
    // Add Year 2 holidays if available
    if (termDatesYear2.length > 0) {
      holidayPeriods.push(`${selectedYear + 1} Summer Holiday: ${selectedYear + 1}-01-01 to ${termDatesYear2[0].start} (before Term 1)`);
      for (let i = 0; i < termDatesYear2.length - 1; i++) {
        const holidayStart = termDatesYear2[i].end;
        const holidayEnd = termDatesYear2[i + 1].start;
        holidayPeriods.push(`${selectedYear + 1} Holiday ${i + 1}: ${holidayStart} to ${holidayEnd} (between Term ${i + 1} and ${i + 2})`);
      }
      holidayPeriods.push(`${selectedYear + 1} Summer Holiday: ${termDatesYear2[termDatesYear2.length - 1].end} to ${selectedYear + 1}-12-31 (after Term 4)`);
    }
    
    const holidayContext = holidayPeriods.join('\n    ');

    const systemPrompt = `You are an expert Australian Family Law Court Order Interpreter.

GATEKEEPER RULE:
1. If the document is a Template, Guide, or Brochure -> Return {"error": "INVALID_DOCUMENT_TYPE"}
2. If valid -> Generate a PRECISE care timeline for ${selectedYear}.

CRITICAL: TIMELINE BOUNDARIES
- Timeline MUST start at ${selectedYear}-01-01T00:00
- Timeline can end at EITHER:
  * ${selectedYear}-12-31T23:59 (1 year) - if the pattern is simple and repeats annually
  * The date that is exactly 2 years from the order commencement date at 23:59 (2 years) - if you need 2 years to show the full recurring pattern
- For 2-year timelines: Calculate exactly 2 years from the order commencement date.
  * Example: Order starts Jan 14, 2026 → Timeline ends Jan 13, 2028 at 23:59 (not Dec 31, 2027)
  * Example: Order starts Apr 20, 2026 → Timeline ends Apr 19, 2028 at 23:59
- Generate 2 years of data if the pattern requires it to accurately calculate care percentages (e.g., alternating Christmas arrangements).

You have been provided with the OFFICIAL School Calendar for Victoria.

[SCHOOL TERM DATES] - When school is IN SESSION, apply "TERM PATTERN":
    ${termDatesContext}

[SCHOOL HOLIDAY DATES] - When school is NOT in session, apply "HOLIDAY PATTERN":
    ${holidayContext}

CRITICAL: ORDER COMMENCEMENT DATE
- If the court order specifies a commencement date that falls BEFORE the official Term 1 start date, treat the period from the commencement date until Term 1 starts as TERM TIME (apply the term pattern, not holidays).
- Example: If order starts "14 January 2026" but Term 1 starts "27 January 2026", apply the TERM PATTERN from 14 Jan to 27 Jan (NOT the holiday pattern).
- The TERM PATTERN applies during ALL school term dates listed above.
- The HOLIDAY PATTERN applies ONLY during the school holiday periods listed above.
- For any period BEFORE the order commencement date, assign care to the primary parent using type "base".

CRITICAL RULES FOR INTERPRETING "NIGHTS":
The app calculates care based on **MIDNIGHTS**. You must ensure your timestamps explicitly exclude nights that belong to the other parent.
1. "Until Friday Morning" -> Block MUST end at **T08:30**. (This excludes Friday night).
2. "Until Monday Morning" -> Block MUST end at **T08:30**. (This excludes Monday night).
3. "Conclusion of School" -> Block starts at **T15:30**.
4. "Commencement of School" -> Block ends at **T08:30**.
5. **NEVER** extend a "Morning" drop-off to the afternoon.

THE "TWO-MODE" EXTRACTION:
1. TERM PATTERN (Applies during [SCHOOL TERM DATES] AND any period between order commencement and Term 1 start):
   - Look for "Week 1" and "Week 2" or similar fortnightly patterns in the court order.
   - This is the pattern that applies when children are attending school.
   - **CYCLE ANCHOR**: Unless specified otherwise, assume the order STARTS with Week 1 from the commencement date.
   - **CYCLE RESET**: The cycle pauses during school holidays and **RESTARTS at Week 1** at the beginning of EACH school term.
   - **MATH CHECK**: "Wed 15:30 to Fri 08:30" = 2 NIGHTS (Wed, Thu). "Fri 15:30 to Mon 08:30" = 3 NIGHTS (Fri, Sat, Sun).
   - Use type code "base" for all term-time blocks.
   - Example: "From conclusion of school on Wednesday until commencement of school on Friday" = Wed 15:30 to Fri 08:30.

2. HOLIDAY PATTERN (Applies ONLY during [SCHOOL HOLIDAY DATES]):
   - Look for phrases like "during all Victorian School Holiday periods" or "school holidays".
   - Usually "Week-about" (7 nights each) or "Half holidays".
   - This is a DIFFERENT pattern from term time.
   - Do NOT apply the holiday pattern to school term dates.
   - Use type code "holiday" for school holiday blocks.

3. CHRISTMAS SPECIAL ARRANGEMENTS:
   - Look for alternating Christmas patterns (even years vs odd years).
   - Use type code "christmas" for Christmas Day/Boxing Day blocks.

VALID TYPE CODES:
- "base" - Use for term-time care and any period before order commencement
- "holiday" - Use for school holiday periods
- "christmas" - Use for Christmas Day/Boxing Day special arrangements

OUTPUT SCHEMA (JSON ONLY):
You must include a "logic_check" to prove you calculated the nights correctly.
The last block MUST end at:
- ${selectedYear}-12-31T23:59 for 1-year timelines, OR
- Exactly 2 years from order commencement date at 23:59 for 2-year timelines
  (e.g., if order starts 2026-01-14, end at 2028-01-13T23:59)

{
  "logic_check": {
    "order_commencement_date": "Date the order starts (e.g. 2026-01-14)",
    "timeline_duration": "1 year or 2 years",
    "timeline_end_date": "Date the timeline ends (e.g. 2028-01-13T23:59 for 2-year from Jan 14 start)",
    "term_pattern_extracted": "User summary (e.g. Father: Wed-Fri Week1, Fri-Mon Week2)",
    "term_nights_per_fortnight_calculation": "Wed+Thu (2) + Fri+Sat+Sun (3) = 5 nights per fortnight",
    "holiday_pattern_extracted": "User summary (e.g. Week-about, 7 nights each)"
  },
  "timeline": [
    ["${selectedYear}-01-01T00:00", "${selectedYear}-01-14T00:00", "M", "base"],
    ["${selectedYear}-01-14T00:00", "${selectedYear}-01-15T15:30", "M", "base"],
    ...
    ["2028-01-13T15:30", "2028-01-13T23:59", "M", "base"]
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