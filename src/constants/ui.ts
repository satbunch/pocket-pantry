/**
 * UI関連の定数定義
 */
import { COLORS } from './colors';

/**
 * ボタンモードマッピング（React Native Paper）
 */
export const BUTTON_MODE_MAP = {
  primary: 'contained' as const,
  secondary: 'outlined' as const,
  danger: 'contained' as const,
};

/**
 * ボタン色マッピング
 */
export const BUTTON_COLOR_MAP = {
  primary: COLORS.primary,
  secondary: undefined, // outlinedモードで青の縁取りとテキスト
  danger: COLORS.danger,
};

/**
 * アウトラインボタンの縁取り色マッピング
 */
export const BUTTON_OUTLINE_COLOR_MAP = {
  primary: undefined,
  secondary: COLORS.primary,
  danger: undefined,
};
