/**
 * Personal Info Section Component
 *
 * Form inputs for name, email, phone, and postcode.
 */

import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { isWeb } from '@/src/utils/responsive';
import { formStyles } from '../styles';
import { VALIDATION } from '../validators';
import type { PersonalInfoSectionProps } from '../types';

export function PersonalInfoSection({
  name,
  email,
  phone,
  postcode,
  errors,
  touched,
  isSubmitting,
  onTextChange,
  onBlur,
  setName,
  setEmail,
  setPhone,
  setPostcode,
  emailRef,
  phoneRef,
  messageRef,
}: PersonalInfoSectionProps) {
  return (
    <>
      <Text style={formStyles.formTitle}>Your Information</Text>

      {/* Name Input */}
      <View style={formStyles.inputContainer}>
        <TextInput
          style={[
            formStyles.input,
            touched.name && errors.name && formStyles.inputError,
          ]}
          placeholder="Your Name *"
          placeholderTextColor="#64748b"
          value={name}
          onChangeText={(value) => onTextChange('name', value, setName)}
          onBlur={() => onBlur('name')}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          maxLength={VALIDATION.NAME_MAX_LENGTH}
          editable={!isSubmitting}
          accessibilityLabel="Your name"
          accessibilityHint="Enter your full name"
        />
        {touched.name && errors.name && (
          <Text style={formStyles.errorText}>{errors.name}</Text>
        )}
      </View>

      {/* Email Input */}
      <View style={formStyles.inputContainer}>
        <TextInput
          ref={emailRef}
          style={[
            formStyles.input,
            touched.email && errors.email && formStyles.inputError,
          ]}
          placeholder="Email *"
          placeholderTextColor="#64748b"
          value={email}
          onChangeText={(value) => onTextChange('email', value, setEmail)}
          onBlur={() => onBlur('email')}
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          editable={!isSubmitting}
          accessibilityLabel="Email address"
          accessibilityHint="Enter your email address"
        />
        {touched.email && errors.email && (
          <Text style={formStyles.errorText}>{errors.email}</Text>
        )}
      </View>

      {/* Phone Input */}
      <View style={formStyles.inputContainer}>
        <TextInput
          ref={phoneRef}
          style={[
            formStyles.input,
            touched.phone && errors.phone && formStyles.inputError,
          ]}
          placeholder="Phone (optional)"
          placeholderTextColor="#64748b"
          value={phone}
          onChangeText={(value) => onTextChange('phone', value, setPhone)}
          onBlur={() => onBlur('phone')}
          keyboardType="phone-pad"
          returnKeyType="next"
          autoComplete="tel"
          textContentType="telephoneNumber"
          maxLength={20}
          editable={!isSubmitting}
          accessibilityLabel="Phone number"
          accessibilityHint="Optional. Enter your phone number"
        />
        {touched.phone && errors.phone && (
          <Text style={formStyles.errorText}>{errors.phone}</Text>
        )}
      </View>

      {/* Postcode Input */}
      <View style={formStyles.inputContainer}>
        <TextInput
          style={[
            formStyles.input,
            touched.postcode && errors.postcode && formStyles.inputError,
          ]}
          placeholder="Postcode *"
          placeholderTextColor="#64748b"
          value={postcode}
          onChangeText={(value) => onTextChange('postcode', value, setPostcode)}
          onBlur={() => onBlur('postcode')}
          keyboardType="number-pad"
          returnKeyType="next"
          onSubmitEditing={() => messageRef.current?.focus()}
          maxLength={4}
          editable={!isSubmitting}
          accessibilityLabel="Postcode"
          accessibilityHint="Enter your 4-digit Australian postcode"
          {...(isWeb && { inputMode: 'numeric' as any })}
        />
        {touched.postcode && errors.postcode && (
          <Text style={formStyles.errorText}>{errors.postcode}</Text>
        )}
      </View>
    </>
  );
}
