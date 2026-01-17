/**
 * Admin Dashboard - Leads List
 * Display all leads with filters, search, and status management
 * Mobile-optimized for use on phone
 */

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
import { Colors } from '../../../constants/theme.ts';
import { LeadsTable } from '../../components/admin/LeadsTable.tsx';
import { SummaryStatCard } from '../../components/admin/SummaryStatCard.tsx';
import { formatCurrency } from '../../utils/formatters.ts';
import {
    isWeb,
    webClickableStyles,
    webInputStyles
} from '../../utils/responsive.ts';
import { getSupabaseClient } from '../../utils/supabase/client.ts';
import { fetchPaginatedLeads, type LeadSubmission } from '../../utils/supabase/leads.ts';

// Use brand colors from theme
const PRIMARY_COLOR = Colors.light.tint;

type LeadStatus = 'new' | 'reviewing' | 'sent' | 'converted' | 'lost';

const LEADS_PER_PAGE = 20;

export default function AdminDashboardScreen() {
  const router = useRouter();
  // const { isMobile } = useResponsive();

  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [sortBy, setSortBy] = useState<'date' | 'liability' | 'income'>('date');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Statistics
  const totalLeads = leads.length;
  const recentLeads = leads.filter((l) => {
    if (!l.created_at) return false;
    const d = new Date(l.created_at);
    const now = new Date();
    return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const avgIncome =
    leads.length > 0
      ? leads.reduce((acc, curr) => {
          const income =
            (curr.income_parent_a || 0) + (curr.income_parent_b || 0);
          return acc + income;
        }, 0) / leads.length
      : 0;

  const loadLeads = useCallback(async (page: number = 0, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
      }

      // Fetch paginated leads from server
      const result = await fetchPaginatedLeads(page, LEADS_PER_PAGE, {
        statusFilter: statusFilter,
        sortBy: sortBy,
        sortOrder: 'desc',
      });

      if (!result.success) {
        // TODO: Replace with proper error reporting service
        if (Platform.OS === 'web') {
          alert(`Error Loading Leads\n\n${result.error}`);
        } else {
          Alert.alert('Error Loading Leads', result.error || 'Unknown error');
        }
        return;
      }

      const newLeads = result.leads || [];
      const total = result.totalCount || 0;

      if (append) {
        // Append to existing leads for "load more"
        setLeads(prev => [...prev, ...newLeads]);
        setFilteredLeads(prev => [...prev, ...newLeads]);
      } else {
        // Replace leads for initial load or refresh
        setLeads(newLeads);
        setFilteredLeads(newLeads);
      }

      setTotalCount(total);
      setCurrentPage(page);
      setHasMore((page + 1) * LEADS_PER_PAGE < total);
    } catch (error) {
      // TODO: Replace with proper error reporting service
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, sortBy]);

  // Load leads on mount (auth is handled by _layout.tsx)
  useEffect(() => {
    console.log('[AdminDashboard] Component mounted, loading leads');
    loadLeads();
  }, [loadLeads]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadLeads(0, false);
  }, [loadLeads]);

  const loadMoreLeads = useCallback(() => {
    if (!loading && hasMore) {
      loadLeads(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, loadLeads]);

  // When filters change, reset to page 0
  useEffect(() => {
    loadLeads(0, false);
  }, [statusFilter, sortBy]);

  // Apply client-side search filter (search is not done server-side for security)
  useEffect(() => {
    let filtered = [...leads];

    // Search query (name or email) - client-side only
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (lead) =>
          lead.parent_name.toLowerCase().includes(query) ||
          lead.parent_email.toLowerCase().includes(query)
      );
    }

    setFilteredLeads(filtered);
  }, [leads, searchQuery]);

  const handleLogout = async () => {
    const supabase = await getSupabaseClient();
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading leads...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Web container style for constrained width on desktop (wider for table display)
  const webContainerStyle = isWeb
    ? {
        maxWidth: 1200, // Wider to accommodate full table without horizontal scroll
        width: '100%' as const,
        alignSelf: 'center' as const,
      }
    : {};

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={[styles.contentWrapper, webContainerStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              {filteredLeads.length} leads
            </Text>
          </View>
          <Pressable
            style={[styles.proposalsButton, isWeb && webClickableStyles]}
            onPress={() => router.push('/admin/proposals')}
          >
            <Text style={styles.proposalsButtonText}>Proposals</Text>
          </Pressable>
          <Pressable
            style={[styles.logoutButton, isWeb && webClickableStyles]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, isWeb && webInputStyles]}
            placeholder="Search by name or email..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        <View accessibilityLabel="Filter leads">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
          >
            <Pressable
              style={[
                styles.filterChip,
                statusFilter === 'all' && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter('all')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === 'all' && styles.filterChipTextActive,
                ]}
              >
                All ({leads.length})
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterChip,
                statusFilter === 'new' && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter('new')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === 'new' && styles.filterChipTextActive,
                ]}
              >
                New ({leads.filter((l) => l.status === 'new').length})
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterChip,
                statusFilter === 'reviewing' && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter('reviewing')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === 'reviewing' && styles.filterChipTextActive,
                ]}
              >
                Reviewing (
                {leads.filter((l) => l.status === 'reviewing').length})
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterChip,
                statusFilter === 'sent' && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter('sent')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === 'sent' && styles.filterChipTextActive,
                ]}
              >
                Sent ({leads.filter((l) => l.status === 'sent').length})
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterChip,
                statusFilter === 'converted' && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter('converted')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === 'converted' && styles.filterChipTextActive,
                ]}
              >
                Converted (
                {leads.filter((l) => l.status === 'converted').length})
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Summary Cards */}
        <View style={styles.statsContainer}>
          <SummaryStatCard
            title="Total Leads"
            value={totalLeads}
            subtitle="All time"
            style={{ marginRight: 12 }}
          />
          <SummaryStatCard
            title="Last 7 Days"
            value={recentLeads}
            subtitle={`${recentLeads > 0 ? '+' : ''}${recentLeads} this week`}
            style={{ marginRight: 12 }}
          />
          <SummaryStatCard
            title="Avg Combined Income"
            value={formatCurrency(avgIncome)}
            subtitle="Per case"
          />
        </View>

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <Pressable
            style={[
              styles.sortButton,
              sortBy === 'date' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('date')}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'date' && styles.sortButtonTextActive,
              ]}
            >
              Date
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.sortButton,
              sortBy === 'liability' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('liability')}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'liability' && styles.sortButtonTextActive,
              ]}
            >
              Liability
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.sortButton,
              sortBy === 'income' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('income')}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'income' && styles.sortButtonTextActive,
              ]}
            >
              Income
            </Text>
          </Pressable>
        </View>

        {/* Leads List */}
        <ScrollView
          style={styles.leadsList}
          contentContainerStyle={styles.leadsListContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#2563eb"
            />
          }
        >
          {filteredLeads.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'No leads match your search' : 'No leads yet'}
              </Text>
            </View>
          ) : (
            <>
              <LeadsTable leads={filteredLeads} />
              
              {/* Pagination Info and Load More */}
              <View style={styles.paginationContainer}>
                <Text style={styles.paginationText}>
                  Showing {filteredLeads.length} of {totalCount} leads
                </Text>
                {hasMore && !searchQuery && (
                  <Pressable
                    style={[styles.loadMoreButton, isWeb && webClickableStyles]}
                    onPress={loadMoreLeads}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.loadMoreButtonText}>
                        Load More ({totalCount - filteredLeads.length} remaining)
                      </Text>
                    )}
                  </Pressable>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
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
  proposalsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: PRIMARY_COLOR, // Brand primary
    borderRadius: 6,
    marginRight: 8,
  },
  proposalsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9', // Light gray
    borderRadius: 6,
  },
  logoutButtonText: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 12,
  },
  searchInput: {
    backgroundColor: '#f8fafc', // Off-white
    color: Colors.light.text,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0', // Light border
    fontSize: 15,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    maxHeight: 44,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  filterChipText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sortLabel: {
    fontSize: 13,
    color: '#64748b',
    marginRight: 12,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sortButtonActive: {
    backgroundColor: '#e2e8f0',
    borderColor: '#cbd5e1',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: Colors.light.text,
  },
  leadsList: {
    flex: 1,
  },
  leadsListContent: {
    padding: 16,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
  },
  leadCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  leadCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leadId: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  leadName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  leadLocation: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  leadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leadLiability: {
    fontSize: 16,
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
  leadDate: {
    fontSize: 13,
    color: '#64748b',
  },
  complexityBadge: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  complexityBadgeText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  paginationContainer: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  paginationText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  loadMoreButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  loadMoreButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
