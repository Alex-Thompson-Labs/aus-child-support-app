/**
 * Form Header Component
 *
 * Displays the form title, subtitle, and close button.
 */

import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { headerStyles } from '../styles';
import type { FormHeaderProps } from '../types';

export function FormHeader({ config, returnTo }: FormHeaderProps) {
  const router = useRouter();

  const handleClose = () => {
    // If returnTo URL is provided and we're on web, redirect externally
    if (returnTo && Platform.OS === 'web') {
      window.location.href = returnTo;
      return;
    }

    // Default behavior: navigate within the app
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
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
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Close form"
      >
        <Text style={headerStyles.closeButtonText}>✕</Text>
      </Pressable>
    </View>
  );
}
