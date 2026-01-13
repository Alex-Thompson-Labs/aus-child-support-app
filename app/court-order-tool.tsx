/**
 * Court Order Interpreter Tool
 *
 * Multi-step wizard that allows users to upload a Family Court Order,
 * parses it into structured data, and calculates care percentages.
 */

import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  FileText,
  Loader2,
  Upload,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SemanticColors } from '@/constants/theme';
import {
  calculateCareFromOrder,
  CareCalculationResult,
  DUMMY_COURT_ORDER,
} from '@/src/utils/CareCalculator';
import { shadowPresets } from '@/src/utils/shadow-styles';

type WizardStep = 'upload' | 'anchor' | 'analyzing' | 'results';
const colors = SemanticColors.light;

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
            fontSize: 16,
            padding: 12,
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            width: '100%',
            fontFamily: 'inherit',
          }}
        />
      </View>
    );
  }
  return (
    <Pressable style={styles.datePickerButton}>
      <Calendar size={20} color={colors.textSecondary} />
      <Text style={styles.datePickerText}>{format(value, 'dd MMMM yyyy')}</Text>
    </Pressable>
  );
}

function StepUpload({
  onUpload,
  isUploading,
}: {
  onUpload: () => void;
  isUploading: boolean;
}) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <FileText size={48} color={colors.primary} />
      </View>
      <Text style={styles.stepTitle}>Upload Court Order</Text>
      <Text style={styles.stepDescription}>
        Upload your Family Court Order document (PDF or image) and we&apos;ll
        extract the care arrangement details automatically.
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
      <Text style={styles.supportedFormats}>
        Supported formats: PDF, JPG, PNG
      </Text>
    </View>
  );
}

interface StepAnchorProps {
  anchorDate: Date;
  onDateChange: (date: Date) => void;
  onContinue: () => void;
  onBack: () => void;
}

function StepAnchor({
  anchorDate,
  onDateChange,
  onContinue,
  onBack,
}: StepAnchorProps) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Calendar size={48} color={colors.primary} />
      </View>
      <Text style={styles.stepTitle}>Set Anchor Date</Text>
      <Text style={styles.stepDescription}>
        Select a date that was the start of Week 1 for the Father&apos;s care
        schedule. This helps us sync the calculation with your actual
        arrangement.
      </Text>
      <View style={styles.datePickerWrapper}>
        <Text style={styles.inputLabel}>Week 1 Start Date</Text>
        <SimpleDatePicker value={anchorDate} onChange={onDateChange} />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Tip: Choose a date when the Father&apos;s regular weekend started.
          For example, if Father has every second weekend starting Friday, pick
          a Friday when that pattern began.
        </Text>
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={onBack}>
          <ArrowLeft size={18} color={colors.textSecondary} />
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
        <Loader2 size={48} color={colors.primary} />
      </View>
      <Text style={styles.stepTitle}>Analyzing Order...</Text>
      <Text style={styles.stepDescription}>
        We&apos;re processing your court order and calculating the care
        percentages based on a 2-year projection.
      </Text>
      <View style={styles.progressSteps}>
        <View style={styles.progressStep}>
          <CheckCircle size={16} color={colors.primary} />
          <Text style={styles.progressStepText}>Document uploaded</Text>
        </View>
        <View style={styles.progressStep}>
          <CheckCircle size={16} color={colors.primary} />
          <Text style={styles.progressStepText}>Extracting care schedule</Text>
        </View>
        <View style={[styles.progressStep, styles.progressStepActive]}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.progressStepText}>
            Running 730-day simulation
          </Text>
        </View>
      </View>
    </View>
  );
}

