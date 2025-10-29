/**
 * アプリケーション全体のテーマ色定義
 * すべてのコンポーネントはこのテーマを参照すること
 */

/**
 * ステータス表示用の色
 */
export const THEME_STATUS_COLORS = {
  expired: '#ef4444', // 期限切れ（赤）
  soon: '#f97316', // もうすぐ期限切れ（オレンジ）
  ok: '#6b7280', // 通常（グレー）
} as const;

/**
 * UI要素用の色
 */
export const THEME_UI_COLORS = {
  // アイコン
  icon: '#6b7280', // アイコン（グレー）
  delete: '#ef4444', // 削除ボタン（赤）

  // テキスト
  quantity: '#1e40af', // 数量テキスト（濃い青）
  unitText: '#6b7280', // 単位テキスト（グレー）
  textPrimary: '#111827', // プライマリテキスト（濃いグレー）
  textSecondary: '#374151', // セカンダリテキスト（中グレー）
  textMuted: '#9ca3af', // ミュートテキスト（薄いグレー）

  // ボーダー・背景
  border: '#e5e7eb', // ボーダー（明るいグレー）
  borderError: '#ef4444', // エラーボーダー（赤）
  background: '#ffffff', // 背景（白）
  backgroundLight: '#f9fafb', // 薄い背景（ライトグレー）

  // ボタン
  buttonPrimary: '#3b82f6', // プライマリボタン（青）
  buttonSecondary: '#3b82f6', // セカンダリボタンテキスト（青）
  buttonDanger: '#ef4444', // 危険ボタン（赤）
  buttonWarning: '#f97316', // 警告ボタン（オレンジ）
  buttonTextWhite: '#ffffff', // ボタンテキスト（白）
} as const;

/**
 * 保管場所別のバッジカラー
 */
export const THEME_STORAGE_COLORS = {
  冷蔵: '#3b82f6', // Blue
  冷凍: '#06b6d4', // Cyan
  常温: '#f59e0b', // Amber
  野菜室: '#22c55e', // Emerald
} as const;

/**
 * テーマ色の統合オブジェクト
 */
export const THEME_COLORS = {
  status: THEME_STATUS_COLORS,
  ui: THEME_UI_COLORS,
  storage: THEME_STORAGE_COLORS,
} as const;
