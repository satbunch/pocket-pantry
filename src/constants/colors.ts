/**
 * アプリケーション全体の色定義
 * Tailwind CSSの色システムを基準に定義
 */

/**
 * プライマリカラー
 */
export const COLORS_PRIMARY = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6', // Primary
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
};

/**
 * セカンダリカラー
 */
export const COLORS_SECONDARY = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#145231',
};

/**
 * デンジャー・エラーカラー
 */
export const COLORS_DANGER = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444', // Danger/Error
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
};

/**
 * ワーニング・アラートカラー
 */
export const COLORS_WARNING = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
};

/**
 * グレースケール
 */
export const COLORS_GRAY = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
};

/**
 * ニュートラル・バックグラウンドカラー
 */
export const COLORS_BACKGROUND = {
  white: '#ffffff',
  light: '#f9fafb',
  neutral: '#f3f4f6',
};

/**
 * よく使う色のショートカット
 */
export const COLORS = {
  // Primary
  primary: COLORS_PRIMARY[500],
  primaryLight: COLORS_PRIMARY[50],
  primaryDark: COLORS_PRIMARY[700],

  // Secondary
  secondary: COLORS_SECONDARY[500],
  secondaryLight: COLORS_SECONDARY[50],
  secondaryDark: COLORS_SECONDARY[700],

  // Danger
  danger: COLORS_DANGER[500],
  dangerLight: COLORS_DANGER[50],
  dangerDark: COLORS_DANGER[700],

  // Warning
  warning: COLORS_WARNING[500],
  warningLight: COLORS_WARNING[50],
  warningDark: COLORS_WARNING[700],

  // Gray
  textPrimary: COLORS_GRAY[900],
  textSecondary: COLORS_GRAY[700],
  textTertiary: COLORS_GRAY[500],
  textMuted: COLORS_GRAY[400],
  border: COLORS_GRAY[300],
  borderLight: COLORS_GRAY[200],
  bgPrimary: COLORS_GRAY[50],
  bgSecondary: COLORS_GRAY[100],

  // Background
  white: COLORS_BACKGROUND.white,
  bgLight: COLORS_BACKGROUND.light,
  bgNeutral: COLORS_BACKGROUND.neutral,
};
