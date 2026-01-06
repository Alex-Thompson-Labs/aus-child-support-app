import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AssessmentYear } from '../utils/child-support-constants';
import { isWeb, webClickableStyles } from '../utils/responsive';

/**
 * YearSelector Component
 *
 * A simple dropdown-style selector for choosing the assessment year.
 * Displays as a styled button/badge that shows the current year.
 *
 * Created: 2026-01-06
 */

interface YearSelectorProps {
    value: AssessmentYear;
    onChange: (year: AssessmentYear) => void;
}

const YEARS: AssessmentYear[] = ['2026', '2025'];

export function YearSelector({ value, onChange }: YearSelectorProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSelect = (year: AssessmentYear) => {
        onChange(year);
        setIsOpen(false);
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => setIsOpen(!isOpen)}
                style={[styles.selector, isWeb && webClickableStyles]}
                accessibilityRole="button"
                accessibilityLabel={`Assessment year: ${value}. Press to change.`}
                accessibilityHint="Opens year selection dropdown"
            >
                <Text style={styles.selectorText}>{value}</Text>
                <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
            </Pressable>

            {isOpen && (
                <View style={styles.dropdown}>
                    {YEARS.map((year) => (
                        <Pressable
                            key={year}
                            onPress={() => handleSelect(year)}
                            style={[
                                styles.option,
                                year === value && styles.optionSelected,
                                isWeb && webClickableStyles,
                            ]}
                            accessibilityRole="menuitem"
                            accessibilityState={{ selected: year === value }}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    year === value && styles.optionTextSelected,
                                ]}
                            >
                                {year}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        zIndex: 1000,
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#eff6ff', // blue-50
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#bfdbfe', // blue-200
    },
    selectorText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2563eb', // blue-600
    },
    chevron: {
        fontSize: 8,
        color: '#2563eb',
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 4,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 10,
        minWidth: 80,
        overflow: 'visible',
        zIndex: 1001,
    },
    option: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    optionSelected: {
        backgroundColor: '#eff6ff', // blue-50
    },
    optionText: {
        fontSize: 14,
        color: '#334155', // slate-700
    },
    optionTextSelected: {
        fontWeight: '600',
        color: '#2563eb', // blue-600
    },
});
