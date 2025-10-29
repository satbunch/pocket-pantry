/**
 * ボタンコンポーネント (React Native Elements)
 */
import { Button as RNEButton } from '@rneui/themed';
import type { ButtonProps } from '@/types/ui/button';

export function Button({ title, onPress, variant = 'primary', disabled = false, className = '' }: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#3b82f6',
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          backgroundColor: '#ef4444',
        };
      case 'warning':
        return {
          backgroundColor: '#f97316',
        };
      default:
        return {
          backgroundColor: '#3b82f6',
        };
    }
  };

  const getTitleStyle = () => {
    if (variant === 'secondary') {
      return {
        color: '#3b82f6',
      };
    }
    return {
      color: '#ffffff',
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
