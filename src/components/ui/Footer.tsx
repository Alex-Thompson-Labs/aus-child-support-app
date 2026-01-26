import { Link } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { PrivacyPolicyLink } from '../PrivacyPolicyLink';

export interface FooterProps {
  /** Optional additional styles for the container */
  containerStyle?: object;
}

/**
 * Footer - Reusable footer component with copyright and privacy policy link
 *
 * Displays centered copyright text and privacy policy link with proper spacing
 * to avoid being obscured by sticky elements at the bottom of the page.
 */
export function Footer({ containerStyle }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <View
      style={[styles.footer, containerStyle]}
      // @ts-ignore - Web-only ARIA role
      accessibilityRole={Platform.OS === 'web' ? 'contentinfo' : undefined}
    >
      <View style={styles.footerContent}>
        <Text style={styles.copyrightText}>© {currentYear} Australian Child Support Calculator</Text>
        <Text style={styles.separator}>•</Text>
        <PrivacyPolicyLink
          linkText="Privacy Policy"
          textStyle={styles.privacyLink}
          containerStyle={styles.privacyLinkContainer}
        />
      </View>

      <View style={styles.locationLinks}>
        <Text style={styles.locationLabel}>Find a Lawyer:</Text>
        <Link href="/child-support-lawyer-sydney" style={styles.link}>Sydney</Link>
        <Text style={styles.separator}>•</Text>
        <Link href="/child-support-lawyer-melbourne" style={styles.link}>Melbourne</Link>
        <Text style={styles.separator}>•</Text>
        <Link href="/child-support-lawyer-brisbane" style={styles.link}>Brisbane</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 24, // Reduced from 48 to 24 (50% reduction)
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 100, // Extra padding to clear sticky bar (60px bar + 40px buffer)
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0', // slate-200
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  copyrightText: {
    fontSize: 12,
    color: '#94a3b8', // slate-400
    textAlign: 'center',
  },
  separator: {
    fontSize: 12,
    color: '#cbd5e1', // slate-300
  },
  privacyLinkContainer: {
    marginTop: 0,
    marginBottom: 0,
  },
  privacyLink: {
    fontSize: 12,
    color: '#64748b', // slate-500
    textDecorationLine: 'underline',
  },
  locationLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  link: {
    fontSize: 12,
    color: '#64748b',
    textDecorationLine: 'underline',
  },
});
