/**
 * Court Order Interpreter Tool
 * 
 * Multi-step wizard that allows users to upload a Family Court Order,
 * parses it into structured data, and calculates care percentages.
 */

import { format, getYear } from 'date-fns';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Calendar, CheckCircle, Download, FileText, Loader2, MapPin, Upload } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
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

type WizardStep = 'upload' | 'anchor' | 'state' | 'analyzing' | 'results';

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

// Schema.org structured data for Court Order Tool page
const courtOrderSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Court Order Interpreter',
  description: 'AI-powered tool to extract care schedules from Family Court Orders and calculate exact night counts for child support assessment.',
  applicationCategory: 'LegalApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'AUD',
  },
};

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

function SimpleDatePicker({ value, onChange }: DatePickerProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.datePickerContainer}>
        <input
          type="date"
          value={format(value, 'yyyy-MM-dd')}
          onChange={(e) => {
            const newDate = new Date(e.target.value + 'T00:00:00');
            if (!isNaN(newDate.getTime())) onChange(newDate);
          }}
          style={{
            fontSize: 16, padding: 12, borderRadius: 8,
            border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
            width: '100%', fontFamily: 'inherit',
          }}
        />
      </View>
    );
  }
  return (
    <Pressable style={styles.datePickerButton}>
      <Calendar size={20} color="#64748b" />
      <Text style={styles.datePickerText}>{format(value, 'dd/MM/yyyy')}</Text>
    </Pressable>
  );
}

function StepUpload({ onUpload, isUploading }: { onUpload: () => void; isUploading: boolean }) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <FileText size={48} color="#2563EB" />
      </View>
      <Text style={styles.stepTitle}>Upload Court Order</Text>
      <Text style={styles.stepDescription}>
        Upload your Family Court Order document (PDF or image) and we'll extract the care arrangement details automatically.
      </Text>
      <Pressable
        style={[styles.primaryButton, isUploading && styles.buttonDisabled]}
        onPress={onUpload}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <>
            <Upload size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Upload Court Order</Text>
          </>
        )}
      </Pressable>
      <Text style={styles.supportedFormats}>Supported formats: PDF, JPG, PNG</Text>
    </View>
  );
}

interface StepAnchorProps {
  anchorDate: Date;
  onDateChange: (date: Date) => void;
  onContinue: () => void;
  onBack: () => void;
}

function StepAnchor({ anchorDate, onDateChange, onContinue, onBack }: StepAnchorProps) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Calendar size={48} color="#2563EB" />
      </View>
      <Text style={styles.stepTitle}>Set Anchor Date</Text>
      <Text style={styles.stepDescription}>
        Select a date that was the start of "Week 1" for the Father's care schedule. This helps us sync the calculation with your actual arrangement.
      </Text>
      <View style={styles.datePickerWrapper}>
        <Text style={styles.inputLabel}>Week 1 Start Date</Text>
        <SimpleDatePicker value={anchorDate} onChange={onDateChange} />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Tip: Choose a date when the Father's regular weekend started. For example, if Father has every second weekend starting Friday, pick a Friday when that pattern began.
        </Text>
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={onBack}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={onContinue}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

interface StepStateProps {
  selectedState: AustralianState;
  onStateChange: (state: AustralianState) => void;
  onContinue: () => void;
  onBack: () => void;
}

function StepState({ selectedState, onStateChange, onContinue, onBack }: StepStateProps) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <MapPin size={48} color="#2563EB" />
      </View>
      <Text style={styles.stepTitle}>Select Your State</Text>
      <Text style={styles.stepDescription}>
        School holiday dates vary by state. Select your state so we can accurately calculate care during school holidays.
      </Text>
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
            <Text
              style={[
                styles.stateButtonLabel,
                selectedState === state.value && styles.stateButtonLabelSelected,
              ]}
            >
              {state.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={onBack}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={onContinue}>
          <Text style={styles.primaryButtonText}>Calculate Care</Text>
        </Pressable>
      </View>
    </View>
  );
}

