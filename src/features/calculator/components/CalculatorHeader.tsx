import { useResponsive } from '@/src/utils/responsive';
import { shadowPresets } from '@/src/utils/shadow-styles';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

// Brand Blue from assessment breakdown
const BRAND_NAVY = '#1e3a8a';

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

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleNavigation = (route: string) => {
        setIsMenuOpen(false);
        if (route.startsWith('http')) {
            Linking.openURL(route);
        } else {
            router.push(route as any);
        }
    };

    // --- MOBILE VIEW (New Implementation) ---
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
                                // Using the requested asset
                                source={require('@/public/favicon-rounded-white-bg.png')}
                                style={styles.iconMobile}
                                resizeMode="contain"
                            />
                            <Text style={styles.leftTitle}>{title || 'Calculator'}</Text>
                        </>
                    )}
                </View>

                {/* Right: Hamburger */}
                <Pressable
                    style={styles.rightElement}
                    onPress={toggleMenu}
                    accessibilityRole="button"
                    accessibilityLabel="Menu"
                >
                    <Feather name={isMenuOpen ? 'x' : 'menu'} size={28} color={BRAND_NAVY} />
                </Pressable>
            </View>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <View style={[styles.dropdownMenu, maxWidth ? { maxWidth } : undefined]}>
                    <MenuItem label="Calculator" onPress={() => handleNavigation('/')} />
                    <MenuItem label="Court Order Scanner" onPress={() => handleNavigation('/court-order-tool')} badge="BETA" />
                    <MenuItem label="About" onPress={() => handleNavigation('/about')} />
                    <MenuItem label="Blog" onPress={() => handleNavigation('https://blog.auschildsupport.com.au')} />
                    <MenuItem label="FAQ" onPress={() => handleNavigation('/faq')} />
                    <MenuItem label="Contact" onPress={() => handleNavigation('/contact')} />
                </View>
            )}
        </View>
    );
}

const MenuItem = ({ label, onPress, badge }: { label: string; onPress: () => void; badge?: string }) => (
    <Pressable
        style={({ pressed }) => [
            styles.menuItem,
            pressed && styles.menuItemPressed
        ]}
        onPress={onPress}
    >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.menuItemText}>{label}</Text>
            {badge && (
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{badge}</Text>
                </View>
            )}
        </View>
        <Feather name="chevron-right" size={16} color="#94a3b8" />
    </Pressable>
);

const styles = StyleSheet.create({
    header: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        backgroundColor: '#ffffff',
        width: '100%',
        zIndex: 100, // Ensure header sits above content
        alignItems: 'center', // Center the constrained content
    },
    mobileHeaderWrapper: {
        // Relative positioning for absolute dropdown
        position: 'relative',
        zIndex: 2000,
        paddingHorizontal: 16, // Add padding here instead
    },
    headerContainer: {
        width: '100%',
        maxWidth: 850,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
        gap: 16,
    },
    mobileHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 850, // Match bodyContainer width
        alignSelf: 'center',
    },
    // Desktop Styles
    logoDesktop: {
        height: 52,
        width: 286,
        marginLeft: -35,
        marginTop: -2,
    },
    blogButton: {
        backgroundColor: '#0056b3',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        flexShrink: 0,
        ...shadowPresets.small,
    },
    blogButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    // Mobile Styles
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
    // Dropdown
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        ...shadowPresets.card,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        paddingVertical: 8,
        marginTop: 1, // Slight offset
        zIndex: 2000,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc',
    },
    menuItemPressed: {
        backgroundColor: '#f1f5f9',
    },
    menuItemText: {
        fontSize: 16,
        color: '#334155',
        fontWeight: '500',
    },
    badgeContainer: {
        backgroundColor: '#dbeafe', // light blue
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    badgeText: {
        color: '#1e3a8a', // BRAND_NAVY (dark blue)
        fontSize: 10,
        fontWeight: 'bold',
    },
});
