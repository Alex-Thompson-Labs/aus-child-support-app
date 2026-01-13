import { format, getDay, getDaysInMonth, startOfMonth } from 'date-fns';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { AustralianState, CareCalculationResult } from './CareCalculator';

export async function generateCareCalendarPDF(
    result: CareCalculationResult,
    year: number,
    state: AustralianState
) {
    // 1. Prepare HTML Content

    // Helper to Render a Month Grid in HTML
    const renderMonthHTML = (monthIndex: number) => {
        const date = new Date(year, monthIndex, 1);
        const monthName = format(date, 'MMMM');
        const daysInMonth = getDaysInMonth(date);
        const startDay = getDay(startOfMonth(date)); // 0=Sun

        let daysHTML = '';

        // Padding
        for (let i = 0; i < startDay; i++) {
            daysHTML += `<div class="day-cell empty"></div>`;
        }

        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const currentDate = new Date(year, monthIndex, d);
            const dateStr = format(currentDate, 'yyyy-MM-dd');
            const assignment = result.assignments.find(a => a.dateStr === dateStr);

            let bgClass = 'neutral';
            if (assignment?.midnightOwner === 'Mother') bgClass = 'mother';
            if (assignment?.midnightOwner === 'Father') bgClass = 'father';

            const isHoliday = assignment?.reason.startsWith('holiday:') ? 'holiday' : '';

            daysHTML += `<div class="day-cell ${bgClass} ${isHoliday}">${d}</div>`;
        }

        return `
      <div class="month-container">
        <div class="month-title">${monthName}</div>
        <div class="days-grid">
            <div class="day-header">S</div><div class="day-header">M</div><div class="day-header">T</div><div class="day-header">W</div><div class="day-header">T</div><div class="day-header">F</div><div class="day-header">S</div>
            ${daysHTML}
        </div>
      </div>
    `;
    };

    const allMonthsHTML = Array.from({ length: 12 }, (_, i) => renderMonthHTML(i)).join('');

    const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; }
            h1 { text-align: center; color: #0f172a; margin-bottom: 10px; }
            .subtitle { text-align: center; color: #64748b; margin-bottom: 30px; }
            
            .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .summary-table th { text-align: left; padding: 12px; background: #f1f5f9; color: #475569; font-size: 12px; text-transform: uppercase; }
            .summary-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; }
            .stat-value { font-size: 18px; }
            
            .legend { display: flex; justify-content: center; gap: 20px; margin-bottom: 30px; }
            .legend-item { display: flex; align-items: center; font-size: 12px; }
            .dot { width: 12px; height: 12px; border-radius: 4px; margin-right: 6px; }
            .dot.mother { background: #f472b6; }
            .dot.father { background: #60a5fa; }
            .dot.holiday { border: 2px solid #f59e0b; box-sizing: border-box; }
            
            .calendar-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; row-gap: 30px; }
            
            .month-container { break-inside: avoid; }
            .month-title { font-weight: 700; text-align: center; margin-bottom: 8px; font-size: 14px; }
            
            .days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
            .day-header { font-size: 8px; text-align: center; color: #94a3b8; font-weight: 700; margin-bottom: 2px; }
            .day-cell { 
                aspect-ratio: 1; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 9px; 
                border-radius: 2px; 
                background: #f1f5f9;
                color: #334155;
            }
            .day-cell.mother { background: #f472b6; color: white; }
            .day-cell.father { background: #60a5fa; color: white; }
            .day-cell.holiday { border: 2px solid #f59e0b; }
            .day-cell.empty { background: transparent; }
            
            .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Care Arrangement Calendar ${year}</h1>
        <div class="subtitle">Generated for State: ${state}</div>
        
        <table class="summary-table">
            <thead>
                <tr>
                    <th>Parent</th>
                    <th>Nights / Year</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Mother</td>
                    <td class="stat-value">${result.motherNightsPerYear}</td>
                    <td class="stat-value">${result.motherPercentage}%</td>
                </tr>
                <tr>
                    <td>Father</td>
                    <td class="stat-value">${result.fatherNightsPerYear}</td>
                    <td class="stat-value">${result.fatherPercentage}%</td>
                </tr>
            </tbody>
        </table>
        
        <div class="legend">
            <div class="legend-item"><div class="dot mother"></div>Mother</div>
            <div class="legend-item"><div class="dot father"></div>Father</div>
            <div class="legend-item"><div class="dot holiday"></div>Holiday Rule Applies</div>
        </div>
        
        <div class="calendar-grid">
            ${allMonthsHTML}
        </div>
        
        <div class="footer">
            Generated by AI Court Order Interpreter • ${new Date().toLocaleDateString()}
        </div>
      </body>
    </html>
  `;

    // 2. Generate PDF
    const { uri } = await printToFileAsync({
        html,
        base64: false,
    });

    // 3. Share PDF
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
}