function StepAnalyzing() {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.loaderContainer}>
        <Loader2 size={48} color="#2563EB" />
      </View>
      <Text style={styles.stepTitle}>Analyzing Order...</Text>
      <Text style={styles.stepDescription}>
        We're processing your court order and calculating the care percentages based on a 2-year projection.
      </Text>
      <View style={styles.progressSteps}>
        <View style={styles.progressStep}>
          <CheckCircle size={16} color="#2563EB" />
          <Text style={styles.progressStepText}>Document uploaded</Text>
        </View>
        <View style={styles.progressStep}>
          <CheckCircle size={16} color="#2563EB" />
          <Text style={styles.progressStepText}>Extracting care schedule</Text>
        </View>
        <View style={[styles.progressStep, styles.progressStepActive]}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.progressStepText}>Running 730-day simulation</Text>
        </View>
      </View>
    </View>
  );
}

function StepResults({ 
  result, 
  onReset, 
  selectedState,
  anchorDate,
  onDownloadPDF 
}: { 
  result: CareCalculationResult; 
  onReset: () => void;
  selectedState: AustralianState;
  anchorDate: Date;
  onDownloadPDF: () => void;
}) {
  const year = getYear(anchorDate);
  // Filter assignments to just the first year for the calendar
  const yearAssignments = result.assignments.filter(a => getYear(a.date) === year);

  return (
    <ScrollView style={styles.resultsScroll} contentContainerStyle={styles.resultsContent}>
      <View style={styles.resultsContainer}>
        <Text style={styles.stepTitle}>Care Calculation Results</Text>
        <View style={styles.resultsGrid}>
          <View style={[styles.resultCard, styles.motherCard]}>
            <Text style={styles.resultLabel}>Mother</Text>
            <Text style={styles.resultPercentage}>{result.motherPercentage.toFixed(1)}%</Text>
            <Text style={styles.resultNights}>{result.motherNightsPerYear} nights/year</Text>
          </View>
          <View style={[styles.resultCard, styles.fatherCard]}>
            <Text style={styles.resultLabel}>Father</Text>
            <Text style={styles.resultPercentage}>{result.fatherPercentage.toFixed(1)}%</Text>
            <Text style={styles.resultNights}>{result.fatherNightsPerYear} nights/year</Text>
          </View>
        </View>

        {/* Care Calendar Visualization */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>365-Day Care Calendar</Text>
          <CareCalendar
            year={year}
            assignments={yearAssignments}
            state={selectedState}
          />
          <Pressable style={styles.downloadButton} onPress={onDownloadPDF}>
            <Download size={18} color="#ffffff" />
            <Text style={styles.downloadButtonText}>Download Calendar PDF</Text>
          </Pressable>
        </View>

        {result.holidayAssignments.length > 0 && (
          <View style={styles.holidaySection}>
            <Text style={styles.sectionTitle}>Holiday Schedule Check</Text>
            <View style={styles.holidayList}>
              {result.holidayAssignments.map((holiday, index) => (
                <View key={`${holiday.event}-${holiday.year}-${index}`} style={styles.holidayItem}>
                  <Text style={styles.holidayEvent}>{holiday.event} {holiday.year}</Text>
                  <View style={[styles.holidayBadge, holiday.care_with === 'Mother' ? styles.motherBadge : styles.fatherBadge]}>
                    <Text style={styles.holidayBadgeText}>{holiday.care_with}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Calculation Details</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Simulation Period</Text>
              <Text style={styles.breakdownValue}>730 days (2 years)</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>State/Territory</Text>
              <Text style={styles.breakdownValue}>{selectedState}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Mother's Total Nights</Text>
              <Text style={styles.breakdownValue}>{result.motherNights}</Text>
            </View>
            <View style={[styles.breakdownRow, styles.breakdownRowLast]}>
              <Text style={styles.breakdownLabel}>Father's Total Nights</Text>
              <Text style={styles.breakdownValue}>{result.fatherNights}</Text>
            </View>
          </View>
        </View>
        <View style={styles.percentageBarSection}>
          <Text style={styles.sectionTitle}>Care Distribution</Text>
          <View style={styles.percentageBar}>
            <View style={[styles.percentageBarFill, styles.motherFill, { width: `${result.motherPercentage}%` as any }]} />
            <View style={[styles.percentageBarFill, styles.fatherFill, { width: `${result.fatherPercentage}%` as any }]} />
          </View>
          <View style={styles.percentageBarLabels}>
            <Text style={styles.percentageBarLabel}>Mother {result.motherPercentage.toFixed(1)}%</Text>
            <Text style={styles.percentageBarLabel}>Father {result.fatherPercentage.toFixed(1)}%</Text>
          </View>
        </View>
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>⚠️ Important Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This is an estimate only, based on a 2-year projection of the care arrangement. Actual care percentages may vary due to:
          </Text>
          <Text style={styles.disclaimerBullet}>• Changes in circumstances</Text>
          <Text style={styles.disclaimerBullet}>• School holiday variations</Text>
          <Text style={styles.disclaimerBullet}>• Special occasions not captured</Text>
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
  const [isUploading, setIsUploading] = useState(false);
  const [anchorDate, setAnchorDate] = useState<Date>(new Date());
  const [selectedState, setSelectedState] = useState<AustralianState>('VIC');
  const [result, setResult] = useState<CareCalculationResult | null>(null);
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
      console.log('Opening document picker...');
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      console.log('Picker result:', result);

      if (result.canceled) {
        console.log('User cancelled picker');
        return;
      }

      const asset = result.assets[0];
      if (!asset) {
        throw new Error('No file selected');
      }

      console.log('Selected file:', asset.name, 'URI:', asset.uri);

      // Robust MIME type detection
      let mimeType = asset.mimeType;
      if (!mimeType || mimeType === 'application/octet-stream') {
        const filename = asset.name.toLowerCase();
        if (filename.endsWith('.pdf')) {
          mimeType = 'application/pdf';
        } else if (filename.endsWith('.png')) {
          mimeType = 'image/png';
        } else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
          mimeType = 'image/jpeg';
        } else {
          mimeType = 'image/jpeg';
        }
      }

      console.log('Detected MIME type:', mimeType);
      await analyzeOrder(asset.uri, mimeType);
    } catch (err: any) {
      console.error('Pick error:', err);
      showAlert('Error picking file', err.message);
    }
  }, [showAlert]);

  const analyzeOrder = async (uri: string, mimeType: string) => {
    setIsUploading(true);
    setStep('analyzing');

    try {
      console.log('Starting file analysis...');
      let base64;

      if (Platform.OS === 'web') {
        console.log('Web platform - fetching blob...');
        const response = await fetch(uri);
        const blob = await response.blob();
        console.log('Blob size:', blob.size);
        
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1];
            console.log('Base64 length:', base64Data?.length);
            resolve(base64Data);
          };
          reader.onerror = (e) => {
            console.error('FileReader error:', e);
            reject(new Error('Failed to read file'));
          };
          reader.readAsDataURL(blob);
        });
      } else {
        base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64',
        });
      }

      console.log('Calling Supabase function...');
      
      // TODO: Remove this fallback once edge function is deployed
      // For now, simulate the AI analysis with dummy data
      console.log('Using fallback dummy data (edge function not deployed)');
      const dummyResponse: CourtOrderJSON = {
        cycle_length_days: 14,
        base_pattern: [
          { day: 'Saturday', week: 1 as const, care_with: 'Father' as const, notes: 'From 9:00am' },
          { day: 'Sunday', week: 1 as const, care_with: 'Father' as const, notes: 'Until 5:00pm' },
          { day: 'Monday', week: 1 as const, care_with: 'Father' as const, notes: 'Until 5:00pm if weekend is a long weekend' },
        ],
        special_overrides: [
          { event: 'Mothers Day', rule: 'Mother has care 9am-5pm' },
          { event: 'Fathers Day', rule: 'Father has care 9am-5pm' },
        ],
        holiday_blocks: [
          { event: 'Christmas', rule: 'Even Years: Father 24-26 Dec. Odd Years: Mother.' },
          { event: 'School Holidays', rule: 'Father has half of all holidays.' },
        ],
      };
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOrderJson(dummyResponse);
      setStep('anchor');
      
      /* 
      // Real Supabase call (uncomment when function is deployed):
      const supabaseClient = await getSupabaseClient();
      const { data, error } = await supabaseClient.functions.invoke('analyze-order', {
        body: {
          fileBase64: base64,
          mediaType: mimeType,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data) throw new Error('No data returned from AI');

      console.log('Analysis successful:', data);
      setOrderJson(data);
      setStep('anchor');
      */
    } catch (err: any) {
      console.error('Analysis error:', err);
      showAlert(
        'Analysis Failed',
        err.message || 'Could not interpret the file. Please try a clearer image or a different file.'
      );
      setStep('upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCalculate = useCallback(() => {
    if (!orderJson) return;
    
    setStep('analyzing');
    setTimeout(() => {
      const calculationResult = calculateCareFromOrder(orderJson, anchorDate, selectedState);
      setResult(calculationResult);
      setStep('results');
    }, 1500);
  }, [anchorDate, orderJson, selectedState]);

  const handleDownloadPDF = useCallback(async () => {
    if (!result) return;

    const year = getYear(anchorDate);
    const yearAssignments = result.assignments.filter(a => getYear(a.date) === year);

    const html = generateCalendarHTML(
      year,
      yearAssignments,
      selectedState,
      result.motherNights,
      result.fatherNights,
      result.motherPercentage,
      result.fatherPercentage
    );

    try {
      if (Platform.OS === 'web') {
        // Web: Open print dialog
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.print();
        }
      } else {
        // Native: Generate PDF and share
        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Care Calendar ${year}`,
          UTI: 'com.adobe.pdf',
        });
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      showAlert('Error', 'Could not generate PDF. Please try again.');
    }
  }, [result, anchorDate, selectedState, showAlert]);

  const handleReset = useCallback(() => {
    setStep('upload');
    setResult(null);
    setOrderJson(null);
    setAnchorDate(new Date());
    setSelectedState('VIC');
  }, []);

  const webContainerStyle = isWeb
    ? {
        maxWidth: MAX_FORM_WIDTH,
        width: '100%' as const,
        alignSelf: 'center' as const,
      }
    : {};

  return (
    <>
      <PageSEO
        title="Court Order Interpreter | Child Support Calculator Australia"
        description="Upload your Family Court Order and our AI will extract the care schedule to calculate exact night counts for child support assessment."
        canonicalPath="/court-order-tool"
        schema={courtOrderSchema}
      />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <CalculatorHeader title="Court Order Interpreter" showBackButton={true} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, webContainerStyle]}
        >
          {/* Page Title */}
          {/* @ts-ignore - Web-only ARIA attributes */}
          <Text style={styles.pageTitle} accessibilityRole="header" aria-level="1">
            AI Court Order Interpreter
          </Text>

          <Text style={styles.introText}>
            Upload a photo or PDF of your Parenting Orders. Our AI will extract the care schedule and calculate the exact night counts for you.
          </Text>

          {/* Step Indicator */}
          <View style={styles.stepIndicator}>
            {(['Upload', 'Anchor Date', 'State', 'Analyzing', 'Results'] as const).map((label, index) => {
              const stepNames: WizardStep[] = ['upload', 'anchor', 'state', 'analyzing', 'results'];
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

          {/* Content */}
          <View style={styles.content}>
            {step === 'upload' && <StepUpload onUpload={pickDocument} isUploading={isUploading} />}
            {step === 'anchor' && <StepAnchor anchorDate={anchorDate} onDateChange={setAnchorDate} onContinue={() => setStep('state')} onBack={() => setStep('upload')} />}
            {step === 'state' && <StepState selectedState={selectedState} onStateChange={setSelectedState} onContinue={handleCalculate} onBack={() => setStep('anchor')} />}
            {step === 'analyzing' && <StepAnalyzing />}
            {step === 'results' && result && (
              <StepResults 
                result={result} 
                onReset={handleReset} 
                selectedState={selectedState}
                anchorDate={anchorDate}
                onDownloadPDF={handleDownloadPDF}
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
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, gap: 8, minWidth: 200, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', gap: 6 },
  secondaryButtonText: { color: '#475569', fontSize: 15, fontWeight: '500' },
  supportedFormats: { fontSize: 12, color: '#64748b', marginTop: 16 },
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
  // State selection styles
  stateGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 500, marginBottom: 32 },
  stateButton: { width: 110, paddingVertical: 12, paddingHorizontal: 8, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 2, borderColor: '#e2e8f0', alignItems: 'center' },
  stateButtonSelected: { borderColor: '#2563EB', backgroundColor: '#eff6ff' },
  stateButtonText: { fontSize: 18, fontWeight: '700', color: '#64748b', marginBottom: 2 },
  stateButtonTextSelected: { color: '#2563EB' },
  stateButtonLabel: { fontSize: 10, color: '#94a3b8', textAlign: 'center' },
  stateButtonLabelSelected: { color: '#2563EB' },
  // Results styles
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
  // Calendar section
  calendarSection: { width: '100%', marginBottom: 24, backgroundColor: '#ffffff', borderRadius: 16, padding: 16, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }) },
  downloadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, gap: 8, marginTop: 16 },
  downloadButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  // Holiday section
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