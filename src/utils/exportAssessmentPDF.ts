/**
 * Assessment PDF Export Utility
 *
 * Generates professional PDF documents for calculator assessment results.
 * Uses @react-pdf/renderer for web platform.
 *
 * IMPORTANT: This is a web-only feature. Mobile platforms should continue
 * using expo-print for PDF generation.
 */

import { Platform } from 'react-native';
import type { CalculationResults } from './calculator';

/**
 * Props for PDF generation
 */
export interface ExportAssessmentPDFProps {
  results: CalculationResults;
  supportA?: boolean;
  supportB?: boolean;
}

/**
 * Generate and download assessment PDF (web only)
 *
 * Uses dynamic import to avoid bundling @react-pdf/renderer in the main chunk.
 * The library is ~200KB and only needed when user clicks export.
 */
export async function exportAssessmentPDF({
  results,
  supportA = false,
  supportB = false,
}: ExportAssessmentPDFProps): Promise<void> {
  if (Platform.OS !== 'web') {
    console.warn('exportAssessmentPDF is only available on web platform');
    return;
  }

  try {
    // Dynamic imports to reduce initial bundle size
    const [{ pdf }, { AssessmentPDFDocument }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('@/src/components/pdf/AssessmentPDFDocument'),
    ]);

    // Generate PDF blob
    const doc = AssessmentPDFDocument({
      results,
      supportA,
      supportB,
      generatedDate: new Date(),
    });

    const blob = await pdf(doc).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Assessment_Estimate.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Check if PDF export is available on current platform
 */
export function isPDFExportAvailable(): boolean {
  return Platform.OS === 'web';
}
