import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
import { useAnalytics } from '../src/utils/analytics';
import { getCoAReasonById } from '../src/utils/change-of-assessment-reasons';
import type { ChangeOfAssessmentReason } from '../src/utils/change-of-assessment-reasons';

// ============================================================================
// Types
// ============================================================================

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    consent?: string;
}

interface FormTouched {
    name: boolean;
    email: boolean;
    phone: boolean;
    message: boolean;
    consent: boolean;
}

interface LeadData {
    name: string;
    email: string;
    phone: string;
    message: string;
    liability: string;
    trigger: string;
    incomeA: string;
    incomeB: string;
    childrenCount: string;
    submittedAt: string;
}

// ============================================================================
// Validation Constants & Helpers
// ============================================================================

const VALIDATION = {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    MESSAGE_MIN_LENGTH: 10,
    MESSAGE_MAX_LENGTH: 500,
    PHONE_REGEX: /^[\d\s\-+()]{8,20}$/,
    // Comprehensive email regex that handles most valid emails
    EMAIL_REGEX: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
} as const;

/**
 * Sanitize a string by trimming whitespace and collapsing multiple spaces
 */
function sanitizeString(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
}

/**
 * Sanitize email: trim, lowercase, remove extra spaces
 */
function sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

/**
 * Sanitize phone: remove all non-digit characters except + at start
 */
