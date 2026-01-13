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

    // CSS Styles
    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      font-size: 10pt;
      color: #334155;
      line-height: 1.5;
      margin: 0;
      padding: 40px;
      background-color: #ffffff;
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
      width: 32px;
      height: 32px;
      background-color: #2563eb;
      border-radius: 6px;
      margin-right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      font-size: 16pt;
      font-weight: 700;
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

    .footer {
      position: absolute;
      bottom: 30px;
      left: 40px;
      right: 40px;
    }

    .footer-divider {
      border-top: 1px solid #e2e8f0;
      margin-bottom: 12px;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .disclaimer {
      flex: 1;
      padding-right: 20px;
    }

    .disclaimer-title {
      font-size: 8pt;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 4px;
    }

    .disclaimer-text {
      font-size: 7pt;
      color: #94a3b8;
      line-height: 1.4;
    }

    .footer-right {
      text-align: right;
      white-space: nowrap;
    }

    .footer-brand {
      font-size: 8pt;
      font-weight: 600;
      color: #2563eb;
    }

    .footer-url {
      font-size: 7pt;
      color: #64748b;
      margin-top: 2px;
    }

    /* Print specific styles */
    @media print {
      body {
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page-break { page-break-after: always; }
      @page {
        size: A4;
        margin: 2cm;
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
            <div class="brand-icon">A</div>
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
              <div class="hero-secondary-label">per month</div>
            </div>
            <div class="hero-secondary-item">
              <div class="hero-secondary-value">${formatCurrency(fortnightlyAmount)}</div>
              <div class="hero-secondary-label">per fortnight</div>
            </div>
          </div>
        </div>

        <div class="section-title">Income Summary</div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="right">You (Parent A)</th>
              <th class="right">Other Parent (B)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adjusted Taxable Income</td>
              <td class="right">${formatCurrency(results.ATI_A)}</td>
              <td class="right">${formatCurrency(results.ATI_B)}</td>
            </tr>
            <tr>
              <td>Child Support Income</td>
              <td class="right">${formatCurrency(results.CSI_A)}</td>
              <td class="right">${formatCurrency(results.CSI_B)}</td>
            </tr>
            <tr>
              <td>Income Percentage</td>
              <td class="right">${results.incomePercA.toFixed(1)}%</td>
              <td class="right">${results.incomePercB.toFixed(1)}%</td>
            </tr>
            ${(supportA || supportB) ? `
              <tr>
                <td>Income Support</td>
                <td class="right">${supportA ? 'Yes' : 'No'}</td>
                <td class="right">${supportB ? 'Yes' : 'No'}</td>
              </tr>
            ` : ''}
          </tbody>
        </table>

        ${results.childResults.length > 0 ? `
          <div class="section-title">Care Arrangement</div>
          <table>
            <thead>
              <tr>
                <th>Child</th>
                <th class="right">Your Care %</th>
                <th class="right">Other Parent %</th>
                <th class="right">Cost Share</th>
              </tr>
            </thead>
            <tbody>
              ${results.childResults.map((child, index) => `
                <tr>
                  <td>Child ${index + 1} (Age ${child.age})</td>
                  <td class="right">${child.roundedCareA}%</td>
                  <td class="right">${child.roundedCareB}%</td>
                  <td class="right">${formatCurrency(child.costPerChild)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}

        <div class="summary-box">
          <div class="summary-row">
            <div class="summary-label">Combined Child Support Income</div>
            <div class="summary-value">${formatCurrency(results.CCSI)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">Total Cost of Children</div>
            <div class="summary-value">${formatCurrency(results.totalCost)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">Self-Support Amount (each parent)</div>
            <div class="summary-value">${formatCurrency(results.SSA)}</div>
          </div>
          ${results.rateApplied !== 'None' ? `
            <div class="summary-row">
              <div class="summary-label">Rate Applied</div>
              <div class="summary-value">${results.rateApplied}</div>
            </div>
          ` : ''}
          <div class="summary-row last">
            <div class="summary-label bold">Annual Child Support Liability</div>
            <div class="summary-value bold">${formatCurrency(results.finalPaymentAmount)}</div>
          </div>
        </div>

        <div class="footer">
          <div class="footer-divider"></div>
          <div class="footer-content">
            <div class="disclaimer">
              <div class="disclaimer-title">GENERAL INFORMATION ONLY</div>
              <div class="disclaimer-text">
                This estimate is for general information purposes only and does not constitute legal or financial advice.
                The calculation is based on the Services Australia 8-step formula and may not reflect your actual
                assessment. For accurate assessments, contact Services Australia or consult a family law professional.
              </div>
            </div>
            <div class="footer-right">
              <div class="footer-brand">Aus Child Support Calculator</div>
              <div class="footer-url">auschildsupport.com</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
