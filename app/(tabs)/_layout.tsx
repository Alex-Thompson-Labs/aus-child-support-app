import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

const isWeb = Platform.OS === 'web';

export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E2E8F0', // off-white for professional look
        tabBarInactiveTintColor: 'rgba(226, 232, 240, 0.5)', // 50% opacity off-white
        headerShown: false,
        tabBarButton: HapticTab,
        // Web-specific tab bar styling
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calculator',
          tabBarIcon: ({ color }) => <IconSymbol size={isWeb ? 24 : 28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Info',
          tabBarIcon: ({ color }) => <IconSymbol size={isWeb ? 24 : 28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

// Unused styles - kept for potential future use
// const styles = StyleSheet.create({
//   tabBarWeb: {
//     height: 56,
//     paddingBottom: 8,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#334155', // slate-700
//     backgroundColor: '#0f172a', // slate-900
//   },
//   tabBarLabelWeb: {
//     fontSize: 13,
//     fontWeight: '500',
//   },
//   tabBarIconWeb: {
//     marginBottom: 2,
//   },
// });
