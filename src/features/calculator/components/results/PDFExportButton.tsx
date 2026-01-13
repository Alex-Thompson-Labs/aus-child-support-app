/**
 * PDFExportButton Component
 *
 * Button to export calculator results as a professional PDF document.
 * Web-only feature using @react-pdf/renderer.
 */

import type { CalculationResults } from '@/src/utils/calculator';
import {
    exportAssessmentPDF,
    isPDFExportAvailable,
} from '@/src/utils/exportAssessmentPDF';
import { Download } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface PDFExportButtonProps {
  results: CalculationResults;
  supportA?: boolean;
  supportB?: boolean;
  variant?: 'primary' | 'secondary';
}

export function PDFExportButton({
  results,
  supportA = false,
  supportB = false,
  variant = 'secondary',
}: PDFExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only show on web
  if (!isPDFExportAvailable()) {
    return null;
  }

  const handleExport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await exportAssessmentPDF({
        results,
        supportA,
        supportB,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsLoading(false);
    }
  };

  const isPrimary = variant === 'primary';

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleExport}
        disabled={isLoading}
        style={({ pressed }) => [
          styles.button,
          isPrimary ? styles.buttonPrimary : styles.buttonSecondary,
          pressed && styles.buttonPressed,
          isLoading && styles.buttonDisabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Download assessment as PDF"
        accessibilityState={{ disabled: isLoading }}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={isPrimary ? '#ffffff' : '#2563eb'}
          />
        ) : (
          <Download
            size={18}
            color={isPrimary ? '#ffffff' : '#2563eb'}
            strokeWidth={2}
          />
        )}
        <Text
          style={[
            styles.buttonText,
            isPrimary ? styles.buttonTextPrimary : styles.buttonTextSecondary,
          ]}
        >
          {isLoading ? 'Generating...' : 'Download PDF'}
        </Text>
      </Pressable>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
    minWidth: 160,
  },
  buttonPrimary: {
    backgroundColor: '#2563eb',
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: '#ffffff',
  },
  buttonTextSecondary: {
    color: '#2563eb',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 8,
  },
});
