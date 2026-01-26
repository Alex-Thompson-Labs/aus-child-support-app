/**
 * Assessment PDF Export Utility
 *
 * Generates professional PDF documents for calculator assessment results.
 * Uses expo-print to generate PDF from HTML content (lazy loaded).
 * Compatible with both Web (Browser Print) and Mobile (Native Print).
 */

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
 * Lazy load expo-print to avoid including it in the initial bundle
 * This saves ~50-80 KB from the initial bundle size
 */
async function loadExpoPrint() {
  try {
    const Print = await import('expo-print');
    return Print;
  } catch (error) {
    console.error('Failed to load expo-print:', error);
    throw new Error('PDF export feature is temporarily unavailable. Please try again later.');
  }
}

/**
 * Generate and download/print assessment PDF
 *
 * Web: Opens browser print dialog (user selects "Save as PDF")
 * Mobile: Opens native print preview (user shares/saves PDF)
 * 
 * Note: This function lazy loads expo-print on first use to reduce initial bundle size
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
    // Lazy load expo-print only when needed
    const Print = await loadExpoPrint();
    await Print.printAsync({
      html,
      ...(process.env.EXPO_OS === 'ios' && {
        width: 595,
        height: 842,
        orientation: Print.Orientation.portrait,
      }),
    });
  } catch (error) {
    // Re-throw with user-friendly message if it's our custom error
    if (error instanceof Error && error.message.includes('temporarily unavailable')) {
      throw error;
    }
    // Otherwise, throw generic error
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Check if PDF export is available on current platform
 * Now available on all platforms via expo-print (lazy loaded)
 */
export function isPDFExportAvailable(): boolean {
  return true;
}
