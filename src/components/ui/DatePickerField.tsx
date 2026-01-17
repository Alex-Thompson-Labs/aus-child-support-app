import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { isWeb } from '../../utils/responsive';

// ============================================================================
// Types
// ============================================================================

interface DatePickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  disabled?: boolean;
  pickMonthYear?: boolean;
  maxDate?: Date;
  minDate?: Date;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format date as "DD/MM/YYYY" or "MM/YYYY" depending on mode
 */
function formatDisplayDate(date: Date, pickMonthYear = false): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  if (pickMonthYear) {
    return `${month}/${year}`;
  }

  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

/**
 * Convert Date to YYYY-MM-DD string for HTML input
 * Note: We always use YYYY-MM-DD even for month picker to ensure type="date" fallback works
 */
function dateToInputValue(date: Date, pickMonthYear = false): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert YYYY-MM-DD (or YYYY-MM) string to Date object
 */
function inputValueToDate(value: string, pickMonthYear = false): Date | null {
  if (!value) return null;

  // If month picker (YYYY-MM), append day to make it parseable
  // Note: type="date" will return YYYY-MM-DD so this check is just a safeguard
  const dateStr = pickMonthYear && value.length === 7 ? `${value}-01` : value;

  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

// ============================================================================
// Constants
// ============================================================================

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// ============================================================================
// Component
// ============================================================================

export default function DatePickerField({
  label,
  value,
  onChange,
  error,
  disabled = false,
  pickMonthYear = false,
  maxDate,
  minDate,
}: DatePickerFieldProps) {
  // Show/hide picker (native or custom)
  const [showPicker, setShowPicker] = useState(false);

  // Ref for the input trigger to calculate position
  const triggerRef = useRef<View>(null);
  const [popoverCoords, setPopoverCoords] = useState({ x: 0, y: 0, width: 0 });

  // Custom Month/Year picker state
  const [pickerYear, setPickerYear] = useState(
    value ? value.getFullYear() : new Date().getFullYear()
  );

  // Handle date change from native picker (iOS/Android)
  const handleNativeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      // Android: always hide picker after selection
      setShowPicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    } else if (event.type === 'dismissed') {
      // User cancelled
      if (Platform.OS === 'ios') {
        setShowPicker(false);
      }
    }
  };

  // Handle switching year in custom picker
  const changeYear = (increment: number) => {
    setPickerYear((prev) => prev + increment);
  };

  // Handle selecting a month in custom picker
  const selectMonth = (monthIndex: number) => {
    const newDate = new Date(pickerYear, monthIndex, 1);
    onChange(newDate);
    setShowPicker(false);
  };

  // Handle date change from web input (standard mode)
  const handleWebChange = (event: any) => {
    const inputValue = event.target.value;
    const date = inputValueToDate(inputValue, pickMonthYear);
    // Add a small delay to make the picker close feel less abrupt
    setTimeout(() => {
      onChange(date);
    }, 250);
  };

  // Calculate position and open picker (Web MonthPicker)
  const openWebMonthPicker = () => {
    if (triggerRef.current) {
      triggerRef.current.measure((x, y, width, height, pageX, pageY) => {
        setPopoverCoords({
          x: pageX,
          y: pageY + height + 8, // 8px spacing
          width: width
        });
        setPickerYear(value ? value.getFullYear() : new Date().getFullYear());
        setShowPicker(true);
      });
    }
  };

  // Render the Custom Month/Year Picker Content
  const renderMonthYearPickerContent = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const maxYear = maxDate ? maxDate.getFullYear() : 2099;
    const maxMonth = maxDate ? maxDate.getMonth() : 11;
    const minYear = minDate ? minDate.getFullYear() : 1900;
    const minMonth = minDate ? minDate.getMonth() : 0;

    const canGoForward = pickerYear < maxYear;
    const canGoBackward = pickerYear > minYear;

    return (
      <View style={styles.pickerContent}>
        {/* Header: Year Selector */}
        <View style={styles.pickerHeader}>
          <TouchableOpacity
            onPress={() => changeYear(-1)}
            style={styles.pickerArrow}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={!canGoBackward}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={canGoBackward ? "#1e293b" : "#cbd5e1"}
            />
          </TouchableOpacity>
          <Text style={styles.pickerYearText}>{pickerYear}</Text>
          <TouchableOpacity
            onPress={() => changeYear(1)}
            style={styles.pickerArrow}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={!canGoForward}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={canGoForward ? "#1e293b" : "#cbd5e1"}
            />
          </TouchableOpacity>
        </View>

        {/* Grid: Months */}
        <View style={styles.monthsGrid}>
          {MONTHS.map((month, index) => {
            const isSelected =
              value &&
              value.getMonth() === index &&
              value.getFullYear() === pickerYear;

            // Disable future months (if maxDate is set)
            const isFutureMonth = pickerYear === maxYear && index > maxMonth;
            // Disable past months (if minDate is set)
            const isPastMonth = pickerYear === minYear && index < minMonth;
            const isDisabled = isFutureMonth || isPastMonth;

            return (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthButton,
                  isSelected && styles.monthButtonActive,
                  isDisabled && styles.monthButtonDisabled,
                ]}
                onPress={() => selectMonth(index)}
                disabled={isDisabled}
              >
                <Text
                  style={[
                    styles.monthText,
                    isSelected && styles.monthTextActive,
                    isDisabled && styles.monthTextDisabled,
                  ]}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // ========================================================================
  // Web Rendering
  // ========================================================================
  if (isWeb) {
    if (pickMonthYear) {
      // Custom Month/Year Picker for Web
      return (
        <View
          ref={triggerRef}
          style={[styles.container, { width: 180, maxWidth: '100%' }]}
          collapsable={false} // Ensure measurement works
        >
          <Text style={styles.label}>{label} (MM/YYYY)</Text>
          <Pressable
            style={[
              styles.input,
              error && styles.inputError,
              disabled && styles.inputDisabled,
            ]}
            onPress={() => {
              if (!disabled) {
                openWebMonthPicker();
              }
            }}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={`${label}, format MM/YYYY`}
            accessibilityHint="Double tap to open month and year selector"
            accessibilityState={{ disabled }}
          >
            <Text
              style={[
                styles.inputText,
                !value && styles.inputPlaceholder,
                disabled && styles.inputTextDisabled,
              ]}
            >
              {value ? formatDisplayDate(value, true) : 'mm/yyyy'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#64748b" style={{ marginLeft: 'auto' }} />
          </Pressable>

          {error && <Text style={styles.errorText} nativeID="date-error">{error}</Text>}

          {/* Web Modal + Absolute Popover */}
          {showPicker && (
            <Modal
              transparent={true}
              visible={showPicker}
              animationType="none"
              onRequestClose={() => setShowPicker(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
                <View style={styles.modalOverlayTransparent}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        styles.webPopover,
                        {
                          position: 'absolute',
                          top: popoverCoords.y,
                          left: popoverCoords.x,
                          // Ensure it stays on screen horizontally
                          maxWidth: '90%'
                        }
                      ]}
                    >
                      {renderMonthYearPickerContent()}
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
        </View>
      );
    }

    // Standard Date Picker for Web
    const textColor = value ? '#1a202c' : '#9ca3af';
    const maxDateValue = maxDate ? dateToInputValue(maxDate) : undefined;
    const minDateValue = minDate ? dateToInputValue(minDate) : undefined;

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label} (DD/MM/YYYY)</Text>
        <div style={{ position: 'relative', width: '140px' }}>
          <input
            type="date"
            value={value ? dateToInputValue(value) : ''}
            onChange={handleWebChange}
            disabled={disabled}
            max={maxDateValue}
            min={minDateValue}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            aria-label={`${label}, format DD/MM/YYYY. Click to open system calendar`}
            aria-invalid={!!error}
            aria-describedby={error ? 'date-error' : undefined}
          />
          <div
            style={{
              backgroundColor: '#ffffff',
              color: textColor,
              borderRadius: '8px',
              padding: '12px',
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderColor: error ? '#ef4444' : '#e2e8f0',
              fontSize: '16px',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              width: '100%',
              boxSizing: 'border-box',
              pointerEvents: 'none',
              opacity: disabled ? 0.6 : 1,
              textAlign: 'center',
            }}
          >
            {value ? formatDisplayDate(value) : 'dd/mm/yyyy'}
          </div>
        </div>
        {error && (
          <Text style={styles.errorText} nativeID="date-error">
            {error}
          </Text>
        )}
      </View>
    );
  }

  // ========================================================================
  // Native Rendering (iOS/Android)
  // ========================================================================
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} ({pickMonthYear ? 'MM/YYYY' : 'DD/MM/YYYY'})
      </Text>
      <Pressable
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        onPress={() => {
          if (!disabled) {
            setPickerYear(value ? value.getFullYear() : new Date().getFullYear());
            setShowPicker(true);
          }
        }}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${label}, format ${pickMonthYear ? 'MM/YYYY' : 'DD/MM/YYYY'}`}
        accessibilityHint={
          pickMonthYear
            ? 'Double tap to open month and year selector'
            : 'Double tap to open date picker'
        }
        accessibilityState={{ disabled }}
      >
        <Text
          style={[
            styles.inputText,
            !value && styles.inputPlaceholder,
            disabled && styles.inputTextDisabled,
          ]}
        >
          {value ? formatDisplayDate(value, pickMonthYear) : 'Select date'}
        </Text>
        {pickMonthYear && (
          <Ionicons name="calendar-outline" size={20} color="#64748b" style={{ marginLeft: 'auto' }} />
        )}
      </Pressable>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Render Appropriate Picker */}
      {showPicker && (
        pickMonthYear ? (
          // Custom Modal for Month/Year Selection
          <Modal
            transparent
            visible={showPicker}
            animationType="fade"
            onRequestClose={() => setShowPicker(false)}
          >
            <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContent}>
                    {renderMonthYearPickerContent()}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        ) : (
          // Standard Native Picker
          <DateTimePicker
            value={value || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleNativeChange}
            maximumDate={maxDate || new Date(2099, 11, 31)}
            minimumDate={minDate || new Date(1900, 0, 1)}
          />
        )
      )}
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48, // Touch target size
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    opacity: 0.6,
  },
  inputText: {
    fontSize: 16,
    color: '#1a202c',
  },
  inputPlaceholder: {
    color: '#64748b',
  },
  inputTextDisabled: {
    color: '#6b7280',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },

  // Custom Picker Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalOverlayTransparent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  webPopover: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    width: 280, // Match typical date picker width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pickerContent: {
    width: '100%',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  pickerArrow: {
    padding: 4,
  },
  pickerYearText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  monthButton: {
    width: '31%', // 3 columns
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  monthButtonActive: {
    backgroundColor: '#3b82f6', // blue-500
    borderColor: '#3b82f6',
  },
  monthButtonDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
    opacity: 0.5,
  },
  monthText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  monthTextActive: {
    color: '#ffffff', // White text on active
    fontWeight: '600',
  },
  monthTextDisabled: {
    color: '#cbd5e1',
  },
});
