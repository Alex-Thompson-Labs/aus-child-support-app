/**
 * Assessment PDF Export Utility
 *
 * Generates professional PDF documents for calculator assessment results.
 * Uses expo-print to generate PDF from HTML content.
 * Compatible with both Web (Browser Print) and Mobile (Native Print).
 */

import * as Print from 'expo-print';
import type { CalculationResults } from './calculator';
import { generateAssessmentHTML } from './generateAssessmentHTML';

/**
 * Props for PDF generation
 */
export interface ExportAssessmentPDFProps {
  results: CalculationResults;
  supportA?: boolean;
  supportB?: boolean;
}

/**
 * Generate and download/print assessment PDF
 *
 * Web: Opens browser print dialog (user selects "Save as PDF")
 * Mobile: Opens native print preview (user shares/saves PDF)
 */
export async function exportAssessmentPDF({
  results,
  supportA = false,
  supportB = false,
}: ExportAssessmentPDFProps): Promise<void> {
  try {
    const html = generateAssessmentHTML({
      results,
      supportA,
      supportB,
      generatedDate: new Date(),
    });
    
    // Open HTML in new window for viewing and printing
    if (typeof window !== 'undefined') {
      const pdfWindow = window.open('', '_blank');
      if (pdfWindow) {
        pdfWindow.document.write(html);
        pdfWindow.document.close();
        return;
      }
    }
    
    // Fallback to print dialog if window.open fails
    await Print.printAsync({
      html,
      ...(process.env.EXPO_OS === 'ios' && {
        width: 595,
        height: 842,
        orientation: Print.Orientation.portrait,
      }),
    });
  } catch (error) {
    // TODO: Replace with proper error reporting service
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Check if PDF export is available on current platform
 * Now available on all platforms via expo-print
 */
export function isPDFExportAvailable(): boolean {
  return true;
}
