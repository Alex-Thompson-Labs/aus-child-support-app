import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function BlogLayout() {
  useEffect(() => {
    // Only load chatbot on web platform
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Check if chatbot is already loaded
      if (document.querySelector('.auscsc-widget-trigger')) {
        return;
      }

      // Load chatbot script
      const script = document.createElement('script');
      script.src = '/chatbot-widget.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      // Cleanup function
      return () => {
        // Remove script on unmount
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        // Remove chatbot elements
        const trigger = document.querySelector('.auscsc-widget-trigger');
        const chatWindow = document.getElementById('auscsc-chat-window');
        if (trigger) trigger.remove();
        if (chatWindow) chatWindow.remove();
      };
    }
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
