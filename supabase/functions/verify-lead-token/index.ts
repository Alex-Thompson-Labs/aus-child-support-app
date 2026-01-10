/**
 * Supabase Edge Function: verify-lead-token
 *
 * Verifies JWT magic link tokens and returns lead data for authorized viewing.
 *
 * Flow:
 * 1. Receive POST with token
 * 2. Verify JWT signature and expiration
 * 3. Fetch lead data from database
 * 4. Return public lead fields (exclude admin-only data)
 */

/* eslint-disable import/no-unresolved */
// @ts-ignore - Deno HTTP imports are valid at runtime in Supabase Edge Functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore - Deno HTTP imports are valid at runtime in Supabase Edge Functions
import * as jose from 'https://deno.land/x/jose@v4.14.4/index.ts';
// @ts-ignore - Deno HTTP imports are valid at runtime in Supabase Edge Functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
/* eslint-enable import/no-unresolved */

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MAGIC_LINK_SECRET =
  Deno.env.get('MAGIC_LINK_SECRET') || 'fallback-secret-change-in-production';

interface PublicLeadData {
  id: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string | null;
  location: string | null;
  income_parent_a: number;
  income_parent_b: number;
  children_count: number;
  annual_liability: number;
  care_data: Array<{ index: number; careA: number; careB: number }> | null;
  complexity_reasons: string[];
  parent_message: string;
  created_at: string;
}

/**
 * Verify JWT token and extract leadId
 */
async function verifyToken(
  token: string
): Promise<{ valid: boolean; leadId?: string; errorCode?: string; errorMessage?: string }> {
  try {
    const secret = new TextEncoder().encode(MAGIC_LINK_SECRET);

    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    const leadId = payload.leadId as string;
    if (!leadId) {
      return {
        valid: false,
        errorCode: 'TOKEN_INVALID',
        errorMessage: 'Invalid token payload',
      };
    }

    return { valid: true, leadId };
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      return {
        valid: false,
        errorCode: 'TOKEN_EXPIRED',
        errorMessage: 'This link has expired',
      };
    }
    if (
      error instanceof jose.errors.JWTInvalid ||
      error instanceof jose.errors.JWSSignatureVerificationFailed
    ) {
      return {
        valid: false,
        errorCode: 'TOKEN_INVALID',
        errorMessage: 'Invalid token signature',
      };
    }
    console.error('[verify-lead-token] Token verification error:', error);
    return {
      valid: false,
      errorCode: 'TOKEN_INVALID',
      errorMessage: 'Token verification failed',
    };
  }
}

/**
 * Fetch lead data and return only public fields
 */
async function fetchPublicLeadData(
  leadId: string
): Promise<{ success: boolean; lead?: PublicLeadData; errorCode?: string; errorMessage?: string }> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from('leads')
    .select(
      `
      id,
      parent_name,
      parent_email,
      parent_phone,
      location,
      income_parent_a,
      income_parent_b,
      children_count,
      annual_liability,
      care_data,
      complexity_reasons,
      parent_message,
      created_at,
      deleted_at
    `
    )
    .eq('id', leadId)
    .single();

  if (error) {
    console.error('[verify-lead-token] Database error:', error);
    return {
      success: false,
      errorCode: 'LEAD_NOT_FOUND',
      errorMessage: 'Lead not found',
    };
  }

  // Check if lead was deleted
  if (data.deleted_at) {
    return {
      success: false,
      errorCode: 'LEAD_NOT_FOUND',
      errorMessage: 'Lead not found',
    };
  }

  // Return only public fields
  const publicLead: PublicLeadData = {
    id: data.id,
    parent_name: data.parent_name,
    parent_email: data.parent_email,
    parent_phone: data.parent_phone,
    location: data.location,
    income_parent_a: data.income_parent_a,
    income_parent_b: data.income_parent_b,
    children_count: data.children_count,
    annual_liability: data.annual_liability,
    care_data: data.care_data,
    complexity_reasons: data.complexity_reasons || [],
    parent_message: data.parent_message,
    created_at: data.created_at,
  };

  return { success: true, lead: publicLead };
}

serve(async (req: Request) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const { token } = await req.json();

    if (!token || typeof token !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'Token is required',
          code: 'TOKEN_MISSING',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Verify the token
    const tokenResult = await verifyToken(token);

    if (!tokenResult.valid || !tokenResult.leadId) {
      return new Response(
        JSON.stringify({
          error: tokenResult.errorMessage,
          code: tokenResult.errorCode,
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Fetch lead data
    const leadResult = await fetchPublicLeadData(tokenResult.leadId);

    if (!leadResult.success || !leadResult.lead) {
      return new Response(
        JSON.stringify({
          error: leadResult.errorMessage,
          code: leadResult.errorCode,
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('[verify-lead-token] Successfully verified token for lead:', tokenResult.leadId);

    return new Response(
      JSON.stringify({
        success: true,
        lead: leadResult.lead,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error) {
    console.error('[verify-lead-token] Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        code: 'SERVER_ERROR',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
