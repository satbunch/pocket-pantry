/**
 * Supabase データベーススキーマの型定義
 * Phase 2以降で使用
 */

/**
 * families テーブル
 * ファミリーグループを管理
 */
export interface Family {
  id: string; // UUID
  name: string;
  avatar_url: string | null;
  invite_code: string; // 人が読める招待コード（ユニーク）
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

/**
 * profiles テーブル
 * ユーザープロフィール情報
 * Supabase Auth の user.id と連携
 */
export interface Profile {
  id: string; // Supabase Auth user.id と同じ
  family_id: string; // FK: families.id
  name: string; // ユーザー表示名
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

/**
 * unit_master テーブル
 * 単位マスターデータ
 * 個/g/ml/本/袋/パック/枚 など
 */
export interface Unit {
  id: string; // UUID
  label: string; // 表示名（個/g/ml/本）
  value: string; // 内部値（piece/g/ml）- ユニーク
  created_at: string; // ISO 8601
}

/**
 * ingredients テーブル
 * 食材情報（Phase 1のIngredientを拡張）
 */
export interface SupabaseIngredient {
  id: string; // UUID
  family_id: string; // FK: families.id （Phase 2で必須）
  name: string;
  storage_category: '冷蔵' | '冷凍' | '常温' | '野菜室';
  quantity: number;
  unit_id: string | null; // FK: unit_master.id
  increment_amount: number;
  is_expiry_not_managed: boolean;
  expiry_date: string | null; // ISO 8601 (YYYY-MM-DD)
  jan_code: string | null; // JANコード（将来用）
  memo: string;
  last_synced_token: string | null; // 同期制御用トークン
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

/**
 * shopping_lists テーブル
 * 買い物リスト（将来は複数リスト対応）
 */
export interface SupabaseShoppingList {
  id: string; // UUID
  family_id: string; // FK: families.id （Phase 2で必須）
  name: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

/**
 * shopping_list_items テーブル
 * 買い物リストのアイテム
 */
export interface SupabaseShoppingListItem {
  id: string; // UUID
  shopping_list_id: string; // FK: shopping_lists.id
  ingredient_id: string | null; // FK: ingredients.id (nullable - 過去登録済みの場合)
  custom_name: string | null; // 自由記述用（past ingredients選択時はnull）
  quantity: number;
  is_checked: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

/**
 * usage_logs テーブル
 * 使用ログ（Phase 5: API利用ログ、OCRスキャン等）
 */
export interface UsageLog {
  id: string; // UUID
  user_id: string; // FK: profiles.id
  action_type: string; // ocr_scan, barcode_scan など
  parameter_json: Record<string, unknown> | null; // jsonb
  created_at: string; // ISO 8601
}

/**
 * Supabase RPC 型定義（将来拡張用）
 */
export interface MigrationResult {
  success: boolean;
  message: string;
  migrated_count: number;
}
