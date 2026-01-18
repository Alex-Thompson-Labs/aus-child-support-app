import { PageSEO } from '@/src/components/seo/PageSEO';
import { CalculatorHeader } from '@/src/features/calculator';
import {
  isWeb,
  MAX_CALCULATOR_WIDTH,
  webClickableStyles,
} from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { sendContactEmail } from '@/src/utils/emailjs';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Topic options for the contact form
const TOPIC_OPTIONS = [
  'Website Bug or Issue',
  'Feature Request',
  'Calculator Question',
  'Partnership Opportunity',
  'General Feedback',
  'Other',
];

// Schema.org structured data for Contact page
const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact AusChildSupport',
  description:
    'Contact us for questions about the Australian Child Support Calculator.',
  mainEntity: {
    '@type': 'Organization',
    name: 'AusChildSupport',
    url: 'https://auschildsupport.com',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: 'English',
    },
  },
};

export default function ContactPage() {
  const router = useRouter();

  // Contact form modal state
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    message: '',
  });
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const webContainerStyle = isWeb
    ? {
        maxWidth: MAX_CALCULATOR_WIDTH,
        width: '100%' as const,
        alignSelf: 'center' as const,
      }
    : {};

  const handleSubmitContact = async () => {
    // Validate form
    if (
      !formData.name ||
      !formData.email ||
      !formData.topic ||
      !formData.message
    ) {
      setSubmitError('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Send via EmailJS
      const result = await sendContactEmail({
        name: formData.name,
        email: formData.email,
        topic: formData.topic,
        message: formData.message,
      });

      if (!result.success) {
        setSubmitError(result.error || 'Unable to send message. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        setShowContactModal(false);
        setSubmitSuccess(false);
        setFormData({ name: '', email: '', topic: '', message: '' });
      }, 2000);
    } catch (error) {
      setSubmitError('Unable to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageSEO
        title="Contact | Child Support Calculator Australia"
        description="Get in touch with AusChildSupport. Connect with family law professionals or visit our blog for child support guidance in Australia."
        canonicalPath="/contact"
        schema={contactSchema}
      />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <CalculatorHeader
          title="Contact"
          showBackButton={true}
          maxWidth={MAX_CALCULATOR_WIDTH}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, webContainerStyle]}
        >
          {/* Page Title */}
          {/* @ts-ignore - Web-only ARIA attributes */}
          <Text
            style={styles.pageTitle}
            accessibilityRole="header"
            aria-level="1"
          >
            Contact Us
          </Text>

          {/* Intro */}
          <Text style={styles.introText}>
            Have questions about child support calculations or need professional
            advice? Here&apos;s how you can reach us.
          </Text>

          {/* Legal Help Card */}
          <View style={styles.contactCard}>
            {/* @ts-ignore - Web-only ARIA attributes */}
            <Text
              style={styles.cardTitle}
              accessibilityRole="header"
              aria-level="2"
            >
              Need Legal Help?
            </Text>
            <Text style={styles.cardDescription}>
              Connect with independent family law professionals who can review
              your child support situation and provide tailored advice.
            </Text>
            <Pressable
              style={[styles.primaryButton, isWeb && webClickableStyles]}
              onPress={() => router.push('/lawyer-inquiry')}
              accessibilityRole="button"
              accessibilityLabel="Request legal help"
            >
              <Text style={styles.primaryButtonText}>Request Legal Help</Text>
            </Pressable>
          </View>

          {/* Blog Card */}
          <View style={styles.contactCard}>
            {/* @ts-ignore - Web-only ARIA attributes */}
            <Text
              style={styles.cardTitle}
              accessibilityRole="header"
              aria-level="2"
            >
              Visit Our Blog
            </Text>
            <Text style={styles.cardDescription}>
              Read articles about child support, family law, and financial
              planning for separated parents in Australia.
            </Text>
            <Pressable
              style={[styles.secondaryButton, isWeb && webClickableStyles]}
              onPress={() =>
                Linking.openURL('https://blog.auschildsupport.com.au')
              }
              accessibilityRole="button"
              accessibilityLabel="Visit blog"
            >
              <Text style={styles.secondaryButtonText}>Visit Blog →</Text>
            </Pressable>
          </View>

          {/* Calculator Card */}
          <View style={styles.contactCard}>
            {/* @ts-ignore - Web-only ARIA attributes */}
            <Text
              style={styles.cardTitle}
              accessibilityRole="header"
              aria-level="2"
            >
              Use the Calculator
            </Text>
            <Text style={styles.cardDescription}>
              Estimate your child support payments using the official 2026
              Services Australia formula.
            </Text>
            <Pressable
              style={[styles.secondaryButton, isWeb && webClickableStyles]}
              onPress={() => router.push('/')}
              accessibilityRole="button"
              accessibilityLabel="Go to calculator"
            >
              <Text style={styles.secondaryButtonText}>Calculator →</Text>
            </Pressable>
          </View>

          {/* General Enquiries Card */}
          <View style={styles.contactCard}>
            {/* @ts-ignore - Web-only ARIA attributes */}
            <Text
              style={styles.cardTitle}
              accessibilityRole="header"
              aria-level="2"
            >
              General Enquiries
            </Text>
            <Text style={styles.cardDescription}>
              Have a question about the website, found a bug, or just want to
              say hello?
            </Text>
            <Pressable
              style={[styles.secondaryButton, isWeb && webClickableStyles]}
              onPress={() => setShowContactModal(true)}
              accessibilityRole="button"
              accessibilityLabel="Contact us"
            >
              <Text style={styles.secondaryButtonText}>Contact Us</Text>
            </Pressable>

            {/* Disclaimer */}
            <View style={styles.cardDisclaimer}>
              <Text style={styles.cardDisclaimerText}>
                We aim to respond within 48 hours. Please note we cannot provide
                legal advice via email.
              </Text>
            </View>

            {/* FAQ Link */}
            <Pressable
              style={styles.faqLink}
              onPress={() => router.push('/faq')}
              accessibilityRole="button"
              accessibilityLabel="View frequently asked questions"
            >
              <Text style={styles.faqLinkText}>
                Frequently Asked Questions →
              </Text>
            </Pressable>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              AusChildSupport provides estimation tools only. For official child
              support assessments, contact Services Australia directly.
            </Text>
          </View>
        </ScrollView>

        {/* Contact Form Modal */}
        <Modal
          visible={showContactModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowContactModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowContactModal(false)}>
            <View style={modalStyles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={modalStyles.modalContent}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Modal Header */}
                    <View style={modalStyles.modalHeader}>
                      <Text style={modalStyles.modalTitle}>Contact Us</Text>
                      <Pressable
                        onPress={() => setShowContactModal(false)}
                        style={modalStyles.closeButton}
                        accessibilityRole="button"
                        accessibilityLabel="Close contact form"
                      >
                        <Ionicons name="close" size={24} color="#64748b" />
                      </Pressable>
                    </View>

                    {submitSuccess ? (
                      // Success Message
                      <View style={modalStyles.successContainer}>
                        <Ionicons
                          name="checkmark-circle"
                          size={64}
                          color="#10b981"
                        />
                        <Text style={modalStyles.successTitle}>
                          Message Sent!
                        </Text>
                        <Text style={modalStyles.successText}>
                          Thank you for contacting us. We&apos;ll get back to
                          you soon.
                        </Text>
                      </View>
                    ) : (
                      <>
                        {/* Form Fields */}
                        <View style={modalStyles.formGroup}>
                          <Text style={modalStyles.label}>Name *</Text>
                          <TextInput
                            style={modalStyles.input}
                            placeholder="Your name"
                            placeholderTextColor="#94a3b8"
                            value={formData.name}
                            onChangeText={(text) =>
                              setFormData({ ...formData, name: text })
                            }
                            editable={!isSubmitting}
                          />
                        </View>

                        <View style={modalStyles.formGroup}>
                          <Text style={modalStyles.label}>Email *</Text>
                          <TextInput
                            style={modalStyles.input}
                            placeholder="your.email@example.com"
                            placeholderTextColor="#94a3b8"
                            value={formData.email}
                            onChangeText={(text) =>
                              setFormData({ ...formData, email: text })
                            }
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isSubmitting}
                          />
                        </View>

                        <View style={modalStyles.formGroup}>
                          <Text style={modalStyles.label}>Topic *</Text>
                          <Pressable
                            style={modalStyles.dropdownButton}
                            onPress={() =>
                              setShowTopicDropdown(!showTopicDropdown)
                            }
                            disabled={isSubmitting}
                          >
                            <Text
                              style={[
                                modalStyles.dropdownButtonText,
                                !formData.topic &&
                                  modalStyles.dropdownPlaceholder,
                              ]}
                            >
                              {formData.topic || 'Select a topic'}
                            </Text>
                            <Ionicons
                              name={
                                showTopicDropdown
                                  ? 'chevron-up'
                                  : 'chevron-down'
                              }
                              size={20}
                              color="#64748b"
                            />
                          </Pressable>

                          {showTopicDropdown && (
                            <View style={modalStyles.dropdownMenu}>
                              {TOPIC_OPTIONS.map((topic) => (
                                <Pressable
                                  key={topic}
                                  style={modalStyles.dropdownItem}
                                  onPress={() => {
                                    setFormData({ ...formData, topic });
                                    setShowTopicDropdown(false);
                                  }}
                                >
                                  <Text style={modalStyles.dropdownItemText}>
                                    {topic}
                                  </Text>
                                </Pressable>
                              ))}
                            </View>
                          )}
                        </View>

                        <View style={modalStyles.formGroup}>
                          <Text style={modalStyles.label}>Message *</Text>
                          <TextInput
                            style={[modalStyles.input, modalStyles.textArea]}
                            placeholder="Tell us more about your enquiry..."
                            placeholderTextColor="#94a3b8"
                            value={formData.message}
                            onChangeText={(text) =>
                              setFormData({ ...formData, message: text })
                            }
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            editable={!isSubmitting}
                          />
                        </View>

                        {/* Error Message */}
                        {submitError && (
                          <View style={modalStyles.errorContainer}>
                            <Ionicons
                              name="warning"
                              size={20}
                              color="#dc2626"
                            />
                            <Text style={modalStyles.errorText}>
                              {submitError}
                            </Text>
                          </View>
                        )}

                        {/* Disclaimer */}
                        <View style={modalStyles.disclaimerBox}>
                          <Text style={modalStyles.disclaimerBoxText}>
                            We aim to respond within 48 hours. Please note we
                            cannot provide legal advice via email.
                          </Text>
                        </View>

                        {/* Submit Button */}
                        <Pressable
                          style={[
                            modalStyles.submitButton,
                            isSubmitting && modalStyles.submitButtonDisabled,
                            isWeb && !isSubmitting && webClickableStyles,
                          ]}
                          onPress={handleSubmitContact}
                          disabled={isSubmitting}
                        >
                          <Text style={modalStyles.submitButtonText}>
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </Text>
                        </Pressable>
                      </>
                    )}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  backButtonText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 24,
  },
  contactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    }),
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    ...createShadow({
      shadowColor: '#2563EB',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
    textAlign: 'center',
  },
  cardDisclaimer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  cardDisclaimerText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
    textAlign: 'center',
  },
  faqLink: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  faqLinkText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

// Modal styles
const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5,
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#1e293b',
  },
  dropdownPlaceholder: {
    color: '#94a3b8',
  },
  dropdownMenu: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#475569',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#dc2626',
    lineHeight: 20,
  },
  disclaimerBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  disclaimerBoxText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    ...createShadow({
      shadowColor: '#2563EB',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
    marginTop: 16,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
  },
});
