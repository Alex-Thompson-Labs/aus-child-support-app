import React from 'react';
import { Text, Pressable, StyleSheet, Linking, Platform } from 'react-native';

export interface PrivacyPolicyLinkProps {
  /** Optional privacy policy URL override */
  url?: string;
  /** Optional link text override */
  linkText?: string;
  /** Optional additional styles for the container */
  containerStyle?: object;
  /** Optional additional styles for the text */
  textStyle?: object;
}

/**
 * PrivacyPolicyLink - Reusable privacy policy link component
 * 
 * Displays a clickable link to the privacy policy.
 * Opens in a new tab on web, uses Linking API on native.
 */
export function PrivacyPolicyLink({
  url = 'https://auschildsupport.com/privacy-policy.html',
  linkText = 'View Privacy Policy',
  containerStyle,
  textStyle,
}: PrivacyPolicyLinkProps) {
  const isWeb = Platform.OS === 'web';

  const webClickableStyles = isWeb ? {
    cursor: 'pointer' as const,
    userSelect: 'none' as const,
  } : {};

  const handlePress = () => {
    if (isWeb) {
      // Open in new tab on web
      window.open(url, '_blank');
    } else {
      // Use Linking API on native
      Linking.openURL(url);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.container, containerStyle, webClickableStyles]}
      accessibilityRole="link"
      accessibilityLabel={linkText}
      accessibilityHint="Opens privacy policy in a new window"
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
