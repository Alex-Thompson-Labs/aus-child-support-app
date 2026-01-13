import { format, getDay, getDaysInMonth, startOfMonth } from 'date-fns';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CareCalculationResult, DayAssignment } from '../utils/CareCalculator';

interface CareCalendarProps {
    result: CareCalculationResult;
    year: number;
}

export const CareCalendar: React.FC<CareCalendarProps> = ({ result, year }) => {
    const months = Array.from({ length: 12 }, (_, i) => i); // 0-11

    // Map assignments by date string for easy lookup
    const assignmentMap = React.useMemo(() => {
        const map = new Map<string, DayAssignment>();
        result.assignments.forEach(a => map.set(a.dateStr, a));
        return map;
    }, [result]);

    const renderMonth = (monthIndex: number) => {
        const date = new Date(year, monthIndex, 1);
        const monthName = format(date, 'MMMM');
        const daysInMonth = getDaysInMonth(date);
        const startDay = getDay(startOfMonth(date)); // 0 = Sunday, 1 = Monday, etc.

        const days = [];
        // Padding for empty days at start of month
        for (let i = 0; i < startDay; i++) {
            days.push(<View key={`pad-${i}`} style={styles.dayCell} />);
        }

        // Actual days
        for (let d = 1; d <= daysInMonth; d++) {
            const currentDate = new Date(year, monthIndex, d);
            const dateStr = format(currentDate, 'yyyy-MM-dd');
            const assignment = assignmentMap.get(dateStr);

            // Colors
            let backgroundColor = '#e2e8f0'; // default gray
            if (assignment) {
                if (assignment.midnightOwner === 'Father') backgroundColor = '#60a5fa'; // Blue
                if (assignment.midnightOwner === 'Mother') backgroundColor = '#f472b6'; // Pink
            }

            // Holiday styling
            const isHoliday = assignment?.reason.startsWith('holiday:');
            const borderColor = isHoliday ? '#f59e0b' : 'transparent'; // Amber border for holidays

            days.push(
                <View key={d} style={[styles.dayCell, { backgroundColor, borderColor, borderWidth: isHoliday ? 2 : 0 }]}>
                    <Text style={styles.dayText}>{d}</Text>
                </View>
            );
        }

        return (
            <View key={monthIndex} style={styles.monthContainer}>
                <Text style={styles.monthTitle}>{monthName}</Text>
                <View style={styles.daysGrid}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <Text key={i} style={styles.dayHeader}>{day}</Text>
                    ))}
                    {days}
                </View>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.yearTitle}>Care Calendar {year}</Text>
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#f472b6' }]} />
                    <Text style={styles.legendText}>Mother</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#60a5fa' }]} />
                    <Text style={styles.legendText}>Father</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { borderColor: '#f59e0b', borderWidth: 2, backgroundColor: 'transparent' }]} />
                    <Text style={styles.legendText}>Holiday Rule</Text>
                </View>
            </View>
            <View style={styles.monthsWrapper}>
                {months.map(m => renderMonth(m))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    yearTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        color: '#0f172a',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
        color: '#334155',
    },
    monthsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 24,
    },
    monthContainer: {
        width: 160,
        marginBottom: 16,
    },
    monthTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
        color: '#1e293b',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayHeader: {
        width: 22,
        height: 22,
        fontSize: 10, // Reduced font size
        textAlign: 'center',
        color: '#64748b',
        fontWeight: '500',
    },
    dayCell: {
        width: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0.5,
        borderRadius: 2,
    },
    dayText: {
        fontSize: 8, // Reduced font size
        color: 'rgba(0,0,0,0.7)',
    },
});
