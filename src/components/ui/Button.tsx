/**
 * ボタンコンポーネント (React Native Paper)
 */
import { Button as PaperButton } from 'react-native-paper';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

export function Button({ title, onPress, variant = 'primary', disabled = false, className = '' }: ButtonProps) {
  const modeMap = {
    primary: 'contained' as const,
    secondary: 'outlined' as const,
    danger: 'contained' as const,
  };

  const buttonColorMap = {
    primary: undefined, // デフォルトテーマカラー使用
    secondary: undefined,
    danger: '#EF4444', // Tailwind red-500
  };

  return (
    <PaperButton
      mode={modeMap[variant]}
      onPress={onPress}
      disabled={disabled}
      buttonColor={buttonColorMap[variant]}
      className={className}
    >
      {title}
    </PaperButton>
  );
}
