/**
 * ボタンコンポーネント (React Native Paper)
 */
import { Button as PaperButton } from 'react-native-paper';
import { BUTTON_MODE_MAP, BUTTON_COLOR_MAP, BUTTON_OUTLINE_COLOR_MAP } from '@/constants/ui';
import type { ButtonProps } from '@/types/ui/button';

export function Button({ title, onPress, variant = 'primary', disabled = false, className = '' }: ButtonProps) {
  const isOutlined = BUTTON_MODE_MAP[variant] === 'outlined';
  const outlineColor = isOutlined ? BUTTON_OUTLINE_COLOR_MAP[variant] : undefined;

  return (
    <PaperButton
      mode={BUTTON_MODE_MAP[variant]}
      onPress={onPress}
      disabled={disabled}
      buttonColor={BUTTON_COLOR_MAP[variant]}
      textColor={outlineColor}
      style={
        isOutlined && outlineColor
          ? {
              borderWidth: 1,
              borderColor: outlineColor,
            }
          : undefined
      }
      className={className}
    >
      {title}
    </PaperButton>
  );
}
