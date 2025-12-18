import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LawyerInquiryScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();

    console.log('[LawyerInquiryScreen] Screen mounted!');
    console.log('[LawyerInquiryScreen] Params:', params);

    // Parse route params
    const liability = params.liability as string;
    const trigger = params.trigger as string;
    const incomeA = params.incomeA as string;
    const incomeB = params.incomeB as string;
    const children = params.children as string;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [consent, setConsent] = useState(false);

    const handleSubmit = () => {
        // TODO: Implement form submission
        console.log('Form submitted:', { name, email, phone, message, liability, trigger });
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.title}>Request Legal Help</Text>

                    {/* Calculation Summary (read-only) */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Your Calculation Summary</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Annual Liability:</Text>
                            <Text style={styles.summaryAmount}>${liability ? parseFloat(liability).toLocaleString() : '0'}/year</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Parent A Income:</Text>
                            <Text style={styles.summaryValue}>${incomeA ? parseFloat(incomeA).toLocaleString() : '0'}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Parent B Income:</Text>
                            <Text style={styles.summaryValue}>${incomeB ? parseFloat(incomeB).toLocaleString() : '0'}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Number of Children:</Text>
                            <Text style={styles.summaryValue}>{children || '0'}</Text>
                        </View>
                    </View>

                    <Text style={styles.formTitle}>Your Information</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Your Name"
                        placeholderTextColor="#64748b"
                        value={name}
                        onChangeText={setName}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#64748b"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Phone (optional)"
                        placeholderTextColor="#64748b"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="What do you need help with?"
                        placeholderTextColor="#64748b"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        numberOfLines={4}
                    />

                    {/* Consent Checkbox */}
                    <Pressable
                        style={styles.checkboxContainer}
                        onPress={() => setConsent(!consent)}
                    >
                        <View style={[styles.checkbox, consent && styles.checkboxChecked]}>
                            {consent && <Text style={styles.checkboxCheck}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxLabel}>
                            I consent to being contacted by a lawyer regarding my child support case
                        </Text>
                    </Pressable>

                    <Pressable style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit Inquiry</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a', // slate-900
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 20,
    },
    summaryCard: {
        backgroundColor: '#1e293b', // slate-800
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#334155', // slate-700
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#94a3b8', // slate-400
    },
    summaryAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2563eb', // blue-600
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#ffffff',
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#1e293b', // slate-800
        color: '#ffffff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#334155', // slate-700
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#334155', // slate-700
        backgroundColor: '#1e293b', // slate-800
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: '#2563eb', // blue-600
        borderColor: '#2563eb',
    },
    checkboxCheck: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    checkboxLabel: {
        flex: 1,
        fontSize: 14,
        color: '#cbd5e1', // slate-300
        lineHeight: 20,
    },
    button: {
        backgroundColor: '#2563eb', // blue-600
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});
