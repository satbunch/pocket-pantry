import React from 'react';
import { View, Text } from 'react-native';

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ error, required, children }: FormFieldProps) {
  return (
    <View>
      {children}
      {!error && required && <Text className="text-xs text-red-500 mt-1">必須</Text>}
    </View>
  );
}
