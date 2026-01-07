/**
 * Form Header Component
 *
 * Displays the form title, subtitle, and close button.
 */

import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { headerStyles } from '../styles';
import type { FormHeaderProps } from '../types';

export function FormHeader({ config, source, returnTo }: FormHeaderProps) {
  const router = useRouter();

  const handleClose = () => {
    // Debug logging for troubleshooting
    if (__DEV__ || Platform.OS === 'web') {
      console.log('[FormHeader] Close pressed:', { source, returnTo, platform: Platform.OS });
    }

    // Only handle external redirects on web
    if (Platform.OS === 'web' && returnTo) {
      // Explicit returnTo URL takes priority
      console.log('[FormHeader] Redirecting to returnTo:', returnTo);
      window.location.href = returnTo;
      return;
    }

    // Default behavior: navigate within the app
    console.log('[FormHeader] Using default navigation');
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={headerStyles.headerWrapper}>
      <View style={headerStyles.header}>
        <View style={headerStyles.headerTextContainer}>
          <Text style={headerStyles.headerTitle}>{config.title}</Text>
          {config.subtitle && (
            <Text style={headerStyles.headerSubtitle}>{config.subtitle}</Text>
          )}
        </View>
        <Pressable
          style={headerStyles.closeButton}
          onPress={handleClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Close form"
        >
          <Text style={headerStyles.closeButtonText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
}
