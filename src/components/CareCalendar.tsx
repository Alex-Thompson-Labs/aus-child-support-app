/**
 * CareCalendar Component
 * 
 * Renders a full year view (Jan-Dec) showing care distribution between parents.
 * - Father's Care: Blue (#60a5fa)
 * - Mother's Care: Pink (#f472b6)
 * - School Holidays: Grey underline indicator
 * 
 * Updated to support the new Timeline architecture.
 */

import {
  addDays,
  format,
  getDay,
  getDaysInMonth,
  startOfMonth,
} from 'date-fns';
import React, { useMemo } from 'react';
import { DimensionValue, Platform, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import {
  AustralianState,
  CareParent,
  DayAssignment,
  getSchoolHolidays,
} from '@/src/utils/CareCalculator';
import { getParentAtTime } from '@/src/utils/timeline-aggregator';
import { TimelineBlock } from '@/src/utils/timeline-types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const FATHER_COLOR_DEFAULT = '#60a5fa';
const MOTHER_COLOR_DEFAULT = '#f472b6';
const HOLIDAY_INDICATOR = '#94a3b8';

interface CareCalendarProps {
  year: number;
  /** @deprecated Use timeline prop instead */
  assignments?: DayAssignment[];
  /** New timeline-based prop */
  timeline?: TimelineBlock[];
  state: AustralianState;
  fatherColor?: string;
  motherColor?: string;
  /** Optional: dates before this are excluded from calculation */
  excludeBeforeDate?: string;
  /** Optional: dates after this are excluded from calculation */
  excludeAfterDate?: string;
}

interface DayCellProps {
  day: number;
  careWith: CareParent | null;
  isHoliday: boolean;
  fatherColor: string;
  motherColor: string;
  isExcluded?: boolean;
  userColor: string; // The color of the selected user (blue)
}

function DayCell({ day, careWith, isHoliday, fatherColor, motherColor, isExcluded, userColor }: DayCellProps) {
  if (day === 0) {
    return <View style={viewStyles.dayCell} />;
  }

  if (isExcluded) {
    return (
      <View style={viewStyles.dayCell}>
        <View style={[viewStyles.dayCircle, { backgroundColor: '#f1f5f9', opacity: 0.5 }]}>
          <Text style={[textStyles.dayText, { color: '#94a3b8' }]}>{day}</Text>
        </View>
      </View>
    );
  }

  if (isHoliday) {
    // School holiday: light blue filled background (no parent indicator)
    return (
      <View style={viewStyles.dayCell}>
        <View style={[
          viewStyles.dayCircle, 
          { 
            backgroundColor: '#dbeafe', // Light blue background for holidays
          }
        ]}>
          <Text style={[textStyles.dayText, { color: '#1e293b' }]}>{day}</Text>
        </View>
      </View>
    );
  }

  // Regular day: outlined with parent's color (not filled)
  const borderColor = careWith === 'Father' ? fatherColor : motherColor;
  // Thicker border for the user's color (blue), thinner for the other parent
  const borderWidth = borderColor === userColor ? 2.5 : 1.5;
  return (
    <View style={viewStyles.dayCell}>
      <View style={[
        viewStyles.dayCircle, 
        { 
          backgroundColor: 'transparent',
          borderWidth: borderWidth,
          borderColor: borderColor
        }
      ]}>
        <Text style={[textStyles.dayText, { color: borderColor }]}>{day}</Text>
      </View>
    </View>
  );
}

interface MonthGridProps {
  year: number;
  month: number;
  assignmentMap: Map<string, CareParent>;
  holidayDates: Set<string>;
  fatherColor: string;
  motherColor: string;
  excludeBeforeDate?: string;
  excludeAfterDate?: string;
  userColor: string;
}

function MonthGrid({ year, month, assignmentMap, holidayDates, fatherColor, motherColor, excludeBeforeDate, excludeAfterDate, userColor }: MonthGridProps) {
  const firstDay = startOfMonth(new Date(year, month, 1));
  const daysInMonth = getDaysInMonth(firstDay);
  const startDayOfWeek = getDay(firstDay);

  const weeks: number[][] = [];
  let currentWeek: number[] = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(0);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(0);
    }
    weeks.push(currentWeek);
  }

  return (
    <View style={viewStyles.monthContainer}>
      <Text style={textStyles.monthTitle}>{MONTH_NAMES[month]}</Text>
      <View style={viewStyles.dayLabelsRow}>
        {DAY_LABELS.map((label, i) => (
          <Text key={i} style={textStyles.dayLabel}>{label}</Text>
        ))}
      </View>
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={viewStyles.weekRow}>
          {week.map((day, dayIndex) => {
            if (day === 0) {
              return <DayCell key={dayIndex} day={0} careWith={null} isHoliday={false} fatherColor={fatherColor} motherColor={motherColor} userColor={userColor} />;
            }
            const dateStr = format(new Date(year, month, day), 'yyyy-MM-dd');
            const isExcluded = !!(excludeBeforeDate && dateStr < excludeBeforeDate) || !!(excludeAfterDate && dateStr > excludeAfterDate);
            const careWith = assignmentMap.get(dateStr) || 'Mother';
            const isHoliday = holidayDates.has(dateStr);
            return (
              <DayCell key={dayIndex} day={day} careWith={careWith} isHoliday={isHoliday} fatherColor={fatherColor} motherColor={motherColor} isExcluded={isExcluded} userColor={userColor} />
            );
          })}
        </View>
      ))}
    </View>
  );
}

