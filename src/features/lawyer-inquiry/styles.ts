/**
 * Lawyer Inquiry Feature - Styles
 *
 * Complete StyleSheet for all lawyer inquiry components.
 * Styles are grouped by component/section for organization.
 */

import { Platform, StyleSheet } from 'react-native';

// ============================================================================
// Container & Layout Styles
// ============================================================================

export const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // soft warm grey background
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});

// ============================================================================
// Header & Trust Badge Styles
// ============================================================================

export const headerStyles = StyleSheet.create({
  // Header wrapper - full width background container
  headerWrapper: {
    backgroundColor: '#ffffff', // white
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // light grey
    alignItems: 'center',
  },
  // Header styles - matches Full Breakdown modal pattern
  header: {
    flexDirection: 'row',
    alignItems: 'center', // Vertically center title and close button
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 12, // Account for close button's internal padding
    paddingVertical: 16,
    ...Platform.select({
      web: {
        maxWidth: 560,
        width: '100%',
      },
      default: {},
    }),
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center', // Center text vertically within container
    gap: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a', // slate-900 (Dark Navy)
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280', // grey-500
    lineHeight: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  closeButtonText: {
    color: '#6b7280', // medium grey
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
  },
  // Trust Badge wrapper - full width background container
  trustBadgeWrapper: {
    backgroundColor: '#f0fdf4', // green-50
    borderBottomWidth: 1,
    borderBottomColor: '#bbf7d0', // green-200
    alignItems: 'center',
  },
  // Trust Badge styles
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
    ...Platform.select({
      web: {
        maxWidth: 560,
        width: '100%',
      },
      default: {},
    }),
  },
  trustBadgeIcon: {
    fontSize: 14,
    color: '#16a34a', // green-600
  },
  trustBadgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#166534', // green-800
  },
});

// ============================================================================
// Form Input Styles
// ============================================================================

export const formStyles = StyleSheet.create({
  formTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e3a8a', // blue-900 (Dark Brand Blue)
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#ffffff', // white
    color: '#1a202c', // near black
    borderRadius: 8,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0', // light grey
    fontSize: 16,
  },
  inputError: {
    borderColor: '#B91C1C', // muted brick red
  },
  textArea: {
    height: 200,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#6b7280', // grey-500 - WCAG AA compliant (4.5:1)
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    color: '#B91C1C', // muted brick red
    fontSize: 12,
    marginTop: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568', // dark grey
    marginBottom: 8,
  },
});

// ============================================================================
// Checkbox & Consent Styles
// ============================================================================

export const checkboxStyles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6b7280', // grey-500 - WCAG AA compliant (4.5:1)
    backgroundColor: '#ffffff', // white
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6', // blue-500
    borderColor: '#3b82f6',
  },
  checkboxError: {
    borderColor: '#B91C1C', // muted brick red
  },
  checkboxCheck: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#4b5563', // grey-600
    lineHeight: 20,
  },
  checkboxErrorText: {
    marginLeft: 36,
    marginTop: 0,
  },
  privacyLinkContainer: {
    marginBottom: 8,
    marginLeft: 36, // Align with checkbox label
  },
  privacyLink: {
    fontSize: 13,
    color: '#3b82f6', // blue-500
    textDecorationLine: 'underline',
  },
});

// ============================================================================
// Button Styles
// ============================================================================

export const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: '#0056b3', // Royal Blue (Brand)
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonPressed: {
    backgroundColor: '#2563eb', // blue-600
  },
  buttonDisabled: {
    backgroundColor: '#6b7280', // grey-500 - WCAG AA compliant (4.5:1)
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#6b7280', // grey-500
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});

// ============================================================================
// Special Circumstances Styles
// ============================================================================

export const circumstancesStyles = StyleSheet.create({
  specialCircumstancesSection: {
    marginBottom: 24,
  },
  specialCircumstanceCard: {
    backgroundColor: '#eff6ff', // Blue-50 - very light blue
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: '#3b82f6', // Blue-500 - left accent border
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
    color: '#3b82f6', // Blue-500
    marginTop: 2,
  },
  specialCircumstanceTextContainer: {
    flex: 1,
    gap: 4,
  },
  specialCircumstanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af', // Blue-800 - dark blue
    lineHeight: 18,
  },
});

// ============================================================================
// Financial Section Styles
// ============================================================================

