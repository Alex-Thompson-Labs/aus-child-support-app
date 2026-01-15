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

    const systemPrompt = `You are an expert Australian Family Law Court Order Interpreter specializing in generating precise care timelines.

GATEKEEPER RULE: VALIDATION FIRST
Before generating any timeline, you must analyze if the document is a specific, executed Court Order or Parenting Plan.

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
Your goal is to generate a COMPLETE TIMELINE covering 100% of the year ${selectedYear}.

SCHOOL TERM DATES (VIC) for ${selectedYear}:
    ${termDatesContext}

SCHOOL HOLIDAY PERIODS for ${selectedYear}:
    ${holidayContext}

TIMELINE GENERATION RULES:

1. CONTINUOUS COVERAGE (CRITICAL):
   - The timeline MUST start at "${selectedYear}-01-01T00:00" and end at "${selectedYear}-12-31T23:59"
   - There must be NO GAPS between blocks - the end time of one block must EXACTLY equal the start time of the next
   - Every minute of the year must be assigned to exactly one parent

2. TIMELINE BLOCK FORMAT:
   Each block is a tuple: [start_iso, end_iso, parent_code, type_code]
   - start_iso: ISO datetime with minute precision (e.g., "${selectedYear}-01-01T00:00")
   - end_iso: ISO datetime with minute precision (e.g., "${selectedYear}-01-07T15:30")
   - parent_code: "M" for Mother, "F" for Father
   - type_code: "base" for regular schedule, "holiday" for school holidays, "christmas" for Christmas period

3. INTERPRETING CARE TRANSITIONS:
   - "Conclusion of school" / "After school" (typically 3:30 PM): Use T15:30
   - "Commencement of school" / "Morning drop-off" (typically 8:30 AM): Use T08:30
   - "3pm Christmas Eve": Use T15:00
   - "11am Christmas Day": Use T11:00
   - If no specific time mentioned, use T18:00 for evening transitions

4. PRIMARY PARENT RULE:
   - Identify who is the primary parent (usually Mother unless specified otherwise)
   - Any time NOT explicitly assigned to the other parent goes to the primary parent
   - This ensures 100% coverage

5. TYPE CODE ASSIGNMENT:
   - Use "christmas" for December 24-26 period
   - Use "holiday" for all school holiday periods (see dates above)
   - Use "base" for all school term periods

OUTPUT SCHEMA (Strict JSON Only):
{
  "timeline": [
    ["${selectedYear}-01-01T00:00", "${selectedYear}-01-03T15:30", "M", "holiday"],
    ["${selectedYear}-01-03T15:30", "${selectedYear}-01-10T08:30", "F", "holiday"],
    ...
  ],
  "year": ${selectedYear},
  "primary_parent": "M"
}

VALIDATION CHECKLIST (verify before outputting):
✓ First block starts at "${selectedYear}-01-01T00:00"
✓ Last block ends at "${selectedYear}-12-31T23:59"
✓ No gaps between consecutive blocks (end[i] === start[i+1])
✓ All parent codes are "M" or "F"
✓ All type codes are "base", "holiday", or "christmas"
✓ ISO strings have minute precision (T00:00 format)

Output ONLY the JSON object. No preamble or conversational text.
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