export function CareCalendar({
  year,
  assignments,
  timeline,
  state,
  fatherColor = FATHER_COLOR_DEFAULT,
  motherColor = MOTHER_COLOR_DEFAULT,
  excludeBeforeDate,
  excludeAfterDate
}: CareCalendarProps) {
  // Determine which color is the "user color" (the blue one)
  // The user color is whichever one matches the default blue color
  const userColor = fatherColor === FATHER_COLOR_DEFAULT ? fatherColor : motherColor;
  
  // Build assignment map from either timeline or legacy assignments
  const assignmentMap = useMemo(() => {
    const map = new Map<string, CareParent>();
    
    if (timeline && timeline.length > 0) {
      // New timeline-based approach: determine care at 23:59 for each day in the timeline
      const firstBlock = timeline[0];
      const lastBlock = timeline[timeline.length - 1];
      const startDate = new Date(firstBlock[0]);
      const endDate = new Date(lastBlock[1]);
      
      // Calculate total days in the timeline
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + dayIndex);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        // Check who has care at 23:59 (midnight rule)
        const midnightCheck = new Date(date);
        midnightCheck.setHours(23, 59, 0, 0);
        const parent = getParentAtTime(timeline, midnightCheck);
        map.set(dateStr, parent === 'M' ? 'Mother' : 'Father');
      }
    } else if (assignments) {
      // Legacy assignments-based approach
      assignments.forEach((a) => {
        map.set(a.dateStr, a.midnightOwner);
      });
    }
    
    return map;
  }, [timeline, assignments]);

  const holidayDates = useMemo(() => {
    const holidays = getSchoolHolidays(year, state);
    const dates = new Set<string>();
    holidays.forEach((holiday) => {
      let current = holiday.start;
      while (current <= holiday.end) {
        dates.add(format(current, 'yyyy-MM-dd'));
        current = addDays(current, 1);
      }
    });
    return dates;
  }, [year, state]);

  // Calculate which months to display based on timeline
  const { startMonth, endMonth, startYear, endYear, showExclusionWarning } = useMemo(() => {
    if (!timeline || timeline.length === 0) {
      return { startMonth: 0, endMonth: 11, startYear: year, endYear: year, showExclusionWarning: false };
    }

    const firstBlock = timeline[0];
    const lastBlock = timeline[timeline.length - 1];
    const startDate = new Date(firstBlock[0]);
    const endDate = new Date(lastBlock[1]);
    
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    
    // Show warning if timeline doesn't start at Jan 1
    const showExclusionWarning = startMonth > 0 || startDate.getDate() > 1;

    return { startMonth, endMonth, startYear, endYear, showExclusionWarning };
  }, [timeline, year]);

  // Generate array of months to display
  const monthsToDisplay = useMemo(() => {
    const months: { year: number; month: number }[] = [];
    
    if (!timeline || timeline.length === 0) {
      // Show all months for the year if no timeline
      for (let m = 0; m < 12; m++) {
        months.push({ year, month: m });
      }
      return months;
    }

    // Add months from start to end across years
    let currentYear = startYear;
    let currentMonth = startMonth;
    
    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
      months.push({ year: currentYear, month: currentMonth });
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
    
    return months;
  }, [timeline, startMonth, endMonth, startYear, endYear]); // Removed 'year' from dependencies

  return (
    <ScrollView style={viewStyles.container} contentContainerStyle={viewStyles.contentContainer}>
      {/* Group months by year */}
      {Array.from(new Set(monthsToDisplay.map(m => m.year))).sort().map(displayYear => {
        const monthsForYear = monthsToDisplay.filter(m => m.year === displayYear);
        
        return (
          <View key={displayYear}>
            <View style={viewStyles.header}>
              <Text style={textStyles.yearTitle}>Care Calendar {displayYear}</Text>
              <View style={viewStyles.legend}>
                <View style={viewStyles.legendItem}>
                  <View style={[viewStyles.legendCircle, { borderColor: fatherColor, borderWidth: fatherColor === userColor ? 2.5 : 1.5 }]} />
                  <Text style={textStyles.legendText}>Father</Text>
                </View>
                <View style={viewStyles.legendItem}>
                  <View style={[viewStyles.legendCircle, { borderColor: motherColor, borderWidth: motherColor === userColor ? 2.5 : 1.5 }]} />
                  <Text style={textStyles.legendText}>Mother</Text>
                </View>
                <View style={viewStyles.legendItem}>
                  <View style={[viewStyles.legendDot, { backgroundColor: '#dbeafe' }]} />
                  <Text style={textStyles.legendText}>School Holiday</Text>
                </View>
              </View>
            </View>

            <View style={viewStyles.monthsGrid}>
              {monthsForYear.map(({ year: monthYear, month }) => (
                <MonthGrid
                  key={`${monthYear}-${month}`}
                  year={monthYear}
                  month={month}
                  assignmentMap={assignmentMap}
                  holidayDates={holidayDates}
                  fatherColor={fatherColor}
                  motherColor={motherColor}
                  excludeBeforeDate={excludeBeforeDate}
                  excludeAfterDate={excludeAfterDate}
                  userColor={userColor}
                />
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

// For PDF generation - returns HTML string
// Updated to support both legacy assignments and new timeline format
export function generateCalendarHTML(
  year: number,
  timelineOrAssignments: TimelineBlock[] | DayAssignment[],
  state: AustralianState,
  motherNights: number,
  fatherNights: number,
  motherPercentage: number,
  fatherPercentage: number,
  fatherColor: string = FATHER_COLOR_DEFAULT,
  motherColor: string = MOTHER_COLOR_DEFAULT
): string {
  // Build assignment map from either timeline or legacy assignments
  const assignmentMap = new Map<string, CareParent>();
  
  // Determine the actual date range from the timeline
  let startDate: Date;
  let endDate: Date;
  let yearsToDisplay: number[] = [year];
  
  // Check if it's a timeline (array of tuples) or assignments (array of objects)
  if (timelineOrAssignments.length > 0 && Array.isArray(timelineOrAssignments[0])) {
    // It's a timeline - convert to assignment map using midnight rule
    const timeline = timelineOrAssignments as TimelineBlock[];
    const firstBlock = timeline[0];
    const lastBlock = timeline[timeline.length - 1];
    startDate = new Date(firstBlock[0]);
    endDate = new Date(lastBlock[1]);
    
    // Calculate total days in the timeline
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + dayIndex);
      const dateStr = format(date, 'yyyy-MM-dd');
      const midnightCheck = new Date(date);
      midnightCheck.setHours(23, 59, 0, 0);
      const parent = getParentAtTime(timeline, midnightCheck);
      assignmentMap.set(dateStr, parent === 'M' ? 'Mother' : 'Father');
    }
    
    // Determine which years to display
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    yearsToDisplay = [];
    for (let y = startYear; y <= endYear; y++) {
      yearsToDisplay.push(y);
    }
  } else {
    // It's legacy assignments
    const assignments = timelineOrAssignments as DayAssignment[];
    assignments.forEach((a) => {
      assignmentMap.set(a.dateStr, a.midnightOwner);
    });
    startDate = new Date(year, 0, 1);
    endDate = new Date(year, 11, 31);
  }

  // Get holidays for all years in the timeline
  const holidayDates = new Set<string>();
  yearsToDisplay.forEach(y => {
    const holidays = getSchoolHolidays(y, state);
    holidays.forEach((holiday) => {
      let current = holiday.start;
      while (current <= holiday.end) {
        holidayDates.add(format(current, 'yyyy-MM-dd'));
        current = addDays(current, 1);
      }
    });
  });

  const generateMonthHTML = (year: number, month: number): string => {
    const firstDay = startOfMonth(new Date(year, month, 1));
    const daysInMonth = getDaysInMonth(firstDay);
    const startDayOfWeek = getDay(firstDay);

    let html = `
      <div class="month">
        <div class="month-title">${MONTH_NAMES[month]}</div>
        <div class="day-labels">
          ${DAY_LABELS.map(l => `<div class="day-label">${l}</div>`).join('')}
        </div>
        <div class="days-grid">
    `;

    for (let i = 0; i < startDayOfWeek; i++) {
      html += '<div class="day-cell empty"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = format(new Date(year, month, day), 'yyyy-MM-dd');
      const careWith = assignmentMap.get(dateStr) || 'Mother';
      const isHoliday = holidayDates.has(dateStr);
      const colorClass = careWith === 'Father' ? 'father' : 'mother';
      const holidayClass = isHoliday ? 'holiday' : '';

      html += `<div class="day-cell ${colorClass} ${holidayClass}"><span>${day}</span></div>`;
    }

    html += '</div></div>';
    return html;
  };

  // Generate months for all years
  const startMonth = startDate.getMonth();
  const endMonth = endDate.getMonth();
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  
  const monthsHTML: string[] = [];
  let currentYear = startYear;
  let currentMonth = startMonth;
  
  while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
    monthsHTML.push(generateMonthHTML(currentYear, currentMonth));
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }

  // Determine title based on years
  const titleYears = yearsToDisplay.length > 1 
    ? `${yearsToDisplay[0]}-${yearsToDisplay[yearsToDisplay.length - 1]}`
    : `${yearsToDisplay[0]}`;
  
  const periodDescription = yearsToDisplay.length > 1
    ? `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
    : `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Care Calendar ${titleYears}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #fff; }
    @media print {
      body { padding: 15px; }
      .year-section { page-break-inside: avoid; break-inside: avoid; }
      .year-title { page-break-after: avoid; break-after: avoid; }
      .months-grid { page-break-inside: avoid; break-inside: avoid; }
      .footer { page-break-inside: avoid; break-inside: avoid; }
    }
    .header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0; }
    .logo { font-size: 14px; color: #64748b; margin-bottom: 5px; }
    .title { font-size: 24px; font-weight: 700; color: #1e293b; }
    .subtitle { font-size: 14px; color: #64748b; margin-top: 5px; }
    .summary { display: flex; justify-content: center; gap: 40px; margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .summary-item { text-align: center; }
    .summary-label { font-size: 12px; color: #64748b; }
    .summary-value { font-size: 20px; font-weight: 700; color: #1e293b; }
    .summary-nights { font-size: 11px; color: #94a3b8; }
    .legend { display: flex; justify-content: center; gap: 20px; margin-bottom: 20px; }
    .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #475569; }
    .legend-dot { width: 12px; height: 12px; border-radius: 50%; }
    .legend-dot.father { background: ${fatherColor}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .legend-dot.mother { background: ${motherColor}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .legend-line { width: 12px; height: 3px; background: #94a3b8; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .year-section { margin-bottom: 30px; page-break-inside: avoid; break-inside: avoid; }
    .year-title { font-size: 20px; font-weight: 700; color: #1e293b; text-align: center; margin-bottom: 15px; padding-top: 20px; border-top: 2px solid #e2e8f0; page-break-after: avoid; break-after: avoid; }
    .year-section:first-child .year-title { border-top: none; padding-top: 0; }
    .months-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; page-break-inside: avoid; break-inside: avoid; }
    .month { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; }
    .month-title { font-size: 12px; font-weight: 600; color: #1e293b; text-align: center; margin-bottom: 8px; }
    .day-labels { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin-bottom: 4px; }
    .day-label { font-size: 9px; color: #94a3b8; text-align: center; }
    .days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
    .day-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 9px; font-weight: 500; color: #fff; position: relative; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .day-cell.empty { background: transparent; }
    .day-cell.father { background: ${fatherColor}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .day-cell.mother { background: ${motherColor}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .day-cell.holiday::after { content: ''; position: absolute; bottom: 1px; left: 25%; right: 25%; height: 2px; background: #475569; border-radius: 1px; }
    .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 10px; color: #94a3b8; page-break-inside: avoid; break-inside: avoid; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Australian Child Support Calculator</div>
    <div class="title">Care Calendar ${titleYears}</div>
    <div class="subtitle">Period: ${periodDescription} | State: ${state} | Generated: ${format(new Date(), 'dd MMM yyyy')}</div>
  </div>
  <div class="summary">
    <div class="summary-item">
      <div class="summary-label">Mother</div>
      <div class="summary-value">${motherPercentage.toFixed(1)}%</div>
      <div class="summary-nights">${Math.round(motherNights / 2)} nights/year</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Father</div>
      <div class="summary-value">${fatherPercentage.toFixed(1)}%</div>
      <div class="summary-nights">${Math.round(fatherNights / 2)} nights/year</div>
    </div>
  </div>
  <div class="legend">
    <div class="legend-item"><div class="legend-dot father"></div> Father's Care</div>
    <div class="legend-item"><div class="legend-dot mother"></div> Mother's Care</div>
    <div class="legend-item"><div class="legend-line"></div> School Holiday</div>
  </div>
  ${yearsToDisplay.map(y => {
    const monthsForYear = monthsHTML.filter((_, idx) => {
      // Calculate which year this month belongs to
      let tempYear = startYear;
      let tempMonth = startMonth;
      for (let i = 0; i < idx; i++) {
        tempMonth++;
        if (tempMonth > 11) {
          tempMonth = 0;
          tempYear++;
        }
      }
      return tempYear === y;
    });
    
    return `
      <div class="year-section">
        ${yearsToDisplay.length > 1 ? `<div class="year-title">${y}</div>` : ''}
        <div class="months-grid">${monthsForYear.join('')}</div>
      </div>
    `;
  }).join('')}
  <div class="footer">This is an estimate based on the interpreted court order. For official assessments, contact Services Australia.<br>auschildsupport.com.au</div>
</body>
</html>`;
}

// Separate view and text styles to avoid type conflicts
const viewStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' } as ViewStyle,
  contentContainer: { padding: 16 } as ViewStyle,
  header: { marginBottom: 20 } as ViewStyle,
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 20, flexWrap: 'wrap' } as ViewStyle,
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 } as ViewStyle,
  legendDot: { width: 14, height: 14, borderRadius: 7 } as ViewStyle,
  legendCircle: { width: 14, height: 14, borderRadius: 7, backgroundColor: 'transparent' } as ViewStyle,
  legendLine: { width: 14, height: 3, borderRadius: 1.5 } as ViewStyle,
  warningBanner: { 
    backgroundColor: '#fef3c7', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b'
  } as ViewStyle,
  monthsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 0 } as ViewStyle,
  monthContainer: {
    width: (Platform.OS === 'web' ? '23%' : '48%') as DimensionValue,
    minWidth: 150,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  } as ViewStyle,
  dayLabelsRow: { flexDirection: 'row', marginBottom: 4 } as ViewStyle,
  weekRow: { flexDirection: 'row' } as ViewStyle,
  dayCell: { flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', padding: 0.5 } as ViewStyle,
  dayCircle: { width: '100%', aspectRatio: 1, borderRadius: 100, alignItems: 'center', justifyContent: 'center' } as ViewStyle,
});

const textStyles = StyleSheet.create({
  yearTitle: { fontSize: 22, fontWeight: '700', color: '#1e293b', textAlign: 'center', marginBottom: 12 } as TextStyle,
  legendText: { fontSize: 12, color: '#475569' } as TextStyle,
  warningText: { fontSize: 13, color: '#92400e', textAlign: 'center' } as TextStyle,
  monthTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b', textAlign: 'center', marginBottom: 8 } as TextStyle,
  dayLabel: { flex: 1, fontSize: 10, color: '#94a3b8', textAlign: 'center' } as TextStyle,
  dayText: { fontSize: 8, fontWeight: '500', color: '#ffffff' } as TextStyle,
});

export default CareCalendar;
