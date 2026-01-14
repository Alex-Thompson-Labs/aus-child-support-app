/**
 * Court Order Scanner Tool
 * 
 * Multi-step wizard that allows users to upload a Family Court Order,
 * parses it into structured data, and calculates care percentages.
 */

import { getSupabaseClient } from '@/src/utils/supabase/client';
import { getYear } from 'date-fns';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { CheckCircle, Download, FileText, Lock as LockIcon, Upload, User, Users } from 'lucide-react-native';
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
import {
  AustralianState,
  calculateCareFromOrder,
  CareCalculationResult,
  CourtOrderJSON,
} from '@/src/utils/CareCalculator';
import { isWeb, MAX_FORM_WIDTH } from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';

type WizardStep = 'upload' | 'state' | 'analyzing' | 'results';
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
        Upload your Family Court Order document (PDF or image) and we&apos;ll extract the care arrangement details automatically.
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

      <Text style={styles.supportedFormats}>Supported format: PDF</Text>
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
  isAnalyzing: boolean;
}

function StepState({
  selectedState,
  onStateChange,
  userRole,
  onUserRoleChange,
  onContinue,
  onBack,
  isAnalyzing
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
        <Pressable style={styles.secondaryButton} onPress={onBack} disabled={isAnalyzing}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
        <Pressable
          style={[styles.primaryButton, isAnalyzing && styles.buttonDisabled]}
          onPress={onContinue}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Users size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Analyze & Calculate</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function StepAnalyzing() {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.loaderContainer}>
        <FileText size={48} color="#2563EB" />
      </View>
      <Text style={styles.stepTitle}>Analyzing Order...</Text>
      <Text style={styles.stepDescription}>
        We&apos;re processing your court order and calculating the care percentages based on your selections.
      </Text>
      <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
    </View>
  );
}

