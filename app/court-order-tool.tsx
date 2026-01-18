/**
 * Court Order Scanner Tool
 * 
 * Multi-step wizard that allows users to upload a Family Court Order,
 * parses it into structured data, and calculates care percentages.
 */

import { getSupabaseClient } from '@/src/utils/supabase/client';
import { format } from 'date-fns';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Download, FileText, Lock as LockIcon, Upload, User, Users } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CareCalendar, generateCalendarHTML } from '@/src/components/CareCalendar';
import { PageSEO } from '@/src/components/seo/PageSEO';
import { CalculatorHeader } from '@/src/features/calculator';
import { AustralianState } from '@/src/utils/CareCalculator';
import { isWeb, MAX_CALCULATOR_WIDTH } from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { calculateCareFromTimeline } from '@/src/utils/timeline-aggregator';
import { CareCalculationResult, TimelineResponse } from '@/src/utils/timeline-types';
import { validateTimeline, ValidationError } from '@/src/utils/timeline-validator';

type WizardStep = 'upload' | 'state' | 'analysing' | 'results';
type UserRole = 'Father' | 'Mother';

const AUSTRALIAN_STATES: { value: AustralianState; label: string }[] = [
  { value: 'VIC', label: 'Victoria' },
  { value: 'NSW', label: 'New South Wales' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' },
];

const USER_COLOR = '#2563EB'; // Brand Blue
const OTHER_PARENT_COLOR = '#94a3b8'; // Slate/Gray

// Schema.org structured data
const courtOrderSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Court Order Scanner',
  description: 'Scanner tool to extract care schedules from Family Court Orders and calculate exact night counts for child support assessment.',
  applicationCategory: 'LegalApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'AUD',
  },
};

function StepUpload({ onUpload }: { onUpload: () => void }) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <FileText size={48} color="#2563EB" />
      </View>
      <Text style={styles.stepTitle}>Upload Court Order</Text>
      <Text style={styles.stepDescription}>
        Upload your Family Court Order PDF and we&apos;ll extract the care arrangement details automatically.
      </Text>
      <Pressable
        style={styles.primaryButton}
        onPress={onUpload}
      >
        <Upload size={20} color="#ffffff" />
        <Text style={styles.primaryButtonText}>Upload Court Order</Text>
      </Pressable>

      {/* Privacy Trust Badge */}
      <View style={styles.trustBadge}>
        <LockIcon size={14} color="#15803d" />
        <Text style={styles.trustBadgeText}>
          Private & Secure: Data is processed in real-time and never stored.
        </Text>
      </View>
    </View>
  );
}

interface StepStateProps {
  selectedState: AustralianState;
  onStateChange: (state: AustralianState) => void;
  userRole: UserRole;
  onUserRoleChange: (role: UserRole) => void;
  onContinue: () => void;
  onBack: () => void;
  isAnalysing: boolean;
}

