/**
 * ボタンコンポーネント (React Native Elements)
 */
import { Button as RNEButton } from '@rneui/themed';
import { THEME_COLORS } from '@/theme/colors';
import type { ButtonProps } from '@/types/ui/button';

export function Button({ title, onPress, variant = 'primary', disabled = false, className = '' }: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: THEME_COLORS.ui.buttonPrimary,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          backgroundColor: THEME_COLORS.ui.buttonDanger,
        };
      case 'warning':
        return {
          backgroundColor: THEME_COLORS.ui.buttonWarning,
        };
      default:
        return {
          backgroundColor: THEME_COLORS.ui.buttonPrimary,
        };
    }
  };

  const getTitleStyle = () => {
    if (variant === 'secondary') {
      return {
        color: THEME_COLORS.ui.buttonSecondary,
      };
    }
    return {
      color: THEME_COLORS.ui.buttonTextWhite,
    };
  };

  return (
    <RNEButton
      title={title}
      onPress={onPress}
      disabled={disabled}
      buttonStyle={getButtonStyle()}
      titleStyle={getTitleStyle()}
      type={variant === 'secondary' ? 'outline' : 'solid'}
      className={className}
    />
  );
}