function sanitizePhone(phone: string): string {
    const trimmed = phone.trim();
    if (!trimmed) return '';

    // Keep + at start if present, then only digits
    const hasPlus = trimmed.startsWith('+');
    const digitsOnly = trimmed.replace(/\D/g, '');
    return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

/**
 * Validate name field
 */
function validateName(name: string): string | undefined {
    const sanitized = sanitizeString(name);

    if (!sanitized) {
        return 'Name is required';
    }

    if (sanitized.length < VALIDATION.NAME_MIN_LENGTH) {
        return `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`;
    }

    if (sanitized.length > VALIDATION.NAME_MAX_LENGTH) {
        return `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`;
    }

    return undefined;
}

/**
 * Validate email field
 */
function validateEmail(email: string): string | undefined {
    const sanitized = sanitizeEmail(email);

    if (!sanitized) {
        return 'Email is required';
    }

    if (!VALIDATION.EMAIL_REGEX.test(sanitized)) {
        return 'Please enter a valid email address';
    }

    return undefined;
}

/**
 * Validate phone field (optional)
 */
function validatePhone(phone: string): string | undefined {
    const sanitized = phone.trim();

    // Phone is optional
    if (!sanitized) {
        return undefined;
    }

    if (!VALIDATION.PHONE_REGEX.test(sanitized)) {
        return 'Please enter a valid phone number';
    }

    return undefined;
}

/**
 * Validate message field
 */
function validateMessage(message: string): string | undefined {
    const sanitized = sanitizeString(message);

    if (!sanitized) {
        return 'Please tell us what you need help with';
    }

    if (sanitized.length < VALIDATION.MESSAGE_MIN_LENGTH) {
        return `Please provide at least ${VALIDATION.MESSAGE_MIN_LENGTH} characters`;
    }

    if (sanitized.length > VALIDATION.MESSAGE_MAX_LENGTH) {
        return `Message must be less than ${VALIDATION.MESSAGE_MAX_LENGTH} characters`;
    }

    return undefined;
}

/**
 * Validate consent checkbox
 */
function validateConsent(consent: boolean): string | undefined {
    if (!consent) {
        return 'You must consent to be contacted';
    }
    return undefined;
}

// ============================================================================
// Component
// ============================================================================

export default function LawyerInquiryScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const analytics = useAnalytics();

    // Parse route params with safe defaults
    const liability = typeof params.liability === 'string' ? params.liability : '0';
    const trigger = typeof params.trigger === 'string' ? params.trigger : 'unknown';
    const incomeA = typeof params.incomeA === 'string' ? params.incomeA : '0';
    const incomeB = typeof params.incomeB === 'string' ? params.incomeB : '0';
    const children = typeof params.children === 'string' ? params.children : '0';

    // Parse care arrangement data
    const careData = typeof params.careData === 'string'
        ? JSON.parse(params.careData) as Array<{ index: number; careA: number; careB: number }>
        : [];

    // Parse CoA reasons data with error handling
    let coaReasons: string[] | null = null;
    try {
        coaReasons = typeof params.coaReasons === 'string'
            ? JSON.parse(params.coaReasons) as string[]
            : null;
    } catch (error) {
        console.error('[LawyerInquiry] Failed to parse coaReasons:', error);
        // Continue without pre-fill
    }

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [consent, setConsent] = useState(false);

    // Validation state
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<FormTouched>({
        name: false,
        email: false,
        phone: false,
        message: false,
        consent: false
    });

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Refs for input focus management
    const emailRef = useRef<TextInput>(null);
    const phoneRef = useRef<TextInput>(null);
    const messageRef = useRef<TextInput>(null);

    // Capture mount timestamp for time_to_submit calculation
    const mountTimeRef = useRef<number>(Date.now());

    // Get valid CoA reasons for display
    const validCoAReasons: Array<ChangeOfAssessmentReason & { urgency: 'URGENT' | 'NORMAL' }> = 
        (coaReasons || [])
            .map(id => {
                const reason = getCoAReasonById(id);
                if (!reason) return null;
                
                // Determine urgency based on priority (1-3 = URGENT, 4-10 = NORMAL)
                const urgency = reason.priority <= 3 ? 'URGENT' : 'NORMAL';
                
                return { ...reason, urgency };
            })
            .filter((reason): reason is NonNullable<typeof reason> => reason !== null);

    // Determine if any urgent reasons exist (for card border styling)
    const hasUrgentReasonsForDisplay = validCoAReasons.some(r => r.urgency === 'URGENT');

    // Pre-fill message when CoA reasons are present
    useEffect(() => {
        if (coaReasons && coaReasons.length > 0) {
            const reasonLabels = coaReasons
                .map(id => getCoAReasonById(id)?.label)
                .filter(Boolean)
                .join('\n- ');

            const prefillMessage = `I would like help requesting a Change of Assessment for the following reasons:\n\n- ${reasonLabels}\n\nPlease contact me to discuss my situation.`;

            setMessage(prefillMessage);
        }
    }, [coaReasons]);

    /**
     * Validate a single field
     */
    const validateField = useCallback((field: keyof FormErrors, value: string | boolean): string | undefined => {
        switch (field) {
            case 'name':
                return validateName(value as string);
            case 'email':
                return validateEmail(value as string);
            case 'phone':
                return validatePhone(value as string);
            case 'message':
                return validateMessage(value as string);
            case 'consent':
                return validateConsent(value as boolean);
            default:
                return undefined;
        }
    }, []);

    /**
     * Validate all fields and return true if form is valid
     */
    const validateAllFields = useCallback((): boolean => {
        const newErrors: FormErrors = {
            name: validateName(name),
            email: validateEmail(email),
            phone: validatePhone(phone),
            message: validateMessage(message),
            consent: validateConsent(consent)
        };

        setErrors(newErrors);

        // Mark all fields as touched
        setTouched({
            name: true,
            email: true,
            phone: true,
            message: true,
            consent: true
        });

        // Check if any errors exist
        return !Object.values(newErrors).some(error => error !== undefined);
    }, [name, email, phone, message, consent]);

    /**
     * Handle field blur - validate and show error
     */
    const handleBlur = useCallback((field: keyof FormErrors) => {
        setTouched(prev => ({ ...prev, [field]: true }));

        const value = field === 'consent' ? consent :
            field === 'name' ? name :
                field === 'email' ? email :
                    field === 'phone' ? phone :
                        message;

        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [field]: error }));
    }, [name, email, phone, message, consent, validateField]);

    /**
     * Handle text change - clear error when user starts typing
     */
    const handleTextChange = useCallback((
        field: keyof FormErrors,
        value: string,
        setter: (value: string) => void
    ) => {
        // Enforce max length for message to prevent paste attacks
        if (field === 'message' && value.length > VALIDATION.MESSAGE_MAX_LENGTH) {
            value = value.slice(0, VALIDATION.MESSAGE_MAX_LENGTH);
        }

        setter(value);

        // Clear error when user starts typing (if field was touched)
        if (touched[field] && errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }, [touched, errors]);

    /**
     * Handle consent toggle
     */
    const handleConsentToggle = useCallback(() => {
        const newValue = !consent;
        setConsent(newValue);

        // Clear error when checking
        if (newValue && errors.consent) {
            setErrors(prev => ({ ...prev, consent: undefined }));
        }
    }, [consent, errors.consent]);

    /**
     * Handle form submission
     */
    const handleSubmit = useCallback(async () => {
        // Prevent double submission
        if (isSubmitting) {
            return;
        }

        // Validate all fields
        const isValid = validateAllFields();

        if (!isValid) {
            // Scroll to first error or show alert
            Alert.alert(
                'Please fix the errors',
                'Some fields need your attention before submitting.'
            );
            return;
        }

        setIsSubmitting(true);

        // Create sanitized lead data
        const leadData: LeadData = {
            name: sanitizeString(name),
            email: sanitizeEmail(email),
            phone: sanitizePhone(phone),
            message: sanitizeString(message),
            liability,
            trigger,
            incomeA,
            incomeB,
            childrenCount: children,
            submittedAt: new Date().toISOString()
        };

        try {
            // Track analytics with correct property names
            const timeToSubmit = Math.round((Date.now() - mountTimeRef.current) / 1000);

            analytics.track('inquiry_form_submitted', {
                trigger_type: trigger || 'unknown',
                annual_liability: parseFloat(liability) || 0,
                has_phone: !!leadData.phone,
                message_length: leadData.message.length,
                time_to_submit: timeToSubmit,
                // CoA tracking properties
                has_coa_reasons: (coaReasons?.length ?? 0) > 0,
                coa_reason_count: coaReasons?.length ?? 0,
                coa_reason_ids: coaReasons?.join(',') ?? '',
                has_urgent_reasons: validCoAReasons.some(r => r.urgency === 'URGENT')
            });
        } catch (error) {
            // Log but don't fail submission on analytics error
            console.error('[LawyerInquiry] Analytics error:', error);
        }

        // Log lead data (Phase 2 will send this to backend)
        console.log('[LawyerInquiry] Lead data:', JSON.stringify(leadData, null, 2));

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success
        setIsSubmitting(false);
        setShowSuccess(true);

        // Navigate back after delay
        setTimeout(() => {
            try {
                // Check if we can go back before attempting navigation
                if (router.canGoBack()) {
                    router.back();
                } else {
                    // No previous screen, go to home
                    router.replace('/');
                }
            } catch (error) {
                console.error('[LawyerInquiry] Navigation error:', error);
                // Fallback: try to go to home
                router.replace('/');
            }
        }, 2500);
    }, [isSubmitting, validateAllFields, name, email, phone, message, liability, trigger, incomeA, incomeB, children, router, analytics]);

    /**
     * Format currency for display
     */
    const formatCurrency = (value: string): string => {
        const num = parseFloat(value);
        if (isNaN(num)) return '$0';
        return `$${Math.round(num).toLocaleString()}`;
    };

    // Success overlay
    if (showSuccess) {
        return (
            <SafeAreaView style={styles.successContainer}>
                <View style={styles.successContent}>
                    <Text style={styles.successIcon}>✓</Text>
                    <Text style={styles.successTitle}>Thank You!</Text>
                    <Text style={styles.successMessage}>
                        Your inquiry has been submitted.{'\n'}
                        A lawyer will contact you within 24 hours.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>Request Legal Help</Text>

                    {/* Change of Assessment Reasons Card - Show only if reasons exist */}
                    {validCoAReasons.length > 0 && (
                        <View style={[
                            styles.coaCard,
                            hasUrgentReasonsForDisplay && styles.coaCardUrgent
                        ]}>
                            <Text style={styles.coaTitle}>📋 CHANGE OF ASSESSMENT GROUNDS SELECTED</Text>
                            
                            {validCoAReasons.map((reason, index) => (
                                <View key={reason.id} style={[
                                    styles.coaReasonContainer,
                                    index < validCoAReasons.length - 1 && styles.coaReasonBorder
                                ]}>
                                    <View style={styles.coaReasonHeader}>
                                        <Text style={[
                                            styles.coaReasonIcon,
                                            reason.urgency === 'URGENT' ? styles.coaIconUrgent : styles.coaIconNormal
                                        ]}>
                                            {reason.urgency === 'URGENT' ? '⚠️' : '📋'}
                                        </Text>
                                        <Text style={styles.coaReasonLabel} numberOfLines={2}>
                                            {reason.label}
                                        </Text>
                                    </View>
                                    <Text style={styles.coaReasonDescription} numberOfLines={3}>
                                        {reason.description}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Calculation Summary (read-only) */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Your Calculation Summary</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Annual Liability:</Text>
                            <Text style={styles.summaryAmount}>{formatCurrency(liability)}/year</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Parent A Income:</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(incomeA)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Parent B Income:</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(incomeB)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Number of Children:</Text>
                            <Text style={styles.summaryValue}>{children}</Text>
                        </View>

                        {/* Care Arrangement */}
                        {careData.length > 0 && (
                            <>
                                <View style={styles.summarySeparator} />
                                <Text style={styles.summarySubtitle}>Care Arrangement</Text>
                                {careData.map((child, idx) => (
                                    <View key={idx} style={styles.careRow}>
                                        <Text style={styles.careChildLabel}>Child {idx + 1}:</Text>
                                        <View style={styles.carePercentages}>
                                            <Text style={styles.careValue}>
                                                Parent A: {child.careA.toFixed(0)}%
                                            </Text>
                                            <Text style={styles.careSeparator}>•</Text>
                                            <Text style={styles.careValue}>
                                                Parent B: {child.careB.toFixed(0)}%
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </>
                        )}
                    </View>

                    <Text style={styles.formTitle}>Your Information</Text>

                    {/* Name Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, touched.name && errors.name && styles.inputError]}
                            placeholder="Your Name *"
                            placeholderTextColor="#64748b"
                            value={name}
                            onChangeText={(value) => handleTextChange('name', value, setName)}
                            onBlur={() => handleBlur('name')}
                            returnKeyType="next"
                            onSubmitEditing={() => emailRef.current?.focus()}
                            autoCapitalize="words"
                            autoComplete="name"
                            textContentType="name"
                            maxLength={VALIDATION.NAME_MAX_LENGTH}
                            editable={!isSubmitting}
                            accessibilityLabel="Your name"
                            accessibilityHint="Enter your full name"
                        />
                        {touched.name && errors.name && (
                            <Text style={styles.errorText}>{errors.name}</Text>
                        )}
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={emailRef}
                            style={[styles.input, touched.email && errors.email && styles.inputError]}
                            placeholder="Email *"
                            placeholderTextColor="#64748b"
                            value={email}
                            onChangeText={(value) => handleTextChange('email', value, setEmail)}
                            onBlur={() => handleBlur('email')}
                            keyboardType="email-address"
                            returnKeyType="next"
                            onSubmitEditing={() => phoneRef.current?.focus()}
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="email"
                            textContentType="emailAddress"
                            editable={!isSubmitting}
                            accessibilityLabel="Email address"
                            accessibilityHint="Enter your email address"
                        />
                        {touched.email && errors.email && (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                    </View>

                    {/* Phone Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={phoneRef}
                            style={[styles.input, touched.phone && errors.phone && styles.inputError]}
                            placeholder="Phone (optional)"
                            placeholderTextColor="#64748b"
                            value={phone}
                            onChangeText={(value) => handleTextChange('phone', value, setPhone)}
                            onBlur={() => handleBlur('phone')}
                            keyboardType="phone-pad"
                            returnKeyType="next"
                            onSubmitEditing={() => messageRef.current?.focus()}
                            autoComplete="tel"
                            textContentType="telephoneNumber"
                            maxLength={20}
                            editable={!isSubmitting}
                            accessibilityLabel="Phone number"
                            accessibilityHint="Optional. Enter your phone number"
                        />
                        {touched.phone && errors.phone && (
                            <Text style={styles.errorText}>{errors.phone}</Text>
                        )}
                    </View>

                    {/* Message Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={messageRef}
                            style={[
                                styles.input,
                                styles.textArea,
                                touched.message && errors.message && styles.inputError
                            ]}
                            placeholder="What do you need help with? *"
                            placeholderTextColor="#64748b"
                            value={message}
                            onChangeText={(value) => handleTextChange('message', value, setMessage)}
                            onBlur={() => handleBlur('message')}
                            multiline
                            numberOfLines={4}
                            maxLength={VALIDATION.MESSAGE_MAX_LENGTH}
                            editable={!isSubmitting}
                            accessibilityLabel="Message"
                            accessibilityHint="Describe your situation and what help you need"
                        />
                        <Text style={styles.charCount}>
                            {message.length}/{VALIDATION.MESSAGE_MAX_LENGTH}
                        </Text>
                        {touched.message && errors.message && (
                            <Text style={styles.errorText}>{errors.message}</Text>
                        )}
                    </View>

                    {/* Consent Checkbox */}
                    <Pressable
                        style={styles.checkboxContainer}
                        onPress={handleConsentToggle}
                        disabled={isSubmitting}
                        accessible={true}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: consent }}
                        accessibilityLabel="Consent to be contacted"
                    >
                        <View style={[
                            styles.checkbox,
                            consent && styles.checkboxChecked,
                            touched.consent && errors.consent && styles.checkboxError
                        ]}>
                            {consent && <Text style={styles.checkboxCheck}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxLabel}>
                            I consent to being contacted by a lawyer regarding my child support case *
                        </Text>
                    </Pressable>
                    {touched.consent && errors.consent && (
                        <Text style={[styles.errorText, styles.checkboxErrorText]}>{errors.consent}</Text>
                    )}

                    {/* Submit Button */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                            isSubmitting && styles.buttonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={isSubmitting ? 'Submitting inquiry' : 'Submit inquiry'}
                        accessibilityState={{ disabled: isSubmitting }}
                    >
                        {isSubmitting ? (
                            <View style={styles.buttonContent}>
                                <ActivityIndicator color="#ffffff" size="small" />
                                <Text style={styles.buttonText}>Submitting...</Text>
                            </View>
                        ) : (
                            <Text style={styles.buttonText}>Submit Inquiry</Text>
                        )}
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ============================================================================
// Styles
// ============================================================================

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
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 20,
    },
    // Change of Assessment card styles
    coaCard: {
        backgroundColor: '#1e293b', // slate-800
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#334155', // slate-700 (normal)
    },
    coaCardUrgent: {
        borderColor: '#ef4444', // red-500 (urgent)
    },
    coaTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#94a3b8', // slate-400
        letterSpacing: 0.5,
        marginBottom: 16,
    },
    coaReasonContainer: {
        marginBottom: 12,
    },
    coaReasonBorder: {
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#334155', // slate-700
    },
    coaReasonHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    coaReasonIcon: {
        fontSize: 16,
        marginRight: 8,
        marginTop: 2,
    },
    coaIconUrgent: {
        color: '#ef4444', // red-500
    },
    coaIconNormal: {
        color: '#3b82f6', // blue-500
    },
    coaReasonLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#ffffff',
        lineHeight: 20,
    },
    coaReasonDescription: {
        fontSize: 13,
        color: '#94a3b8', // slate-400
        lineHeight: 18,
        marginLeft: 24, // Align with label (icon width + margin)
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
    summarySeparator: {
        height: 1,
        backgroundColor: '#334155', // slate-700
        marginVertical: 12,
    },
    summarySubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#cbd5e1', // slate-300
        marginBottom: 8,
    },
    careRow: {
        marginBottom: 6,
    },
    careChildLabel: {
        fontSize: 13,
        color: '#94a3b8', // slate-400
        marginBottom: 4,
    },
    carePercentages: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    careValue: {
        fontSize: 13,
        fontWeight: '500',
        color: '#e2e8f0', // slate-200
    },
    careSeparator: {
        fontSize: 13,
        color: '#64748b', // slate-500
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#1e293b', // slate-800
        color: '#ffffff',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#334155', // slate-700
        fontSize: 16,
    },
    inputError: {
        borderColor: '#ef4444', // red-500
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    charCount: {
        fontSize: 12,
        color: '#64748b', // slate-500
        textAlign: 'right',
        marginTop: 4,
    },
    errorText: {
        color: '#ef4444', // red-500
        fontSize: 12,
        marginTop: 4,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
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
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: '#f59e0b', // amber-500
        borderColor: '#f59e0b',
    },
    checkboxError: {
        borderColor: '#ef4444', // red-500
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
    checkboxErrorText: {
        marginLeft: 36,
        marginTop: 0,
    },
    button: {
        backgroundColor: '#2563eb', // blue-600
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonPressed: {
        backgroundColor: '#1d4ed8', // blue-700
    },
    buttonDisabled: {
        backgroundColor: '#64748b', // slate-500
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Success screen styles
    successContainer: {
        flex: 1,
        backgroundColor: '#0f172a', // slate-900
        justifyContent: 'center',
        alignItems: 'center',
    },
    successContent: {
        alignItems: 'center',
        padding: 40,
    },
    successIcon: {
        fontSize: 64,
        color: '#22c55e', // green-500
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 16,
    },
    successMessage: {
        fontSize: 16,
        color: '#94a3b8', // slate-400
        textAlign: 'center',
        lineHeight: 24,
    },
});
