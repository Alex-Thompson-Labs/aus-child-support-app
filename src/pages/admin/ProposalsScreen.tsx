/**
 * Admin Proposals Screen
 * Manage partnership proposals - create, view analytics, copy links
 */

import { Colors } from '@/constants/theme';
import {
    isWeb,
    webClickableStyles,
    webInputStyles
} from '@/src/utils/responsive';
import {
    getSupabaseClient,
    type PartnershipProposal,
} from '@/src/utils/supabase';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Use brand colors from theme
const PRIMARY_COLOR = Colors.light.tint;

interface ProposalWithStats extends PartnershipProposal {
  view_count: number;
  total_view_minutes: number;
}

/**
 * Generate a random 8-character slug
 */
function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

export default function ProposalsScreen() {
  const router = useRouter();

  const [proposals, setProposals] = useState<ProposalWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newFirmName, setNewFirmName] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const loadProposals = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = await getSupabaseClient();

      // Fetch proposals with view stats
      const { data, error } = await supabase
        .from('partnership_proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // TODO: Replace with proper error reporting service
        if (Platform.OS === 'web') {
          alert(`Error Loading Proposals\n\n${error.message}`);
        } else {
          Alert.alert('Error Loading Proposals', error.message);
        }
        return;
      }

      // Fetch view stats for each proposal
      const proposalsWithStats: ProposalWithStats[] = await Promise.all(
        (data || []).map(async (proposal) => {
          const { data: views } = await supabase
            .from('proposal_views')
            .select('viewed_at, last_heartbeat_at')
            .eq('proposal_id', proposal.id);

          const viewCount = views?.length || 0;
          const totalMinutes =
            views?.reduce((sum, v) => {
              const start = new Date(v.viewed_at).getTime();
              const end = new Date(v.last_heartbeat_at).getTime();
              return sum + (end - start) / 1000 / 60;
            }, 0) || 0;

          return {
            ...proposal,
            view_count: viewCount,
            total_view_minutes: Math.round(totalMinutes * 10) / 10,
          };
        })
      );

      setProposals(proposalsWithStats);
    } catch (error) {
      // TODO: Replace with proper error reporting service
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = await getSupabaseClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/admin/login');
        return;
      }

      loadProposals();
    };

    checkAuth();
  }, [router, loadProposals]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProposals();
  }, [loadProposals]);

  const handleCreate = async () => {
    const trimmedName = newFirmName.trim();
    if (!trimmedName) {
      if (Platform.OS === 'web') {
        alert('Please enter a firm name');
      } else {
        Alert.alert('Missing Name', 'Please enter a firm name');
      }
      return;
    }

    try {
      setCreating(true);
      const supabase = await getSupabaseClient();

      const slug = generateSlug();

      const { error } = await supabase.from('partnership_proposals').insert({
        firm_name: trimmedName,
        slug,
        is_active: true,
      });

      if (error) {
        // TODO: Replace with proper error reporting service
        if (Platform.OS === 'web') {
          alert(`Error Creating Proposal\n\n${error.message}`);
        } else {
          Alert.alert('Error Creating Proposal', error.message);
        }
        return;
      }

      setNewFirmName('');
      loadProposals();
    } catch (error) {
      // TODO: Replace with proper error reporting service
    } finally {
      setCreating(false);
    }
  };

  const handleCopyLink = async (slug: string) => {
    const baseUrl =
      process.env.EXPO_PUBLIC_SITE_URL || 'https://auschildsupport.com.au';
    const link = `${baseUrl}/partner/${slug}`;

    try {
      if (Platform.OS === 'web' && navigator.clipboard) {
        await navigator.clipboard.writeText(link);
        setCopiedSlug(slug);
        setTimeout(() => setCopiedSlug(null), 2000);
      } else {
        Alert.alert('Link', link);
      }
    } catch (error) {
      // TODO: Replace with proper error reporting service
      Alert.alert('Link', link);
    }
  };

  const handleToggleActive = async (proposal: ProposalWithStats) => {
    try {
      const supabase = await getSupabaseClient();

      const { error } = await supabase
        .from('partnership_proposals')
        .update({ is_active: !proposal.is_active })
        .eq('id', proposal.id);

      if (error) {
        // TODO: Replace with proper error reporting service
        return;
      }

      loadProposals();
    } catch (error) {
      // TODO: Replace with proper error reporting service
    }
  };

  const handleBack = () => {
    router.push('/admin/dashboard');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading proposals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Web container style for constrained width on desktop (wider for proposals table)
  const webContainerStyle = isWeb ? {
    maxWidth: 1200, // Wider to accommodate full proposals table without scrolling
    width: '100%' as const,
    alignSelf: 'center' as const,
  } : {};

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={[styles.contentWrapper, webContainerStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable
              style={[styles.backButton, isWeb && webClickableStyles]}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
            <View>
              <Text style={styles.headerTitle}>Partnership Proposals</Text>
              <Text style={styles.headerSubtitle}>
                {proposals.length} proposal{proposals.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Create New Proposal */}
        <View style={styles.createSection}>
          <Text style={styles.createTitle}>Create New Proposal</Text>
          <View style={styles.createForm}>
            <TextInput
              style={[styles.input, isWeb && webInputStyles]}
              placeholder="Firm name (e.g. Smith Family Lawyers)"
              placeholderTextColor="#64748b"
              value={newFirmName}
              onChangeText={setNewFirmName}
              editable={!creating}
            />
            <Pressable
              style={[
                styles.createButton,
                creating && styles.createButtonDisabled,
                isWeb && webClickableStyles,
              ]}
              onPress={handleCreate}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.createButtonText}>Create</Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Proposals List */}
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#2563eb"
            />
          }
        >
          {proposals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No proposals yet</Text>
              <Text style={styles.emptyStateHint}>
                Create your first proposal above
              </Text>
            </View>
          ) : (
            proposals.map((proposal) => (
              <View key={proposal.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.firmName}>{proposal.firm_name}</Text>
                  <Pressable
                    style={[
                      styles.statusBadge,
                      proposal.is_active
                        ? styles.statusActive
                        : styles.statusInactive,
                      isWeb && webClickableStyles,
                    ]}
                    onPress={() => handleToggleActive(proposal)}
                  >
                    <Text style={styles.statusText}>
                      {proposal.is_active ? 'Active' : 'Inactive'}
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{proposal.view_count}</Text>
                    <Text style={styles.statLabel}>Views</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>
                      {proposal.total_view_minutes}
                    </Text>
                    <Text style={styles.statLabel}>Minutes</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>
                      {formatDate(proposal.created_at)}
                    </Text>
                    <Text style={styles.statLabel}>Created</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.slug}>/partner/{proposal.slug}</Text>
                  <Pressable
                    style={[styles.copyButton, isWeb && webClickableStyles]}
                    onPress={() => handleCopyLink(proposal.slug)}
                  >
                    <Text style={styles.copyButtonText}>
                      {copiedSlug === proposal.slug ? 'Copied!' : 'Copy Link'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, // White background
  },
  contentWrapper: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0', // Light border
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9', // Light gray
    borderRadius: 6,
  },
  backButtonText: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text, // Dark text
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  createSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  createTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  createForm: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8fafc', // Off-white
    color: Colors.light.text,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0', // Light border
    fontSize: 15,
  },
  createButton: {
    backgroundColor: PRIMARY_COLOR, // Brand primary
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
  },
  emptyStateHint: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  firmName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusActive: {
    backgroundColor: '#166534',
  },
  statusInactive: {
    backgroundColor: '#94a3b8',
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  slug: {
    fontSize: 13,
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  copyButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  copyButtonText: {
    color: Colors.light.text,
    fontSize: 13,
    fontWeight: '600',
  },
});
