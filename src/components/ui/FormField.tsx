import { View, Text } from 'react-native';
import type { FormFieldProps } from '@/types/ui/form';

export function FormField({ error, required, children }: FormFieldProps) {
  return (
    <View>
      {!error && required && <Text className="text-xs text-red-500 mt-1">※</Text>}
      {children}
    </View>
  );
}
