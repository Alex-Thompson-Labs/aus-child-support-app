/**
 * Lawyer Inquiry Screen
 *
 * Main controller component that orchestrates the lawyer inquiry form.
 * Acts as a thin wrapper that composes all sub-components.
 */

import { StepProgressIndicator } from '@/src/components/ui/StepProgressIndicator';
import { TrustBadges } from '@/src/components/ui/TrustBadges';
import { PARTNERS, type PartnerKey } from '@/src/config/partners';
import { isWeb, MAX_CALCULATOR_WIDTH } from '@/src/utils/responsive';
import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdditionalDetailsSection } from './components/AdditionalDetailsSection';
import { ConsentSection } from './components/ConsentSection';
import { EnrichmentView } from './components/EnrichmentView';
import { FAQSection } from './components/FAQSection';
import { FinancialSection } from './components/FinancialSection';
import { PersonalInfoSection } from './components/PersonalInfoSection';
import { SpecialCircumstancesSection } from './components/SpecialCircumstancesSection';
import { SuccessView } from './components/SuccessView';
import { useInquiryForm } from './hooks/useInquiryForm';
import { useRouteParams } from './hooks/useRouteParams';
import { useInquiryStyles } from './useInquiryStyles';

/**
 * Get partner display name if the partner ID is valid.
 * Returns undefined for invalid/unknown partners (graceful fallback to default messaging).
 */
function getPartnerName(partnerId: string | undefined): string | undefined {
  if (!partnerId) return undefined;
  const config = PARTNERS[partnerId as PartnerKey];
  return config?.name;
}

