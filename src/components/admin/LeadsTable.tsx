import { Colors } from '@/constants/theme';
import { formatCurrency } from '@/src/utils/formatters';
import { isWeb, webClickableStyles } from '@/src/utils/responsive';
import { LeadSubmission } from '@/src/utils/supabase';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface LeadsTableProps {
    leads: LeadSubmission[];
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads }) => {
    const router = useRouter();

    const handleLeadPress = (lead: LeadSubmission) => {
        router.push(`/admin/lead/${lead.id}`);
    };

    const getPayerRoleDisplay = (lead: LeadSubmission) => {
        if (lead.payer_role === 'you') return 'Payer';
        if (lead.payer_role === 'other_parent') return 'Payee';
        // Fallback inference if payer_role is missing
        if (lead.annual_liability > 0) return 'Payer'; // Assumes positive liability means user pays? (Need to verify logic, usually positive means liable)
        return 'Unknown';
        // Logic: In the calc, we show "Annual Transfer" amount. Usually calculated as what 'parent A' pays 'parent B'.
        // If payer_role is set, use it.
    };

    const getCombinedIncome = (lead: LeadSubmission) => {
        return (lead.income_parent_a || 0) + (lead.income_parent_b || 0);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-AU', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ minWidth: '100%' }}>
                <View style={styles.table}>
                    {/* Header Row */}
                    <View style={styles.headerRow}>
                        <Text style={[styles.headerCell, styles.colDate]}>Date</Text>
                        <Text style={[styles.headerCell, styles.colName]}>Name / Email</Text>
                        <Text style={[styles.headerCell, styles.colRole]}>Role</Text>
                        <Text style={[styles.headerCell, styles.colIncome]}>Comb. Income</Text>
                        <Text style={[styles.headerCell, styles.colChildren]}>Kids</Text>
                        <Text style={[styles.headerCell, styles.colResult]}>Transfer</Text>
                        <Text style={[styles.headerCell, styles.colStatus]}>Status</Text>
                    </View>

                    {/* Data Rows */}
                    {leads.map((lead, index) => {
                        const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;
                        const completedDate = lead.created_at;

                        // Badge logic
                        const isAdultChild = lead.complexity_reasons?.some(r => r.toLowerCase().includes('adult') || r.includes('18'));

                        return (
                            <Pressable
                                key={lead.id}
                                style={[styles.row, rowStyle, isWeb && webClickableStyles]}
                                onPress={() => handleLeadPress(lead)}
                            >
                                <Text style={[styles.cell, styles.colDate]}>{formatDate(completedDate)}</Text>

                                <View style={styles.colName}>
                                    <Text style={styles.nameText} numberOfLines={1}>{lead.parent_name}</Text>
                                    <Text style={styles.emailText} numberOfLines={1}>{lead.parent_email}</Text>
                                </View>

                                <Text style={[styles.cell, styles.colRole]}>{getPayerRoleDisplay(lead)}</Text>

                                <Text style={[styles.cell, styles.colIncome]}>
                                    {formatCurrency(getCombinedIncome(lead))}
                                </Text>

                                <Text style={[styles.cell, styles.colChildren]}>{lead.children_count}</Text>

                                <Text style={[styles.cell, styles.colResult, styles.resultText]}>
                                    {formatCurrency(lead.annual_liability)}
                                </Text>

                                <View style={styles.colStatus}>
                                    <View style={[styles.statusBadge, getStatusColor(lead.status)]}>
                                        <Text style={styles.statusText}>{lead.status || 'new'}</Text>
                                    </View>
                                    {isAdultChild && (
                                        <View style={styles.tagBadge}>
                                            <Text style={styles.tagText}>A18</Text>
                                        </View>
                                    )}
                                </View>
                            </Pressable>
                        );
                    })}
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
});
