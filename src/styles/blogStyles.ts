import { createShadow } from '@/src/utils/shadow-styles';
import { Platform, StyleSheet } from 'react-native';

/**
 * Shared blog post styles - January 2026 optimization
 * 
 * Optimized for mobile readability with:
 * - Increased padding (20px) for breathing room
 * - Better line height (1.6) for legal content
 * - Clear visual hierarchy with color differentiation
 * - Distinct callout box types (info, urgent, warning, example)
 * - Prominent CTA buttons with darker blue
 * 
 * See docs/DESIGN_SYSTEM.md for full specifications
 */
export const createBlogStyles = () => StyleSheet.create({
    // Layout
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 32 },
    
    // Article Header
    articleHeader: { marginBottom: 24 },
    category: { 
        fontSize: 14, 
        fontWeight: '600', 
        color: '#2563eb', 
        textTransform: 'uppercase', 
        letterSpacing: 0.5, 
        marginBottom: 8 
    },
    publishDate: { fontSize: 14, color: '#64748b' },
    
    // Typography - Optimized for readability
    h1: { 
        fontSize: 32, 
        fontWeight: '700', 
        color: '#1e3a8a', 
        marginBottom: 12, 
        ...(Platform.OS === 'web' ? { lineHeight: 40 } : {}) 
    },
    h2: { 
        fontSize: 24, 
        fontWeight: '700', 
        color: '#1e293b', 
        marginTop: 48, 
        marginBottom: 16, 
        ...(Platform.OS === 'web' ? { lineHeight: 32 } : {}) 
    },
    h3: { 
        fontSize: 20, 
        fontWeight: '600', 
        color: '#475569', 
        marginTop: 32, 
        marginBottom: 12, 
        ...(Platform.OS === 'web' ? { lineHeight: 28 } : {}) 
    },
    intro: { 
        fontSize: 18, 
        lineHeight: 28, 
        color: '#334155', 
        marginBottom: 16, 
        fontWeight: '500' 
    },
    paragraph: { 
        fontSize: 16, 
        lineHeight: 25.6, // 1.6x for better readability
        color: '#475569', 
        marginBottom: 18 
    },
    bulletItem: { 
        fontSize: 15, 
        lineHeight: 24, 
        color: '#475569', 
        marginBottom: 12, // Increased from 8px
        paddingLeft: 8 
    },
    bold: { 
        fontWeight: '600', 
        color: '#3b82f6' // Medium blue for labels
    },
    
    // Inline Links
    inlineLink: { 
        color: '#2563eb', 
        fontWeight: '600', 
        textDecorationLine: 'underline' 
    },
    
    // Quick Answer Box (Hero CTA)
    quickAnswerBox: { 
        backgroundColor: '#2563eb', 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 24, 
        alignItems: 'center', 
        ...createShadow({ 
            shadowColor: '#2563eb', 
            shadowOffset: { width: 0, height: 4 }, 
            shadowOpacity: 0.3, 
            shadowRadius: 8, 
            elevation: 4 
        }) 
    },
    quickAnswerTitle: { 
        fontSize: 18, 
        fontWeight: '700', 
        color: '#ffffff', 
        marginBottom: 8 
    },
    quickAnswerText: { 
        fontSize: 15, 
        lineHeight: 24, 
        color: '#ffffff', 
        textAlign: 'center' 
    },
    
    // Info Boxes (Blue) - General information
    greenCard: { 
        backgroundColor: '#eff6ff', 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 24, 
        marginTop: 16, 
        borderWidth: 1, 
        borderColor: '#bfdbfe' 
    },
    greenCardTitle: { 
        fontSize: 17, 
        fontWeight: '700', 
        color: '#1e40af', 
        marginBottom: 12 
    },
    
    // Info Boxes (alternative naming)
    dangerCard: { 
        backgroundColor: '#eff6ff', 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 24, 
        marginTop: 16, 
        borderWidth: 1, 
        borderColor: '#bfdbfe' 
    },
    dangerCardTitle: { 
        fontSize: 17, 
        fontWeight: '700', 
        color: '#1e40af', 
        marginBottom: 12 
    },
    
    // Real Example Boxes (Gray with blue accent)
    exampleCard: { 
        backgroundColor: '#f1f5f9', // Gray instead of blue
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 24, 
        marginTop: 16, 
        borderLeftWidth: 4, 
        borderLeftColor: '#2563eb', 
        ...createShadow({ 
            shadowColor: '#2563eb', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.1, 
            shadowRadius: 4, 
            elevation: 2 
        }) 
    },
    exampleTitle: { 
        fontSize: 17, 
        fontWeight: '700', 
        color: '#1e40af', 
        marginBottom: 12 
    },
    exampleText: { 
        fontSize: 16, 
        lineHeight: 25.6, 
        color: '#475569', 
        marginBottom: 12 
    },
    exampleResult: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#1e40af', 
        marginTop: 12, 
        marginBottom: 6 
    },
    exampleCalc: { 
        fontSize: 16, 
        fontWeight: '500', // No monospace
        color: '#334155', 
        marginBottom: 6, 
        paddingLeft: 8 
    },
    exampleImpact: { 
        fontSize: 16, 
        color: '#475569', 
        fontStyle: 'italic', 
        marginTop: 12, 
        fontWeight: '500' 
    },
    
    // Urgent Boxes (Red) - Time-sensitive
    urgentCard: { 
        backgroundColor: '#fee2e2', // Light red
        borderRadius: 12, 
        borderWidth: 3, // Thicker border
        borderColor: '#dc2626', 
        padding: 20, 
        marginBottom: 24, 
        marginTop: 16, 
        ...createShadow({ 
            shadowColor: '#dc2626', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.2, 
            shadowRadius: 4, 
            elevation: 3 
        }) 
    },
    urgentCardTitle: { 
        fontSize: 18, 
        fontWeight: '700', 
        color: '#991b1b', 
        marginBottom: 12 
    },
    
    // Warning Boxes (Yellow/Amber)
    warningBox: { 
        backgroundColor: '#fef3c7', // Light yellow
        borderRadius: 12, 
        borderWidth: 3, 
        borderColor: '#f59e0b', 
        padding: 20, 
        marginBottom: 24, 
        marginTop: 16 
    },
    warningTitle: { 
        fontSize: 17, 
        fontWeight: '700', 
        color: '#92400e', 
        marginBottom: 12 
    },
    warningText: { 
        fontSize: 16, 
        lineHeight: 25.6, 
        color: '#78350f' 
    },
    
    // Cost/Financial Boxes (Amber with left border)
    costCard: { 
        backgroundColor: '#fef3c7', 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 24, 
        marginTop: 16, 
        borderLeftWidth: 4, 
        borderLeftColor: '#f59e0b', 
        borderWidth: 1, 
        borderColor: '#fde68a' 
    },
    costTitle: { 
        fontSize: 17, 
        fontWeight: '700', 
        color: '#92400e', 
        marginBottom: 12 
    },
    costText: { 
        fontSize: 16, 
        lineHeight: 25.6, 
        color: '#78350f', 
        marginBottom: 8 
    },
    
    // Pricing Cards
    pricingCard: { 
        backgroundColor: '#ffffff', 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 16, 
        borderWidth: 1, 
        borderColor: '#e2e8f0', 
        ...createShadow({ 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 1 }, 
            shadowOpacity: 0.06, 
            shadowRadius: 3, 
            elevation: 2 
        }) 
    },
    pricingTitle: { 
        fontSize: 17, 
        fontWeight: '700', 
        color: '#1e40af', 
        marginBottom: 12 
    },
    pricingItem: { 
        fontSize: 15, 
        lineHeight: 24, 
        color: '#475569', 
        marginBottom: 6 
    },
    
    // Tip/Info Cards
    tipCard: { 
        backgroundColor: '#eff6ff', 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 24, 
        marginTop: 16, 
        borderWidth: 1, 
        borderColor: '#bfdbfe' 
    },
    tipTitle: { 
        fontSize: 17, 
        fontWeight: '700', 
        color: '#1e40af', 
        marginBottom: 12 
    },
    
    // Checklist Cards
    checklistCard: { 
        backgroundColor: '#eff6ff', 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 24, 
        marginTop: 16, 
        borderWidth: 1, 
        borderColor: '#bfdbfe' 
    },
    checklistTitle: { 
        fontSize: 17, 
        fontWeight: '700', 
        color: '#1e40af', 
        marginBottom: 12 
    },
    
    // Red Flag Cards
    redFlagCard: { 
        backgroundColor: '#f1f5f9', 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 24, 
        marginTop: 16, 
        borderWidth: 1, 
        borderColor: '#cbd5e1' 
    },
    redFlagTitle: { 
        fontSize: 17, 
        fontWeight: '700', 
        color: '#475569', 
        marginBottom: 12 
    },
    
    // Framework/Decision Cards
    frameworkCard: { 
        backgroundColor: '#ffffff', 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 16, 
        borderWidth: 1, 
        borderColor: '#e2e8f0', 
        ...createShadow({ 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 1 }, 
            shadowOpacity: 0.06, 
            shadowRadius: 3, 
            elevation: 2 
        }) 
    },
    frameworkTitle: { 
        fontSize: 17, 
        fontWeight: '700', 
        color: '#1e40af', 
        marginBottom: 12 
    },
    frameworkAction: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#2563eb', 
        marginTop: 12, 
        fontStyle: 'italic' 
    },
    
    // List Cards (white background)
    listCard: { 
        backgroundColor: '#ffffff', 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 24, 
        marginTop: 16, 
        borderWidth: 1, 
        borderColor: '#e2e8f0' 
    },
    
    // CTA Buttons - Prominent with darker blue
    calculatorButton: { 
        backgroundColor: '#2563eb', // Darker blue
        borderRadius: 8, 
        paddingVertical: 14, 
        paddingHorizontal: 20, 
        marginBottom: 24, 
        alignItems: 'center', 
        ...createShadow({ 
            shadowColor: '#2563eb', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.3, 
            shadowRadius: 8, 
            elevation: 4 
        }) 
    },
    calculatorButtonText: { 
        color: '#ffffff', 
        fontSize: 17, 
        fontWeight: '600' 
    },
    
    ctaButton: { 
        backgroundColor: '#2563eb', 
        borderRadius: 8, 
        paddingVertical: 14, 
        paddingHorizontal: 20, 
        marginBottom: 24, 
        alignItems: 'center', 
        ...createShadow({ 
            shadowColor: '#2563eb', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.3, 
            shadowRadius: 8, 
            elevation: 4 
        }) 
    },
    ctaButtonText: { 
        color: '#ffffff', 
        fontSize: 17, 
        fontWeight: '600' 
    },
    
    // Trust/Info Boxes with CTA
    trustBox: { 
        backgroundColor: '#eff6ff', 
        borderRadius: 12, 
        padding: 20, 
        marginTop: 16, 
        marginBottom: 24, 
        borderWidth: 1, 
        borderColor: '#bfdbfe', 
        ...createShadow({ 
            shadowColor: '#2563eb', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.1, 
            shadowRadius: 4, 
            elevation: 2 
        }) 
    },
    trustTitle: { 
        fontSize: 17, 
        fontWeight: '700', 
        color: '#1e40af', 
        marginBottom: 12 
    },
    trustText: { 
        fontSize: 16, 
        lineHeight: 25.6, 
        color: '#475569', 
        marginBottom: 12 
    },
    trustButton: { 
        backgroundColor: '#2563eb', 
        borderRadius: 8, 
        paddingVertical: 14, 
        paddingHorizontal: 20, 
        marginTop: 16, 
        alignItems: 'center', 
        ...createShadow({ 
            shadowColor: '#2563eb', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.3, 
            shadowRadius: 8, 
            elevation: 4 
        }) 
    },
    trustButtonText: { 
        color: '#ffffff', 
        fontSize: 17, 
        fontWeight: '600' 
    },
    
    // Urgent CTA Boxes
    urgentCtaBox: { 
        backgroundColor: '#dbeafe', 
        borderRadius: 12, 
        borderWidth: 2, 
        borderColor: '#3b82f6', 
        padding: 20, 
        marginTop: 16, 
        marginBottom: 24, 
        ...createShadow({ 
            shadowColor: '#2563eb', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.2, 
            shadowRadius: 4, 
            elevation: 3 
        }) 
    },
    urgentCtaTitle: { 
        fontSize: 18, 
        fontWeight: '700', 
        color: '#1e40af', 
        marginBottom: 12, 
        textAlign: 'center' 
    },
    urgentCtaText: { 
        fontSize: 16, 
        lineHeight: 25.6, 
        color: '#475569', 
        marginBottom: 16, 
        textAlign: 'center' 
    },
    urgentFeatures: { marginBottom: 20 },
    urgentCtaButton: { 
        backgroundColor: '#2563eb', 
        borderRadius: 8, 
        paddingVertical: 16, 
        paddingHorizontal: 24, 
        marginBottom: 12, 
        alignItems: 'center', 
        ...createShadow({ 
            shadowColor: '#2563eb', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.3, 
            shadowRadius: 8, 
            elevation: 4 
        }) 
    },
    urgentCtaButtonText: { 
        color: '#ffffff', 
        fontSize: 17, 
        fontWeight: '700' 
    },
    urgentCtaDisclaimer: { 
        fontSize: 13, 
        color: '#64748b', 
        textAlign: 'center', 
        fontStyle: 'italic' 
    },
    
    // Info Boxes with Button
    infoBox: { 
        backgroundColor: '#eff6ff', 
        borderRadius: 12, 
        padding: 20, 
        marginTop: 16, 
        marginBottom: 24, 
        borderWidth: 1, 
        borderColor: '#bfdbfe' 
    },
    infoTitle: { 
        fontSize: 17, 
        fontWeight: '700', 
        color: '#1e40af', 
        marginBottom: 12 
    },
    infoText: { 
        fontSize: 16, 
        lineHeight: 25.6, 
        color: '#475569', 
        marginBottom: 16 
    },
    infoButton: { 
        backgroundColor: '#2563eb', 
        borderRadius: 8, 
        paddingVertical: 14, 
        paddingHorizontal: 20, 
        alignItems: 'center', 
        ...createShadow({ 
            shadowColor: '#2563eb', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.3, 
            shadowRadius: 8, 
            elevation: 4 
        }) 
    },
    infoButtonText: { 
        color: '#ffffff', 
        fontSize: 17, 
        fontWeight: '600' 
    },
    
    // FAQ Items
    faqItem: { 
        backgroundColor: '#ffffff', 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 16, 
        borderWidth: 1, 
        borderColor: '#e2e8f0' 
    },
    faqQuestion: { 
        fontSize: 17, 
        fontWeight: '700', 
        color: '#1e40af', 
        marginBottom: 12 
    },
    faqAnswer: { 
        fontSize: 16, 
        lineHeight: 25.6, 
        color: '#475569' 
    },
    
    // Final CTA Section
    finalCtaSection: { 
        backgroundColor: '#1e3a8a', 
        borderRadius: 12, 
        padding: 32, 
        marginTop: 48, 
        alignItems: 'center', 
        ...createShadow({ 
            shadowColor: '#1e3a8a', 
            shadowOffset: { width: 0, height: 4 }, 
            shadowOpacity: 0.3, 
            shadowRadius: 8, 
            elevation: 4 
        }) 
    },
    finalCtaTitle: { 
        fontSize: 24, 
        fontWeight: '700', 
        color: '#ffffff', 
        marginBottom: 16, 
        textAlign: 'center' 
    },
    finalCtaText: { 
        fontSize: 16, 
        lineHeight: 25.6, 
        color: '#bfdbfe', 
        marginBottom: 24, 
        textAlign: 'center' 
    },
    primaryButton: { 
        backgroundColor: '#ffffff', 
        borderRadius: 8, 
        paddingVertical: 16, 
        paddingHorizontal: 32, 
        marginBottom: 16, 
        ...createShadow({ 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.1, 
            shadowRadius: 4, 
            elevation: 3 
        }) 
    },
    primaryButtonText: { 
        color: '#1e3a8a', 
        fontSize: 18, 
        fontWeight: '700' 
    },
    finalCtaDisclaimer: { 
        fontSize: 13, 
        color: '#bfdbfe', 
        textAlign: 'center', 
        fontStyle: 'italic' 
    },
    finalCtaTrustSignals: { marginBottom: 24, alignSelf: 'stretch' },
    finalCtaTrustItem: { 
        fontSize: 15, 
        lineHeight: 24, 
        color: '#bfdbfe', 
        marginBottom: 8, 
        textAlign: 'center' 
    },
});
