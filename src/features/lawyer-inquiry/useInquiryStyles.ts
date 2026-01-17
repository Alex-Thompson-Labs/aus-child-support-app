/**
 * Lawyer Inquiry Feature - Dynamic Styles Hook
 *
 * Provides theme-aware styles for the lawyer inquiry form.
 * Uses useAppTheme() to switch between light and dark mode colors.
 */

import { useAppTheme } from '@/src/theme';
import { MAX_CALCULATOR_WIDTH } from '@/src/utils/responsive';
import { useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';

export function useInquiryStyles() {
  const { colors, isDark } = useAppTheme();

  return useMemo(() => {
    // ============================================================================
    // Container & Layout Styles
    // ============================================================================
    const containerStyles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.backgroundNeutral,
      },
      keyboardView: {
        flex: 1,
      },
      scrollView: {
        flex: 1,
      },
      scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 40,
      },
      progressContainer: {
        width: '100%',
        maxWidth: MAX_CALCULATOR_WIDTH,
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginHorizontal: 16,
        marginBottom: 16,
        ...Platform.select({
          web: {
            boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.08)',
          },
          default: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          },
        }),
      },
    });

    // ============================================================================
    // Top Header Bar Styles (Title + Close button at very top)
    // ============================================================================
    const topHeaderBarStyles = StyleSheet.create({
      headerBar: {
        backgroundColor: colors.surface,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        width: '100%',
        zIndex: 100,
      },
      headerBarInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: MAX_CALCULATOR_WIDTH,
        alignSelf: 'center',
      },
      headerBarTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e3a8a',
        textAlign: 'left',
      },
      headerBarCloseButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surfaceSubtle,
      },
      headerBarCloseButtonText: {
        color: colors.primaryDark,
        fontSize: 20,
        fontWeight: '400',
        lineHeight: 24,
      },
    });

    // ============================================================================
    // Header & Trust Badge Styles (Content card subtitle only)
    // ============================================================================
    const headerStyles = StyleSheet.create({
      headerWrapper: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginHorizontal: 16,
        marginBottom: 16,
        ...Platform.select({
          web: {
            boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.08)',
          },
          default: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          },
        }),
      },
      header: {
        flexDirection: 'column',
        paddingLeft: 20,
        paddingRight: 12,
        paddingVertical: 16,
        gap: 0,
      },
      headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 44,
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primaryDark,
      },
      headerSubtitle: {
        fontSize: 14,
        color: colors.textMuted,
        lineHeight: 20,
        marginTop: 0,
        marginBottom: 8,
      },
      closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surfaceSubtle,
      },
      closeButtonText: {
        color: colors.primaryDark,
        fontSize: 24,
        fontWeight: '400',
        lineHeight: 32,
      },
      trustBadgeWrapper: {
        backgroundColor: isDark ? '#052e16' : '#f0fdf4',
        borderBottomWidth: 1,
        borderBottomColor: isDark ? '#166534' : '#bbf7d0',
        alignItems: 'center',
        ...Platform.select({
          web: {
            maxWidth: MAX_CALCULATOR_WIDTH,
            width: '100%',
            alignSelf: 'center',
          },
          default: {},
        }),
      },
      trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        gap: 6,
        ...Platform.select({
          web: {
            maxWidth: MAX_CALCULATOR_WIDTH,
            width: '100%',
          },
          default: {},
        }),
      },
      trustBadgeIcon: {
        fontSize: 14,
        color: isDark ? '#4ade80' : '#16a34a',
      },
      trustBadgeText: {
        fontSize: 13,
        fontWeight: '500',
        color: isDark ? '#86efac' : '#166534',
      },
    });

    // ============================================================================
    // Form Input Styles
    // ============================================================================
    const formStyles = StyleSheet.create({
      formTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primaryDark,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      },
      inputContainer: {
        marginBottom: 12,
      },
      input: {
        backgroundColor: colors.inputBackground,
        color: colors.inputText,
        borderRadius: 8,
        padding: 12,
        borderWidth: 1.5,
        borderColor: colors.inputBorder,
        fontSize: 16,
      },
      inputError: {
        borderColor: colors.errorBorder,
      },
      textArea: {
        height: 152,
        textAlignVertical: 'top',
        paddingTop: 12,
      },
      charCount: {
        fontSize: 12,
        color: colors.textMuted,
        textAlign: 'right',
        marginTop: 4,
      },
      errorText: {
        color: colors.error,
        fontSize: 12,
        marginTop: 4,
      },
      fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 8,
      },
    });

    // ============================================================================
    // Checkbox & Consent Styles
    // ============================================================================
    const checkboxStyles = StyleSheet.create({
      checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 2,
        marginBottom: 2,
      },
      checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.textMuted,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
      },
      checkboxChecked: {
        backgroundColor: colors.userHighlight,
        borderColor: colors.userHighlight,
      },
      checkboxError: {
        borderColor: colors.errorBorder,
      },
      checkboxCheck: {
        color: colors.textInverse,
        fontSize: 16,
        fontWeight: '700',
      },
      checkboxTextContainer: {
        flex: 1,
      },
      checkboxLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
      },
      checkboxErrorText: {
        marginLeft: 36,
        marginTop: 0,
      },
      privacyLinkContainer: {
        marginBottom: 2,
        marginLeft: 36,
        marginTop: 4,
      },
      privacyLink: {
        fontSize: 13,
        color: colors.userHighlight,
        textDecorationLine: 'underline',
      },
    });

    // ============================================================================
    // Button Styles
    // ============================================================================
    const buttonStyles = StyleSheet.create({
      button: {
        backgroundColor: colors.buttonPrimary,
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 12,
      },
      buttonPressed: {
        backgroundColor: colors.primary,
      },
      buttonDisabled: {
        backgroundColor: colors.textMuted,
        opacity: 0.6,
      },
      buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      buttonText: {
        color: colors.buttonPrimaryText,
        fontSize: 16,
        fontWeight: '600',
      },
      disclaimer: {
        fontSize: 12,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 18,
      },
    });

    // ============================================================================
    // Special Circumstances Styles
    // ============================================================================
    const circumstancesStyles = StyleSheet.create({
      specialCircumstancesSection: {
        marginBottom: 12,
      },
      specialCircumstanceCard: {
        backgroundColor: colors.primaryLight,
        borderWidth: 1,
        borderLeftWidth: 4,
        borderColor: colors.userHighlight,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
      },
      specialCircumstanceHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
      },
      specialCircumstanceIcon: {
        fontSize: 16,
        color: colors.userHighlight,
        marginTop: 2,
      },
      specialCircumstanceTextContainer: {
        flex: 1,
        gap: 4,
      },
      specialCircumstanceTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primaryDark,
        lineHeight: 18,
      },
    });

    // ============================================================================
    // Financial Section Styles
    // ============================================================================
    const financialStyles = StyleSheet.create({
      financialSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -8,
        marginBottom: 16,
        gap: 8,
        cursor: 'pointer',
      },
      financialSectionHeaderText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primaryDark,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      },
      secureBadge: {
        backgroundColor: colors.primaryDark,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
      },
      secureBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.textInverse,
        letterSpacing: 0.5,
      },
      summaryCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      },
      directModeCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.border,
      },
      directModeSubtitle: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 16,
        lineHeight: 20,
      },
      summaryTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      },
      summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      },
      summaryLabel: {
        fontSize: 14,
        color: colors.textMuted,
      },
      summaryLabelBold: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
      },
      summaryAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.userHighlight,
      },
      summaryValue: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textSecondary,
      },
      summarySeparator: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 12,
      },
      summarySubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 8,
      },
      careRow: {
        marginBottom: 6,
      },
      careChildLabel: {
        fontSize: 13,
        color: colors.textMuted,
        marginBottom: 4,
      },
      carePercentages: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      careValue: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.textSecondary,
      },
      careSeparator: {
        fontSize: 13,
        color: colors.textMuted,
      },
      financialSection: {
        marginBottom: 16,
      },
      chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
      },
      chip: {
        backgroundColor: colors.surfaceSubtle,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: colors.border,
      },
      chipActive: {
        backgroundColor: colors.userHighlight,
        borderColor: colors.userHighlight,
      },
      chipError: {
        borderColor: colors.errorBorder,
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2',
      },
      chipText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textSecondary,
      },
      chipTextActive: {
        color: colors.textInverse,
      },
      switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        gap: 12,
      },
      switchLabel: {
        flex: 1,
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
      },
      warningBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: isDark ? '#1e3a5f' : '#eff6ff',
        borderWidth: 1,
        borderColor: isDark ? '#3b82f6' : '#bfdbfe',
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
      },
      warningText: {
        flex: 1,
        fontSize: 13,
        color: isDark ? '#93c5fd' : '#1e40af',
        lineHeight: 18,
      },
      errorBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2',
        borderWidth: 1,
        borderColor: isDark ? '#ef4444' : '#fecaca',
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
      },
      errorBoxText: {
        flex: 1,
        fontSize: 13,
        color: isDark ? '#fca5a5' : '#991b1b',
        lineHeight: 18,
      },
      countryDropdown: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        marginTop: 4,
        maxHeight: 200,
        ...Platform.select({
          web: {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
          default: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          },
        }),
      },
      countryDropdownScroll: {
        maxHeight: 200,
      },
      countryOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
      },
      countryOptionText: {
        fontSize: 14,
        color: colors.textSecondary,
      },
      noResultsText: {
        padding: 16,
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
      },
    });

    // ============================================================================
    // Success View Styles
    // ============================================================================
    const successStyles = StyleSheet.create({
      successContainer: {
        flex: 1,
        backgroundColor: colors.backgroundNeutral,
      },
      successContent: {
        alignItems: 'center',
        padding: 40,
        maxWidth: 400,
        width: '100%',
      },
      successIcon: {
        fontSize: 64,
        color: isDark ? '#34d399' : '#10b981',
        marginBottom: 24,
      },
      successTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.textSecondary,
        marginBottom: 16,
      },
      successMessage: {
        fontSize: 16,
        color: colors.textMuted,
        textAlign: 'center',
        lineHeight: 24,
      },
      successButtonsContainer: {
        marginTop: 32,
        width: '100%',
        gap: 12,
      },
      successButton: {
        backgroundColor: colors.userHighlight,
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        width: '100%',
      },
      successButtonPressed: {
        backgroundColor: colors.primary,
      },
      successButtonText: {
        color: colors.textInverse,
        fontSize: 16,
        fontWeight: '600',
      },
      successButtonSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        width: '100%',
      },
      successButtonSecondaryPressed: {
        backgroundColor: colors.surfaceSubtle,
      },
      successButtonSecondaryText: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
      },
      partnerBadge: {
        backgroundColor: isDark ? '#052e16' : '#f0fdf4',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
      },
      partnerBadgeText: {
        fontSize: 13,
        color: isDark ? '#86efac' : '#166534',
        fontWeight: '500',
      },
    });

    // ============================================================================
    // Enrichment View Styles
    // ============================================================================
    const enrichmentStyles = StyleSheet.create({
      enrichmentContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: colors.backgroundNeutral,
        ...Platform.select({
          web: {
            maxWidth: 768,
            width: '100%',
            alignSelf: 'center',
          },
          default: {},
        }),
      },
      enrichmentHeader: {
        alignItems: 'center',
        marginBottom: 24,
      },
      enrichmentIcon: {
        fontSize: 48,
        color: isDark ? '#34d399' : '#10b981',
        marginBottom: 12,
      },
      enrichmentTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textSecondary,
      },
      enrichmentSubtitle: {
        fontSize: 15,
        color: colors.textMuted,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
      },
      enrichmentFactorsList: {
        marginBottom: 32,
        maxHeight: 350,
      },
      enrichmentFactorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
      },
      enrichmentCheckbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
      },
      enrichmentCheckboxChecked: {
        backgroundColor: colors.primaryLight,
        borderColor: colors.userHighlight,
      },
      enrichmentCheckboxCheck: {
        color: colors.userHighlight,
        fontSize: 16,
        fontWeight: '700',
      },
      enrichmentFactorLabel: {
        fontSize: 16,
        color: colors.textSecondary,
        flex: 1,
      },
      enrichmentButtons: {
        gap: 12,
      },
      enrichmentSkipButton: {
        paddingVertical: 14,
        alignItems: 'center',
      },
      enrichmentSkipButtonText: {
        fontSize: 15,
        color: colors.textMuted,
        fontWeight: '500',
      },
    });

    return {
      containerStyles,
      topHeaderBarStyles,
      headerStyles,
      formStyles,
      checkboxStyles,
      buttonStyles,
      circumstancesStyles,
      financialStyles,
      successStyles,
      enrichmentStyles,
      colors,
      isDark,
    };
  }, [colors, isDark]);
}
