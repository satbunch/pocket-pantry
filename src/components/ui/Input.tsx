/**
 * テキスト入力コンポーネント (React Native Paper)
 */
import { View } from 'react-native';
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';
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
      <PaperTextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        mode="outlined"
        error={!!error}
      />
      {error && (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      )}
    </View>
  );
}
