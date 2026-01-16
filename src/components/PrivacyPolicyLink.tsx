import React from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text } from 'react-native';

export interface PrivacyPolicyLinkProps {
  /** Optional privacy policy URL override */
  url?: string;
  /** Optional link text override */
  linkText?: string;
  /** Optional additional styles for the container */
  containerStyle?: object;
  /** Optional additional styles for the text */
  textStyle?: object;
  /** Whether to open in new tab on web (default: true) */
  openInNewTab?: boolean;
}

/**
 * PrivacyPolicyLink - Reusable privacy policy link component
 *
 * Displays a clickable link to the privacy policy.
 * Uses platform-aware URLs: relative path on web for local dev,
 * absolute URL on native platforms.
 *
 * Note: Linking.openURL() works on all platforms including web.
 * React Native Web translates it to window.open() automatically,
 * so we don't need separate web/native code paths.
 */
export function PrivacyPolicyLink({
  url,
  linkText = 'Read our Privacy Policy',
  containerStyle,
  textStyle,
  openInNewTab = true,
}: PrivacyPolicyLinkProps) {
  const isWeb = Platform.OS === 'web';

  // Platform-aware URL: use relative path on web, absolute on native
  const privacyUrl = url || (isWeb
    ? '/privacy-policy.html'
    : 'https://auschildsupport.com.au/privacy-policy.html');

  const webClickableStyles = isWeb
    ? {
      cursor: 'pointer' as const,
      userSelect: 'none' as const,
    }
    : {};

  const handlePress = () => {
    // Linking.openURL() works on all platforms
    // On web, React Native Web translates this to window.open() or window.location
    // depending on the context. For external links, it opens in a new tab by default.
    Linking.openURL(privacyUrl);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.container, containerStyle, webClickableStyles]}
      accessibilityRole="link"
      accessibilityLabel={linkText}
      accessibilityHint="Opens privacy policy"
    >
      <Text style={[styles.linkText, textStyle]}>{linkText}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 8,
  },
  linkText: {
    fontSize: 13,
    color: '#3b82f6', // blue-500
    textDecorationLine: 'underline',
  },
});
