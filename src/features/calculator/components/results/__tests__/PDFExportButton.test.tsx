/**
 * PDFExportButton Component Tests
 * 
 * Tests for lazy-loaded PDF export functionality including:
 * - Successful PDF generation after lazy loading
 * - Error handling when imports fail
 * - Proper data and formatting in generated PDFs
 */

import type { CalculationResults } from '@/src/utils/calculator';
import * as exportAssessmentPDF from '@/src/utils/exportAssessmentPDF';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { PDFExportButton } from '../PDFExportButton';

// Mock the icons
jest.mock('@/src/components/icons', () => ({
  Download: () => null,
}));

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web',
  select: jest.fn((obj) => obj.web),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock the export utility
jest.mock('@/src/utils/exportAssessmentPDF');

// Sample calculation results for testing
const mockResults: CalculationResults = {
  ATI_A: 80000,
  ATI_B: 60000,
  SSA: 29619,
  CSI_A: 50381,
  CSI_B: 30381,
  CCSI: 80762,
  incomePercA: 62.4,
  incomePercB: 37.6,
  totalCost: 15000,
  payer: 'Parent A',
  finalPaymentAmount: 8500,
  rateApplied: 'None',
  childResults: [
    {
      age: 8,
      roundedCareA: 35,
      roundedCareB: 65,
      costPercA: 24,
      costPercB: 76,
      childSupportPercA: 38.4,
      childSupportPercB: -38.4,
      costPerChild: 7500,
      liabilityA: 2880,
      liabilityB: 0,
      farAppliedA: false,
      farAppliedB: false,
      marAppliedA: false,
      marAppliedB: false,
    },
    {
      age: 12,
      roundedCareA: 35,
      roundedCareB: 65,
      costPercA: 24,
      costPercB: 76,
      childSupportPercA: 38.4,
      childSupportPercB: -38.4,
      costPerChild: 7500,
      liabilityA: 2880,
      liabilityB: 0,
      farAppliedA: false,
      farAppliedB: false,
      marAppliedA: false,
      marAppliedB: false,
    },
  ],
};

