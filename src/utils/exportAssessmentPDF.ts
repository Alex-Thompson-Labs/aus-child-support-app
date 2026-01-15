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
    console.log('[PDF Export] Starting PDF generation...');
    const html = generateAssessmentHTML({
      results,
      supportA,
      supportB,
      generatedDate: new Date(),
    });
    
    console.log('[PDF Export] HTML generated, length:', html.length);
    
    // Open HTML in new window for viewing and printing
    if (typeof window !== 'undefined') {
      const pdfWindow = window.open('', '_blank');
      if (pdfWindow) {
        pdfWindow.document.write(html);
        pdfWindow.document.close();
        console.log('[PDF Export] Assessment opened in new window');
        return;
      }
    }
    
    // Fallback to print dialog if window.open fails
    console.log('[PDF Export] Calling Print.printAsync...');
    await Print.printAsync({
      html,
      ...(process.env.EXPO_OS === 'ios' && {
        width: 595,
        height: 842,
        orientation: Print.Orientation.portrait,
      }),
    });
    
    console.log('[PDF Export] Print dialog opened successfully');
  } catch (error) {
    console.error('[PDF Export] Failed to generate PDF:', error);
    console.error('[PDF Export] Error details:', JSON.stringify(error, null, 2));
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
