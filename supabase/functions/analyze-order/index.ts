import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { OpenAI } from "https://esm.sh/openai@4.20.1"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { fileBase64, mediaType } = await req.json()

        if (!fileBase64) {
            throw new Error("No file content provided")
        }

        const openai = new OpenAI({
            apiKey: Deno.env.get('OPENAI_API_KEY'),
        })

        const systemPrompt = `You are an expert Australian Family Law Court Order Interpreter. 
    Your goal is to extract the care arrangement schedule from a Court Order image/text and convert it into a structured JSON format for calculation.

    KEY RULES:
    1. MIDNIGHT RULE: Care is determined by who has the child at 11:59 PM.
    2. HOLIDAY SUSPENSION: Holiday rules strictly override the base pattern.
    3. CYCLE: Usually a 14-day (fortnightly) cycle.

    Output must be strictly valid JSON matching this schema:
    {
      "cycle_length_days": 14,
      "base_pattern": [
        {
          "day": "Monday",
          "week": 1,
          "care_with": "Father" | "Mother",
          "notes": "From 3pm" // critical: capture start/end times precisely
        }
      ],
      "holiday_blocks": [
        {
          "event": "Christmas",
          "rule": "Father has even years 24-26 Dec"
        }
      ],
      "special_overrides": []
    }

    IMPORTANT:
    - Ensure EVERY day of the 14-day cycle is accounted for.
    - If a day is not explicitly mentioned, assign it to the primary carer (default to Mother if unclear, or infer from context).
    - Capture the specific "From X time" and "Until Y time" in the "notes" field.
    - Do not wrap the output in markdown code blocks. Return only validity JSON.`

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Here is the court order. Extract the care schedule JSON." },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mediaType || 'image/png'};base64,${fileBase64}`
                            }
                        }
                    ]
                },
            ],
            max_tokens: 3000,
        })

        const result = completion.choices[0].message.content
        const cleanJson = result.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()

        return new Response(cleanJson, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
