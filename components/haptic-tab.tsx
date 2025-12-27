import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { Platform, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

const isWeb = Platform.OS === 'web';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      style={[props.style, isWeb && styles.webTab]}
      onPressIn={(ev) => {
        // Only enable haptics on iOS (not web or Android)
        if (process.env.EXPO_OS === 'ios' && Platform.OS !== 'web') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}

const styles = StyleSheet.create({
  webTab: {
    // Web-specific cursor and interaction improvements
    cursor: 'pointer',
  } as any, // cursor is web-only property
});
