/**
 * UI関連の定数定義
 */

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
  primary: '#3b82f6', // Tailwind blue-500
  secondary: undefined, // outlinedモードで青の縁取りとテキスト
  danger: '#EF4444', // Tailwind red-500
};

/**
 * アウトラインボタンの縁取り色マッピング
 */
export const BUTTON_OUTLINE_COLOR_MAP = {
  primary: undefined,
  secondary: '#3b82f6', // Tailwind blue-500
  danger: undefined,
};
