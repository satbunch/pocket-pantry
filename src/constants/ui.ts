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
  primary: undefined, // デフォルトテーマカラー使用
  secondary: undefined,
  danger: '#EF4444', // Tailwind red-500
};
