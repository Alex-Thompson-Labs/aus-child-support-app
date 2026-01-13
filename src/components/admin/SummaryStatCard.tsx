import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

const PRIMARY_COLOR = Colors.light.tint;

interface SummaryStatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    style?: ViewStyle;
}

export const SummaryStatCard: React.FC<SummaryStatCardProps> = ({
    title,
    value,
    subtitle,
    style,
}) => {
    return (
        <View style={[styles.card, style]}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        flex: 1,
        minWidth: 150,
    },
    title: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.light.text,
    },
    subtitle: {
        fontSize: 12,
        color: PRIMARY_COLOR,
        marginTop: 4,
        fontWeight: '500',
    },
});
