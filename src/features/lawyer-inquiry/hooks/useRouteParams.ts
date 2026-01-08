/**
 * Lawyer Inquiry Feature - Route Parameters Hook
 *
 * Parses and validates route parameters for the lawyer inquiry screen.
 */

import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { getInquiryConfig } from '../config';
import type { CareDataItem, InquiryTypeConfig } from '../types';

export interface ParsedRouteParams {
  // Basic params
  liability: string;
  trigger: string;
  incomeA: string;
  incomeB: string;
  children: string;
  mode: string | undefined;
  reason: string | undefined;
  payer: string; // "Parent A", "Parent B", or "Neither"

  // External navigation (for blog integration)
  source: string | undefined; // Source indicator (e.g., "blog") for exit redirect
  returnTo: string | undefined; // Explicit URL to return to on exit

  // Chatbot lead qualification data
  hasParentingPlan: string | undefined; // "true", "false", or "unsure"
  assessmentType: string | undefined; // e.g., "income", "agreement", "special", "appeal"

  // Computed values
  isDirectMode: boolean;
  inquiryConfig: InquiryTypeConfig;
  preFillMessage: string;
  careData: CareDataItem[];
  specialCircumstances: string[] | null;
}

export function useRouteParams(): ParsedRouteParams {
  const params = useLocalSearchParams();

  // Parse basic route params with safe defaults
  const liability =
    typeof params.liability === 'string' ? params.liability : '0';
  const trigger =
    typeof params.trigger === 'string' ? params.trigger : 'unknown';
  const incomeA = typeof params.incomeA === 'string' ? params.incomeA : '0';
  const incomeB = typeof params.incomeB === 'string' ? params.incomeB : '0';
  const children = typeof params.children === 'string' ? params.children : '0';

  // Parse Direct Mode params
  const mode = typeof params.mode === 'string' ? params.mode : undefined;
  const reason = typeof params.reason === 'string' ? params.reason : undefined;

  // Parse payer (from calculation results)
  const payer = typeof params.payer === 'string' ? params.payer : 'Neither';

  // Parse source and returnTo for external navigation (blog integration)
  const source =
    typeof params.source === 'string' ? params.source : undefined;

  // Parse returnTo with URL decoding (handles encoded URLs like https%3A%2F%2F...)
  const returnTo = useMemo(() => {
    const rawValue = params.returnTo;
    if (typeof rawValue !== 'string' || !rawValue) {
      return undefined;
    }
    try {
      // Decode URL-encoded characters
      return decodeURIComponent(rawValue);
    } catch {
      // If decoding fails, use raw value
      return rawValue;
    }
  }, [params.returnTo]);

  // Parse chatbot lead qualification params
  const hasParentingPlan =
    typeof params.hasParentingPlan === 'string'
      ? params.hasParentingPlan
      : undefined;
  const assessmentType =
    typeof params.assessmentType === 'string'
      ? params.assessmentType
      : undefined;

  // Detect Direct Mode: explicit mode=direct OR missing calculation data
  const isDirectMode = useMemo(() => {
    const explicitDirect = mode === 'direct';
    const noCalcData = liability === '0' && incomeA === '0' && incomeB === '0';
    return explicitDirect || noCalcData;
  }, [mode, liability, incomeA, incomeB]);

  // Get inquiry type config based on reason param (for context-aware UI)
  const inquiryConfig = useMemo(
    (): InquiryTypeConfig => getInquiryConfig(reason),
    [reason]
  );

  // Parse pre-fill message from Smart Conversion Footer OR inquiry config
  const preFillMessage = useMemo(() => {
    // preFillMessage param takes priority
    if (typeof params.preFillMessage === 'string' && params.preFillMessage) {
      return params.preFillMessage;
    }
    // Fall back to inquiry config pre-fill message
    return inquiryConfig.preFillMessage;
  }, [params.preFillMessage, inquiryConfig.preFillMessage]);

  // Parse care arrangement data (SAFELY)
  const careData = useMemo((): CareDataItem[] => {
    try {
      return typeof params.careData === 'string'
        ? JSON.parse(params.careData)
        : [];
    } catch (error) {
      if (__DEV__)
        console.error('[LawyerInquiry] Failed to parse careData:', error);
      return []; // Fallback to empty if parsing fails
    }
  }, [params.careData]);

  // Parse Special Circumstances data with error handling
  const specialCircumstances = useMemo((): string[] | null => {
    try {
      return typeof params.specialCircumstances === 'string'
        ? (JSON.parse(params.specialCircumstances) as string[])
        : null;
    } catch (error) {
      if (__DEV__)
        console.error(
          '[LawyerInquiry] Failed to parse specialCircumstances:',
          error
        );
      // Continue without pre-fill
      return null;
    }
  }, [params.specialCircumstances]);

  return {
    liability,
    trigger,
    incomeA,
    incomeB,
    children,
    mode,
    reason,
    payer,
    source,
    returnTo,
    hasParentingPlan,
    assessmentType,
    isDirectMode,
    inquiryConfig,
    preFillMessage,
    careData,
    specialCircumstances,
  };
}
