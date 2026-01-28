import { useResponsive } from '@/src/utils/responsive';
import { shadowPresets } from '@/src/utils/shadow-styles';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Image,
    Linking,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';

// Brand Blue from assessment breakdown
const BRAND_NAVY = '#1e3a8a';
const DRAWER_WIDTH = 320;

// Basic back button for sub-pages
interface CalculatorHeaderProps {
    title?: string;
    showBackButton?: boolean;
    maxWidth?: number;
}

export function CalculatorHeader({ title, showBackButton, maxWidth }: CalculatorHeaderProps) {
    const { isDesktop } = useResponsive();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;

    const openDrawer = () => {
        setIsMenuOpen(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeDrawer = () => {
        Animated.timing(slideAnim, {
            toValue: DRAWER_WIDTH,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setIsMenuOpen(false));
    };

    const handleNavigation = (route: string) => {
        closeDrawer();
        // Small delay to let animation complete before navigating
        setTimeout(() => {
            if (route.startsWith('http')) {
                Linking.openURL(route);
            } else {
                router.push(route as any);
            }
        }, 100);
    };

    return (
        // @ts-ignore - Web-only ARIA role
        <View style={[styles.header, styles.mobileHeaderWrapper]} accessibilityRole="banner">
            <View style={[styles.mobileHeaderRow, maxWidth ? { maxWidth } : undefined]}>
                {/* Left: Icon/Logo + Title (side by side) or Back Button + Title */}
                <View style={styles.leftSection}>
                    {showBackButton ? (
                        <>
                            <Pressable
                                onPress={() => router.replace('/')}
                                accessibilityRole="button"
                                accessibilityLabel="Go back to calculator"
                                hitSlop={12}
                            >
                                <Feather name="arrow-left" size={24} color={BRAND_NAVY} />
                            </Pressable>
                            <Text style={styles.leftTitle}>{title || 'Calculator'}</Text>
                        </>
                    ) : (
                        <>
                            <Image
                                source={
                                    Platform.OS === 'web'
                                        ? { uri: '/favicon-rounded-white-bg.webp' }
                                        : require('@/public/favicon-rounded-white-bg.png')
                                }
                                style={styles.iconMobile}
                                resizeMode="contain"
                                // @ts-ignore - Web-only loading attribute
                                loading="eager"
                                // @ts-ignore - Web-only dimensions for CLS prevention
                                width={40}
                                height={40}
                            />
                            <Text style={styles.leftTitle}>{title || 'Calculator'}</Text>
                        </>
                    )}
                </View>

                {/* Right: Hamburger */}
                <Pressable
                    style={styles.rightElement}
                    onPress={openDrawer}
                    accessibilityRole="button"
                    accessibilityLabel="Open menu"
                >
                    <Feather name="menu" size={28} color={BRAND_NAVY} />
                </Pressable>
            </View>

            {/* Slide-out Drawer Modal */}
            <Modal
                transparent
                visible={isMenuOpen}
                animationType="none"
                onRequestClose={closeDrawer}
            >
                {/* Backdrop */}
                <TouchableWithoutFeedback onPress={closeDrawer}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                {/* Drawer Panel - Centered container */}
                <View style={styles.drawerContainer}>
                    <Animated.View
                        style={[
                            styles.drawer,
                            { transform: [{ translateX: slideAnim }] }
                        ]}
                    >
                        {/* Decorative Background Shapes */}
                        <View style={styles.softGlow} />
                        <View style={styles.techRing} />

                        {/* Content wrapper with width constraint */}
                        <View style={styles.drawerContent}>
                            {/* Header Bar */}
                            <View style={styles.drawerHeader}>
                                <Image
                                    source={
                                        Platform.OS === 'web'
                                            ? { uri: '/main-page-logo.webp' }
                                            : require('@/assets/source_images/australian-child-support-assessment-calculator-logo.png')
                                    }
                                    style={styles.drawerLogo}
                                    resizeMode="contain"
                                    // @ts-ignore - Web-only loading attribute
                                    loading="eager"
                                    // @ts-ignore - Web-only dimensions for CLS prevention
                                    width={280}
                                    height={42}
                                />
                                <Pressable
                                    onPress={closeDrawer}
                                    style={styles.closeButton}
                                    accessibilityRole="button"
                                    accessibilityLabel="Close menu"
                                >
                                    <Feather name="x" size={28} color="#ffffff" />
                                </Pressable>
                            </View>

                            {/* Top Section */}
                            <View style={styles.topSection}>
                                {/* Primary Action */}
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.primaryNavButton,
                                        pressed && styles.primaryNavButtonPressed
                                    ]}
                                    onPress={() => handleNavigation('/')}
                                    accessibilityRole="button"
                                >
                                    <Feather name="plus-circle" size={26} color={BRAND_NAVY} />
                                    <Text style={styles.primaryNavButtonText}>Start New Calculation</Text>
                                </Pressable>

                                {/* Feature Item - Court Order Scanner */}
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.featureItem,
                                        styles.featureItemSpacing,
                                        pressed && styles.featureItemPressed
                                    ]}
                                    onPress={() => handleNavigation('/court-order-tool')}
                                    accessibilityRole="button"
                                >
                                    <View style={styles.featureItemContent}>
                                        <Feather name="file-text" size={26} color="#ffffff" />
                                        <Text style={styles.featureItemText}>Court Order Scanner</Text>
                                        <View style={styles.betaBadge}>
                                            <Text style={styles.betaBadgeText}>BETA</Text>
                                        </View>
                                    </View>
                                    <Feather name="chevron-right" size={18} color="#ffffff" />
                                </Pressable>

                                {/* Feature Item - Special Circumstances Wizard */}
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.featureItem,
                                        styles.featureItemSpacing,
                                        pressed && styles.featureItemPressed
                                    ]}
                                    onPress={() => handleNavigation('/special-circumstances')}
                                    accessibilityRole="button"
                                >
                                    <View style={styles.featureItemContent}>
                                        <Feather name="sliders" size={26} color="#ffffff" />
                                        <Text style={styles.featureItemText}>Special Circumstances Wizard</Text>
                                    </View>
                                    <Feather name="chevron-right" size={18} color="#ffffff" />
                                </Pressable>
                            </View>

                            {/* Middle Section - Support Links */}
                            <View style={styles.middleSection}>
                                <SupportMenuItem
                                    label="About"
                                    icon="info"
                                    onPress={() => handleNavigation('/about')}
                                />
                                <SupportMenuItem
                                    label="FAQ"
                                    icon="help-circle"
                                    onPress={() => handleNavigation('/faq')}
                                />
                                <SupportMenuItem
                                    label="Contact"
                                    icon="mail"
                                    onPress={() => handleNavigation('/contact')}
                                />
                                <SupportMenuItem
                                    label="Blog"
                                    icon="book-open"
                                    onPress={() => handleNavigation('/blog')}
                                />
                            </View>

                            {/* Bottom Section - Trust Footer */}
                            <View style={styles.trustFooter}>
                                <View style={styles.trustTextContainer}>
                                    <Text style={styles.trustStatement}>100% Private & Secure</Text>
                                </View>
                                {/* Support person image - add menu-support-person.png to public/images/ */}
                                <SupportPersonImage />
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
}

