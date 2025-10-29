/**
 * テキスト入力コンポーネント (React Native Elements)
 */
import { View } from 'react-native';
import { Input as RNEInput } from '@rneui/themed';
import type { InputProps } from '@/types/ui/input';

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  className = '',
}: InputProps) {
  return (
    <View className={className}>
      <RNEInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        errorMessage={error}
        errorStyle={{ color: '#ef4444', fontSize: 12 }}
        inputContainerStyle={{
          borderWidth: 1,
          borderColor: error ? '#ef4444' : '#d1d5db',
          borderRadius: 8,
          paddingHorizontal: 12,
          backgroundColor: '#ffffff',
        }}
        containerStyle={{
          paddingHorizontal: 0,
        }}
        labelStyle={{
          fontSize: 16,
          fontWeight: '500',
          color: '#374151',
          marginBottom: 4,
        }}
      />
    </View>
  );
}
