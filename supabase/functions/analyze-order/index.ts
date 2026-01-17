// Court Order Scanner using Google Gemini 2.0 Flash (free tier)
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@^0.21.0';

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

    // Get Gemini API key
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not set in environment. Please add it to your Supabase secrets.');
    }

    // Select term dates for the requested year (default to 2026 if not available)
    const selectedYear = TERM_DATES[year] ? year : 2026;
    const termDatesYear1 = TERM_DATES[selectedYear].VIC;
    const termDatesYear2 = TERM_DATES[selectedYear + 1]?.VIC || [];

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

    console.log('Calling Gemini 2.0 Flash for analysis...');

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);

    // Map media type to Gemini-compatible format
    const geminiMimeType = mediaType === 'application/pdf' ? 'application/pdf' : (mediaType || 'image/jpeg');

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0,
        responseMimeType: 'application/json',
      },
    });

    // Create the content with inline data for the file
    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `Here is the court order. Generate a complete care timeline for ${selectedYear}. Output ONLY JSON.` },
      {
        inlineData: {
          mimeType: geminiMimeType,
          data: fileBase64,
        },
      },
    ]);

    const response = result.response;
    const resultText = response.text();

    // Improved extraction to handle any conversational text before/after JSON
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : resultText;

    // Parse the JSON to add opportunity detection
    const parsedResult = JSON.parse(cleanJson);

    // Extract text for keyword scanning using a second API call
    console.log('Extracting text for keyword scanning...');

    const textModel = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0,
      },
    });

    const textExtractionResult = await textModel.generateContent([
      { text: 'Extract all text from this document. Return ONLY the raw text content, no formatting or commentary.' },
      {
        inlineData: {
          mimeType: geminiMimeType,
          data: fileBase64,
        },
      },
    ]);

    const documentText = textExtractionResult.response.text().toLowerCase();

    // Keyword detection logic
    const opportunities: {
      reason_id: number;
      reason_title: string;
      reason_description: string;
      detected_keywords: string[];
    }[] = [];

    // Reason 1: Travel Costs
    const travelKeywords = ['flights', 'airfare', 'interstate travel', 'airport', 'petrol expenses', 'travel costs', 'fuel costs'];
    const detectedTravel = travelKeywords.filter(kw => documentText.includes(kw));
    if (detectedTravel.length > 0) {
      opportunities.push({
        reason_id: 1,
        reason_title: 'Travel Costs',
        reason_description: 'Fuel, flights, and transport expenses for visits can often be claimed to lower your liability',
        detected_keywords: detectedTravel,
      });
    }

    // Reason 2: Medical & Special Needs Costs
    const medicalKeywords = ['orthodontist', 'orthodontic', 'braces', 'psychologist', 'psychiatrist', 'speech therapy', 'occupational therapy', 'medical specialist', 'paediatrician', 'autism', 'adhd', 'ndis'];
    const detectedMedical = medicalKeywords.filter(kw => documentText.includes(kw));
    if (detectedMedical.length > 0) {
      opportunities.push({
        reason_id: 2,
        reason_title: 'Medical & Special Needs Costs',
        reason_description: 'Extra medical and therapy costs not covered by Medicare can reduce your payments',
        detected_keywords: detectedMedical,
      });
    }

    // Reason 3: Private School & Education Costs
    const educationKeywords = ['private school', 'school fees', 'tuition fees', 'grammar school', 'catholic college', 'anglican', 'college fees', 'uniforms', 'levies', 'textbooks', 'extra-curricular', 'music tuition', 'private health'];
    const detectedEducation = educationKeywords.filter(kw => documentText.includes(kw));
    if (detectedEducation.length > 0) {
      opportunities.push({
        reason_id: 3,
        reason_title: 'Private School & Education Costs',
        reason_description: 'Private school fees and education expenses that the formula ignores can lower your liability',
        detected_keywords: detectedEducation,
      });
    }

    // Reason 6: High Child Care Costs
    const childcareKeywords = ['child care', 'day care', 'creche', 'before school care', 'after school care', 'vacation care', 'nanny', 'au pair'];
    const detectedChildcare = childcareKeywords.filter(kw => documentText.includes(kw));
    if (detectedChildcare.length > 0) {
      opportunities.push({
        reason_id: 6,
        reason_title: 'High Child Care Costs',
        reason_description: 'Work-related child care expenses can be claimed to reduce your payments',
        detected_keywords: detectedChildcare,
      });
    }

    // Reason 8: Hidden Income / Financial Resources
    const businessKeywords = ['pty ltd', 'proprietary limited', 'director', 'shareholder', 'dividends', 'business ownership', 'abn', 'distributions'];
    const detectedBusiness = businessKeywords.filter(kw => documentText.includes(kw));

    const hasFamilyTrust = documentText.includes('family trust') &&
      !documentText.includes('trust account') &&
      !documentText.includes('held in trust');
    const hasUnitTrust = documentText.includes('unit trust') &&
      !documentText.includes('trust account') &&
      !documentText.includes('held in trust');

    if (hasFamilyTrust) detectedBusiness.push('family trust');
    if (hasUnitTrust) detectedBusiness.push('unit trust');

    if (detectedBusiness.length > 0) {
      opportunities.push({
        reason_id: 8,
        reason_title: 'Hidden Income / Financial Resources',
        reason_description: 'Business assets and trust structures that may suppress taxable income can be challenged',
        detected_keywords: detectedBusiness,
      });
    }

    // Add opportunities to the result
    parsedResult.opportunities = opportunities;

    return new Response(JSON.stringify(parsedResult), {
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
