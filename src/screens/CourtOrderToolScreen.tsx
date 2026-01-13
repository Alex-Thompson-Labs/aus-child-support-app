import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calculateCareFromOrder, CareCalculationResult, CourtOrderJSON } from '../utils/CareCalculator';
import { supabase } from '../utils/supabase/client';

export default function CourtOrderToolScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CareCalculationResult | null>(null);
    const [orderJson, setOrderJson] = useState<CourtOrderJSON | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            setFileName(asset.name);
            analyzeOrder(asset.uri, asset.mimeType ?? 'image/jpeg');

        } catch (err: any) {
            Alert.alert('Error picking file', err.message);
        }
    };

    const analyzeOrder = async (uri: string, mimeType: string) => {
        setLoading(true);
        setResult(null);
        setOrderJson(null);

        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: 'base64',
            });

            const { data, error } = await supabase.functions.invoke('analyze-order', {
                body: {
                    fileBase64: base64,
                    mediaType: mimeType,
                },
            });

            if (error) throw error;
            if (!data) throw new Error('No data returned');

            console.log('Analyzed JSON:', data);
            setOrderJson(data);

            // Run local calculation
            const calcResult = calculateCareFromOrder(data, new Date());
            setResult(calcResult);

        } catch (err: any) {
            console.error(err);
            Alert.alert('Analysis Failed', 'Could not interpret the file. Please try a clearer image or a different file.');
        } finally {
            setLoading(false);
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
                        Upload a photo or PDF of your Parenting Orders. Our AI will extract the care schedule and calculate the exact night counts for you.
                    </Text>

                    {!loading && !result && (
                        <Pressable style={styles.uploadButton} onPress={pickDocument}>
                            <Feather name="upload" size={24} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.uploadButtonText}>Select File to Analyze</Text>
                        </Pressable>
                    )}

                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#2563eb" />
                            <Text style={styles.loadingText}>Analyzing Court Order...</Text>
                            <Text style={styles.loadingSubText}>This may take up to 30 seconds</Text>
                        </View>
                    )}

                    {result && (
                        <View style={styles.resultContainer}>
                            <View style={styles.successHeader}>
                                <Feather name="check-circle" size={24} color="#16a34a" />
                                <Text style={styles.successTitle}>Analysis Complete</Text>
                            </View>

                            <View style={styles.statRow}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Mother's Nights</Text>
                                    <Text style={styles.statValue}>{result.motherNightsPerYear}</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Father's Nights</Text>
                                    <Text style={styles.statValue}>{result.fatherNightsPerYear}</Text>
                                </View>
                            </View>

                            <View style={styles.statRow}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Mother's %</Text>
                                    <Text style={styles.statValue}>{result.motherPercentage}%</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Father's %</Text>
                                    <Text style={styles.statValue}>{result.fatherPercentage}%</Text>
                                </View>
                            </View>

                            <Pressable
                                style={styles.actionButton}
                                onPress={() => {
                                    Alert.alert("Values Saved", "These values will be used for calculation.");
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

                {/* Debug View for extracted pattern */}
                {orderJson && (
                    <View style={styles.debugBox}>
                        <Text style={styles.debugTitle}>Extracted Schedule:</Text>
                        {orderJson.base_pattern.map((p, i) => (
                            <Text key={i} style={styles.debugText}>
                                Week {p.week} {p.day}: {p.care_with} ({p.notes || 'No notes'})
                            </Text>
                        ))}
                    </View>
                )}

            </ScrollView>
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
});
