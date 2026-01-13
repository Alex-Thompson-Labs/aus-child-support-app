import { useAppTheme } from '@/src/theme';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export interface PercentageBarProps {
    percentA: number;
    percentB: number;
}

export function PercentageBar({ percentA, percentB }: PercentageBarProps) {
    const { colors } = useAppTheme();

    const dynamicStyles = useMemo(() => ({
        visualBar: { backgroundColor: colors.border },
        barSegmentA: { backgroundColor: colors.userHighlight },
        barSegmentB: { backgroundColor: colors.border },
    }), [colors]);

    return (
        <View style={[styles.visualBar, dynamicStyles.visualBar]}>
            <View style={[styles.barSegmentA, dynamicStyles.barSegmentA, { flex: percentA }]} />
            <View style={[styles.barSegmentB, dynamicStyles.barSegmentB, { flex: percentB }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    visualBar: {
        flexDirection: 'row',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    barSegmentA: {},
    barSegmentB: {},
});