export default function LawyerInquiryScreen() {
  // Parse route parameters
  const params = useRouteParams();
  const router = useRouter();

  // Get dynamic styles
  const { containerStyles, topHeaderBarStyles, headerStyles } = useInquiryStyles();

  // Close handler for header bar
  const handleClose = () => {
    if (Platform.OS === 'web' && params.returnTo) {
      window.location.href = params.returnTo;
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  // Initialize form state and handlers
  const form = useInquiryForm({
    preFillMessage: params.preFillMessage,
    liability: params.liability,
    trigger: params.trigger,
    incomeA: params.incomeA,
    incomeB: params.incomeB,
    children: params.children,
    isDirectMode: params.isDirectMode,
    reason: params.reason,
    careData: params.careData,
    specialCircumstances: params.specialCircumstances,
    payer: params.payer,
    // Chatbot lead qualification data
    hasParentingPlan: params.hasParentingPlan,
    assessmentType: params.assessmentType,
    returnTo: params.returnTo,
    // Partner attribution (for ROI tracking)
    partner: params.partner,
    // Time tracking
    calculatorStartTime: params.calculatorStartTime,
  });

  // Web container styles
  const webContainerStyle = isWeb
    ? {
      maxWidth: MAX_CALCULATOR_WIDTH,
      width: '100%' as const,
      marginLeft: 'auto' as const,
      marginRight: 'auto' as const,
    }
    : {};

  // Render Success View
  if (form.showSuccess) {
    return (
      <SuccessView
        returnTo={params.returnTo}
        partnerName={getPartnerName(params.partner)}
      />
    );
  }

  // Render Enrichment View
  if (form.showEnrichment) {
    return (
      <EnrichmentView
        reason={params.reason}
        onSubmit={form.handleEnrichmentSubmit}
        onSkip={form.handleSkipEnrichment}
        isUpdating={form.isUpdatingEnrichment}
        selectedFactors={form.selectedEnrichmentFactors}
        onFactorToggle={form.handleEnrichmentFactorToggle}
        incomes={{
          parentA: params.isDirectMode
            ? parseInt(form.manualIncomeA.replace(/[^0-9]/g, ''), 10) || 0
            : parseFloat(params.incomeA) || 0,
          parentB: params.isDirectMode
            ? parseInt(form.manualIncomeB.replace(/[^0-9]/g, ''), 10) || 0
            : parseFloat(params.incomeB) || 0,
        }}
        childrenCount={
          params.isDirectMode
            ? parseInt(form.manualChildren, 10) || 0
            : parseInt(params.children) || 0
        }
        onLiabilityCalculated={form.setEnrichmentLiability}
        onPayerRoleCalculated={form.setEnrichmentPayerRole}
        enrichmentCountry={form.enrichmentCountry}
        onEnrichmentCountryChange={form.setEnrichmentCountry}
        showSuccess={form.showEnrichmentSuccess}
      />
    );
  }

  // Render Main Form
  return (
    <SafeAreaView style={containerStyles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={containerStyles.keyboardView}
      >
        {/* Top Header Bar - Title centered, Close button on right */}
        <View style={topHeaderBarStyles.headerBar}>
          <View style={topHeaderBarStyles.headerBarInner}>
            <Text style={topHeaderBarStyles.headerBarTitle}>
              {params.inquiryConfig.title}
            </Text>
            <Pressable
              style={({ pressed }) => [
                topHeaderBarStyles.headerBarCloseButton,
                Platform.OS === 'web' && { cursor: 'pointer' as const },
                pressed && { opacity: 0.7 },
              ]}
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close form"
            >
              <Text style={topHeaderBarStyles.headerBarCloseButtonText}>✕</Text>
            </Pressable>
          </View>
        </View>

        {/* Trust Badge */}
        <TrustBadges variant="banner" />

        {/* Progress Indicator - Step 3: Next Steps */}
        <View style={[
          containerStyles.progressContainer,
          webContainerStyle,
        ]}>
          <StepProgressIndicator currentStep={3} compact />
        </View>

        <ScrollView
          style={containerStyles.scrollView}
          contentContainerStyle={[
            containerStyles.scrollContent,
            webContainerStyle,
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Subtitle (if present) */}
          {params.inquiryConfig.subtitle && (
            <Text style={headerStyles.headerSubtitle}>
              {params.inquiryConfig.subtitle}
            </Text>
          )}

          {/* Section 1: Personal Information */}
          <PersonalInfoSection
            name={form.name}
            email={form.email}
            phone={form.phone}
            postcode={form.postcode}
            errors={form.errors}
            touched={form.touched}
            isSubmitting={form.isSubmitting}
            onTextChange={form.handleTextChange}
            onBlur={form.handleBlur}
            setName={form.setName}
            setEmail={form.setEmail}
            setPhone={form.setPhone}
            setPostcode={form.setPostcode}
            emailRef={form.emailRef}
            phoneRef={form.phoneRef}
            postcodeRef={form.postcodeRef}
            messageRef={form.messageRef}
          />

          {/* Section 2: Special Circumstances */}
          <SpecialCircumstancesSection
            circumstances={form.validCircumstances}
          />

          {/* Section 3: Financial Information */}
          <FinancialSection
            isDirectMode={params.isDirectMode}
            liability={params.liability}
            payer={params.payer}
            incomeA={params.incomeA}
            incomeB={params.incomeB}
            dependentsList={params.children}
            careData={params.careData}
            manualIncomeA={form.manualIncomeA}
            manualIncomeB={form.manualIncomeB}
            manualChildren={form.manualChildren}
            setManualIncomeA={form.setManualIncomeA}
            setManualIncomeB={form.setManualIncomeB}
            setManualChildren={form.setManualChildren}
            shouldShowFinancialTags={form.shouldShowFinancialTags}
            financialTags={form.financialTags}
            setFinancialTags={form.setFinancialTags}
            specialCircumstances={params.specialCircumstances}
            shouldShowCourtDate={form.shouldShowCourtDate}
            courtDate={form.courtDate}
            onCourtDateChange={form.handleCourtDateChange}
            // PSI (Post-Separation Income) props
            shouldShowPsiFields={form.shouldShowPsiFields}
            separationDate={form.separationDate}
            onSeparationDateChange={form.setSeparationDate}
            cohabited6Months={form.cohabited6Months}
            onCohabited6MonthsChange={form.setCohabited6Months}
            showPsiWarning={form.showPsiWarning}
            // International Jurisdiction props
            shouldShowInternationalFields={form.shouldShowInternationalFields}
            otherParentCountry={form.otherParentCountry}
            onOtherParentCountryChange={form.setOtherParentCountry}
            internationalWarning={form.internationalWarning}
            // Direct mode refs for keyboard navigation
            manualIncomeARef={form.manualIncomeARef}
            manualIncomeBRef={form.manualIncomeBRef}
            manualChildrenRef={form.manualChildrenRef}
            // Common
            errors={form.errors}
            touched={form.touched}
            isSubmitting={form.isSubmitting}
            onTextChange={form.handleTextChange}
            onBlur={form.handleBlur}
          />

          {/* Section 4: Additional Details */}
          <AdditionalDetailsSection
            message={form.message}
            setMessage={form.setMessage}
            financialTags={form.financialTags}
            errors={form.errors}
            touched={form.touched}
            isSubmitting={form.isSubmitting}
            onTextChange={form.handleTextChange}
            onBlur={form.handleBlur}
            messageRef={form.messageRef}
          />

          {/* Section 5: Consent & Submit */}
          <ConsentSection
            consent={form.consent}
            onConsentToggle={form.handleConsentToggle}
            errors={form.errors}
            touched={form.touched}
            isSubmitting={form.isSubmitting}
            buttonText={params.inquiryConfig.buttonText}
            onSubmit={form.handleSubmit}
          />

          {/* Section 6: FAQ */}
          <FAQSection />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