function StepState({
  selectedState,
  onStateChange,
  userRole,
  onUserRoleChange,
  onContinue,
  onBack,
  isAnalysing
}: StepStateProps) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Confirm Details</Text>
      <Text style={styles.stepDescription}>
        Select your state for holiday dates and identify your role in the court order.
      </Text>

      {/* Role Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Are you the Father or Mother?</Text>
        <View style={styles.roleRow}>
          <Pressable
            style={[styles.roleButton, userRole === 'Father' && styles.roleButtonSelected]}
            onPress={() => onUserRoleChange('Father')}
          >
            <User size={20} color={userRole === 'Father' ? '#2563EB' : '#64748b'} />
            <Text style={[styles.roleButtonText, userRole === 'Father' && styles.roleButtonTextSelected]}>Father</Text>
          </Pressable>
          <Pressable
            style={[styles.roleButton, userRole === 'Mother' && styles.roleButtonSelected]}
            onPress={() => onUserRoleChange('Mother')}
          >
            <User size={20} color={userRole === 'Mother' ? '#2563EB' : '#64748b'} />
            <Text style={[styles.roleButtonText, userRole === 'Mother' && styles.roleButtonTextSelected]}>Mother</Text>
          </Pressable>
        </View>
      </View>

      {/* State Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Select Your State</Text>
        <View style={styles.stateGrid}>
          {AUSTRALIAN_STATES.map((state) => (
            <Pressable
              key={state.value}
              style={[
                styles.stateButton,
                selectedState === state.value && styles.stateButtonSelected,
              ]}
              onPress={() => onStateChange(state.value)}
            >
              <Text
                style={[
                  styles.stateButtonText,
                  selectedState === state.value && styles.stateButtonTextSelected,
                ]}
              >
                {state.value}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={onBack} disabled={isAnalysing}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
        <Pressable
          style={[styles.primaryButton, isAnalysing && styles.buttonDisabled]}
          onPress={onContinue}
          disabled={isAnalysing}
        >
          {isAnalysing ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Users size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Analyse & Calculate</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function StepAnalysing() {
  const [progress, setProgress] = React.useState(0);
  const [stage, setStage] = React.useState('Uploading document...');

  React.useEffect(() => {
    // Simulate progress stages - spread across ~90 seconds to match actual Gemini processing time
    const stages = [
      { progress: 5, label: 'Uploading document...', delay: 1000 },
      { progress: 12, label: 'Reading court order...', delay: 5000 },
      { progress: 20, label: 'Extracting care schedule...', delay: 15000 },
      { progress: 32, label: 'Analysing patterns...', delay: 28000 },
      { progress: 45, label: 'Calculating nights...', delay: 42000 },
      { progress: 60, label: 'Validating timeline...', delay: 55000 },
      { progress: 75, label: 'Detecting opportunities...', delay: 68000 },
      { progress: 88, label: 'Finalizing results...', delay: 78000 },
      { progress: 95, label: 'Almost done...', delay: 85000 },
    ];

    const timers = stages.map(({ progress: p, label, delay }) =>
      setTimeout(() => {
        setProgress(p);
        setStage(label);
      }, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <View style={styles.stepContainer}>
      <View style={styles.loaderContainer}>
        <FileText size={48} color="#2563EB" />
      </View>
      <Text style={styles.stepTitle}>Analysing Order...</Text>
      <Text style={styles.stepDescription}>
        We&apos;re reading your court order and extracting the care schedule to calculate exact night counts.
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{stage}</Text>
        <Text style={styles.progressPercentage}>{progress}%</Text>
      </View>

      <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
    </View>
  );
}

function StepResults({
  result,
  onReset,
  selectedState,
  year,
  onDownloadPDF,
  userRole,
  timelineResponse
}: {
  result: CareCalculationResult;
  onReset: () => void;
  selectedState: AustralianState;
  year: number;
  onDownloadPDF: () => void;
  userRole: UserRole;
  timelineResponse: TimelineResponse | null;
}) {
  // Determine colors based on role
  const fatherColor = userRole === 'Father' ? USER_COLOR : OTHER_PARENT_COLOR;
  const motherColor = userRole === 'Mother' ? USER_COLOR : OTHER_PARENT_COLOR;

  // Detect if this is a 2-year timeline and get the actual start/end dates
  const is2YearTimeline = timelineResponse &&
    result.timeline.length > 0 &&
    result.timeline[result.timeline.length - 1][1].startsWith(`${year + 1}`);

  // Extract actual calculation period from timeline
  const startDate = result.timeline[0]?.[0] || `${year}-01-01T00:00`;
  const endDate = result.timeline[result.timeline.length - 1]?.[1] || `${year}-12-31T23:59`;

  const calculationStartMonth = parseInt(startDate.split('-')[1]);
  const calculationStartDay = parseInt(startDate.split('-')[2].split('T')[0]);
  const calculationEndYear = parseInt(endDate.split('-')[0]);
  const calculationEndMonth = parseInt(endDate.split('-')[1]);
  const calculationEndDay = parseInt(endDate.split('-')[2].split('T')[0]);

  const calculationDuration = is2YearTimeline ? '2-Year' : '1-Year';
  const periodDescription = is2YearTimeline
    ? `${format(new Date(startDate), 'MMM d, yyyy')} - ${format(new Date(endDate), 'MMM d, yyyy')}`
    : `${year} Full Year`;

  return (
    <ScrollView style={styles.resultsScroll} contentContainerStyle={styles.resultsContent}>
      <View style={styles.resultsContainer}>
        <Text style={styles.stepTitle}>Court Order Conversion Results</Text>
        <Text style={styles.periodDescription}>{periodDescription}</Text>
        <View style={styles.resultsGrid}>
          {/* Dynamically order cards? Req says: "User ... in Brand Blue" */}
          <View style={[styles.resultCard, { backgroundColor: userRole === 'Mother' ? '#eff6ff' : '#f8f9fa', borderColor: userRole === 'Mother' ? '#bfdbfe' : '#e2e8f0', borderWidth: 1 }]}>
            <Text style={styles.resultLabel}>Mother {userRole === 'Mother' && '(You)'}</Text>
            <Text style={[styles.resultPercentage, { color: motherColor }]}>{result.motherPercentage.toFixed(1)}%</Text>
            <Text style={styles.resultNights}>{result.motherNightsPerYear} nights/year</Text>
          </View>
          <View style={[styles.resultCard, { backgroundColor: userRole === 'Father' ? '#eff6ff' : '#f8f9fa', borderColor: userRole === 'Father' ? '#bfdbfe' : '#e2e8f0', borderWidth: 1 }]}>
            <Text style={styles.resultLabel}>Father {userRole === 'Father' && '(You)'}</Text>
            <Text style={[styles.resultPercentage, { color: fatherColor }]}>{result.fatherPercentage.toFixed(1)}%</Text>
            <Text style={styles.resultNights}>{result.fatherNightsPerYear} nights/year</Text>
          </View>
        </View>

        {/* Change of Assessment Opportunities Card */}
        {(timelineResponse?.opportunities && timelineResponse.opportunities.length > 0) || (result.dayVisitsCount && result.dayVisitsCount > 20) ? (
          <View style={styles.opportunitiesCard}>
            <View style={styles.opportunitiesHeader}>
              <Text style={styles.opportunitiesTitle}>Potential Savings Detected</Text>
            </View>
            <Text style={styles.opportunitiesIntro}>
              Your order includes expenses that are often ignored by the standard formula. You may be eligible to reduce your child support payments by claiming them:
            </Text>
            <View style={styles.opportunitiesList}>
              {/* Day Visits Opportunity (Reason 1) */}
              {result.dayVisitsCount && result.dayVisitsCount > 20 && (
                <View style={styles.opportunityItem}>
                  <Text style={styles.opportunityBullet}>•</Text>
                  <View style={styles.opportunityContent}>
                    <Text style={styles.opportunityTitle}>Travel Costs</Text>
                    <Text style={styles.opportunityDescription}>
                      You have {result.dayVisitsCount} day-only visits. While these count as 0 nights, the fuel and transport costs can often be claimed to lower your liability.
                    </Text>
                  </View>
                </View>
              )}
              {/* Keyword-detected opportunities */}
              {timelineResponse?.opportunities?.map((opp) => (
                <View key={opp.reason_id} style={styles.opportunityItem}>
                  <Text style={styles.opportunityBullet}>•</Text>
                  <View style={styles.opportunityContent}>
                    <Text style={styles.opportunityTitle}>{opp.reason_title}</Text>
                    <Text style={styles.opportunityDescription}>{opp.reason_description}</Text>
                  </View>
                </View>
              ))}
            </View>
            <Pressable
              style={styles.opportunitiesButton}
              onPress={() => {
                // Navigate to lawyer inquiry form
                if (Platform.OS === 'web') {
                  window.location.href = '/lawyer-inquiry';
                } else {
                  import('expo-router').then(({ router }) => {
                    router.push('/lawyer-inquiry');
                  });
                }
              }}
            >
              <Text style={styles.opportunitiesButtonText}>Check Eligibility</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Care Calendar</Text>

          <CareCalendar
            year={year}
            timeline={result.timeline}
            state={selectedState}
            fatherColor={fatherColor}
            motherColor={motherColor}
          />

          <Pressable style={styles.downloadButton} onPress={onDownloadPDF}>
            <Download size={18} color="#ffffff" />
            <Text style={styles.downloadButtonText}>Download Calendar PDF</Text>
          </Pressable>
        </View>

        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Calculation Details</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>State/Territory</Text>
              <Text style={styles.breakdownValue}>{selectedState}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Mother&apos;s Total Nights</Text>
              <Text style={styles.breakdownValue}>{result.motherNights}</Text>
            </View>
            <View style={[styles.breakdownRow, styles.breakdownRowLast]}>
              <Text style={styles.breakdownLabel}>Father&apos;s Total Nights</Text>
              <Text style={styles.breakdownValue}>{result.fatherNights}</Text>
            </View>
          </View>
        </View>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>Important Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This is an estimate only. Actual care percentages may vary due to changes in circumstances.
          </Text>
          <Text style={styles.disclaimerText}>For official child support assessments, contact Services Australia.</Text>
        </View>
        <Pressable style={styles.resetButton} onPress={onReset}>
          <Text style={styles.secondaryButtonText}>Start New Conversion</Text>
        </Pressable>

        {/* Beta Feedback Footer */}
        <View style={styles.feedbackFooter}>
          <Text style={styles.feedbackText}>
            Is this result different from what you expected?{' '}
            <Text
              style={styles.feedbackLink}
              onPress={() => {
                const subject = encodeURIComponent('Beta Feedback: Court Order Scanner');
                const body = encodeURIComponent('I scanned my court order and noticed an issue with...');
                const mailtoUrl = `mailto:feedback@auschildsupport.com?subject=${subject}&body=${body}`;

                if (Platform.OS === 'web') {
                  window.open(mailtoUrl, '_blank');
                } else {
                  import('react-native').then(({ Linking }) => {
                    Linking.openURL(mailtoUrl);
                  });
                }
              }}
            >
              Report an issue
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default function CourtOrderToolScreen() {
  const [step, setStep] = useState<WizardStep>('upload');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedState, setSelectedState] = useState<AustralianState>('VIC');
  const [userRole, setUserRole] = useState<UserRole>('Father');
  const [result, setResult] = useState<CareCalculationResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ uri: string; mimeType: string } | null>(null);

  // State for timeline response
  const [timelineResponse, setTimelineResponse] = useState<TimelineResponse | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const showAlert = useCallback((title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  }, []);

  const pickDocument = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      const asset = result.assets[0];
      if (!asset) throw new Error('No file selected');

      let mimeType = asset.mimeType;
      // ... MIME type logic
      if (!mimeType || mimeType === 'application/octet-stream') {
        const filename = asset.name.toLowerCase();
        if (filename.endsWith('.pdf')) mimeType = 'application/pdf';
        else if (filename.endsWith('.png')) mimeType = 'image/png';
        else mimeType = 'image/jpeg';
      }

      setUploadedFile({ uri: asset.uri, mimeType: mimeType || 'image/jpeg' });
      setStep('state'); // Move to State/Role selection
    } catch (err: any) {
      console.error('Pick error:', err);
      showAlert('Error picking file', err.message);
    }
  }, [showAlert]);

  const analyseAndCalculate = async () => {
    if (!uploadedFile) return;
    setStep('analysing');
    setValidationErrors([]);

    try {
      // 1. Yield to UI loop to let spinner render
      await new Promise(resolve => setTimeout(resolve, 100));

      let base64;
      let finalUri = uploadedFile.uri;
      const isImage = uploadedFile.mimeType.startsWith('image/');

      // 2. Resize if Image (Optimizes upload speed & prevents freeze)
      if (isImage && !Platform.OS.match(/web/)) {
        try {
          const result = await ImageManipulator.manipulateAsync(
            uploadedFile.uri,
            [{ resize: { width: 1500 } }], // Max width 1500px is plenty for OCR
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
          finalUri = result.uri;
          console.log('Image resized to:', finalUri);
        } catch (e) {
          console.warn('Image resize failed, using original:', e);
        }
      }

      // 3. Convert to Base64
      if (Platform.OS === 'web') {
        const response = await fetch(finalUri);
        const blob = await response.blob();
        base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(blob);
        });
      } else {
        base64 = await FileSystem.readAsStringAsync(finalUri, { encoding: 'base64' });
      }

      // 4. Call Supabase with JSON (Reliable) - pass year parameter
      console.log('Calling Supabase function with Base64...', { year: selectedYear });
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase.functions.invoke('analyze-order', {
        body: {
          fileBase64: base64,
          mediaType: uploadedFile.mimeType,
          year: selectedYear,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data) throw new Error('No data returned from Scanner');

      if (data.error === 'INVALID_DOCUMENT_TYPE') {
        throw new Error(data.reason || 'Invalid document type. Please upload a valid Court Order.');
      }

      // Handle other error types
      if (data.error) {
        throw new Error(data.reason || `Error: ${data.error}`);
      }

      // 5. Validate the timeline
      console.log('Timeline response:', data);
      const timelineData = data as TimelineResponse;
      const validation = validateTimeline(timelineData.timeline, timelineData.year);

      if (!validation.valid) {
        console.error('Timeline validation errors:', validation.errors);
        setValidationErrors(validation.errors);
        throw new Error('The generated timeline has validation errors. Please try again.');
      }

      setTimelineResponse(timelineData);
      setSelectedYear(timelineData.year);

      // 6. Calculate using new timeline aggregator
      const calculationResult = calculateCareFromTimeline(timelineData);
      setResult(calculationResult);
      setStep('results');

    } catch (err: any) {
      console.error('Analysis error:', err);
      showAlert('Analysis Failed', err.message);
      setStep('upload');
      setUploadedFile(null);
    }
  };

  const handleDownloadPDF = useCallback(async () => {
    if (!result) return;

    // Pass dynamic colors
    const fatherColor = userRole === 'Father' ? USER_COLOR : OTHER_PARENT_COLOR;
    const motherColor = userRole === 'Mother' ? USER_COLOR : OTHER_PARENT_COLOR;

    const html = generateCalendarHTML(
      selectedYear, result.timeline, selectedState,
      result.motherNights, result.fatherNights,
      result.motherPercentage, result.fatherPercentage,
      fatherColor, motherColor
    );
    // ... PDF Print logic
    if (Platform.OS === 'web') {
      const printWindow = window.open('', '_blank');
      if (printWindow) { printWindow.document.write(html); printWindow.print(); }
    } else {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Care Calendar', UTI: 'com.adobe.pdf' });
    }
  }, [result, selectedYear, selectedState, userRole]);

  const handleReset = useCallback(() => {
    setStep('upload');
    setResult(null);
    setTimelineResponse(null);
    setValidationErrors([]);
    setUploadedFile(null);
    setSelectedYear(2026);
    setSelectedState('VIC');
    setUserRole('Father');
  }, []);

  const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

  return (
    <>
      <PageSEO
        title="Court Order Scanner | Aus Child Support"
        description="Extract care schedule from court orders."
        canonicalPath="/court-order-tool"
        schema={courtOrderSchema}
      />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <CalculatorHeader title="Court Order Scanner (BETA)" showBackButton={true} maxWidth={MAX_CALCULATOR_WIDTH} />
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>

          {/* Page Title */}
          {/* @ts-ignore - Web-only ARIA attributes */}
          <Text style={styles.pageTitle} accessibilityRole="header" aria-level="1">
            Court Order Scanner
          </Text>

          <View style={styles.betaDisclaimer}>
            <Text style={styles.betaDisclaimerText}>
              This tool is currently in Beta. While our system is highly accurate, real-world court orders vary significantly in formatting. Please review all extracted dates and care percentages carefully to ensure they match your documents.
            </Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressIndicatorContainer}>
            {/* Track with circles and connectors */}
            <View style={styles.progressTrack}>
              {(['Upload', 'Details', 'Analysing', 'Results'] as const).map((label, index) => {
                const stepNames: WizardStep[] = ['upload', 'state', 'analysing', 'results'];
                const currentIndex = stepNames.indexOf(step);
                const isActive = index === currentIndex;
                const isComplete = index < currentIndex;
                const isLast = index === 3;

                return (
                  <React.Fragment key={label}>
                    {/* Step Circle */}
                    <View style={[
                      styles.progressCircle,
                      isComplete && styles.progressCircleComplete,
                      isActive && styles.progressCircleActive,
                    ]}>
                      <Text style={[
                        styles.progressNumber,
                        (isComplete || isActive) && styles.progressNumberActive,
                      ]}>
                        {isComplete ? '✓' : index + 1}
                      </Text>
                    </View>

                    {/* Connector Line */}
                    {!isLast && (
                      <View style={styles.progressConnector}>
                        <View style={[
                          styles.progressConnectorFill,
                          isComplete && styles.progressConnectorFillComplete,
                        ]} />
                      </View>
                    )}
                  </React.Fragment>
                );
              })}
            </View>

            {/* Labels - positioned to align with circles */}
            <View style={styles.progressLabelsRow}>
              {(['Upload', 'Details', 'Analysing', 'Results'] as const).map((label, index) => {
                const stepNames: WizardStep[] = ['upload', 'state', 'analysing', 'results'];
                const currentIndex = stepNames.indexOf(step);
                const isActive = index === currentIndex;
                const isComplete = index < currentIndex;
                const isLast = index === 3;

                return (
                  <React.Fragment key={label}>
                    <View style={styles.progressLabelContainer}>
                      <Text style={[
                        styles.progressLabel,
                        isActive && styles.progressLabelActive,
                        isComplete && styles.progressLabelComplete,
                      ]}>
                        {label}
                      </Text>
                    </View>
                    {!isLast && <View style={styles.progressLabelSpacer} />}
                  </React.Fragment>
                );
              })}
            </View>
          </View>

          <View style={styles.content}>
            {step === 'upload' && <StepUpload onUpload={pickDocument} />}
            {step === 'state' && (
              <StepState
                selectedState={selectedState}
                onStateChange={setSelectedState}
                userRole={userRole}
                onUserRoleChange={setUserRole}
                onContinue={analyseAndCalculate}
                onBack={() => setStep('upload')}
                isAnalysing={false}
              />
            )}
            {step === 'analysing' && <StepAnalysing />}
            {step === 'results' && result && (
              <StepResults
                result={result}
                onReset={handleReset}
                selectedState={selectedState}
                year={selectedYear}
                onDownloadPDF={handleDownloadPDF}
                userRole={userRole}
                timelineResponse={timelineResponse}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  pageTitle: { fontSize: 28, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
  betaBadge: { backgroundColor: '#dbeafe', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#93c5fd' },
  betaBadgeText: { fontSize: 11, fontWeight: '700', color: '#1e40af', letterSpacing: 0.5 },
  introText: { fontSize: 16, color: '#475569', lineHeight: 24, marginBottom: 16 },
  betaDisclaimer: { backgroundColor: '#eff6ff', padding: 14, borderRadius: 10, marginBottom: 24, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
  betaDisclaimerText: { fontSize: 13, color: '#1e40af', lineHeight: 20 },
  progressIndicatorContainer: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 24, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 }) },
  progressTrack: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  progressCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f1f5f9', borderWidth: 2, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  progressCircleComplete: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  progressCircleActive: { backgroundColor: '#2563EB', borderWidth: 3, borderColor: '#1e40af' },
  progressNumber: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  progressNumberActive: { color: '#ffffff' },
  progressConnector: { flex: 1, height: 4, backgroundColor: '#e2e8f0', marginHorizontal: 8, borderRadius: 2, overflow: 'hidden' },
  progressConnectorFill: { height: '100%', width: 0, backgroundColor: '#2563EB' },
  progressConnectorFillComplete: { width: '100%' },
  progressLabelsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  progressLabelContainer: { width: 32, alignItems: 'center' },
  progressLabelSpacer: { flex: 1, marginHorizontal: 8 },
  progressLabel: { fontSize: 11, color: '#94a3b8', textAlign: 'center' },
  progressLabelActive: { color: '#2563EB', fontWeight: '600' },
  progressLabelComplete: { color: '#64748b' },
  content: { minHeight: 400 },
  stepContainer: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  iconContainer: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  loaderContainer: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  stepTitle: { fontSize: 22, fontWeight: '700', color: '#1e3a8a', marginBottom: 12, textAlign: 'center' },
  stepDescription: { fontSize: 15, color: '#475569', textAlign: 'center', lineHeight: 22, marginBottom: 32, maxWidth: 400 },
  sectionContainer: { width: '100%', maxWidth: 500, marginBottom: 32 },
  sectionLabel: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 16, textAlign: 'center' },
  roleRow: { flexDirection: 'row', gap: 16, justifyContent: 'center' },
  roleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 2, borderColor: '#e2e8f0', gap: 8 },
  roleButtonSelected: { borderColor: '#2563EB', backgroundColor: '#eff6ff' },
  roleButtonText: { fontSize: 16, fontWeight: '600', color: '#64748b' },
  roleButtonTextSelected: { color: '#2563EB' },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, gap: 8, minWidth: 200, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', gap: 6 },
  secondaryButtonText: { color: '#475569', fontSize: 15, fontWeight: '500' },
  supportedFormats: { fontSize: 12, color: '#94a3b8', marginTop: 12 },
  trustBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0fdf4', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, gap: 6, marginTop: 16, borderWidth: 1, borderColor: '#dcfce7' },
  trustBadgeText: { fontSize: 13, fontWeight: '600', color: '#166534' },
  datePickerWrapper: { width: '100%', maxWidth: 400, marginBottom: 24 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 },
  datePickerContainer: { width: '100%' },
  datePickerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', gap: 12 },
  datePickerText: { fontSize: 16, color: '#1e293b' },
  infoBox: { backgroundColor: '#eff6ff', padding: 16, borderRadius: 12, maxWidth: 400, marginBottom: 32 },
  infoText: { fontSize: 14, color: '#475569', lineHeight: 20 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  progressSteps: { alignItems: 'flex-start', gap: 12 },
  progressStep: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressStepActive: { opacity: 0.8 },
  progressStepText: { fontSize: 14, color: '#475569' },
  stateGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 500, marginBottom: 32 },
  stateButton: { width: 110, paddingVertical: 12, paddingHorizontal: 8, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 2, borderColor: '#e2e8f0', alignItems: 'center' },
  stateButtonSelected: { borderColor: '#2563EB', backgroundColor: '#eff6ff' },
  stateButtonText: { fontSize: 18, fontWeight: '700', color: '#64748b', marginBottom: 2 },
  stateButtonTextSelected: { color: '#2563EB' },
  stateButtonLabel: { fontSize: 10, color: '#94a3b8', textAlign: 'center' },
  stateButtonLabelSelected: { color: '#2563EB' },
  resultsScroll: { flex: 1 },
  resultsContent: { padding: 20, alignItems: 'center' },
  resultsContainer: { width: '100%', maxWidth: 600, alignItems: 'center' },
  calculationDurationLabel: { fontSize: 13, color: '#64748b', marginBottom: 4, fontWeight: '500' },
  periodDescription: { fontSize: 12, color: '#94a3b8', marginBottom: 16 },
  resultsGrid: { flexDirection: 'row', gap: 16, marginBottom: 24, width: '100%' },
  resultCard: { flex: 1, padding: 20, borderRadius: 16, alignItems: 'center', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }) },
  motherCard: { backgroundColor: '#fce7f3' },
  fatherCard: { backgroundColor: '#dbeafe' },
  resultLabel: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 },
  resultPercentage: { fontSize: 36, fontWeight: '700', color: '#1e293b' },
  resultNights: { fontSize: 13, color: '#64748b', marginTop: 4 },
  calendarSection: { width: '100%', marginBottom: 24, backgroundColor: '#ffffff', borderRadius: 16, padding: 16, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }) },
  downloadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, gap: 8, marginTop: 16 },
  downloadButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  holidaySection: { width: '100%', marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 12 },
  holidayList: { backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  holidayItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  holidayEvent: { fontSize: 14, color: '#1e293b' },
  holidayBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  motherBadge: { backgroundColor: '#fce7f3' },
  fatherBadge: { backgroundColor: '#dbeafe' },
  holidayBadgeText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  breakdownSection: { width: '100%', marginBottom: 24 },
  breakdownCard: { backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', padding: 16 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  breakdownRowLast: { borderBottomWidth: 0 },
  breakdownLabel: { fontSize: 14, color: '#475569' },
  breakdownValue: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  percentageBarSection: { width: '100%', marginBottom: 24 },
  percentageBar: { flexDirection: 'row', height: 24, borderRadius: 12, overflow: 'hidden', backgroundColor: '#e2e8f0' },
  percentageBarFill: { height: '100%' },
  motherFill: { backgroundColor: '#f472b6' },
  fatherFill: { backgroundColor: '#60a5fa' },
  percentageBarLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  percentageBarLabel: { fontSize: 12, color: '#64748b' },
  disclaimerBox: { backgroundColor: '#eff6ff', padding: 16, borderRadius: 12, width: '100%', marginBottom: 24, borderLeftWidth: 4, borderLeftColor: '#2563eb' },
  disclaimerTitle: { fontSize: 14, fontWeight: '600', color: '#1e40af', marginBottom: 8 },
  disclaimerText: { fontSize: 13, color: '#1e40af', lineHeight: 18, marginBottom: 4 },
  disclaimerBullet: { fontSize: 13, color: '#92400e', marginLeft: 8, lineHeight: 18 },
  resetButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', gap: 6, marginTop: 8 },
  progressContainer: { width: '100%', maxWidth: 400, marginTop: 24, alignItems: 'center' },
  progressBarBackground: { width: '100%', height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#2563EB', borderRadius: 4 },
  progressText: { fontSize: 14, color: '#475569', marginTop: 12, textAlign: 'center' },
  progressPercentage: { fontSize: 12, color: '#94a3b8', marginTop: 4, fontWeight: '600' },
  yearLabel: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 12, marginTop: 8 },
  excludedNotice: { backgroundColor: '#fef3c7', padding: 12, borderRadius: 8, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#f59e0b' },
  excludedNoticeText: { fontSize: 13, color: '#92400e', lineHeight: 18 },
  feedbackFooter: { marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0', alignItems: 'center', width: '100%' },
  feedbackText: { fontSize: 12, color: '#64748b', textAlign: 'center', lineHeight: 18 },
  feedbackLink: { color: '#64748b', textDecorationLine: 'underline', fontWeight: '500' },
  opportunitiesCard: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', borderRadius: 12, padding: 20, marginBottom: 24, width: '100%', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }) },
  opportunitiesHeader: { marginBottom: 12 },
  opportunitiesTitle: { fontSize: 18, fontWeight: '700', color: '#1e40af' },
  opportunitiesIntro: { fontSize: 14, color: '#1e40af', lineHeight: 20, marginBottom: 16 },
  opportunitiesList: { marginBottom: 16 },
  opportunityItem: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
  opportunityBullet: { fontSize: 16, color: '#2563EB', marginRight: 8, marginTop: 2 },
  opportunityContent: { flex: 1 },
  opportunityTitle: { fontSize: 15, fontWeight: '600', color: '#1e40af', marginBottom: 4 },
  opportunityDescription: { fontSize: 13, color: '#3b82f6', lineHeight: 18 },
  opportunitiesButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
  opportunitiesButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
});