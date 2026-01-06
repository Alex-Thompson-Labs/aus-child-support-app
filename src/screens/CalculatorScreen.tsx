import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculator } from '../hooks/useCalculator';
import { useResponsive } from '../utils/responsive';
import { shadowPresets } from '../utils/shadow-styles';

// ✅ STANDARD IMPORTS (Reliable)
import { CalculatorFAQ } from '../components/calculator/CalculatorFAQ';
import { CalculatorForm } from '../components/CalculatorForm';
import { CalculatorResults } from '../components/CalculatorResults';
import { PrivacyPolicyLink } from '../components/PrivacyPolicyLink';

export function CalculatorScreen() {
  const {
    formState,
    setFormState,
    selectedYear,
    setSelectedYear,
    errors,
    results,
    isStale,
    setIsStale,
    addChild,
    removeChild,
    updateChild,
    calculate,
    reset,
    resetTimestamp,
  } = useCalculator();

  const { isDesktop } = useResponsive();
  const params = useLocalSearchParams();
  const router = useRouter();

  // Reset calculator when navigating back with reset=true
  React.useEffect(() => {
    if (params.reset === 'true') {
      reset();
      router.setParams({ reset: undefined });
    }
  }, [params.reset, reset, router]);

  // Handlers
  const handleIncomeAChange = (value: number) => {
    setFormState((prev) => ({ ...prev, incomeA: value }));
    setIsStale(true);
  };
  const handleIncomeBChange = (value: number) => {
    setFormState((prev) => ({ ...prev, incomeB: value }));
    setIsStale(true);
  };
  const handleSupportAChange = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, supportA: checked }));
    setIsStale(true);
  };
  const handleSupportBChange = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, supportB: checked }));
    setIsStale(true);
  };

  const handleRelDepAChange = (
    updates: Partial<{ u13: number; plus13: number }>
  ) => {
    setFormState((prev) => ({
      ...prev,
      relDepA: { ...prev.relDepA, ...updates },
    }));
    setIsStale(true);
  };

  const handleRelDepBChange = (
    updates: Partial<{ u13: number; plus13: number }>
  ) => {
    setFormState((prev) => ({
      ...prev,
      relDepB: { ...prev.relDepB, ...updates },
    }));
    setIsStale(true);
  };

  const formProps = {
    incomeA: formState.incomeA,
    incomeB: formState.incomeB,
    supportA: formState.supportA,
    supportB: formState.supportB,
    childrenData: formState.children,
    relDepA: formState.relDepA,
    relDepB: formState.relDepB,
    errors: errors,
    incomePercA: results?.incomePercA,
    incomePercB: results?.incomePercB,
    csiA: results?.CSI_A,
    csiB: results?.CSI_B,
    selectedYear: selectedYear,
    onYearChange: setSelectedYear,
    onIncomeAChange: handleIncomeAChange,
    onIncomeBChange: handleIncomeBChange,
    onSupportAChange: handleSupportAChange,
    onSupportBChange: handleSupportBChange,
    onAddChild: addChild,
    onRemoveChild: removeChild,
    onUpdateChild: updateChild,
    onRelDepAChange: handleRelDepAChange,
    onRelDepBChange: handleRelDepBChange,
    onCalculate: calculate,
    onReset: reset,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        {/* @ts-ignore - Web-only ARIA role */}
        <View style={styles.header} accessibilityRole="banner">
          <View
            style={
              isDesktop ? styles.headerContainer : styles.mobileHeaderRow
            }
          >
            <Ionicons
              name="people"
              size={isDesktop ? 32 : 24}
              color="#2563eb"
            />
            <Text
              style={[styles.title, isDesktop && styles.titleDesktop]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              accessibilityRole="header"
              aria-level="1"
            >
              Child Support Calculator
            </Text>

            <Pressable
              style={styles.blogButton}
              accessibilityRole="button"
              onPress={() => Linking.openURL('https://blog.auschildsupport.com')}
            >
              <Text style={styles.blogButtonText}>Blog</Text>
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          // Cast to 'any' allows web-only roles without TS errors
          accessibilityRole={'main' as any}
        >
          <View style={isDesktop ? styles.bodyContainer : styles.fullWidth}>
            {/* ✅ FORM RESTORED (No Suspense) */}
            <CalculatorForm {...formProps} isDesktopWeb={isDesktop} />

            {/* FAQ Section */}
            <CalculatorFAQ />

            {/* Privacy Footer */}
            <View style={styles.privacyFooter}>
              <PrivacyPolicyLink
                linkText="Privacy Policy"
                textStyle={styles.privacyFooterText}
              />
            </View>

            {/* Bottom Padding */}
            <View style={{ height: 140 }} />
          </View>
        </ScrollView>

        {/* Results Overlay */}
        {results && (
          <View style={styles.resultsOverlay}>
            <View
              style={isDesktop ? styles.bodyContainer : styles.fullWidth}
            >
              <CalculatorResults
                results={results}
                formData={formState}
                displayMode="modal"
                isStale={isStale}
                resetTimestamp={resetTimestamp}
              />
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
    width: '100%',
    alignItems: 'center',
  },
  mobileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    gap: 8,
  },
  headerContainer: {
    width: '100%',
    maxWidth: 850,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 16,
  },
  bodyContainer: {
    width: '100%',
    maxWidth: 850,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
    textAlign: 'center',
  },
  titleDesktop: {
    fontSize: 28,
    letterSpacing: -0.5,
    marginLeft: 10,
  },
  blogButton: {
    backgroundColor: '#0056b3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexShrink: 0,
    ...shadowPresets.small,
  },
  blogButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  resultsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  fullWidth: {
    width: '100%',
  },
  privacyFooter: {
    marginTop: 32,
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
  privacyFooterText: {
    fontSize: 12,
    color: '#64748b', // grey-500
  },
});