function StepResults({
  result,
  onReset,
}: {
  result: CareCalculationResult;
  onReset: () => void;
}) {
  return (
    <ScrollView
      style={styles.resultsScroll}
      contentContainerStyle={styles.resultsContent}
    >
      <View style={styles.resultsContainer}>
        <Text style={styles.stepTitle}>Care Calculation Results</Text>
        <View style={styles.resultsGrid}>
          <View style={[styles.resultCard, styles.motherCard]}>
            <Text style={styles.resultLabel}>Mother</Text>
            <Text style={styles.resultPercentage}>
              {result.motherPercentage.toFixed(1)}%
            </Text>
            <Text style={styles.resultNights}>
              {result.motherNightsPerYear} nights/year
            </Text>
          </View>
          <View style={[styles.resultCard, styles.fatherCard]}>
            <Text style={styles.resultLabel}>Father</Text>
            <Text style={styles.resultPercentage}>
              {result.fatherPercentage.toFixed(1)}%
            </Text>
            <Text style={styles.resultNights}>
              {result.fatherNightsPerYear} nights/year
            </Text>
          </View>
        </View>
        {result.holidayAssignments.length > 0 && (
          <View style={styles.holidaySection}>
            <Text style={styles.sectionTitle}>Holiday Schedule Check</Text>
            <View style={styles.holidayList}>
              {result.holidayAssignments.map((holiday, index) => (
                <View
                  key={`${holiday.event}-${holiday.year}-${index}`}
                  style={styles.holidayItem}
                >
                  <Text style={styles.holidayEvent}>
                    {holiday.event} {holiday.year}
                  </Text>
                  <View
                    style={[
                      styles.holidayBadge,
                      holiday.care_with === 'Mother'
                        ? styles.motherBadge
                        : styles.fatherBadge,
                    ]}
                  >
                    <Text style={styles.holidayBadgeText}>
                      {holiday.care_with}
                    </Text>
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
              <Text style={styles.breakdownLabel}>
                Mother&apos;s Total Nights
              </Text>
              <Text style={styles.breakdownValue}>{result.motherNights}</Text>
            </View>
            <View style={[styles.breakdownRow, styles.breakdownRowLast]}>
              <Text style={styles.breakdownLabel}>
                Father&apos;s Total Nights
              </Text>
              <Text style={styles.breakdownValue}>{result.fatherNights}</Text>
            </View>
          </View>
        </View>
        <View style={styles.percentageBarSection}>
          <Text style={styles.sectionTitle}>Care Distribution</Text>
          <View style={styles.percentageBar}>
            <View
              style={[
                styles.percentageBarFill,
                styles.motherFill,
                { width: `${result.motherPercentage}%` as any },
              ]}
            />
            <View
              style={[
                styles.percentageBarFill,
                styles.fatherFill,
                { width: `${result.fatherPercentage}%` as any },
              ]}
            />
          </View>
          <View style={styles.percentageBarLabels}>
            <Text style={styles.percentageBarLabel}>
              Mother {result.motherPercentage.toFixed(1)}%
            </Text>
            <Text style={styles.percentageBarLabel}>
              Father {result.fatherPercentage.toFixed(1)}%
            </Text>
          </View>
        </View>
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>⚠️ Important Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This is an estimate only, based on a 2-year projection of the care
            arrangement. Actual care percentages may vary due to:
          </Text>
          <Text style={styles.disclaimerBullet}>
            • Changes in circumstances
          </Text>
          <Text style={styles.disclaimerBullet}>
            • School holiday variations
          </Text>
          <Text style={styles.disclaimerBullet}>
            • Special occasions not captured
          </Text>
          <Text style={styles.disclaimerText}>
            For official child support assessments, contact Services Australia.
          </Text>
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
  const [result, setResult] = useState<CareCalculationResult | null>(null);

  const handleUpload = useCallback(() => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setStep('anchor');
    }, 2000);
  }, []);

  const handleCalculate = useCallback(() => {
    setStep('analyzing');
    setTimeout(() => {
      const calculationResult = calculateCareFromOrder(
        DUMMY_COURT_ORDER,
        anchorDate
      );
      setResult(calculationResult);
      setStep('results');
    }, 2500);
  }, [anchorDate]);

  const handleReset = useCallback(() => {
    setStep('upload');
    setResult(null);
    setAnchorDate(new Date());
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Court Order Interpreter</Text>
        <Text style={styles.headerSubtitle}>
          Calculate care percentages from your court order
        </Text>
      </View>
      <View style={styles.stepIndicator}>
        {(['Upload', 'Anchor Date', 'Analyzing', 'Results'] as const).map(
          (label, index) => {
            const stepNames: WizardStep[] = [
              'upload',
              'anchor',
              'analyzing',
              'results',
            ];
            const currentIndex = stepNames.indexOf(step);
            const isActive = index === currentIndex;
            const isComplete = index < currentIndex;
            return (
              <View key={label} style={styles.stepIndicatorItem}>
                <View
                  style={[
                    styles.stepDot,
                    isActive && styles.stepDotActive,
                    isComplete && styles.stepDotComplete,
                  ]}
                >
                  {isComplete && <CheckCircle size={12} color="#ffffff" />}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isActive && styles.stepLabelActive,
                    isComplete && styles.stepLabelComplete,
                  ]}
                >
                  {label}
                </Text>
              </View>
            );
          }
        )}
      </View>
      <View style={styles.content}>
        {step === 'upload' && (
          <StepUpload onUpload={handleUpload} isUploading={isUploading} />
        )}
        {step === 'anchor' && (
          <StepAnchor
            anchorDate={anchorDate}
            onDateChange={setAnchorDate}
            onContinue={handleCalculate}
            onBack={() => setStep('upload')}
          />
        )}
        {step === 'analyzing' && <StepAnalyzing />}
        {step === 'results' && result && (
          <StepResults result={result} onReset={handleReset} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: { fontSize: 14, color: colors.textMuted },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surfaceSubtle,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepIndicatorItem: { alignItems: 'center', flex: 1 },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepDotActive: { backgroundColor: colors.primary },
  stepDotComplete: { backgroundColor: colors.primary },
  stepLabel: { fontSize: 11, color: colors.textMuted, textAlign: 'center' },
  stepLabelActive: { color: colors.primary, fontWeight: '600' },
  stepLabelComplete: { color: colors.primary },
  content: { flex: 1 },
  stepContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loaderContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 400,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    minWidth: 200,
    ...shadowPresets.small,
  },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  supportedFormats: { fontSize: 12, color: colors.textMuted, marginTop: 16 },
  datePickerWrapper: { width: '100%', maxWidth: 400, marginBottom: 24 },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  datePickerContainer: { width: '100%' },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  datePickerText: { fontSize: 16, color: colors.textPrimary },
  infoBox: {
    backgroundColor: colors.primaryLight,
    padding: 16,
    borderRadius: 12,
    maxWidth: 400,
    marginBottom: 32,
  },
  infoText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  progressSteps: { alignItems: 'flex-start', gap: 12 },
  progressStep: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressStepActive: { opacity: 0.8 },
  progressStepText: { fontSize: 14, color: colors.textSecondary },
  resultsScroll: { flex: 1 },
  resultsContent: { padding: 20, alignItems: 'center' },
  resultsContainer: { width: '100%', maxWidth: 500, alignItems: 'center' },
  resultsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    width: '100%',
  },
  resultCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    ...shadowPresets.medium,
  },
  motherCard: { backgroundColor: '#fce7f3' },
  fatherCard: { backgroundColor: '#dbeafe' },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  resultPercentage: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  resultNights: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  holidaySection: { width: '100%', marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  holidayList: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  holidayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  holidayEvent: { fontSize: 14, color: colors.textPrimary },
  holidayBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  motherBadge: { backgroundColor: '#fce7f3' },
  fatherBadge: { backgroundColor: '#dbeafe' },
  holidayBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  breakdownSection: { width: '100%', marginBottom: 24 },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  breakdownRowLast: { borderBottomWidth: 0 },
  breakdownLabel: { fontSize: 14, color: colors.textSecondary },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  percentageBarSection: { width: '100%', marginBottom: 24 },
  percentageBar: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  percentageBarFill: { height: '100%' },
  motherFill: { backgroundColor: '#f472b6' },
  fatherFill: { backgroundColor: '#60a5fa' },
  percentageBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  percentageBarLabel: { fontSize: 12, color: colors.textMuted },
  disclaimerBox: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 24,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
    marginBottom: 4,
  },
  disclaimerBullet: {
    fontSize: 13,
    color: '#92400e',
    marginLeft: 8,
    lineHeight: 18,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
    marginTop: 8,
  },
});
