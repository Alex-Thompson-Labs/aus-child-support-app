import { Colors } from '@/constants/theme';
import { formatCurrency } from '@/src/utils/formatters';
import { isWeb, webClickableStyles } from '@/src/utils/responsive';
import { LeadSubmission } from '@/src/utils/supabase';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface LeadsTableProps {
    leads: LeadSubmission[];
}

// Row height for consistent rendering
const ROW_HEIGHT = 60;

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads }) => {
    const router = useRouter();

    const handleLeadPress = useCallback((lead: LeadSubmission) => {
        router.push(`/admin/lead/${lead.id}`);
    }, [router]);

    const getPayerRoleDisplay = useCallback((lead: LeadSubmission) => {
        if (lead.payer_role === 'you') return 'Payer';
        if (lead.payer_role === 'other_parent') return 'Payee';
        // Fallback inference if payer_role is missing
        if (lead.annual_liability > 0) return 'Payer';
        return 'Unknown';
    }, []);

    const getCombinedIncome = useCallback((lead: LeadSubmission) => {
        return (lead.income_parent_a || 0) + (lead.income_parent_b || 0);
    }, []);

    const formatDate = useCallback((dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-AU', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    const renderItem = useCallback(({ item, index }: { item: LeadSubmission; index: number }) => {
        const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;
        const completedDate = item.created_at;

        // Badge logic
        const isAdultChild = item.complexity_reasons?.some(r => r.toLowerCase().includes('adult') || r.includes('18'));
        
        // Score badge color
        const getScoreBadgeColor = (category?: string) => {
            switch (category?.toLowerCase()) {
                case 'high': return { backgroundColor: '#dcfce7', color: '#166534' };
                case 'medium': return { backgroundColor: '#fef3c7', color: '#92400e' };
                case 'low': return { backgroundColor: '#fee2e2', color: '#991b1b' };
                default: return { backgroundColor: '#f1f5f9', color: '#64748b' };
            }
        };

        return (
            <Pressable
                style={[styles.row, rowStyle, isWeb && webClickableStyles]}
                onPress={() => handleLeadPress(item)}
            >
                <Text style={[styles.cell, styles.colDate]}>{formatDate(completedDate)}</Text>

                <View style={styles.colName}>
                    <Text style={styles.nameText} numberOfLines={1}>{item.parent_name}</Text>
                    <Text style={styles.emailText} numberOfLines={1}>{item.parent_email}</Text>
                </View>

                <Text style={[styles.cell, styles.colRole]}>{getPayerRoleDisplay(item)}</Text>

                <Text style={[styles.cell, styles.colIncome]}>
                    {formatCurrency(getCombinedIncome(item))}
                </Text>

                <Text style={[styles.cell, styles.colChildren]}>{item.children_count}</Text>

                <Text style={[styles.cell, styles.colResult, styles.resultText]}>
                    {formatCurrency(item.annual_liability)}
                </Text>

                <View style={styles.colScore}>
                    {item.lead_score !== undefined && item.lead_score !== null ? (
                        <View style={[styles.scoreBadge, { backgroundColor: getScoreBadgeColor(item.score_category).backgroundColor }]}>
                            <Text style={[styles.scoreText, { color: getScoreBadgeColor(item.score_category).color }]}>
                                {item.lead_score}
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.cell}>-</Text>
                    )}
                </View>

                <View style={styles.colStatus}>
                    <View style={[styles.statusBadge, getStatusColor(item.status)]}>
                        <Text style={styles.statusText}>{item.status || 'new'}</Text>
                    </View>
                    {isAdultChild && (
                        <View style={styles.tagBadge}>
                            <Text style={styles.tagText}>A18</Text>
                        </View>
                    )}
                </View>
            </Pressable>
        );
    }, [handleLeadPress, formatDate, getPayerRoleDisplay, getCombinedIncome]);

    const renderHeader = useCallback(() => (
        <View style={styles.headerRow}>
            <Text style={[styles.headerCell, styles.colDate]}>Date</Text>
            <Text style={[styles.headerCell, styles.colName]}>Name / Email</Text>
            <Text style={[styles.headerCell, styles.colRole]}>Role</Text>
            <Text style={[styles.headerCell, styles.colIncome]}>Comb. Income</Text>
            <Text style={[styles.headerCell, styles.colChildren]}>Kids</Text>
            <Text style={[styles.headerCell, styles.colResult]}>Transfer</Text>
            <Text style={[styles.headerCell, styles.colScore]}>Score</Text>
            <Text style={[styles.headerCell, styles.colStatus]}>Status</Text>
        </View>
    ), []);

    const keyExtractor = useCallback((item: LeadSubmission) => item.id || '', []);

    const getItemType = useCallback((_item: LeadSubmission, index: number) => {
        // Alternate between two types for striping
        return index % 2 === 0 ? 'even' : 'odd';
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ minWidth: '100%' }}>
                <View style={styles.table}>
                    <FlashList
                        data={leads}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        getItemType={getItemType}
                        ListHeaderComponent={renderHeader}
                        showsVerticalScrollIndicator={true}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

function getStatusColor(status?: string) {
    switch (status) {
        case 'new': return { backgroundColor: '#e0f2fe', borderColor: '#bae6fd' }; // Sky blue
        case 'reviewing': return { backgroundColor: '#fef3c7', borderColor: '#fde68a' }; // Amber
        case 'sent': return { backgroundColor: '#f3e8ff', borderColor: '#e9d5ff' }; // Purple
        case 'converted': return { backgroundColor: '#dcfce7', borderColor: '#bbf7d0' }; // Green
        default: return { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' }; // Slate
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        overflow: 'hidden',
    },
    table: {
        minWidth: 800, // Ensure horizontal scroll on small screens
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        minHeight: ROW_HEIGHT,
    },
    rowEven: {
        backgroundColor: '#ffffff',
    },
    rowOdd: {
        backgroundColor: '#f8fafc', // Very subtle stripe
    },
    headerCell: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
    },
    cell: {
        fontSize: 13,
        color: '#334155',
    },
    // Columns
    colDate: { width: 100 },
    colName: { flex: 1, minWidth: 180 },
    colRole: { width: 80 },
    colIncome: { width: 120, textAlign: 'right' },
    colChildren: { width: 60, textAlign: 'center' },
    colResult: { width: 120, textAlign: 'right', fontWeight: 'bold' },
    colScore: { width: 80, alignItems: 'center', justifyContent: 'center' },
    colStatus: { width: 140, paddingLeft: 16, flexDirection: 'row', alignItems: 'center', gap: 6 },

    nameText: {
        fontWeight: '500',
    },
    emailText: {
        fontSize: 11,
        color: '#94a3b8',
    },
    resultText: {
        color: Colors.light.tint,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#475569',
        textTransform: 'capitalize',
    },
    tagBadge: {
        backgroundColor: '#fce7f3',
        borderColor: '#fbcfe8',
        borderWidth: 1,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#be185d',
    },
    scoreBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 40,
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 12,
        fontWeight: '700',
    },
});
