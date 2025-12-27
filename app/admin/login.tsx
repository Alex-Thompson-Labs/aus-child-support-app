/**
 * Admin Login Screen
 * Simple email/password authentication for alex@auschildsupport.com
 * Uses Supabase Auth with RLS policies
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/src/utils/supabase';
import { useResponsive, MAX_FORM_WIDTH, isWeb, webInputStyles, webClickableStyles } from '@/src/utils/responsive';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { isMobile, isDesktop } = useResponsive();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const webContainerStyle = isWeb ? {
    maxWidth: MAX_FORM_WIDTH,
    width: '100%' as const,
    alignSelf: 'center' as const,
  } : {};

  const handleLogin = async () => {
    // Validate inputs
    if (!email.trim()) {
      if (Platform.OS === 'web') {
        alert('Missing Information\n\nPlease enter your email.');
      } else {
        Alert.alert('Missing Information', 'Please enter your email.');
      }
      return;
    }

    if (!password.trim()) {
      if (Platform.OS === 'web') {
        alert('Missing Information\n\nPlease enter your password.');
      } else {
        Alert.alert('Missing Information', 'Please enter your password.');
      }
      return;
    }

    // Only allow alex@auschildsupport.com
    if (email.toLowerCase().trim() !== 'alex@auschildsupport.com') {
      if (Platform.OS === 'web') {
        alert('Unauthorized\n\nOnly admin account can access this area.');
      } else {
        Alert.alert('Unauthorized', 'Only admin account can access this area.');
      }
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('[AdminLogin] Error:', error);
        if (Platform.OS === 'web') {
          alert(`Login Failed\n\n${error.message}`);
        } else {
          Alert.alert('Login Failed', error.message);
        }
        return;
      }

      if (!data.session) {
        if (Platform.OS === 'web') {
          alert('Login Failed\n\nNo session returned.');
        } else {
          Alert.alert('Login Failed', 'No session returned.');
        }
        return;
      }

      console.log('[AdminLogin] Success - navigating to dashboard');
      router.replace('/admin/dashboard');
    } catch (error) {
      console.error('[AdminLogin] Unexpected error:', error);
      if (Platform.OS === 'web') {
        alert(`Error\n\n${error instanceof Error ? error.message : 'Unknown error'}`);
      } else {
        Alert.alert('Error', error instanceof Error ? error.message : 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={[styles.scrollContent, webContainerStyle]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, isDesktop && styles.titleDesktop]}>Admin Login</Text>
            <Text style={styles.subtitle}>Manage leads and communicate with lawyers</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, isWeb && webInputStyles]}
              placeholder="alex@auschildsupport.com"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, isWeb && webInputStyles]}
              placeholder="Enter your password"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              editable={!loading}
              onSubmitEditing={handleLogin}
            />

            <Pressable 
              style={[
                styles.button, 
                loading && styles.buttonDisabled,
                isWeb && webClickableStyles
              ]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Admin access only. Session expires after 1 hour of inactivity.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-900
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleDesktop: {
    fontSize: 32,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8', // slate-400
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0', // slate-200
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e293b', // slate-800
    color: '#ffffff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155', // slate-700
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb', // blue-600
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b', // slate-500
    textAlign: 'center',
    lineHeight: 18,
  },
});


