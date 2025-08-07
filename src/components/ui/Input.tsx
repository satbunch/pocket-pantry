import React from 'react';
import { TextInput, TextInputProps, View, Text, StyleSheet } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  variant?: 'default' | 'filled';
}

export function Input({ label, error, leftIcon, rightIcon, variant = 'default', style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {/* Label */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Input Container */}
      <View style={[styles.inputContainer, styles[variant], error && styles.inputError]}>
        {/* Left Icon */}
        {leftIcon && <Text style={styles.icon}>{leftIcon}</Text>}

        {/* Text Input */}
        <TextInput style={[styles.input, style]} placeholderTextColor="#8E8E93" {...props} />

        {/* Right Icon */}
        {rightIcon && <Text style={styles.icon}>{rightIcon}</Text>}
      </View>

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  // Container styles
  container: {
    marginBottom: 4,
  },

  // Label styles
  label: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 6,
    fontWeight: '500',
  },

  // Input container styles
  inputContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    paddingHorizontal: 12,
  },

  // Variant styles
  default: {
    backgroundColor: 'transparent',
  },
  filled: {
    backgroundColor: '#F2F2F7',
  },

  // Input error state
  inputError: {
    borderColor: '#FF3B30',
  },

  // Text input styles
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
  },

  // Icon styles
  icon: {
    fontSize: 16,
    color: '#8E8E93',
    marginHorizontal: 4,
  },

  // Error text styles
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});
