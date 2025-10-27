/**
 * React Native Paper テーマカスタマイズ
 */
import { MD3LightTheme } from 'react-native-paper';
import { COLORS } from '@/constants/colors';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    primaryContainer: COLORS.primaryLight,
    secondary: COLORS.secondary,
    secondaryContainer: COLORS.secondaryLight,
    tertiary: COLORS.warning,
    tertiaryContainer: COLORS.warningLight,
    error: COLORS.danger,
    errorContainer: COLORS.dangerLight,
    background: COLORS.bgLight,
    surface: COLORS.white,
    surfaceVariant: COLORS.bgNeutral,
    outline: COLORS.border,
    outlineVariant: COLORS.borderLight,
  },
};
