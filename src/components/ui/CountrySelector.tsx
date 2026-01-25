/**
 * Country Selector Component
 * 
 * Dropdown with search functionality for selecting overseas parent's country.
 * Shows jurisdiction status badge after selection.
 */

import { useAppTheme } from '@/src/theme';
import { ALL_COUNTRIES } from '@/src/utils/all-countries';
import {
  checkJurisdictionStatus,
  getJurisdictionExplanation,
  type JurisdictionStatus
} from '@/src/utils/jurisdiction-checker';
import { isWeb, webInputStyles } from '@/src/utils/responsive';
import { AlertCircle, CheckCircle, Info } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

interface CountrySelectorProps {
  value?: string;
  onSelect: (country: string, status: JurisdictionStatus) => void;
  placeholder?: string;
  error?: string;
}

export function CountrySelector({ 
  value, 
  onSelect, 
  placeholder = 'Select country',
  error 
}: CountrySelectorProps) {
  const { colors } = useAppTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return ALL_COUNTRIES;
    
    const query = searchQuery.toLowerCase();
    return ALL_COUNTRIES.filter(country => 
      country.toLowerCase().includes(query)
    );
  }, [searchQuery]);
  
  // Get jurisdiction status for selected country
  const jurisdictionStatus = value ? checkJurisdictionStatus(value) : null;
  
  const handleSelect = (country: string) => {
    const status = checkJurisdictionStatus(country);
    onSelect(country, status);
    setIsOpen(false);
    setSearchQuery('');
  };
  
  const dynamicStyles = useMemo(() => ({
    input: {
      borderColor: error ? colors.errorBorder : colors.inputBorder,
      backgroundColor: error ? colors.errorLight : colors.inputBackground,
      color: colors.inputText,
    },
    dropdown: {
      backgroundColor: colors.cardBackground,
      borderColor: colors.cardBorder,
    },
    dropdownItem: {
      borderBottomColor: colors.cardBorder,
    },
    dropdownItemHover: {
      backgroundColor: colors.primaryLight,
    },
    statusBadge: {
      backgroundColor: getStatusColor(jurisdictionStatus, colors),
      borderColor: getStatusBorderColor(jurisdictionStatus, colors),
    },
    statusText: {
      color: getStatusTextColor(jurisdictionStatus, colors),
    },
    errorText: {
      color: colors.error,
    },
  }), [colors, error, jurisdictionStatus]);
  
  return (
    <View style={styles.container}>
      {/* Input Field */}
      <Pressable onPress={() => setIsOpen(true)}>
        <View 
          style={[
            styles.input, 
            dynamicStyles.input,
            isWeb && webInputStyles
          ]}
          accessibilityRole="button"
          accessibilityLabel="Select country"
          accessibilityHint="Opens country selection dropdown"
        >
          <Text 
            style={[
              styles.inputText, 
              { color: value ? colors.inputText : colors.placeholder }
            ]}
            numberOfLines={1}
          >
            {value || placeholder}
          </Text>
        </View>
      </Pressable>
      
      {/* Error Message */}
      {error && (
        <Text style={[styles.errorText, dynamicStyles.errorText]}>
          {error}
        </Text>
      )}
      
      {/* Jurisdiction Status Badge */}
      {value && jurisdictionStatus && (
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, dynamicStyles.statusBadge]}>
            {getStatusIcon(jurisdictionStatus, colors)}
            <Text style={[styles.statusBadgeText, dynamicStyles.statusText]}>
              {getStatusLabel(jurisdictionStatus)}
            </Text>
          </View>
          <Text style={[styles.statusExplanation, { color: colors.textSecondary }]}>
            {getJurisdictionExplanation(jurisdictionStatus)}
          </Text>
        </View>
      )}
      
      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsOpen(false)}
        >
          <View 
            style={[styles.dropdown, dynamicStyles.dropdown]}
            onStartShouldSetResponder={() => true}
          >
            {/* Search Input */}
            <TextInput
              style={[
                styles.searchInput, 
                { 
                  borderColor: colors.inputBorder,
                  backgroundColor: colors.inputBackground,
                  color: colors.inputText,
                },
                isWeb && webInputStyles
              ]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search countries..."
              placeholderTextColor={colors.placeholder}
              autoFocus={Platform.OS === 'web'}
              accessibilityLabel="Search countries"
            />
            
            {/* Country List */}
            <ScrollView style={styles.dropdownScroll}>
              {filteredCountries.length === 0 ? (
                <Text style={[styles.noResults, { color: colors.textSecondary }]}>
                  No countries found
                </Text>
              ) : (
                filteredCountries.map((country) => (
                  <Pressable
                    key={country}
                    style={({ pressed }) => [
                      styles.dropdownItem,
                      dynamicStyles.dropdownItem,
                      pressed && dynamicStyles.dropdownItemHover,
                    ]}
                    onPress={() => handleSelect(country)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${country}`}
                  >
                    <Text style={[styles.dropdownItemText, { color: colors.text }]}>
                      {country}
                    </Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// Helper functions for status styling
function getStatusColor(status: JurisdictionStatus | null, colors: any): string {
  if (!status) return colors.cardBackground;
  
  switch (status) {
    case 'reciprocating':
      return colors.successLight || '#d1fae5';
    case 'excluded':
      return colors.errorLight || '#fee2e2';
    case 'non-reciprocating':
      return colors.warningLight || '#fef3c7';
  }
}

function getStatusBorderColor(status: JurisdictionStatus | null, colors: any): string {
  if (!status) return colors.cardBorder;
  
  switch (status) {
    case 'reciprocating':
      return colors.success || '#10b981';
    case 'excluded':
      return colors.error || '#ef4444';
    case 'non-reciprocating':
      return colors.warning || '#f59e0b';
  }
}

function getStatusTextColor(status: JurisdictionStatus | null, colors: any): string {
  if (!status) return colors.text;
  
  switch (status) {
    case 'reciprocating':
      return colors.successDark || '#065f46';
    case 'excluded':
      return colors.errorDark || '#991b1b';
    case 'non-reciprocating':
      return colors.warningDark || '#92400e';
  }
}

function getStatusLabel(status: JurisdictionStatus): string {
  switch (status) {
    case 'reciprocating':
      return 'Reciprocating Jurisdiction';
    case 'excluded':
      return 'Excluded Jurisdiction';
    case 'non-reciprocating':
      return 'Non-Reciprocating Jurisdiction';
  }
}

function getStatusIcon(status: JurisdictionStatus, colors: any) {
  const iconColor = getStatusTextColor(status, colors);
  const size = 16;
  
  switch (status) {
    case 'reciprocating':
      return <CheckCircle size={size} color={iconColor} />;
    case 'excluded':
      return <AlertCircle size={size} color={iconColor} />;
    case 'non-reciprocating':
      return <Info size={size} color={iconColor} />;
  }
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  statusContainer: {
    gap: 8,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusExplanation: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdown: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  searchInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    fontSize: 16,
  },
  dropdownScroll: {
    maxHeight: 400,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  noResults: {
    padding: 20,
    textAlign: 'center',
    fontSize: 14,
  },
});