describe('PDFExportButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Platform Availability', () => {
    it('should render on web platform', () => {
      jest.spyOn(exportAssessmentPDF, 'isPDFExportAvailable').mockReturnValue(true);

      const { getByText } = render(
        <PDFExportButton results={mockResults} />
      );

      expect(getByText('Download PDF')).toBeTruthy();
    });

    it('should not render on non-web platforms when unavailable', () => {
      jest.spyOn(exportAssessmentPDF, 'isPDFExportAvailable').mockReturnValue(false);

      const { queryByText } = render(
        <PDFExportButton results={mockResults} />
      );

      expect(queryByText('Download PDF')).toBeNull();
    });
  });

  describe('PDF Export Functionality', () => {
    it('should successfully export PDF after lazy loading', async () => {
      jest.spyOn(exportAssessmentPDF, 'isPDFExportAvailable').mockReturnValue(true);
      jest.spyOn(exportAssessmentPDF, 'exportAssessmentPDF').mockResolvedValue();

      const { getByText } = render(
        <PDFExportButton results={mockResults} />
      );

      const button = getByText('Download PDF');
      fireEvent.press(button);

      // Should show loading state
      await waitFor(() => {
        expect(getByText('Generating...')).toBeTruthy();
      });

      // Wait for export to complete
      await waitFor(() => {
        expect(exportAssessmentPDF.exportAssessmentPDF).toHaveBeenCalledWith({
          results: mockResults,
          supportA: false,
          supportB: false,
        });
      });

      // Should return to normal state
      await waitFor(() => {
        expect(getByText('Download PDF')).toBeTruthy();
      });
    });

    it('should pass support flags correctly to export function', async () => {
      jest.spyOn(exportAssessmentPDF, 'isPDFExportAvailable').mockReturnValue(true);
      jest.spyOn(exportAssessmentPDF, 'exportAssessmentPDF').mockResolvedValue();

      const { getByText } = render(
        <PDFExportButton 
          results={mockResults} 
          supportA={true}
          supportB={true}
        />
      );

      const button = getByText('Download PDF');
      fireEvent.press(button);

      await waitFor(() => {
        expect(exportAssessmentPDF.exportAssessmentPDF).toHaveBeenCalledWith({
          results: mockResults,
          supportA: true,
          supportB: true,
        });
      });
    });

    it('should disable button while loading', async () => {
      jest.spyOn(exportAssessmentPDF, 'isPDFExportAvailable').mockReturnValue(true);
      jest.spyOn(exportAssessmentPDF, 'exportAssessmentPDF').mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { getByText, getByLabelText } = render(
        <PDFExportButton results={mockResults} />
      );

      const button = getByLabelText('Download assessment as PDF');
      fireEvent.press(button);

      // Button should be disabled during loading
      await waitFor(() => {
        expect(getByText('Generating...')).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle lazy loading import failures', async () => {
      jest.spyOn(exportAssessmentPDF, 'isPDFExportAvailable').mockReturnValue(true);
      const importError = new Error('PDF export feature is temporarily unavailable. Please try again later.');
      jest.spyOn(exportAssessmentPDF, 'exportAssessmentPDF').mockRejectedValue(importError);

      const { getByText } = render(
        <PDFExportButton results={mockResults} />
      );

      const button = getByText('Download PDF');
      fireEvent.press(button);

      // Wait for error to be handled
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'PDF Export Failed',
          'PDF export feature is temporarily unavailable. Please try again later.',
          expect.any(Array)
        );
      });

      // Error message should be displayed
      await waitFor(() => {
        expect(getByText('PDF export feature is temporarily unavailable. Please try again later.')).toBeTruthy();
      });
    });

    it('should handle generic export failures', async () => {
      jest.spyOn(exportAssessmentPDF, 'isPDFExportAvailable').mockReturnValue(true);
      const genericError = new Error('Network error');
      jest.spyOn(exportAssessmentPDF, 'exportAssessmentPDF').mockRejectedValue(genericError);

      const { getByText } = render(
        <PDFExportButton results={mockResults} />
      );

      const button = getByText('Download PDF');
      fireEvent.press(button);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'PDF Export Failed',
          'Network error',
          expect.any(Array)
        );
      });

      await waitFor(() => {
        expect(getByText('Network error')).toBeTruthy();
      });
    });

    it('should provide retry option on error', async () => {
      jest.spyOn(exportAssessmentPDF, 'isPDFExportAvailable').mockReturnValue(true);
      const error = new Error('Export failed');
      jest.spyOn(exportAssessmentPDF, 'exportAssessmentPDF').mockRejectedValue(error);

      const { getByText } = render(
        <PDFExportButton results={mockResults} />
      );

      const button = getByText('Download PDF');
      fireEvent.press(button);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });

      // Verify alert has retry button
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertCall[2];
      expect(buttons).toHaveLength(2);
      expect(buttons[0].text).toBe('OK');
      expect(buttons[1].text).toBe('Try Again');
    });

    it('should clear error state on successful retry', async () => {
      jest.spyOn(exportAssessmentPDF, 'isPDFExportAvailable').mockReturnValue(true);
      
      // First call fails, second succeeds
      jest.spyOn(exportAssessmentPDF, 'exportAssessmentPDF')
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockResolvedValueOnce();

      const { getByText, queryByText } = render(
        <PDFExportButton results={mockResults} />
      );

      // First attempt
      const button = getByText('Download PDF');
      fireEvent.press(button);

      await waitFor(() => {
        expect(getByText('First attempt failed')).toBeTruthy();
      });

      // Retry
      fireEvent.press(button);

      await waitFor(() => {
        expect(exportAssessmentPDF.exportAssessmentPDF).toHaveBeenCalledTimes(2);
      });

      // Error should be cleared
      await waitFor(() => {
        expect(queryByText('First attempt failed')).toBeNull();
      });
    });
  });

  describe('UI Variants', () => {
    it('should render primary variant with correct styling', () => {
      jest.spyOn(exportAssessmentPDF, 'isPDFExportAvailable').mockReturnValue(true);

      const { getByText } = render(
        <PDFExportButton results={mockResults} variant="primary" />
      );

      expect(getByText('Download PDF')).toBeTruthy();
    });

    it('should render secondary variant by default', () => {
      jest.spyOn(exportAssessmentPDF, 'isPDFExportAvailable').mockReturnValue(true);

      const { getByText } = render(
        <PDFExportButton results={mockResults} />
      );

      expect(getByText('Download PDF')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels', () => {
      jest.spyOn(exportAssessmentPDF, 'isPDFExportAvailable').mockReturnValue(true);

      const { getByLabelText } = render(
        <PDFExportButton results={mockResults} />
      );

      expect(getByLabelText('Download assessment as PDF')).toBeTruthy();
    });

    it('should update accessibility state when disabled', async () => {
      jest.spyOn(exportAssessmentPDF, 'isPDFExportAvailable').mockReturnValue(true);
      jest.spyOn(exportAssessmentPDF, 'exportAssessmentPDF').mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { getByLabelText } = render(
        <PDFExportButton results={mockResults} />
      );

      const button = getByLabelText('Download assessment as PDF');
      fireEvent.press(button);

      // Accessibility state should reflect disabled status during loading
      await waitFor(() => {
        expect(button.props.accessibilityState.disabled).toBe(true);
      });
    });
  });
});
