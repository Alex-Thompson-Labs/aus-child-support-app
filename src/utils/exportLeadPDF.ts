/**
 * Lead PDF Export Utility
 *
 * Generates professional PDF documents for lead details
 * Includes: parent contact, case summary, CoA reasons, calculation data
 *
 * OPTIMIZATION: expo-print and expo-sharing are dynamically imported
 * to avoid bundling ~150KB in the main chunk (admin-only feature)
 *
 * ============================================================================
 * Function Documentation
 * ============================================================================
 *
 * exportLeadAsPDF(lead: LeadSubmission): Promise<void>
 *
 * Caller:
 * - app/admin/lead/[id].tsx (line 244) - Admin lead detail screen
 *   Triggered by "Export PDF" button in admin interface
 *
 * Parameters:
 * - lead: LeadSubmission - Complete lead data from Supabase database
 *   Required fields:
 *   - id: string - Lead unique identifier
 *   - parent_name: string - Parent's full name
 *   - parent_email: string - Parent's email address
 *   - parent_phone?: string | null - Optional phone number
 *   - location?: string | null - Postcode/location
 *   - income_parent_a: number - Parent A's adjusted taxable income
 *   - income_parent_b: number - Parent B's adjusted taxable income
 *   - children_count: number - Number of children
 *   - annual_liability: number - Calculated annual child support amount
 *   - care_data?: Array<{index: number, careA: number, careB: number}> | null
 *   - complexity_reasons?: string[] - Array of CoA reason IDs
 *   - complexity_trigger?: string - Primary trigger type
 *   - financial_tags?: string[] | null - Selected financial issue tags
 *   - parent_message?: string | null - Compiled message from inquiry form
 *   - status?: string - Lead status ('new', 'reviewing', 'sent', 'converted', 'lost')
 *   - notes?: string | null - Admin notes
 *   - created_at?: string - ISO timestamp
 *
 * Platform Behavior:
 * - Web: Opens print dialog with generated HTML (window.print())
 * - Mobile: Uses expo-print to generate PDF file, then expo-sharing to share
 *
 * PDF Content Sections:
 * 1. Header - Lead ID, status badge, generation timestamp
 * 2. Parent Contact - Name, email, phone, location, submission date
 * 3. Case Summary - Incomes, combined income, children count, annual liability
 * 4. Care Arrangement - Table showing care percentages per child (if available)
 * 5. Change of Assessment Grounds - Grouped by category (urgent, income, child, other)
 * 6. Complexity Triggers - List of trigger types (if available)
 * 7. Parent's Message - Full message text from inquiry form
 * 8. Admin Notes - Internal notes (if available)
 * 9. Footer - Branding and confidentiality notice
 *
 * Error Handling:
 * - Throws error if print window fails to open (web)
 * - Throws error if PDF generation fails (mobile)
 * - Throws error if sharing not available (mobile)
 * - All errors are logged and re-thrown for caller to handle
 *
 * Dependencies:
 * - getCoAReasonById() - Converts CoA reason IDs to full reason objects
 * - formatCurrency() - Formats numbers as currency strings
 * - LeadSubmission type from supabase.ts
 */

import { Platform } from 'react-native';
import { formatCurrency } from './formatters';
import { getSpecialCircumstanceById } from './special-circumstances';
import type { LeadSubmission } from './supabase';

/**
 * Format date for display
 */
function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get status badge color
 */
function getStatusColor(status?: string): string {
  switch (status) {
    case 'new':
      return '#3b82f6'; // blue
    case 'reviewing':
      return '#f59e0b'; // amber
    case 'sent':
      return '#8b5cf6'; // purple
    case 'converted':
      return '#10b981'; // green
    case 'lost':
      return '#64748b'; // slate
    default:
      return '#3b82f6'; // blue
  }
}

/**
 * Get category color and emoji
 */
function getCategoryInfo(category: string): {
  color: string;
  emoji: string;
  title: string;
} {
  switch (category) {
    case 'urgent':
      return { color: '#ef4444', emoji: '⚠️', title: 'Urgent Matters' };
    case 'income':
      return { color: '#f59e0b', emoji: '💰', title: 'Income Issues' };
    case 'child':
      return { color: '#8b5cf6', emoji: '👶', title: 'Child-Related' };
    case 'other':
      return { color: '#3b82f6', emoji: '📋', title: 'Other Factors' };
    default:
      return { color: '#64748b', emoji: '📋', title: 'Other' };
  }
}

/**
 * Generate HTML content for PDF
 */
