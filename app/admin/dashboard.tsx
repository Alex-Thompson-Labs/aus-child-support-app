/**
 * Admin Dashboard - Leads List
 * Display all leads with filters, search, and status management
 * Mobile-optimized for use on phone
 */

import { isWeb, useResponsive, webClickableStyles, webInputStyles } from '@/src/utils/responsive';
import { supabase, type LeadSubmission } from '@/src/utils/supabase';
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

type LeadStatus = 'new' | 'reviewing' | 'sent' | 'converted' | 'lost';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { isMobile } = useResponsive();

  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [sortBy, setSortBy] = useState<'date' | 'liability'>('date');

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('[AdminDashboard] No session - redirecting to login');
      router.replace('/admin/login');
      return;
    }

    // Verify it's the admin email
    if (session.user.email?.toLowerCase() !== 'alex@auschildsupport.com') {
      console.log('[AdminDashboard] Not admin email - redirecting');
      await supabase.auth.signOut();
      router.replace('/admin/login');
      return;
    }

    console.log('[AdminDashboard] Auth verified - loading leads');
    loadLeads();
  };

  const loadLeads = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .is('deleted_at', null) // Exclude soft-deleted leads
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[AdminDashboard] Error loading leads:', error);
        if (Platform.OS === 'web') {
          alert(`Error Loading Leads\n\n${error.message}`);
        } else {
          Alert.alert('Error Loading Leads', error.message);
        }
        return;
      }

      console.log(`[AdminDashboard] Loaded ${data?.length || 0} leads`);
      setLeads(data || []);
      setFilteredLeads(data || []);
    } catch (error) {
      console.error('[AdminDashboard] Unexpected error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadLeads();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...leads];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Search query (name or email)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(lead => 
        lead.parent_name.toLowerCase().includes(query) ||
        lead.parent_email.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => 
        new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      );
    } else if (sortBy === 'liability') {
      filtered.sort((a, b) => b.annual_liability - a.annual_liability);
    }

    setFilteredLeads(filtered);
  }, [leads, statusFilter, searchQuery, sortBy]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  const handleLeadPress = (lead: LeadSubmission) => {
    router.push(`/admin/lead/${lead.id}`);
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

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>{filteredLeads.length} leads</Text>
        </View>
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <Pressable
          style={[styles.filterChip, statusFilter === 'all' && styles.filterChipActive]}
          onPress={() => setStatusFilter('all')}
        >
          <Text style={[styles.filterChipText, statusFilter === 'all' && styles.filterChipTextActive]}>
            All ({leads.length})
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.filterChip, statusFilter === 'new' && styles.filterChipActive]}
          onPress={() => setStatusFilter('new')}
        >
          <Text style={[styles.filterChipText, statusFilter === 'new' && styles.filterChipTextActive]}>
            New ({leads.filter(l => l.status === 'new').length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, statusFilter === 'reviewing' && styles.filterChipActive]}
          onPress={() => setStatusFilter('reviewing')}
        >
          <Text style={[styles.filterChipText, statusFilter === 'reviewing' && styles.filterChipTextActive]}>
            Reviewing ({leads.filter(l => l.status === 'reviewing').length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, statusFilter === 'sent' && styles.filterChipActive]}
          onPress={() => setStatusFilter('sent')}
        >
          <Text style={[styles.filterChipText, statusFilter === 'sent' && styles.filterChipTextActive]}>
            Sent ({leads.filter(l => l.status === 'sent').length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, statusFilter === 'converted' && styles.filterChipActive]}
          onPress={() => setStatusFilter('converted')}
        >
          <Text style={[styles.filterChipText, statusFilter === 'converted' && styles.filterChipTextActive]}>
            Converted ({leads.filter(l => l.status === 'converted').length})
          </Text>
        </Pressable>
      </ScrollView>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <Pressable
          style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]}
          onPress={() => setSortBy('date')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'date' && styles.sortButtonTextActive]}>
            Date
          </Text>
        </Pressable>
        <Pressable
          style={[styles.sortButton, sortBy === 'liability' && styles.sortButtonActive]}
          onPress={() => setSortBy('liability')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'liability' && styles.sortButtonTextActive]}>
            Liability
          </Text>
        </Pressable>
      </View>

      {/* Leads List */}
      <ScrollView
        style={styles.leadsList}
        contentContainerStyle={styles.leadsListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />
        }
      >
        {filteredLeads.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No leads match your search' : 'No leads yet'}
            </Text>
          </View>
        ) : (
          filteredLeads.map((lead) => (
            <Pressable
              key={lead.id}
              style={[styles.leadCard, isWeb && webClickableStyles]}
              onPress={() => handleLeadPress(lead)}
            >
              <View style={styles.leadCardHeader}>
                <Text style={styles.leadId}>Lead #{lead.id?.slice(0, 8)}</Text>
                <View style={[styles.statusBadge, getStatusBadgeStyle(lead.status)]}>
                  <Text style={styles.statusBadgeText}>{lead.status || 'new'}</Text>
                </View>
              </View>

              <Text style={styles.leadName}>{getFirstName(lead.parent_name)}</Text>
              
              {lead.location && (
                <Text style={styles.leadLocation}>{lead.location}</Text>
              )}

              <View style={styles.leadFooter}>
                <Text style={styles.leadLiability}>
                  ${lead.annual_liability.toLocaleString()}/yr
                </Text>
                <Text style={styles.leadDate}>
                  {formatDate(lead.created_at)}
                </Text>
              </View>

              {lead.complexity_reasons && lead.complexity_reasons.length > 0 && (
                <View style={styles.complexityBadge}>
                  <Text style={styles.complexityBadgeText}>
                    {lead.complexity_reasons.length} complexity triggers
                  </Text>
                </View>
              )}
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper functions
function getStatusBadgeStyle(status?: string) {
  switch (status) {
    case 'new':
      return { backgroundColor: '#3b82f6' }; // blue
    case 'reviewing':
      return { backgroundColor: '#f59e0b' }; // amber
    case 'sent':
      return { backgroundColor: '#8b5cf6' }; // purple
    case 'converted':
      return { backgroundColor: '#10b981' }; // green
    case 'lost':
      return { backgroundColor: '#64748b' }; // slate
    default:
      return { backgroundColor: '#3b82f6' }; // blue
  }
}

function getFirstName(fullName: string): string {
  return fullName.split(' ')[0];
}

function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-AU', { 
    day: 'numeric', 
    month: 'short' 
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-900
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1e293b',
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 12,
  },
  searchInput: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
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
    backgroundColor: '#1e293b',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterChipText: {
    fontSize: 13,
    color: '#94a3b8',
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
    color: '#94a3b8',
    marginRight: 12,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sortButtonActive: {
    backgroundColor: '#334155',
    borderColor: '#475569',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: '#e2e8f0',
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
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
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
    color: '#ffffff',
    marginBottom: 4,
  },
  leadLocation: {
    fontSize: 14,
    color: '#94a3b8',
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
    color: '#2563eb',
  },
  leadDate: {
    fontSize: 13,
    color: '#64748b',
  },
  complexityBadge: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  complexityBadgeText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
});