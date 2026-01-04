/**
 * Form Header Component
 *
 * Displays the form title, subtitle, and close button.
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { headerStyles } from '../styles';
import type { FormHeaderProps } from '../types';

export function FormHeader({ config }: FormHeaderProps) {
  const router = useRouter();

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
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
        }}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Close form"
      >
        <Text style={headerStyles.closeButtonText}>✕</Text>
      </Pressable>
    </View>
  );
}
