// Deno type declaration for Supabase Edge Functions
/**
 * Supabase Edge Function: submit-lead
 *
 * Handles lead submission with partner attribution and secure magic link routing.
 *
 * Flow:
 * 1. Receive POST with lead data + partner_id
 * 2. Store lead in 'leads' table
 * 3. Generate time-limited magic link token (JWT)
 * 4. Route notification email based on partner_id
 * 5. Return success with lead ID
 */

/* eslint-disable import/no-unresolved */

import { createClient } from '@supabase/supabase-js';
import * as jose from 'jose';
/* eslint-enable import/no-unresolved */

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response> | Response): void;
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const MAGIC_LINK_SECRET =
  Deno.env.get('MAGIC_LINK_SECRET') || 'fallback-secret-change-in-production';
const SITE_URL = Deno.env.get('SITE_URL') || 'https://auschildsupport.com';

// Token expiration: 7 days
const TOKEN_EXPIRATION_HOURS = 168;

// Partner email routing configuration
const PARTNER_EMAIL_ROUTES: Record<string, { to: string; cc?: string }> = {
  sage: {
    to: 'example@example.com',
    cc: 'alex@auschildsupport.com',
  },
};

// Default routing for non-partner leads
const DEFAULT_EMAIL_ROUTE: { to: string; cc?: string } = {
  to: 'alex@auschildsupport.com',
};

interface LeadPayload {
  parent_name: string;
  parent_email: string;
  parent_phone?: string | null;
  location?: string | null;
  income_parent_a: number;
  income_parent_b: number;
  children_count: number;
  annual_liability: number;
  payer_role?: 'you' | 'other_parent' | null;
  care_data?: { index: number; careA: number; careB: number }[] | null;
  complexity_trigger?: string[] | null;
  complexity_reasons: string[];
  financial_tags?: string[] | null;
  parent_message: string;
  consent_given: boolean;
  parenting_plan_status?: string | null;
  inquiry_type?: string | null;
  referer_url?: string | null;
  partner_id?: string | null;
}

interface MagicLinkTokenPayload {
  leadId: string;
  exp: number;
}

/**
 * Generate a signed JWT token for secure lead access
 */
async function generateMagicLinkToken(leadId: string): Promise<string> {
  const secret = new TextEncoder().encode(MAGIC_LINK_SECRET);
  const expirationTime =
    Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_HOURS * 60 * 60;

  const token = await new jose.SignJWT({ leadId } as MagicLinkTokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expirationTime)
    .setIssuedAt()
    .sign(secret);

  return token;
}

/**
 * Construct the magic link URL
 */
function constructMagicLink(token: string): string {
  return `${SITE_URL}/admin/view-lead/${token}`;
}

/**
 * Format income gap for email
 */
function formatIncomeGap(incomeA: number, incomeB: number): string {
  const gap = Math.abs(incomeA - incomeB);
  return `$${gap.toLocaleString('en-AU')}`;
}

/**
 * Get primary complexity reason for email subject
 */
function getPrimaryReason(reasons: string[]): string {
  if (!reasons || reasons.length === 0) {
    return 'Complex Case';
  }
  // Return the first reason, truncated if too long
  const primary = reasons[0];
  return primary.length > 50 ? primary.substring(0, 47) + '...' : primary;
}

/**
 * Send notification email via Resend
 */
async function sendNotificationEmail(
  leadId: string,
  magicLink: string,
  partnerId: string | null,
  complexityReasons: string[],
  incomeA: number,
  incomeB: number
): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('[submit-lead] RESEND_API_KEY not configured, skipping email');
    return false;
  }

  const emailRoute =
    partnerId && PARTNER_EMAIL_ROUTES[partnerId]
      ? PARTNER_EMAIL_ROUTES[partnerId]
      : DEFAULT_EMAIL_ROUTE;

  const primaryReason = getPrimaryReason(complexityReasons);
  const incomeGap = formatIncomeGap(incomeA, incomeB);

  const emailPayload: {
    from: string;
    to: string;
    cc?: string;
    subject: string;
    html: string;
  } = {
    from: 'Child Support Calculator <leads@auschildsupport.com>',
    to: emailRoute.to,
    subject: `New High-Value Lead: ${primaryReason}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0056b3 0%, #004494 100%); padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Complex Case Detected</h1>
        </div>

        <div style="background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef; border-top: none;">
          <p style="margin-top: 0;">A new complex case has been submitted through the Child Support Calculator.</p>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0056b3;">
            <p style="margin: 0 0 10px 0;"><strong>Complexity:</strong> ${primaryReason}</p>
            <p style="margin: 0;"><strong>Income Gap:</strong> ${incomeGap}</p>
          </div>

          <p>Click below to view the full lead details securely:</p>

          <a href="${magicLink}"
             style="display: inline-block; background: #0056b3; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0;">
            View Full Details (Secure Portal)
          </a>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This link expires in 7 days. For security, no personal information is included in this email.
          </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>Australian Child Support Calculator</p>
        </div>
      </body>
      </html>
    `,
  };

  if (emailRoute.cc) {
    emailPayload.cc = emailRoute.cc;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[submit-lead] Failed to send email:', errorText);
      return false;
    }

    console.log('[submit-lead] Notification email sent to:', emailRoute.to);
    return true;
  } catch (error) {
    console.error('[submit-lead] Email error:', error);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
      },
    });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload: LeadPayload = await req.json();

    // Validate required fields
    if (!payload.parent_name || !payload.parent_email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name or email' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!payload.consent_given) {
      return new Response(JSON.stringify({ error: 'Consent is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client with service role key for insert access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Prepare lead data for insertion
    const leadData = {
      parent_name: payload.parent_name,
      parent_email: payload.parent_email,
      parent_phone: payload.parent_phone ?? null,
      location: payload.location ?? null,
      income_parent_a: payload.income_parent_a,
      income_parent_b: payload.income_parent_b,
      children_count: payload.children_count,
      annual_liability: payload.annual_liability,
      payer_role: payload.payer_role ?? null,
      care_data: payload.care_data ?? null,
      complexity_trigger: payload.complexity_trigger ?? null,
      complexity_reasons: payload.complexity_reasons ?? [],
      financial_tags: payload.financial_tags ?? null,
      parent_message: payload.parent_message,
      consent_given: payload.consent_given,
      parenting_plan_status: payload.parenting_plan_status ?? null,
      inquiry_type: payload.inquiry_type ?? null,
      referer_url: payload.referer_url ?? null,
      partner_id: payload.partner_id ?? null,
    };

    // Insert lead into database
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select('id')
      .single();

    if (error) {
      console.error('[submit-lead] Database error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to store lead',
          details: error.message,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const leadId = data.id;
    console.log('[submit-lead] Lead stored with ID:', leadId);

    // Generate magic link token
    const token = await generateMagicLinkToken(leadId);
    const magicLink = constructMagicLink(token);

    // Store the token hash in the database for verification
    const tokenHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(token)
    );
    const tokenHashHex = Array.from(new Uint8Array(tokenHash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    await supabase
      .from('leads')
      .update({ magic_link_token_hash: tokenHashHex })
      .eq('id', leadId);

    // Send notification email (non-blocking - don't fail if email fails)
    await sendNotificationEmail(
      leadId,
      magicLink,
      payload.partner_id ?? null,
      payload.complexity_reasons ?? [],
      payload.income_parent_a,
      payload.income_parent_b
    );

    return new Response(
      JSON.stringify({
        success: true,
        leadId,
        message: 'Lead submitted successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('[submit-lead] Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