export const financialStyles = StyleSheet.create({
  // Financial Section Header (Case Eligibility Check)
  financialSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  financialSectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e3a8a', // blue-900 (Dark Brand Blue)
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lockIcon: {
    fontSize: 14,
  },
  // Summary Card (Standard Mode)
  summaryCard: {
    backgroundColor: '#f9fafb', // very light grey
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb', // light grey
  },
  // Direct Mode card styles
  directModeCard: {
    backgroundColor: '#f9fafb', // very light grey - matches summaryCard
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb', // light grey
  },
  directModeSubtitle: {
    fontSize: 14,
    color: '#6b7280', // grey-500
    marginBottom: 16,
    lineHeight: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e3a8a', // blue-900 (Dark Brand Blue)
    marginBottom: 16,
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
    color: '#6b7280', // grey-500
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6', // blue-500
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a202c', // near black
  },
  summarySeparator: {
    height: 1,
    backgroundColor: '#e5e7eb', // light grey
    marginVertical: 12,
  },
  summarySubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568', // dark grey
    marginBottom: 8,
  },
  // Care arrangement rows
  careRow: {
    marginBottom: 6,
  },
  careChildLabel: {
    fontSize: 13,
    color: '#6b7280', // grey-500
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
    color: '#1a202c', // near black
  },
  careSeparator: {
    fontSize: 13,
    color: '#6b7280', // grey-500 - WCAG AA compliant (4.5:1)
  },
  // Financial tags section
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
    backgroundColor: '#f3f4f6', // grey-100
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db', // grey-300
  },
  chipActive: {
    backgroundColor: '#3b82f6', // blue-500
    borderColor: '#3b82f6',
  },
  chipError: {
    borderColor: '#B91C1C', // muted brick red
    backgroundColor: '#fef2f2', // red-50
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563', // grey-700
  },
  chipTextActive: {
    color: '#ffffff',
  },
});

// ============================================================================
// Success View Styles
// ============================================================================

export const successStyles = StyleSheet.create({
  successContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa', // soft warm grey
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    alignItems: 'center',
    padding: 40,
    maxWidth: 400,
    width: '100%',
  },
  successIcon: {
    fontSize: 64,
    color: '#10b981', // emerald-500
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a202c', // near black
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#6b7280', // grey-500
    textAlign: 'center',
    lineHeight: 24,
  },
  successButtonsContainer: {
    marginTop: 32,
    width: '100%',
    gap: 12,
  },
  successButton: {
    backgroundColor: '#3b82f6', // blue-500
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  successButtonPressed: {
    backgroundColor: '#2563eb', // blue-600
  },
  successButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  successButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db', // grey-300
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  successButtonSecondaryPressed: {
    backgroundColor: '#f3f4f6', // grey-100
  },
  successButtonSecondaryText: {
    color: '#4b5563', // grey-600
    fontSize: 16,
    fontWeight: '600',
  },
});

// ============================================================================
// Enrichment View Styles
// ============================================================================

export const enrichmentStyles = StyleSheet.create({
  enrichmentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
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
    color: '#10b981', // emerald-500
    marginBottom: 12,
  },
  enrichmentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c', // near black
  },
  enrichmentSubtitle: {
    fontSize: 15,
    color: '#6b7280', // grey-500
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
    borderColor: '#cbd5e1', // slate-300 (Grey Border)
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  enrichmentCheckboxChecked: {
    backgroundColor: '#eff6ff', // blue-50 (Light Blue Background)
    borderColor: '#3b82f6', // blue-500 (Blue Border)
  },
  enrichmentCheckboxCheck: {
    color: '#3b82f6', // blue-500 (Blue Checkmark)
    fontSize: 16,
    fontWeight: '700',
  },
  enrichmentFactorLabel: {
    fontSize: 16,
    color: '#1a202c', // near black
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
    color: '#6b7280', // grey-500
    fontWeight: '500',
  },
});

// ============================================================================
// Combined Export (for backward compatibility / convenience)
// ============================================================================

// Using 'as any' to suppress TypeScript errors for web-specific CSS properties
// (cursor, userSelect, outlineStyle, etc.) which are valid for React Native Web
export const styles = {
  ...containerStyles,
  ...headerStyles,
  ...formStyles,
  ...checkboxStyles,
  ...buttonStyles,
  ...circumstancesStyles,
  ...financialStyles,
  ...successStyles,
  ...enrichmentStyles,
} as any;