// Support person image component with gradient mask
const SupportPersonImage = () => {
    return (
        <View style={styles.supportPersonImageContainer}>
            <Image
                source={
                    Platform.OS === 'web'
                        ? { uri: '/images/menu-support-person.webp' }
                        : require('@/public/images/menu-support-person.png')
                }
                style={styles.supportPersonImage}
                resizeMode="contain"
                // @ts-ignore - Web-only loading attribute (below-the-fold, lazy load)
                loading="lazy"
                // @ts-ignore - Web-only dimensions for CLS prevention
                width={320}
                height={380}
            />
            <LinearGradient
                colors={[BRAND_NAVY, 'transparent']}
                style={styles.gradientMask}
                pointerEvents="none"
            />
        </View>
    );
};

// Support menu item with huge white centered text (no icons)
const SupportMenuItem = ({
    label,
    icon,
    onPress
}: {
    label: string;
    icon: keyof typeof Feather.glyphMap;
    onPress: () => void;
}) => (
    <Pressable
        style={({ pressed }) => [
            styles.supportMenuItem,
            pressed && styles.supportMenuItemPressed
        ]}
        onPress={onPress}
        accessibilityRole="button"
    >
        <Text style={styles.supportMenuItemText}>{label}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    header: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        backgroundColor: '#ffffff',
        width: '100%',
        zIndex: 100,
    },
    mobileHeaderWrapper: {
        position: 'relative',
        zIndex: 2000,
        paddingHorizontal: 16,
    },
    mobileHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 850,
        alignSelf: 'center',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconMobile: {
        width: 40,
        height: 40,
    },
    leftTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: BRAND_NAVY,
    },
    rightElement: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },

    // Backdrop - matches main page background
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f8fafc',
    },

    // Drawer container - centers the drawer with max width
    drawerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Drawer - Constrained navy background
    drawer: {
        width: '100%',
        maxWidth: 850,
        height: '100%',
        backgroundColor: BRAND_NAVY,
        justifyContent: 'space-between',
        overflow: 'hidden',
    },

    // Drawer content wrapper - full width within constrained drawer
    drawerContent: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        flex: 1,
    },

    // Decorative Background Shapes - Subtle white watermarks
    softGlow: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        zIndex: 0,
    },
    techRing: {
        position: 'absolute',
        top: 200,
        right: -160,
        width: 400,
        height: 400,
        borderRadius: 200,
        borderWidth: 30,
        borderColor: 'rgba(255, 255, 255, 0.03)',
        backgroundColor: 'transparent',
        zIndex: 0,
    },

    // Drawer Header Bar - Title and Close Button
    drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 10,
        zIndex: 10,
        flexShrink: 0,
    },
    drawerLogo: {
        height: 42,
        width: 280,
        tintColor: '#ffffff',
    },
    drawerHeaderTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
    },
    closeButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Top Section - Primary actions (layered above decorations)
    topSection: {
        paddingTop: 20,
        gap: 16,
        zIndex: 10,
        flexShrink: 0,
    },

    // Primary Action Button - Inverted white on dark
    primaryNavButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 10,
        ...shadowPresets.medium,
    },
    primaryNavButtonPressed: {
        backgroundColor: '#f1f5f9',
    },
    primaryNavButtonText: {
        color: BRAND_NAVY,
        fontSize: 21,
        fontWeight: '800',
    },

    // Feature Item - Transparent white on dark background
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    featureItemSpacing: {
        marginTop: 0,
    },
    featureItemPressed: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    featureItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        flexWrap: 'wrap',
    },
    featureItemText: {
        fontSize: 21,
        fontWeight: '800',
        color: '#ffffff',
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    betaBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    betaBadgeText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },

    // Middle Section - Heavy left-aligned editorial typography (layered above decorations)
    middleSection: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 24,
        paddingTop: 40,
        paddingBottom: 20,
        gap: 32,
        zIndex: 5,
        flexShrink: 0,
        flex: 1,
    },
    supportMenuItem: {
        alignItems: 'flex-start',
        paddingVertical: 0,
    },
    supportMenuItemPressed: {
        opacity: 0.7,
    },
    supportMenuItemText: {
        fontSize: 24,
        color: '#ffffff',
        fontWeight: '800',
        letterSpacing: -0.5,
    },

    // Trust Footer - seamless dark navy (layered above decorations)
    trustFooter: {
        position: 'relative',
        backgroundColor: BRAND_NAVY,
        height: 280,
        overflow: 'visible',
        zIndex: 3,
        flexShrink: 0,
        marginTop: 'auto',
    },
    trustTextContainer: {
        position: 'absolute',
        left: 24,
        bottom: 40,
        maxWidth: '60%',
        zIndex: 10,
    },
    trustStatement: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        opacity: 0.8,
    },
    // Giant support person image - 320x380, anchored to bottom edge
    supportPersonImageContainer: {
        position: 'absolute',
        bottom: -60,
        right: -30,
        width: 320,
        height: 380,
    },
    supportPersonImage: {
        width: 320,
        height: 380,
    },
    gradientMask: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 1,
    },
});
