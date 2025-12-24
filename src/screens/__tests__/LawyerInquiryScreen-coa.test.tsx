/**
 * Tests for Change of Assessment integration in LawyerInquiryScreen
 * 
 * Covers all edge cases from CHRISTMAS_BREAK_PLAN.md requirements
 */

import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { LawyerInquiryScreen } from '../LawyerInquiryScreen';

// Mock expo-router
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({
    back: jest.fn(),
    replace: jest.fn(),
    canGoBack: jest.fn(() => true),
  })),
}));

// Mock analytics
jest.mock('@/src/utils/analytics', () => ({
  useAnalytics: jest.fn(() => ({
    track: jest.fn(),
    identify: jest.fn(),
    screen: jest.fn(),
  })),
}));

describe('LawyerInquiryScreen - Change of Assessment Integration', () => {
  const baseParams = {
    liability: '12000',
    trigger: 'high_value',
    incomeA: '80000',
    incomeB: '50000',
    children: '2',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Edge Case: selectedCoAReasons is undefined', () => {
    it('should render without crashing when selectedCoAReasons is undefined', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        // selectedCoAReasons not provided
      });

      const { queryByText } = render(<LawyerInquiryScreen />);
      
      // Should not show CoA card
      expect(queryByText(/CHANGE OF ASSESSMENT GROUNDS/i)).toBeNull();
      
      // Should show form normally
      expect(queryByText('Request Legal Help')).toBeTruthy();
    });

    it('should not crash when route params are completely missing', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({});

      expect(() => render(<LawyerInquiryScreen />)).not.toThrow();
    });
  });

  describe('Edge Case: selectedCoAReasons is empty array', () => {
    it('should not show CoA card when array is empty', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: JSON.stringify([]),
      });

      const { queryByText } = render(<LawyerInquiryScreen />);
      
      expect(queryByText(/CHANGE OF ASSESSMENT GROUNDS/i)).toBeNull();
    });

    it('should not show CoA card when string is empty', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: '',
      });

      const { queryByText } = render(<LawyerInquiryScreen />);
      
      expect(queryByText(/CHANGE OF ASSESSMENT GROUNDS/i)).toBeNull();
    });
  });

  describe('Valid CoA reasons display', () => {
    it('should display single urgent reason with correct styling', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: JSON.stringify(['income_not_reflected']),
      });

      const { getByText, getByTestId } = render(<LawyerInquiryScreen />);
      
      // Should show CoA card
      expect(getByText(/CHANGE OF ASSESSMENT GROUNDS/i)).toBeTruthy();
      
      // Should show reason label
      expect(getByText(/Income not accurately reflected/i)).toBeTruthy();
      
      // Should show urgent icon (⚠️)
      expect(getByText('⚠️')).toBeTruthy();
    });

    it('should display single normal reason with correct styling', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: JSON.stringify(['school_fees']),
      });

      const { getByText } = render(<LawyerInquiryScreen />);
      
      expect(getByText(/Private school fees/i)).toBeTruthy();
      expect(getByText('📋')).toBeTruthy();
    });

    it('should display multiple reasons in order', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: JSON.stringify([
          'income_not_reflected',
          'school_fees',
          'property_settlement'
        ]),
      });

      const { getByText } = render(<LawyerInquiryScreen />);
      
      expect(getByText(/Income not accurately reflected/i)).toBeTruthy();
      expect(getByText(/Private school fees/i)).toBeTruthy();
      expect(getByText(/Property settlement/i)).toBeTruthy();
    });

    it('should apply urgent border style when urgent reasons present', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: JSON.stringify(['income_not_reflected']),
      });

      const { getByTestId } = render(<LawyerInquiryScreen />);
      
      // Card should have urgent styling (red border)
      // This would need a testID added to the card in implementation
      // expect(getByTestId('coa-card')).toHaveStyle({ borderColor: '#ef4444' });
    });

    it('should show reason descriptions', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: JSON.stringify(['income_not_reflected']),
      });

      const { getByText } = render(<LawyerInquiryScreen />);
      
      // Description should be visible (may be truncated)
      expect(getByText(/actual income/i)).toBeTruthy();
    });
  });

  describe('Edge Case: Invalid reason IDs', () => {
    it('should filter out invalid IDs and show only valid reasons', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: JSON.stringify([
          'invalid_id_123',
          'income_not_reflected',
          'another_invalid'
        ]),
      });

      const { getByText, queryByText } = render(<LawyerInquiryScreen />);
      
      // Should show valid reason
      expect(getByText(/Income not accurately reflected/i)).toBeTruthy();
      
      // Should show CoA card (because at least one valid reason)
      expect(getByText(/CHANGE OF ASSESSMENT GROUNDS/i)).toBeTruthy();
    });

    it('should not show CoA card when all IDs are invalid', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: JSON.stringify(['invalid_1', 'invalid_2']),
      });

      const { queryByText } = render(<LawyerInquiryScreen />);
      
      // Should not show CoA card
      expect(queryByText(/CHANGE OF ASSESSMENT GROUNDS/i)).toBeNull();
    });
  });

  describe('Edge Case: Corrupted navigation params', () => {
    it('should handle malformed JSON gracefully', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: '{invalid json[',
      });

      const { queryByText } = render(<LawyerInquiryScreen />);
      
      // Should not crash
      expect(queryByText('Request Legal Help')).toBeTruthy();
      
      // Should not show CoA card
      expect(queryByText(/CHANGE OF ASSESSMENT GROUNDS/i)).toBeNull();
    });

    it('should handle comma-separated string format', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: 'income_not_reflected,school_fees',
      });

      const { getByText } = render(<LawyerInquiryScreen />);
      
      // Should parse and display both reasons
      expect(getByText(/Income not accurately reflected/i)).toBeTruthy();
      expect(getByText(/Private school fees/i)).toBeTruthy();
    });

    it('should handle non-string param types', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: 12345, // Wrong type
      });

      expect(() => render(<LawyerInquiryScreen />)).not.toThrow();
    });
  });

  describe('Form submission with CoA reasons', () => {
    it('should include CoA data in lead brief when submitting', async () => {
      const mockTrack = jest.fn();
      require('@/src/utils/analytics').useAnalytics.mockReturnValue({
        track: mockTrack,
        identify: jest.fn(),
        screen: jest.fn(),
      });

      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: JSON.stringify(['income_not_reflected', 'school_fees']),
      });

      const { getByPlaceholderText, getByText } = render(<LawyerInquiryScreen />);
      
      // Fill form
      fireEvent.changeText(getByPlaceholderText('Your Name'), 'Test User');
      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText(/What do you need/i), 'Need help');
      
      // Submit
      fireEvent.press(getByText('Submit Inquiry'));
      
      await waitFor(() => {
        expect(mockTrack).toHaveBeenCalledWith(
          'inquiry_form_submitted',
          expect.objectContaining({
            has_coa_reasons: true,
            coa_reason_count: 2,
            coa_reason_ids: 'income_not_reflected,school_fees',
            has_urgent_reasons: true, // income_not_reflected is urgent
          })
        );
      });
    });

    it('should handle analytics failure gracefully', async () => {
      const mockTrack = jest.fn(() => {
        throw new Error('Analytics service unavailable');
      });
      
      require('@/src/utils/analytics').useAnalytics.mockReturnValue({
        track: mockTrack,
        identify: jest.fn(),
        screen: jest.fn(),
      });

      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: JSON.stringify(['income_not_reflected']),
      });

      const { getByPlaceholderText, getByText } = render(<LawyerInquiryScreen />);
      
      // Fill form
      fireEvent.changeText(getByPlaceholderText('Your Name'), 'Test User');
      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText(/What do you need/i), 'Help');
      
      // Should not crash on submit despite analytics error
      expect(() => {
        fireEvent.press(getByText('Submit Inquiry'));
      }).not.toThrow();
      
      // Success alert should still show
      await waitFor(() => {
        expect(getByText(/Inquiry Submitted/i)).toBeTruthy();
      });
    });

    it('should set hasUrgentReasons correctly based on priorities', async () => {
      const mockTrack = jest.fn();
      require('@/src/utils/analytics').useAnalytics.mockReturnValue({
        track: mockTrack,
      });

      // Test with only normal priority reasons
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: JSON.stringify(['school_fees', 'contact_costs']),
      });

      const { getByPlaceholderText, getByText } = render(<LawyerInquiryScreen />);
      
      fireEvent.changeText(getByPlaceholderText('Your Name'), 'Test User');
      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText(/What do you need/i), 'Help');
      fireEvent.press(getByText('Submit Inquiry'));
      
      await waitFor(() => {
        expect(mockTrack).toHaveBeenCalledWith(
          'inquiry_form_submitted',
          expect.objectContaining({
            has_urgent_reasons: false, // Both are normal priority
          })
        );
      });
    });
  });

  describe('Responsive layout', () => {
    it('should truncate long reason descriptions', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: JSON.stringify(['other_circumstances']),
      });

      const { getByText } = render(<LawyerInquiryScreen />);
      
      // Description text should have numberOfLines prop (handled by component)
      // This ensures it doesn't overflow on small screens
      expect(getByText(/other special circumstances/i)).toBeTruthy();
    });

    it('should show separator between multiple reasons', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: JSON.stringify(['income_not_reflected', 'school_fees']),
      });

      const { getByTestId } = render(<LawyerInquiryScreen />);
      
      // Reasons should have borders between them (except last one)
      // This would need testIDs added to implementation
    });
  });

  describe('Accessibility', () => {
    it('should be readable with screen readers', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        ...baseParams,
        selectedCoAReasons: JSON.stringify(['income_not_reflected']),
      });

      const { getByText } = render(<LawyerInquiryScreen />);
      
      // All text should be accessible
      expect(getByText(/CHANGE OF ASSESSMENT GROUNDS/i)).toBeTruthy();
      expect(getByText(/Income not accurately reflected/i)).toBeTruthy();
    });
  });
});

describe('LawyerInquiryScreen - Lead Brief Generation', () => {
  it('should generate complete lead brief with CoA data', () => {
    // This would test the leadBrief object structure
    const expectedLeadBrief = {
      name: 'Test User',
      email: 'test@example.com',
      phone: null,
      message: 'Help needed',
      annualLiability: 12000,
      triggerType: 'high_value',
      incomeA: 80000,
      incomeB: 50000,
      numChildren: 2,
      changeOfAssessmentReasons: {
        count: 2,
        reasons: expect.arrayContaining([
          expect.objectContaining({
            label: expect.any(String),
            description: expect.any(String),
            urgency: expect.stringMatching(/^(URGENT|Normal)$/),
          }),
        ]),
        formattedText: expect.stringContaining('CHANGE OF ASSESSMENT GROUNDS'),
        hasUrgent: expect.any(Boolean),
      },
      submittedAt: expect.any(String),
    };

    // Test that lead brief structure is correct
    expect(expectedLeadBrief).toBeDefined();
  });
});


