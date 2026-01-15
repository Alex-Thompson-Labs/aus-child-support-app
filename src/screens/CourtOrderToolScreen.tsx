import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CareCalendar } from '../components/CareCalendar';
import { AustralianState } from '../utils/CareCalculator';
import { generateCareCalendarPDF } from '../utils/pdfGenerator';
import { supabase } from '../utils/supabase/client';
import { calculateCareFromTimeline } from '../utils/timeline-aggregator';
import {
    CareCalculationResult,
    TimelineResponse,
} from '../utils/timeline-types';
import {
    validateTimeline,
    ValidationError,
} from '../utils/timeline-validator';

const STATES: AustralianState[] = [
  'VIC',
  'NSW',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'ACT',
  'NT',
];

// Default year for timeline generation
const DEFAULT_YEAR = 2026;

export default function CourtOrderToolScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CareCalculationResult | null>(null);
  const [timelineResponse, setTimelineResponse] = useState<TimelineResponse | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // State selector (kept for calendar display)
  const [selectedState, setSelectedState] = useState<AustralianState>('VIC');
  const [calendarVisible, setCalendarVisible] = useState(false);
  
  // Year for timeline generation
  const [selectedYear] = useState<number>(DEFAULT_YEAR);

  const pickDocument = async () => {
    try {
      console.log('Opening document picker...');
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      console.log('Picker result:', result);

      if (result.canceled) return;

      const asset = result.assets[0];
      if (!asset) {
        throw new Error('No file selected');
      }

      // Robust MIME type detection
      let mimeType = asset.mimeType;

      // If MIME type is missing or generic/octet-stream, try to infer from extension
      if (!mimeType || mimeType === 'application/octet-stream') {
        const filename = asset.name.toLowerCase();
        if (filename.endsWith('.pdf')) {
          mimeType = 'application/pdf';
        } else if (filename.endsWith('.png')) {
          mimeType = 'image/png';
        } else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
          mimeType = 'image/jpeg';
        } else {
          // Fallback default
          mimeType = 'image/jpeg';
        }
      }

      console.log('Selected file:', asset.name, 'MIME:', mimeType);

      await analyzeOrder(asset.uri, mimeType);
    } catch (err: any) {
      console.error('Pick error:', err);
      Alert.alert('Error picking file', err.message);
    }
  };

  const analyzeOrder = async (uri: string, mimeType: string) => {
    setLoading(true);
    setResult(null);
    setTimelineResponse(null);
    setValidationErrors([]);

    try {
      let base64;

      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            // Split to remove the data:mime/type;base64, prefix
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64',
        });
      }

      console.log('Sending to backend...', { mimeType, size: base64.length, year: selectedYear });

      // Pass year parameter to Edge Function (Requirements: 6.1)
      const { data, error } = await supabase.functions.invoke('analyze-order', {
        body: {
          fileBase64: base64,
          mediaType: mimeType,
          year: selectedYear,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data) throw new Error('No data returned');

      // Handle INVALID_DOCUMENT_TYPE errors (Requirements: 6.4)
      if (data.error === 'INVALID_DOCUMENT_TYPE') {
        throw new Error(data.reason || 'Invalid document type. Please upload a valid Court Order.');
      }

      // Handle other error types from the Edge Function
      if (data.error) {
        throw new Error(data.reason || `Error: ${data.error}`);
      }

      console.log('Timeline response:', data);

      // Validate the timeline (Requirements: 6.2, 6.3)
      const timelineData = data as TimelineResponse;
      const validation = validateTimeline(timelineData.timeline, timelineData.year);
      
      if (!validation.valid) {
        console.error('Timeline validation errors:', validation.errors);
        setValidationErrors(validation.errors);
        throw new Error('The generated timeline has validation errors. Please try again.');
      }

      setTimelineResponse(timelineData);

      // Use new timeline aggregator (Requirements: 6.2)
      const calcResult = calculateCareFromTimeline(timelineData);
      setResult(calcResult);
    } catch (err: any) {
      console.error('Analysis error:', err);
      Alert.alert(
        'Analysis Failed',
        err.message || 'Could not interpret the file. Please try a clearer image or a different file.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!result) return;
    try {
      await generateCareCalendarPDF(
        result,
        selectedYear,
        selectedState
      );
    } catch (error: any) {
      Alert.alert('Export Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#334155" />
        </Pressable>
        <Text style={styles.headerTitle}>AI Court Order Interpreter</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.description}>
            Upload a photo or PDF of your Parenting Orders. Our AI will extract
            the care schedule and calculate the exact night counts for you.
          </Text>

          {!loading && !result && (
            <Pressable style={styles.uploadButton} onPress={pickDocument}>
              <Feather
                name="upload"
                size={24}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.uploadButtonText}>
                Select File to Analyze
              </Text>
            </Pressable>
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Analyzing Court Order...</Text>
              <Text style={styles.loadingSubText}>
                This may take up to 30 seconds
              </Text>
            </View>
          )}

          {result && (
            <View style={styles.resultContainer}>
              <View style={styles.successHeader}>
                <Feather name="check-circle" size={24} color="#16a34a" />
                <Text style={styles.successTitle}>Analysis Complete</Text>
              </View>

              <View style={styles.calculationDetails}>
                <Text style={styles.detailText}>
                  Calculation Duration: <Text style={{ fontWeight: 'bold' }}>{result.totalDays} Days</Text>
                  {result.totalDays > 365 ? ' (2 Years)' : ' (1 Year)'}
                </Text>
              </View>

              <View style={styles.statRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Mother&apos;s Nights</Text>
                  <Text style={styles.statValue}>
                    {result.motherNightsPerYear}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Father&apos;s Nights</Text>
                  <Text style={styles.statValue}>
                    {result.fatherNightsPerYear}
                  </Text>
                </View>
              </View>

              <View style={styles.statRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Mother&apos;s %</Text>
                  <Text style={styles.statValue}>
                    {result.motherPercentage}%
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Father&apos;s %</Text>
                  <Text style={styles.statValue}>
                    {result.fatherPercentage}%
                  </Text>
                </View>
              </View>

              {/* New Data & Action Buttons */}
              <View style={styles.buttonGroup}>
                <Pressable
                  style={[styles.secondaryButton, { marginRight: 8 }]}
                  onPress={() => setCalendarVisible(true)}
                >
                  <Feather
                    name="calendar"
                    size={20}
                    color="#2563eb"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.secondaryButtonText}>View Calendar</Text>
                </Pressable>

                <Pressable
                  style={styles.secondaryButton}
                  onPress={handleExportPDF}
                >
                  <Feather
                    name="download"
                    size={20}
                    color="#2563eb"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.secondaryButtonText}>Export PDF</Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.actionButton}
                onPress={() => {
                  Alert.alert(
                    'Values Saved',
                    'These values will be used for calculation.'
                  );
                  // Future integration: update calculator store
                }}
              >
                <Text style={styles.actionButtonText}>Use These Values</Text>
              </Pressable>

              <Pressable style={styles.retryButton} onPress={pickDocument}>
                <Text style={styles.retryButtonText}>Analyze Another File</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Debug View for timeline blocks (Requirements: 6.2) */}
        {timelineResponse && (
          <View style={styles.debugBox}>
            <Text style={styles.debugTitle}>Timeline Blocks ({timelineResponse.timeline.length} blocks):</Text>
            <Text style={styles.debugText}>Year: {timelineResponse.year}</Text>
            <Text style={styles.debugText}>Primary Parent: {timelineResponse.primary_parent === 'M' ? 'Mother' : 'Father'}</Text>
            <Text style={[styles.debugText, { marginTop: 8, fontWeight: 'bold' }]}>First 10 blocks:</Text>
            {timelineResponse.timeline.slice(0, 10).map((block, i) => (
              <Text key={i} style={styles.debugText}>
                {block[0]} → {block[1]} | {block[2] === 'M' ? 'Mother' : 'Father'} | {block[3]}
              </Text>
            ))}
            {timelineResponse.timeline.length > 10 && (
              <Text style={styles.debugText}>... and {timelineResponse.timeline.length - 10} more blocks</Text>
            )}
          </View>
        )}

        {/* Validation Errors Display (Requirements: 6.4) */}
        {validationErrors.length > 0 && (
          <View style={[styles.debugBox, { backgroundColor: '#fef2f2' }]}>
            <Text style={[styles.debugTitle, { color: '#dc2626' }]}>Validation Errors:</Text>
            {validationErrors.map((error, i) => (
              <Text key={i} style={[styles.debugText, { color: '#dc2626' }]}>
                [{error.code}] {error.message}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={calendarVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{selectedYear} Care Calendar</Text>
          <Pressable
            onPress={() => setCalendarVisible(false)}
            style={styles.closeButton}
          >
            <Feather name="x" size={24} color="#334155" />
          </Pressable>
        </View>
        {result && timelineResponse && (
          <CareCalendar
            year={selectedYear}
            timeline={timelineResponse.timeline}
            state={selectedState}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  description: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 24,
    lineHeight: 24,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  loadingSubText: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748b',
  },
  resultContainer: {
    alignItems: 'center',
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16a34a',
    marginLeft: 8,
  },
  stateSelectorContainer: {
    width: '100%',
    marginBottom: 20,
  },
  stateLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
    width: '100%',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  buttonGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    marginTop: 16,
    padding: 8,
  },
  retryButtonText: {
    color: '#64748b',
    fontSize: 14,
  },
  debugBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  calculationDetails: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  detailText: {
    color: '#3b82f6',
    fontSize: 14,
  },
});
