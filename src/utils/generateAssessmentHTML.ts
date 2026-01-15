import { CalculationResults } from './calculator';

// Helper functions
function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function getPayerText(payer: string): string {
    if (payer === 'Parent A') return 'You pay';
    if (payer === 'Parent B') return 'Other parent pays';
    if (payer === 'Neither') return 'No payment required';
    return payer;
}

export interface AssessmentHTMLProps {
    results: CalculationResults;
    supportA?: boolean;
    supportB?: boolean;
    generatedDate?: Date;
}

export function generateAssessmentHTML({
    results,
    supportA = false,
    supportB = false,
    generatedDate = new Date(),
}: AssessmentHTMLProps): string {
    const monthlyAmount = results.finalPaymentAmount / 12;
    const fortnightlyAmount = results.finalPaymentAmount / 26;
    const dailyAmount = results.finalPaymentAmount / 365;

    // CSS Styles
    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      font-size: 10pt;
      color: #334155;
      line-height: 1.5;
      margin: 0 auto;
      padding: 40px 20px;
      background-color: #ffffff;
      max-width: 850px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #2563eb;
    }

    .brand-container {
      display: flex;
      align-items: center;
    }

    .brand-icon {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .brand-icon svg {
      width: 100%;
      height: 100%;
    }

    .brand-name {
      font-size: 16pt;
      font-weight: 700;
      color: #1e3a8a;
      margin: 0;
      line-height: 1.2;
    }

    .brand-tagline {
      font-size: 8pt;
      color: #64748b;
      margin: 0;
    }

    .header-right {
      text-align: right;
    }

    .document-title {
      font-size: 14pt;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
    }

    .document-date {
      font-size: 9pt;
      color: #64748b;
      margin-top: 2px;
    }

    .hero-section {
      background-color: #2563eb;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 20px;
      text-align: center;
      color: #ffffff;
    }

    .hero-label {
      font-size: 12pt;
      margin-bottom: 6px;
    }

    .hero-amount {
      font-size: 36pt;
      font-weight: 700;
      margin-bottom: 4px;
      line-height: 1;
    }

    .hero-subtext {
      font-size: 11pt;
      opacity: 0.9;
    }

    .hero-secondary-row {
      display: flex;
      justify-content: center;
      margin-top: 16px;
      gap: 24px;
    }

    .hero-secondary-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero-secondary-value {
      font-size: 14pt;
      font-weight: 600;
    }

    .hero-secondary-label {
      font-size: 9pt;
      opacity: 0.8;
    }

    .section-title {
      font-size: 12pt;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 12px;
      margin-top: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    th {
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 10px;
      font-size: 9pt;
      font-weight: 600;
      color: #475569;
      text-transform: uppercase;
      text-align: left;
    }

    th.right, td.right {
      text-align: right;
    }

    td {
      padding: 10px;
      font-size: 10pt;
      color: #334155;
      border-bottom: 1px solid #f1f5f9;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .summary-box {
      background-color: #f8fafc;
      border-radius: 6px;
      padding: 16px;
      marginTop: 20px;
      border: 1px solid #e2e8f0;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .summary-row.last {
      margin-bottom: 0;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      margin-top: 4px;
    }

    .summary-label {
      font-size: 10pt;
      color: #64748b;
    }

    .summary-value {
      font-size: 10pt;
      color: #334155;
    }

    .summary-label.bold, .summary-value.bold {
      font-size: 11pt;
      font-weight: 600;
      color: #0f172a;
    }

    .summary-value.bold {
      color: #2563eb;
    }

    .step-card {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }

    .step-header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }

    .step-number {
      background-color: #2563eb;
      color: #ffffff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10pt;
      font-weight: 600;
      margin-right: 10px;
      flex-shrink: 0;
    }

    .step-title {
      font-size: 10pt;
      font-weight: 600;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .step-content {
      padding-left: 38px;
    }

    .step-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .step-row:last-child {
      border-bottom: none;
    }

    .step-label {
      font-size: 9pt;
      color: #64748b;
    }

    .step-value {
      font-size: 9pt;
      color: #0f172a;
      font-weight: 500;
    }

    .step-formula {
      background-color: #f8fafc;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 8pt;
      color: #475569;
      margin: 8px 0;
      font-family: 'Courier New', monospace;
    }

    .percentage-bar {
      display: flex;
      height: 24px;
      border-radius: 4px;
      overflow: hidden;
      margin: 8px 0;
    }

    .percentage-segment {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8pt;
      font-weight: 600;
      color: #ffffff;
    }

    .segment-a {
      background-color: #2563eb;
    }

    .segment-b {
      background-color: #64748b;
    }

    .child-card {
      background-color: #f8fafc;
      border-radius: 4px;
      padding: 10px;
      margin: 8px 0;
    }

    .child-header {
      font-size: 9pt;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 6px;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
    }

    .disclaimer {
      background-color: #f8fafc;
      padding: 16px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    .disclaimer-title {
      font-size: 9pt;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .disclaimer-text {
      font-size: 8pt;
      color: #64748b;
      line-height: 1.6;
    }

    .footer-brand {
      text-align: center;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
    }

    .footer-brand-name {
      font-size: 9pt;
      font-weight: 600;
      color: #2563eb;
    }

    .footer-url {
      font-size: 8pt;
      color: #64748b;
      margin-top: 4px;
    }

    /* Print specific styles */
    @media print {
      body {
        padding: 20px;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page-break { page-break-after: always; }
      .step-card { page-break-inside: avoid; }
      .child-card { page-break-inside: avoid; }
      .special-circumstances-section { page-break-inside: avoid; }
      @page {
        size: A4;
        margin: 1.5cm;
      }
    }
  `;

    // HTML Content
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Assessment Estimate</title>
        <style>${css}</style>
      </head>
      <body>
        <div class="header">
          <div class="brand-container">
            <div class="brand-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                <path d="M7 21h10"/>
                <path d="M12 3v18"/>
                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
              </svg>
            </div>
            <div>
              <h1 class="brand-name">Aus Child Support Calculator</h1>
              <p class="brand-tagline">Services Australia 8-Step Formula</p>
            </div>
          </div>
          <div class="header-right">
            <h2 class="document-title">Assessment Estimate</h2>
            <p class="document-date">Generated ${formatDate(generatedDate)}</p>
          </div>
        </div>

        <div class="hero-section">
          <div class="hero-label">${getPayerText(results.payer)}</div>
          <div class="hero-amount">${formatCurrency(results.finalPaymentAmount)}</div>
          <div class="hero-subtext">per year</div>
          <div class="hero-secondary-row">
            <div class="hero-secondary-item">
              <div class="hero-secondary-value">${formatCurrency(monthlyAmount)}</div>
              <div class="hero-secondary-label">/month</div>
            </div>
            <div class="hero-secondary-item">
              <div class="hero-secondary-value">${formatCurrency(fortnightlyAmount)}</div>
              <div class="hero-secondary-label">/fortnight</div>
            </div>
            <div class="hero-secondary-item">
              <div class="hero-secondary-value">${formatCurrency(dailyAmount)}</div>
              <div class="hero-secondary-label">/day</div>
            </div>
          </div>
          ${supportA || supportB ? `
            <div style="margin-top: 12px; font-size: 9pt; opacity: 0.9;">
              ✓ Income support ${supportA && supportB ? 'applied: You + Other Parent' : supportA ? 'applied: You' : 'applied: Other Parent'}
            </div>
          ` : ''}
        </div>

        <div class="section-title">8-Step Assessment Breakdown</div>
        <div style="font-size: 9pt; color: #64748b; margin-bottom: 16px;">
          This estimate follows the official Services Australia formula. All steps are shown in expanded view.
        </div>

        <!-- STEP 1: Child Support Income -->
        <div class="step-card">
          <div class="step-header">
            <div class="step-number">1</div>
            <div class="step-title">Child Support Income</div>
          </div>
          <div class="step-content">
            <div class="step-row">
              <div class="step-label">Your Adjusted Taxable Income (ATI)</div>
              <div class="step-value">${formatCurrency(results.ATI_A)}</div>
            </div>
            <div class="step-row">
              <div class="step-label">Your Self-Support Amount (SSA)</div>
              <div class="step-value">-${formatCurrency(results.SSA)}</div>
            </div>
            <div class="step-row">
              <div class="step-label">Your Child Support Income (CSI)</div>
              <div class="step-value">${formatCurrency(results.CSI_A)}</div>
            </div>
            <div style="height: 12px;"></div>
            <div class="step-row">
              <div class="step-label">Other Parent's ATI</div>
              <div class="step-value">${formatCurrency(results.ATI_B)}</div>
            </div>
            <div class="step-row">
              <div class="step-label">Other Parent's SSA</div>
              <div class="step-value">-${formatCurrency(results.SSA)}</div>
            </div>
            <div class="step-row">
              <div class="step-label">Other Parent's CSI</div>
              <div class="step-value">${formatCurrency(results.CSI_B)}</div>
            </div>
            ${supportA || supportB ? `
              <div style="margin-top: 12px; padding: 8px; background-color: #fef3c7; border-radius: 4px; font-size: 8pt; color: #92400e;">
                <strong>Income Support Applied:</strong> ${supportA ? 'You receive' : ''} ${supportA && supportB ? ' and ' : ''} ${supportB ? 'Other Parent receives' : ''} income support. CSI is set to $0 for income support recipients.
              </div>
            ` : ''}
          </div>
        </div>

        <!-- STEP 2: Combined Child Support Income -->
        <div class="step-card">
          <div class="step-header">
            <div class="step-number">2</div>
            <div class="step-title">Combined Child Support Income</div>
          </div>
          <div class="step-content">
            <div class="step-formula">
              CCSI = Your CSI + Other Parent's CSI<br>
              CCSI = ${formatCurrency(results.CSI_A)} + ${formatCurrency(results.CSI_B)} = ${formatCurrency(results.CCSI)}
            </div>
            <div class="step-row">
              <div class="step-label">Combined Child Support Income (CCSI)</div>
              <div class="step-value">${formatCurrency(results.CCSI)}</div>
            </div>
          </div>
        </div>

        <!-- STEP 3: Income Percentage -->
        <div class="step-card">
          <div class="step-header">
            <div class="step-number">3</div>
            <div class="step-title">Income Percentage</div>
          </div>
          <div class="step-content">
            <div class="step-formula">
              Your % = (Your CSI ÷ CCSI) × 100<br>
              Your % = (${formatCurrency(results.CSI_A)} ÷ ${formatCurrency(results.CCSI)}) × 100 = ${results.incomePercA.toFixed(1)}%
            </div>
            <div class="percentage-bar">
              <div class="percentage-segment segment-a" style="width: ${results.incomePercA}%;">
                You: ${results.incomePercA.toFixed(1)}%
              </div>
              <div class="percentage-segment segment-b" style="width: ${results.incomePercB}%;">
                Other: ${results.incomePercB.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 4: Care Percentage (per child) -->
        ${results.childResults.map((child, index) => `
          <div class="step-card">
            <div class="step-header">
              <div class="step-number">4${results.childResults.length > 1 ? String.fromCharCode(97 + index) : ''}</div>
              <div class="step-title">Care Percentage - Child ${index + 1} (Age ${child.age})</div>
            </div>
            <div class="step-content">
              <div class="step-row">
                <div class="step-label">Your Care</div>
                <div class="step-value">${child.roundedCareA}%</div>
              </div>
              <div class="step-row">
                <div class="step-label">Other Parent's Care</div>
                <div class="step-value">${child.roundedCareB}%</div>
              </div>
              <div class="percentage-bar">
                <div class="percentage-segment segment-a" style="width: ${child.roundedCareA}%;">
                  ${child.roundedCareA}%
                </div>
                <div class="percentage-segment segment-b" style="width: ${child.roundedCareB}%;">
                  ${child.roundedCareB}%
                </div>
              </div>
            </div>
          </div>
        `).join('')}

        <!-- STEP 5: Cost Percentage (per child) -->
        ${results.childResults.map((child, index) => `
          <div class="step-card">
            <div class="step-header">
              <div class="step-number">5${results.childResults.length > 1 ? String.fromCharCode(97 + index) : ''}</div>
              <div class="step-title">Cost Percentage - Child ${index + 1}</div>
            </div>
            <div class="step-content">
              <div class="step-row">
                <div class="step-label">Your Cost %</div>
                <div class="step-value">${child.costPercA.toFixed(1)}%</div>
              </div>
              <div class="step-row">
                <div class="step-label">Other Parent's Cost %</div>
                <div class="step-value">${child.costPercB.toFixed(1)}%</div>
              </div>
              <div style="margin-top: 8px; font-size: 8pt; color: #64748b;">
                Cost percentage is derived from care percentage using the Services Australia conversion table.
              </div>
            </div>
          </div>
        `).join('')}

        <!-- STEP 6: Child Support Percentage (per child) -->
        ${results.childResults.map((child, index) => `
          <div class="step-card">
            <div class="step-header">
              <div class="step-number">6${results.childResults.length > 1 ? String.fromCharCode(97 + index) : ''}</div>
              <div class="step-title">Child Support Percentage - Child ${index + 1}</div>
            </div>
            <div class="step-content">
              <div class="step-formula">
                CS% = Income% - Cost%<br>
                Your CS% = ${results.incomePercA.toFixed(1)}% - ${child.costPercA.toFixed(1)}% = ${child.childSupportPercA.toFixed(1)}%<br>
                Other CS% = ${results.incomePercB.toFixed(1)}% - ${child.costPercB.toFixed(1)}% = ${child.childSupportPercB.toFixed(1)}%
              </div>
              <div class="step-row">
                <div class="step-label">Your CS%</div>
                <div class="step-value">${child.childSupportPercA.toFixed(1)}%</div>
              </div>
              <div class="step-row">
                <div class="step-label">Other Parent's CS%</div>
                <div class="step-value">${child.childSupportPercB.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        `).join('')}

        <!-- STEP 7: Cost of Children -->
        <div class="step-card">
          <div class="step-header">
            <div class="step-number">7</div>
            <div class="step-title">Cost of Children</div>
          </div>
          <div class="step-content">
            ${results.childResults.map((child, index) => `
              <div class="child-card">
                <div class="child-header">Child ${index + 1} (Age ${child.age})</div>
                <div class="step-row">
                  <div class="step-label">Cost per child</div>
                  <div class="step-value">${formatCurrency(child.costPerChild)}</div>
                </div>
              </div>
            `).join('')}
            <div class="step-row" style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #e2e8f0;">
              <div class="step-label"><strong>Total Cost of Children</strong></div>
              <div class="step-value"><strong>${formatCurrency(results.totalCost)}</strong></div>
            </div>
          </div>
        </div>

        <!-- STEP 8: Annual Rate -->
        <div class="step-card">
          <div class="step-header">
            <div class="step-number">8</div>
            <div class="step-title">Annual Rate</div>
          </div>
          <div class="step-content">
            ${results.childResults.map((child, index) => {
              const rateLabel = child.farAppliedA || child.farAppliedB ? 'Fixed Annual Rate' : 
                               child.marAppliedA || child.marAppliedB ? 'Minimum Annual Rate' : 
                               'Standard Rate';
              return `
              <div class="child-card">
                <div class="child-header">Child ${index + 1} - ${rateLabel}</div>
                <div class="step-formula">
                  Annual Amount = Cost per Child × CS%<br>
                  ${child.childSupportPercA >= 0 ? `Your liability = ${formatCurrency(child.costPerChild)} × ${child.childSupportPercA.toFixed(1)}% = ${formatCurrency(child.liabilityA)}` : ''}
                  ${child.childSupportPercB >= 0 ? `<br>Other liability = ${formatCurrency(child.costPerChild)} × ${child.childSupportPercB.toFixed(1)}% = ${formatCurrency(child.liabilityB)}` : ''}
                </div>
              </div>
            `;
            }).join('')}
            ${results.rateApplied !== 'None' ? `
              <div style="margin: 12px 0; padding: 10px; background-color: #fef3c7; border-radius: 4px; font-size: 8pt; color: #92400e;">
                <strong>Special Rate Applied:</strong> ${results.rateApplied}
              </div>
            ` : ''}
            <div class="step-row" style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #e2e8f0;">
              <div class="step-label"><strong>Total Annual Liability</strong></div>
              <div class="step-value"><strong>${formatCurrency(results.finalPaymentAmount)}</strong></div>
            </div>
          </div>
        </div>

        <div class="footer">
          <div class="disclaimer">
            <div class="disclaimer-title">General Information Only</div>
            <div class="disclaimer-text">
              This estimate is for general information purposes only and does not constitute legal or financial advice.
              The calculation is based on the Services Australia 8-step formula and may not reflect your actual
              assessment. For accurate assessments, contact Services Australia or consult a family law professional.
            </div>
          </div>
          <div class="footer-brand">
            <div class="footer-brand-name">Aus Child Support Calculator</div>
            <div class="footer-url">auschildsupport.com</div>
          </div>
        </div>
      </body>
    </html>
  `;
}
