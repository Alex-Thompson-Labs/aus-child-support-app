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

    await Print.printAsync({
      html,
      // On iOS, we can optimize for A4. On web, it respects CSS Print media rules.
      ...(process.env.EXPO_OS === 'ios' && {
        width: 595, // A4 width in points
        height: 842, // A4 height in points
        orientation: Print.Orientation.portrait,
      }),
    });
  } catch (error) {
    console.error('Failed to generate PDF:', error);
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