function StepResults({
  result,
  onReset,
  selectedState,
  anchorDate,
  onDownloadPDF,
  userRole
}: {
  result: CareCalculationResult;
  onReset: () => void;
  selectedState: AustralianState;
  anchorDate: Date;
  onDownloadPDF: () => void;
  userRole: UserRole;
}) {
  const year = getYear(anchorDate);
  const yearAssignments = result.assignments.filter(a => getYear(a.date) === year);

  // Determine colors based on role
  const fatherColor = userRole === 'Father' ? USER_COLOR : OTHER_PARENT_COLOR;
  const motherColor = userRole === 'Mother' ? USER_COLOR : OTHER_PARENT_COLOR;

  return (
    <ScrollView style={styles.resultsScroll} contentContainerStyle={styles.resultsContent}>
      <View style={styles.resultsContainer}>
        <Text style={styles.stepTitle}>Care Calculation Results</Text>
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

        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>365-Day Care Calendar</Text>
          <CareCalendar
            year={year}
            assignments={yearAssignments}
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
            This is an estimate only, based on a 2-year projection of the care arrangement. Actual care percentages may vary due to changes in circumstances.
          </Text>
          <Text style={styles.disclaimerText}>For official child support assessments, contact Services Australia.</Text>
        </View>
        <Pressable style={styles.resetButton} onPress={onReset}>
          <Text style={styles.secondaryButtonText}>Start New Calculation</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default function CourtOrderToolScreen() {
  const [step, setStep] = useState<WizardStep>('upload');
  const [anchorDate, setAnchorDate] = useState<Date>(new Date());
  const [selectedState, setSelectedState] = useState<AustralianState>('VIC');
  const [userRole, setUserRole] = useState<UserRole>('Father');
  const [result, setResult] = useState<CareCalculationResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ uri: string; mimeType: string } | null>(null);

  // State for logic
  const [orderJson, setOrderJson] = useState<CourtOrderJSON | null>(null);

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

  const analyzeAndCalculate = async () => {
    if (!uploadedFile) return;
    setStep('analyzing');

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

      // 4. Call Supabase with JSON (Reliable)
      console.log('Calling Supabase function with Base64...');
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase.functions.invoke('analyze-order', {
        body: {
          fileBase64: base64,
          mediaType: uploadedFile.mimeType,
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

      // 3. Process Result
      console.log('Analysis successful:', data);
      setOrderJson(data);

      let currentAnchor = new Date();
      if (data.start_date) {
        currentAnchor = new Date(data.start_date + 'T00:00:00');
        setAnchorDate(currentAnchor);
      }

      // 4. Calculate
      const calculationResult = calculateCareFromOrder(data, currentAnchor, selectedState);
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
    const year = getYear(anchorDate);
    const yearAssignments = result.assignments.filter(a => getYear(a.date) === year);

    // Pass dynamic colors
    const fatherColor = userRole === 'Father' ? USER_COLOR : OTHER_PARENT_COLOR;
    const motherColor = userRole === 'Mother' ? USER_COLOR : OTHER_PARENT_COLOR;

    const html = generateCalendarHTML(
      year, yearAssignments, selectedState,
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
  }, [result, anchorDate, selectedState, userRole]);

  const handleReset = useCallback(() => {
    setStep('upload');
    setResult(null);
    setOrderJson(null);
    setUploadedFile(null);
    setAnchorDate(new Date());
    setSelectedState('VIC');
    setUserRole('Father');
  }, []);

  const webContainerStyle = isWeb ? { maxWidth: MAX_FORM_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

  return (
    <>
      <PageSEO
        title="Import Care Schedule"
        description="Extract care schedule."
        canonicalPath="/court-order-tool"
        schema={courtOrderSchema}
      />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <CalculatorHeader title="Import Care Schedule" showBackButton={true} maxWidth={MAX_FORM_WIDTH} />
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
          <Text style={styles.pageTitle} accessibilityRole="header" aria-level="1">Court Order Scanner</Text>
          <Text style={styles.introText}>Upload a photo or PDF of your Parenting Orders. Our system will extract the care schedule.</Text>

          <View style={styles.stepIndicator}>
            {(['Upload', 'Details', 'Analyzing', 'Results'] as const).map((label, index) => {
              const stepNames: WizardStep[] = ['upload', 'state', 'analyzing', 'results'];
              const currentIndex = stepNames.indexOf(step);
              const isActive = index === currentIndex;
              const isComplete = index < currentIndex;
              return (
                <View key={label} style={styles.stepIndicatorItem}>
                  <View style={[styles.stepDot, isActive && styles.stepDotActive, isComplete && styles.stepDotComplete]}>
                    {isComplete && <CheckCircle size={12} color="#ffffff" />}
                  </View>
                  <Text style={[styles.stepLabel, isActive && styles.stepLabelActive, isComplete && styles.stepLabelComplete]}>{label}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.content}>
            {step === 'upload' && <StepUpload onUpload={pickDocument} />}
            {step === 'state' && (
              <StepState
                selectedState={selectedState}
                onStateChange={setSelectedState}
                userRole={userRole}
                onUserRoleChange={setUserRole}
                onContinue={analyzeAndCalculate}
                onBack={() => setStep('upload')}
                isAnalyzing={false}
              />
            )}
            {step === 'analyzing' && <StepAnalyzing />}
            {step === 'results' && result && (
              <StepResults
                result={result}
                onReset={handleReset}
                selectedState={selectedState}
                anchorDate={anchorDate}
                onDownloadPDF={handleDownloadPDF}
                userRole={userRole}
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
  pageTitle: { fontSize: 28, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  introText: { fontSize: 16, color: '#475569', lineHeight: 24, marginBottom: 24 },
  stepIndicator: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 16, backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 24, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 }) },
  stepIndicatorItem: { alignItems: 'center', flex: 1 },
  stepDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  stepDotActive: { backgroundColor: '#2563EB' },
  stepDotComplete: { backgroundColor: '#2563EB' },
  stepLabel: { fontSize: 10, color: '#64748b', textAlign: 'center' },
  stepLabelActive: { color: '#2563EB', fontWeight: '600' },
  stepLabelComplete: { color: '#2563EB' },
  content: { minHeight: 400 },
  stepContainer: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  iconContainer: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  loaderContainer: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  stepTitle: { fontSize: 22, fontWeight: '700', color: '#1e293b', marginBottom: 12, textAlign: 'center' },
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
  disclaimerBox: { backgroundColor: '#fef3c7', padding: 16, borderRadius: 12, width: '100%', marginBottom: 24 },
  disclaimerTitle: { fontSize: 14, fontWeight: '600', color: '#92400e', marginBottom: 8 },
  disclaimerText: { fontSize: 13, color: '#92400e', lineHeight: 18, marginBottom: 4 },
  disclaimerBullet: { fontSize: 13, color: '#92400e', marginLeft: 8, lineHeight: 18 },
  resetButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', gap: 6, marginTop: 8 },
});