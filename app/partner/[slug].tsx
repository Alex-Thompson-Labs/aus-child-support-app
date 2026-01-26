/**
 * Partnership Proposal Landing Page
 *
 * Public-facing page for partner firms to view their proposal.
 * Features:
 * - Fetches proposal by slug from URL
 * - Tracks view with heartbeat-based duration
 * - Shows 404 for invalid/inactive proposals
 * - NoIndex to prevent search engine indexing
 */

import { NoIndex } from '@/src/components/seo/NoIndex';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';
import type { PartnershipProposal } from '@/src/utils/supabase';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Heartbeat interval in milliseconds (10 seconds)
const HEARTBEAT_INTERVAL_MS = 10_000;

type PageState = 'loading' | 'not_found' | 'ready';

export default function PartnerProposalPage() {
  // Get slug from URL params
  const { slug } = useLocalSearchParams<{ slug: string }>();

  // Component state
  const [pageState, setPageState] = useState<PageState>('loading');
  const [proposal, setProposal] = useState<PartnershipProposal | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs for heartbeat tracking
  const viewIdRef = useRef<string | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  /**
   * Update the heartbeat timestamp for the current view
   */
  const updateHeartbeat = useCallback(async () => {
    if (!viewIdRef.current) return;

    try {
      // Lazy load Supabase client only when needed
      const { getSupabaseClient } = await import('@/src/utils/supabase/client');
      const supabase = await getSupabaseClient();

      const { error: updateError } = await supabase
        .from('proposal_views')
        .update({ last_heartbeat_at: new Date().toISOString() })
        .eq('id', viewIdRef.current);

      if (updateError) {
        console.warn(
          '[PartnerProposal] Heartbeat update failed:',
          updateError.message
        );
      }
    } catch (err) {
      console.warn('[PartnerProposal] Heartbeat error:', err);
    }
  }, []);

  /**
   * Start the heartbeat interval timer
   */
  const startHeartbeat = useCallback(() => {
    // Clear any existing interval
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    // Start new interval
    heartbeatIntervalRef.current = setInterval(
      updateHeartbeat,
      HEARTBEAT_INTERVAL_MS
    );

    console.log('[PartnerProposal] Heartbeat started');
  }, [updateHeartbeat]);

  /**
   * Stop the heartbeat interval timer
   */
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
      console.log('[PartnerProposal] Heartbeat stopped');
    }
  }, []);

  /**
   * Record a new view in the database
   */
  const recordView = useCallback(
    async (proposalId: string) => {
      try {
        // Lazy load Supabase client and utilities only when needed
        const { getSupabaseClient, getDeviceInfo } = await import('@/src/utils/supabase');
        const supabase = await getSupabaseClient();

        const deviceInfo = getDeviceInfo();

        const { data, error: insertError } = await supabase
          .from('proposal_views')
          .insert({
            proposal_id: proposalId,
            device_info: deviceInfo,
          })
          .select('id')
          .single();

        if (insertError) {
          console.error(
            '[PartnerProposal] Failed to record view:',
            insertError.message
          );
          return;
        }

        if (data?.id) {
          viewIdRef.current = data.id;
          console.log('[PartnerProposal] View recorded:', data.id);

          // Start heartbeat after successful view recording
          startHeartbeat();
        }
      } catch (err) {
        console.error('[PartnerProposal] Error recording view:', err);
      }
    },
    [startHeartbeat]
  );

  /**
   * Fetch proposal by slug and record view
   */
  useEffect(() => {
    const fetchProposal = async () => {
      if (!slug) {
        setPageState('not_found');
        return;
      }

      try {
        // Lazy load Supabase client only when needed
        const { getSupabaseClient } = await import('@/src/utils/supabase/client');
        const supabase = await getSupabaseClient();

        // Fetch proposal by slug (RLS ensures only active proposals are returned for anon)
        const { data, error: fetchError } = await supabase
          .from('partnership_proposals')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        if (fetchError || !data) {
          console.log('[PartnerProposal] Proposal not found for slug:', slug);
          setPageState('not_found');
          return;
        }

        setProposal(data as PartnershipProposal);
        setPageState('ready');

        // Record the view
        await recordView(data.id);
      } catch (err) {
        console.error('[PartnerProposal] Unexpected error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setPageState('not_found');
      }
    };

    fetchProposal();

    // Cleanup: stop heartbeat on unmount
    return () => {
      stopHeartbeat();
    };
  }, [slug, recordView, stopHeartbeat]);

  // Loading state
  if (pageState === 'loading') {
    return (
      <>
        <NoIndex />
        <LoadingFallback />
      </>
    );
  }

  // 404 state - proposal not found or inactive
  if (pageState === 'not_found') {
    return (
      <>
        <NoIndex />
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <View style={styles.notFoundContainer}>
            <Text style={styles.notFoundTitle}>Proposal Not Found</Text>
            <Text style={styles.notFoundMessage}>
              This proposal link is invalid or has expired.
            </Text>
            {error && <Text style={styles.errorDetail}>Error: {error}</Text>}
            <Link href="/" asChild>
              <Pressable
                style={styles.homeButton}
                accessibilityRole="button"
                accessibilityLabel="Return to home page"
              >
                <Text style={styles.homeButtonText}>Return Home</Text>
              </Pressable>
            </Link>
          </View>
        </SafeAreaView>
      </>
    );
  }

  // Ready state - show proposal
  return (
    <>
      <NoIndex />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerSubtitle}>Partnership Proposal</Text>
            <Text style={styles.headerTitle}>
              Proposal for {proposal?.firm_name}
            </Text>
          </View>

          {/* Placeholder content - expand as needed */}
          <View style={styles.proposalCard}>
            <Text style={styles.proposalText}>
              Thank you for your interest in partnering with AusChildSupport.
            </Text>
            <Text style={styles.proposalText}>
              This proposal outlines our partnership opportunity for{' '}
              <Text style={styles.firmName}>{proposal?.firm_name}</Text>.
            </Text>
          </View>

          {/* Add more proposal content sections here */}
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              [Proposal content will be displayed here]
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Not Found styles
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  notFoundMessage: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  errorDetail: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  homeButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 16,
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Content styles
  content: {
    flex: 1,
    padding: 20,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
  },

  // Proposal content styles
  proposalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  proposalText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 26,
    marginBottom: 12,
  },
  firmName: {
    fontWeight: '600',
    color: '#1e293b',
  },
  placeholder: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});
