/**
 * ResultsModalContent Component
 * 
 * Displays the full breakdown content including:
 * - ResultsHero (payment amount and details)
 * - SpecialCircumstancesPrompt (complexity detection)
 * - ResultsSimpleExplanation (calculation breakdown - lazy loaded)
 * - SmartConversionFooter (CTA for lawyer inquiry)
 * - PDFExportButton (download assessment - lazy loaded)
 * - FtbImpactCard (family tax benefit implications)
 * 
 * Performance: PDFExportButton is lazy loaded to defer loading of
 * @react-pdf/renderer, expo-print, and expo-sharing until needed.
 */

import { LazyLoadErrorBoundary } from '@/src/components/ui/LazyLoadErrorBoundary';
import { SmartConversionFooter } from '@/src/features/conversion/components/SmartConversionFooter';
import { SpecialCircumstancesPrompt } from '@/src/features/conversion/components/SpecialCircumstancesPrompt';
import type { CalculationResults } from '@/src/utils/calculator';
import type { ComplexityFormData } from '@/src/utils/complexity-detection';
import { MAX_CALCULATOR_WIDTH } from '@/src/utils/responsive';
import React, { lazy, Suspense } from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FtbImpactCard } from '../FtbImpactCard';
import { ResultsHero } from './ResultsHero';

// Lazy load the breakdown explanation component
const ResultsSimpleExplanation = lazy(() =>
  import('../ResultsSimpleExplanation').then((module) => ({
    default: module.ResultsSimpleExplanation,
  }))
);

// Lazy load PDF export button to reduce initial bundle size
// This defers loading of @react-pdf/renderer, expo-print, and expo-sharing
const PDFExportButton = lazy(() =>
  import('./PDFExportButton').then((module) => ({
    default: module.PDFExportButton,
  }))
);

export interface ResultsModalContentProps {
  results: CalculationResults;
  formData?: ComplexityFormData;
  localFormData: ComplexityFormData;
  currentResultsKey: string;
  isStale?: boolean;
  calculatorStartTime?: number;
  isWeb: boolean;
  selectedYear?: number;
  hasDeceasedParent?: boolean;
  onCloseModal: () => void;
  onSpecialCircumstancesChange: (reasons: string[]) => void;
}

export function ResultsModalContent({
  results,
  formData,
  localFormData,
  currentResultsKey,
  isStale = false,
  calculatorStartTime,
  isWeb,
  selectedYear = 2025,
  hasDeceasedParent = false,
  onCloseModal,
  onSpecialCircumstancesChange,
}: ResultsModalContentProps) {
  const insets = useSafeAreaInsets();

  const webModalContainerStyle = isWeb
    ? {
        maxWidth: MAX_CALCULATOR_WIDTH,
        width: '100%' as const,
        alignSelf: 'center' as const,
      }
    : {};

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 20 },
        webModalContainerStyle,
      ]}
      showsVerticalScrollIndicator={true}
    >
      <ResultsHero
        results={results}
        isStale={isStale}
        variant="modal"
        supportA={formData?.supportA ?? false}
        supportB={formData?.supportB ?? false}
      />

      <SpecialCircumstancesPrompt
        key={currentResultsKey}
        results={results}
        formData={localFormData}
        onNavigate={onCloseModal}
        onSpecialCircumstancesChange={onSpecialCircumstancesChange}
        calculatorStartTime={calculatorStartTime}
      />

      {results && (
        <LazyLoadErrorBoundary>
          <Suspense
            fallback={
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading breakdown...</Text>
              </View>
            }
          >
            <ResultsSimpleExplanation
              results={results}
              formState={{
                supportA: formData?.supportA ?? false,
                supportB: formData?.supportB ?? false,
              }}
              hasDeceasedParent={hasDeceasedParent}
            />
          </Suspense>
        </LazyLoadErrorBoundary>
      )}

      {/* Smart Conversion Footer - Always show at bottom of results */}
      <SmartConversionFooter
        results={results}
        carePercentages={results.childResults.map(
          (child) => child.roundedCareA
        )}
        formData={localFormData}
        onBeforeNavigate={onCloseModal}
        calculatorStartTime={calculatorStartTime}
      />

      {/* PDF Export Button - Below conversion footer */}
      {Platform.OS === 'web' && (
        <View style={styles.pdfButtonContainer}>
          <LazyLoadErrorBoundary
            fallback={
              <Text style={styles.errorText}>
                PDF export temporarily unavailable
              </Text>
            }
          >
            <Suspense
              fallback={
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#2563eb" />
                </View>
              }
            >
              <PDFExportButton
                results={results}
                supportA={formData?.supportA ?? false}
                supportB={formData?.supportB ?? false}
                variant="secondary"
              />
            </Suspense>
          </LazyLoadErrorBoundary>
        </View>
      )}

      {/* FTB Impact Card - Shows FTB Part A/B implications */}
      <FtbImpactCard
        results={results}
        userIncome={results.ATI_A}
        childCount={formData?.children?.length ?? results.childResults.length}
        year={selectedYear}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
  },
  pdfButtonContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    padding: 12,
  },
});
