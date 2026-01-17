import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { theme } from '../../theme';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

// --- CHANGED TO DEFAULT EXPORT ---
export default function Accordion({
  title,
  children,
  defaultOpen = false,
  headerStyle,
  titleStyle,
  iconColor,
}: AccordionProps & {
  headerStyle?: any;
  titleStyle?: any;
  iconColor?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleOpen}
        style={[styles.header, headerStyle]}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={title}
        accessibilityHint={isOpen ? 'Double tap to collapse' : 'Double tap to expand'}
        aria-expanded={isOpen}
      >
        <Text style={[styles.title, isOpen && styles.titleActive, titleStyle]}>{title}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={iconColor || (isOpen ? theme.colors.primary : theme.colors.textSecondary)}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        />
      </TouchableOpacity>

      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border || '#e5e7eb',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary || '#111827',
  },
  titleActive: {
    color: theme.colors.primary || '#2563EB',
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
});
