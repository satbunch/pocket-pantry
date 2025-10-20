/**
 * ボタンコンポーネント
 */
import { TouchableOpacity, Text } from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

export function Button({ title, onPress, variant = 'primary', disabled = false, className = '' }: ButtonProps) {
  const variantClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-200',
    danger: 'bg-red-500',
  };

  const textVariantClasses = {
    primary: 'text-white',
    secondary: 'text-black',
    danger: 'text-white',
  };

  return (
    <TouchableOpacity
      className={`py-3 px-6 rounded-lg items-center justify-center ${variantClasses[variant]} ${disabled ? 'opacity-50' : ''} ${className}`}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text className={`text-base font-semibold ${textVariantClasses[variant]}`}>{title}</Text>
    </TouchableOpacity>
  );
}
