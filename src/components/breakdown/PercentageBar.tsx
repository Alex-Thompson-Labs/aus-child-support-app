import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../../theme';

export interface PercentageBarProps {
    percentA: number;
    percentB: number;
}

export function PercentageBar({ percentA, percentB }: PercentageBarProps) {
    return (
        <View style={styles.visualBar}>
            <View style={[styles.barSegmentA, { flex: percentA }]} />
            <View style={[styles.barSegmentB, { flex: percentB }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    visualBar: {
        flexDirection: 'row',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: theme.colors.border,
    },
    barSegmentA: {
        backgroundColor: theme.colors.userHighlight,
    },
    barSegmentB: {
        backgroundColor: theme.colors.border,
    },
});