function generateLeadHTML(lead: LeadSubmission, userId: string = 'system'): string {
  // Extract Special Circumstances from complexity_reasons array and convert IDs to full objects
  const circumstanceIds = lead.complexity_reasons || [];
  const specialCircumstances = circumstanceIds
    .map((id) => getSpecialCircumstanceById(id))
    .filter((reason): reason is NonNullable<typeof reason> => reason !== null);

  // Group Special Circumstances by category
  const urgentReasons = specialCircumstances.filter(
    (r) => r.category === 'urgent'
  );
  const incomeReasons = specialCircumstances.filter(
    (r) => r.category === 'income'
  );
  const childReasons = specialCircumstances.filter(
    (r) => r.category === 'child'
  );
  const otherReasons = specialCircumstances.filter(
    (r) => r.category === 'other'
  );

  // Generate care arrangement details
  let careArrangementHTML = '';
  if (lead.care_data && lead.care_data.length > 0) {
    const careRows = lead.care_data
      .map(
        (child, idx) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Child ${idx + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${child.careA.toFixed(0)}%</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${child.careB.toFixed(0)}%</td>
        </tr>
      `
      )
      .join('');

    careArrangementHTML = `
      <div style="margin-bottom: 24px;">
        <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; margin-bottom: 12px;">Care Arrangement</h3>
        <table style="width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Child</th>
              <th style="padding: 10px; text-align: center; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Parent A Care</th>
              <th style="padding: 10px; text-align: center; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Parent B Care</th>
            </tr>
          </thead>
          <tbody>
            ${careRows}
          </tbody>
        </table>
      </div>
    `;
  }

  // Generate CoA reasons section
  const generateCoASectionHTML = (reasons: any[], category: string) => {
    if (reasons.length === 0) return '';

    const categoryInfo = getCategoryInfo(category);
    const reasonsHTML = reasons
      .map(
        (r) => `
        <div style="margin-bottom: 16px; padding: 12px; background: #f9fafb; border-left: 4px solid ${categoryInfo.color}; border-radius: 4px;">
          <div style="display: flex; align-items: start; margin-bottom: 6px;">
            <span style="font-size: 18px; margin-right: 8px;">${categoryInfo.emoji}</span>
            <strong style="color: #1f2937; font-size: 14px;">${r.label}</strong>
          </div>
          <p style="color: #6b7280; font-size: 13px; margin: 6px 0 6px 26px; line-height: 1.5;">${r.description}</p>
          ${r.officialCodes ? `<p style="color: #6b7280; font-size: 11px; font-style: italic; margin: 4px 0 0 26px;">Official grounds: ${r.officialCodes}</p>` : ''}
        </div>
      `
      )
      .join('');

    return `
      <div style="margin-bottom: 16px;">
        <h4 style="color: ${categoryInfo.color}; font-size: 14px; font-weight: 600; margin-bottom: 12px;">
          ${categoryInfo.emoji} ${categoryInfo.title}
        </h4>
        ${reasonsHTML}
      </div>
    `;
  };

  const specialCircumstancesHTML =
    specialCircumstances.length > 0
      ? `
    <div style="margin-bottom: 32px; page-break-inside: avoid;">
      <h2 style="color: #1f2937; font-size: 20px; font-weight: 700; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 3px solid #f59e0b;">
        💭 Special Circumstances
      </h2>
      <div style="background: white; padding: 16px; border: 2px solid ${urgentReasons.length > 0 ? '#ef4444' : '#e5e7eb'}; border-radius: 8px;">
        <p style="color: #6b7280; font-size: 13px; margin-bottom: 16px; line-height: 1.5;">
          The following special circumstances were identified:
        </p>
        ${generateCoASectionHTML(urgentReasons, 'urgent')}
        ${generateCoASectionHTML(incomeReasons, 'income')}
        ${generateCoASectionHTML(childReasons, 'child')}
        ${generateCoASectionHTML(otherReasons, 'other')}
      </div>
    </div>
  `
      : '';

  // Generate complexity triggers section
  const complexityTriggersHTML =
    lead.complexity_reasons && lead.complexity_reasons.length > 0
      ? `
    <div style="margin-bottom: 24px;">
      <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; margin-bottom: 12px;">Complexity Triggers</h3>
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 4px;">
        <ul style="margin: 0; padding-left: 20px; color: #92400e;">
          ${lead.complexity_reasons.map((reason) => `<li style="margin-bottom: 4px;">${reason}</li>`).join('')}
        </ul>
      </div>
    </div>
  `
      : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lead Report - ${lead.parent_name}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background: #ffffff;
            padding: 40px;
          }
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            font-weight: 700;
            color: rgba(229, 231, 235, 0.5);
            pointer-events: none;
            z-index: 9999;
            white-space: nowrap;
            text-align: center;
            user-select: none;
            width: 100%;
          }
          .watermark-text {
            display: block;
            font-size: 24px;
            margin-top: 10px;
            color: rgba(156, 163, 175, 0.5);
          }
          @media print {
            body {
              padding: 20px;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <!-- Watermark -->
        <div class="watermark">
          CONFIDENTIAL
          <span class="watermark-text">Exported by ${userId} on ${new Date().toLocaleString('en-AU')}</span>
        </div>

        <!-- Header -->
        <div style="margin-bottom: 32px; padding-bottom: 24px; border-bottom: 4px solid #2563eb;">
          <h1 style="color: #1f2937; font-size: 28px; font-weight: 700; margin-bottom: 8px;">
            Lead Report
          </h1>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <p style="color: #6b7280; font-size: 14px;">
              Generated: ${formatDate(new Date().toISOString())}
            </p>
            <div style="display: inline-block; padding: 6px 12px; background: ${getStatusColor(lead.status)}; color: white; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
              ${lead.status || 'new'}
            </div>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 8px; font-family: monospace;">
            Lead ID: #${lead.id?.slice(0, 8)}
          </p>
        </div>

        <!-- Parent Contact Information -->
        <div style="margin-bottom: 32px; page-break-inside: avoid;">
          <h2 style="color: #1f2937; font-size: 20px; font-weight: 700; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 3px solid #2563eb;">
            📞 Parent Contact Information
          </h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <div style="margin-bottom: 12px;">
              <strong style="color: #6b7280; font-size: 13px; display: block; margin-bottom: 4px;">Name:</strong>
              <p style="color: #1f2937; font-size: 16px; font-weight: 600;">${lead.parent_name}</p>
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #6b7280; font-size: 13px; display: block; margin-bottom: 4px;">Email:</strong>
              <p style="color: #2563eb; font-size: 14px;">
                <a href="mailto:${lead.parent_email}" style="color: #2563eb; text-decoration: none;">${lead.parent_email}</a>
              </p>
            </div>
            ${lead.parent_phone
      ? `
              <div style="margin-bottom: 12px;">
                <strong style="color: #6b7280; font-size: 13px; display: block; margin-bottom: 4px;">Phone:</strong>
                <p style="color: #1f2937; font-size: 14px;">
                  <a href="tel:${lead.parent_phone}" style="color: #2563eb; text-decoration: none;">${lead.parent_phone}</a>
                </p>
              </div>
            `
      : ''
    }
            ${lead.location
      ? `
              <div style="margin-bottom: 12px;">
                <strong style="color: #6b7280; font-size: 13px; display: block; margin-bottom: 4px;">Location:</strong>
                <p style="color: #1f2937; font-size: 14px;">${lead.location}</p>
              </div>
            `
      : ''
    }
            <div>
              <strong style="color: #6b7280; font-size: 13px; display: block; margin-bottom: 4px;">Submitted:</strong>
              <p style="color: #1f2937; font-size: 14px;">${formatDate(lead.created_at)}</p>
            </div>
          </div>
        </div>

        <!-- Case Summary -->
        <div style="margin-bottom: 32px; page-break-inside: avoid;">
          <h2 style="color: #1f2937; font-size: 20px; font-weight: 700; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 3px solid #2563eb;">
            📊 Case Summary
          </h2>
          <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;">
              <div>
                <strong style="color: #6b7280; font-size: 13px; display: block; margin-bottom: 4px;">Parent A Income:</strong>
                <p style="color: #1f2937; font-size: 16px; font-weight: 600;">${formatCurrency(lead.income_parent_a)}/year</p>
              </div>
              <div>
                <strong style="color: #6b7280; font-size: 13px; display: block; margin-bottom: 4px;">Parent B Income:</strong>
                <p style="color: #1f2937; font-size: 16px; font-weight: 600;">${formatCurrency(lead.income_parent_b)}/year</p>
              </div>
              <div>
                <strong style="color: #6b7280; font-size: 13px; display: block; margin-bottom: 4px;">Combined Income:</strong>
                <p style="color: #1f2937; font-size: 16px; font-weight: 600;">${formatCurrency(lead.income_parent_a + lead.income_parent_b)}/year</p>
              </div>
              <div>
                <strong style="color: #6b7280; font-size: 13px; display: block; margin-bottom: 4px;">Number of Children:</strong>
                <p style="color: #1f2937; font-size: 16px; font-weight: 600;">${lead.children_count}</p>
              </div>
            </div>
            <div style="background: #eff6ff; border: 2px solid #2563eb; padding: 16px; border-radius: 8px; margin-top: 16px;">
              <strong style="color: #1e40af; font-size: 13px; display: block; margin-bottom: 4px;">Estimated Annual Child Support:</strong>
              <p style="color: #1e40af; font-size: 24px; font-weight: 700;">${formatCurrency(lead.annual_liability)}/year</p>
              <p style="color: #3b82f6; font-size: 13px; margin-top: 4px;">
                (${formatCurrency(lead.annual_liability / 12)}/month)
              </p>
            </div>
          </div>
        </div>

        ${careArrangementHTML}

        ${specialCircumstancesHTML}

        ${complexityTriggersHTML}

        <!-- Parent Message -->
        ${lead.parent_message
      ? `
          <div style="margin-bottom: 32px; page-break-inside: avoid;">
            <h2 style="color: #1f2937; font-size: 20px; font-weight: 700; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 3px solid #2563eb;">
              💬 Parent's Message
            </h2>
            <div style="background: #f9fafb; padding: 20px; border-left: 4px solid #2563eb; border-radius: 4px;">
              <p style="color: #374151; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${lead.parent_message}</p>
            </div>
          </div>
        `
      : ''
    }

        <!-- Admin Notes -->
        ${lead.notes
      ? `
          <div style="margin-bottom: 32px; page-break-inside: avoid;">
            <h2 style="color: #1f2937; font-size: 20px; font-weight: 700; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 3px solid #64748b;">
              📝 Admin Notes
            </h2>
            <div style="background: #f1f5f9; padding: 20px; border-left: 4px solid #64748b; border-radius: 4px;">
              <p style="color: #334155; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${lead.notes}</p>
            </div>
          </div>
        `
      : ''
    }

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 24px; border-top: 2px solid #e5e7eb; text-align: center;">
          <p style="color: #6b7280; font-size: 12px; margin-bottom: 4px;">
            Australian Child Support Calculator
          </p>
          <p style="color: #6b7280; font-size: 12px;">
            <a href="https://auschildsupport.com" style="color: #2563eb; text-decoration: none;">auschildsupport.com</a>
          </p>
          <p style="color: #d1d5db; font-size: 11px; margin-top: 8px;">
            This document is confidential and intended for authorized recipients only.
          </p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Export lead as PDF
 *
 * @param lead - Lead submission data to export
 * @returns Promise<void>
 */
export async function exportLeadAsPDF(lead: LeadSubmission, userId: string = 'system'): Promise<void> {
  try {
    console.log('[ExportPDF] Generating PDF for lead:', lead.id);

    // Generate HTML content
    const html = generateLeadHTML(lead, userId);

    if (Platform.OS === 'web') {
      // Web platform: Use print dialog or download as HTML
      console.log('[ExportPDF] Using web platform export');

      // Open print dialog with the HTML content
      const printWindow = window.open('', '_blank');

      if (!printWindow) {
        throw new Error(
          'Failed to open print window. Please allow popups for this site.'
        );
      }

      printWindow.document.write(html);
      printWindow.document.close();

      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        printWindow.print();
      };

      console.log('[ExportPDF] Print dialog opened');
      return;
    }

    // Mobile platforms: Use expo-print (dynamically imported)
    console.log('[ExportPDF] Using expo-print for mobile');

    // Dynamic imports to avoid bundling in main chunk
    const [Print, Sharing] = await Promise.all([
      import('expo-print'),
      import('expo-sharing'),
    ]);

    const result = await Print.printToFileAsync({
      html,
      base64: false,
    });

    // Check if result is valid
    if (!result || !result.uri) {
      throw new Error('Failed to generate PDF file');
    }

    const { uri } = result;
    console.log('[ExportPDF] PDF generated at:', uri);

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();

    if (!isAvailable) {
      console.warn('[ExportPDF] Sharing not available on this platform');
      throw new Error('PDF sharing is not supported on this device');
    }

    // Share the PDF
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Lead Report - ${lead.parent_name}`,
      UTI: 'com.adobe.pdf',
    });

    console.log('[ExportPDF] PDF shared successfully');
  } catch (error) {
    console.error('[ExportPDF] Error generating PDF:', error);
    throw error;
  }
}
