// Lawyer Alert Component
// TODO: Implement this in Day 1-2 of Phase 1
//
// Displays complexity alerts with "Get Legal Help" buttons

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Analytics } from '../utils/analytics';

interface LawyerAlertProps {
  title: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
  buttonText: string;
  onPress: () => void;
}

export function LawyerAlert({
  title,
  message,
  urgency,
  buttonText,
  onPress
}: LawyerAlertProps) {
  const handlePress = () => {
    // Track analytics before executing onPress
    Analytics.track('lawyer_button_clicked', {
      alert_title: title,
      urgency,
      button_text: buttonText,
    });
    onPress();
  };

  const isHighUrgency = urgency === 'high';
  const borderColor = isHighUrgency ? '#ef4444' : '#334155';
  const buttonColor = isHighUrgency ? '#ef4444' : '#2563eb';

  return (
    <View style={[styles.container, { borderColor }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={[styles.button, { backgroundColor: buttonColor }]} onPress={handlePress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    // borderColor is dynamic based on urgency
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    // backgroundColor is dynamic based on urgency
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
