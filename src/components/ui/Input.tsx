/**
 * テキスト入力コンポーネント (React Native Elements)
 */
import { View } from 'react-native';
import { Input as RNEInput } from '@rneui/themed';
import { THEME_COLORS } from '@/theme/colors';
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
        errorStyle={{ color: THEME_COLORS.status.expired, fontSize: 12 }}
        inputContainerStyle={{
          borderWidth: 1,
          borderColor: error ? THEME_COLORS.ui.borderError : THEME_COLORS.ui.border,
          borderRadius: 8,
          paddingHorizontal: 12,
          backgroundColor: THEME_COLORS.ui.background,
        }}
        containerStyle={{
          paddingHorizontal: 0,
        }}
        labelStyle={{
          fontSize: 16,
          fontWeight: '500',
          color: THEME_COLORS.ui.textSecondary,
          marginBottom: 4,
        }}
      />
    </View>
  );
}
