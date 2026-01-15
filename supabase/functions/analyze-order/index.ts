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
const TERM_DATES: Record<number, { VIC: { start: string; end: string }[] }> = {
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

CRITICAL: TIMELINE BOUNDARIES - CALCULATE FROM ORDER COMMENCEMENT DATE
- Timeline MUST start at the ORDER COMMENCEMENT DATE (not Jan 1)
- Timeline MUST end at exactly 12 or 24 months from the ORDER COMMENCEMENT DATE
- CALCULATION FORMULA:
  * 12-month cycle: timeline_end_date = order_commencement_date + 365 days at 23:59
  * 24-month cycle: timeline_end_date = order_commencement_date + 730 days at 23:59
  
EXAMPLES (FOLLOW THESE EXACTLY):
  * Order starts 2026-02-06 → Timeline: 2026-02-06T00:00 to 2027-02-05T23:59 (12 months)
  * Order starts 2026-02-06 → Timeline: 2026-02-06T00:00 to 2028-02-05T23:59 (24 months)
  * Order starts 2026-01-14 → Timeline: 2026-01-14T00:00 to 2027-01-13T23:59 (12 months)
  * Order starts 2026-03-20 → Timeline: 2026-03-20T00:00 to 2027-03-19T23:59 (12 months)

DO NOT include any period before the order commencement date in the timeline.

WHEN TO USE 24 MONTHS:
- Alternating Christmas arrangements (even/odd years)
- Alternating year patterns
- Any pattern that doesn't repeat within 12 months

WHEN TO USE 12 MONTHS:
- Pattern repeats consistently every year
- No alternating year-based arrangements

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

CRITICAL: PRIMARY RESIDENCE AND CARE ALLOCATION
1. **Identify Primary Parent**: Look for phrases like "The child shall live with [Parent]" or "primary residence with [Parent]"
2. **Default Care**: When no specific time is allocated to the non-primary parent, care belongs to the PRIMARY PARENT
3. **Short Visits vs Overnights**: 
   - DINNER VISITS (e.g., "Wednesday 3:30pm to 7:00pm"): Child returns to PRIMARY PARENT after visit
   - OVERNIGHT VISITS: Child stays with visiting parent through midnight (23:59)
4. **Timeline Construction**:
   - Start with PRIMARY PARENT having care
   - Insert blocks for NON-PRIMARY PARENT only during their allocated time
   - After each visit ends, care returns to PRIMARY PARENT
   - Use "M" for Mother, "F" for Father (based on who actually has care, not their role)

CRITICAL RULES FOR INTERPRETING "NIGHTS":
The app calculates care based on **MIDNIGHTS** (who has care at 23:59). You must ensure your timestamps explicitly exclude nights that belong to the other parent.
1. "Until Friday Morning" -> Block MUST end at **T08:30**. (This excludes Friday night).
2. "Until Monday Morning" -> Block MUST end at **T08:30**. (This excludes Monday night).
3. "Conclusion of School" -> Block starts at **T15:30**.
4. "Commencement of School" -> Block ends at **T08:30**.
5. **NEVER** extend a "Morning" drop-off to the afternoon.
6. **DINNER VISITS**: If visit ends before midnight (e.g., 7:00pm), that night does NOT count for the visiting parent.

EXAMPLE - DINNER VISIT PATTERN:
Order says: "Child lives with Mother. Father has Wednesday 3:30pm-7:00pm"
CORRECT Timeline:
  ["2026-02-05T00:00", "2026-02-12T15:30", "M", "base"]  // Mother has care
  ["2026-02-12T15:30", "2026-02-12T19:00", "F", "base"]  // Father's dinner visit
  ["2026-02-12T19:00", "2026-02-19T15:30", "M", "base"]  // Back to Mother
  
At 23:59 on Feb 12, Mother has care (since 7:00pm), so Mother gets that night counted.

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

CRITICAL CALCULATION RULE:
- Timeline MUST start at order_commencement_date (NOT Jan 1)
- timeline_end_date = order_commencement_date + 365 days (for 12-month) OR + 730 days (for 24-month) at 23:59

VALIDATION CHECK BEFORE OUTPUTTING:
- If order_commencement_date is "2026-02-06" and timeline_duration is "12 months"
  → First block starts "2026-02-06T00:00" and last block ends "2027-02-05T23:59"
- If order_commencement_date is "2026-02-06" and timeline_duration is "24 months"  
  → First block starts "2026-02-06T00:00" and last block ends "2028-02-05T23:59"

{
  "logic_check": {
    "order_commencement_date": "EXACT date the order starts (e.g. 2026-02-06)",
    "timeline_duration": "12 months or 24 months",
    "timeline_end_date": "order_commencement_date + 365 or 730 days at 23:59 (e.g. 2027-02-05T23:59 for 12-month from 2026-02-06)",
    "term_pattern_extracted": "User summary (e.g. Week-about: Each parent has 7 consecutive nights)",
    "term_nights_per_fortnight_calculation": "7 nights per week each parent = 7 nights per fortnight per parent",
    "holiday_pattern_extracted": "User summary (e.g. Week-about continues during holidays)"
  },
  "timeline": [
    ["2026-02-06T00:00", "2026-02-13T08:30", "F", "base"],
    ["2026-02-13T08:30", "2026-02-20T08:30", "M", "base"],
    ...
    ["2027-02-05T15:30", "2027-02-05T23:59", "M", "base"]
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