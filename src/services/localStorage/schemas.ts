// ============================================================================
// 基本型定義
// ============================================================================

export type LocalStorageKey =
  | 'items_local' // 食材データ
  | 'shopping_lists_local' // 買い物リスト
  | 'user_preferences' // ユーザー設定
  | 'sync_status' // 同期状態
  | 'app_metadata'; // アプリメタデータ

export type DataSource = 'local' | 'remote' | 'syncing';

// ============================================================================
// 食材データスキーマ
// ============================================================================

export interface LocalFoodItem {
  id: string; // UUID v4
  name: string; // 食材名
  category: FoodCategory; // カテゴリ
  quantity: number; // 数量
  unit: string; // 単位（個、パック、g等）
  purchase_date?: string; // 購入日（ISO 8601）
  expiry_date?: string; // 賞味期限（ISO 8601）
  location: StorageLocation; // 保存場所
  notes?: string; // メモ
  photo_uri?: string; // 写真のローカルパス
  barcode?: string; // バーコード（JANコード等）
  price?: number; // 価格
  created_at: string; // 作成日時（ISO 8601）
  updated_at: string; // 更新日時（ISO 8601）
  local_only: boolean; // ローカルのみのデータか
  sync_pending: boolean; // 同期待ちか
}

export type FoodCategory =
  | '野菜'
  | '果物'
  | '肉類'
  | '魚介類'
  | '乳製品'
  | '卵'
  | '穀物'
  | '調味料'
  | '冷凍食品'
  | '菓子'
  | '飲み物'
  | 'その他';

export type StorageLocation = '冷蔵庫' | '冷凍庫' | '野菜室' | '常温' | 'その他';

// ============================================================================
// 買い物リストスキーマ
// ============================================================================

export interface LocalShoppingList {
  id: string; // UUID v4
  name: string; // リスト名
  items: LocalShoppingItem[]; // 買い物アイテム
  created_at: string; // 作成日時
  updated_at: string; // 更新日時
  completed: boolean; // 完了フラグ
  local_only: boolean; // ローカルのみのデータか
  sync_pending: boolean; // 同期待ちか
}

export interface LocalShoppingItem {
  id: string; // UUID v4
  name: string; // アイテム名
  quantity?: number; // 数量
  unit?: string; // 単位
  checked: boolean; // チェック済みか
  category?: FoodCategory; // カテゴリ（推定）
  estimated_price?: number; // 予想価格
  notes?: string; // メモ
  created_at: string; // 作成日時
}

// ============================================================================
// ユーザー設定スキーマ
// ============================================================================

export interface LocalUserPreferences {
  // 通知設定
  notifications: {
    expiry_alerts: boolean; // 賞味期限アラート
    expiry_days_before: number; // 何日前に通知するか
    shopping_reminders: boolean; // 買い物リマインダー
    family_updates: boolean; // 家族更新通知
  };

  // 表示設定
  display: {
    default_view: 'list' | 'grid'; // デフォルト表示
    sort_by: 'name' | 'expiry' | 'category' | 'created'; // ソート方法
    sort_order: 'asc' | 'desc'; // ソート順
    show_expired: boolean; // 期限切れ表示
    group_by_category: boolean; // カテゴリ別グループ化
  };

  // 入力設定
  input: {
    default_location: StorageLocation; // デフォルト保存場所
    auto_suggest_expiry: boolean; // 賞味期限自動推定
    photo_auto_compress: boolean; // 写真自動圧縮
  };

  // データ設定
  data: {
    auto_backup_prompt: boolean; // 自動バックアップ促進
    max_local_items: number; // ローカル最大アイテム数
    auto_cleanup_expired: boolean; // 期限切れ自動削除
  };

  // 更新情報
  updated_at: string; // 設定更新日時
}

// ============================================================================
// 同期状態スキーマ
// ============================================================================

export interface LocalSyncStatus {
  // 認証状態
  auth_state: 'guest' | 'authenticated' | 'migrating';
  user_id?: string; // SupabaseユーザーID
  family_id?: string; // ファミリーID

  // 同期統計
  sync_stats: {
    last_sync_at?: string; // 最終同期日時
    pending_items: number; // 同期待ちアイテム数
    pending_lists: number; // 同期待ちリスト数
    failed_syncs: number; // 同期失敗回数
    total_synced_items: number; // 総同期済みアイテム数
  };

  // 同期設定
  sync_settings: {
    auto_sync: boolean; // 自動同期有効
    sync_on_wifi_only: boolean; // WiFi接続時のみ同期
    sync_interval_minutes: number; // 同期間隔（分）
  };

  // エラー情報
  last_error?: {
    message: string;
    occurred_at: string;
    retry_count: number;
  };
}

// ============================================================================
// アプリメタデータスキーマ
// ============================================================================

export interface LocalAppMetadata {
  // アプリ情報
  app_version: string; // アプリバージョン
  data_version: string; // データスキーマバージョン
  first_launch_at: string; // 初回起動日時
  last_launch_at: string; // 最終起動日時

  // オンボーディング
  onboarding: {
    completed: boolean; // オンボーディング完了
    current_step: number; // 現在のステップ
    skipped_auth_prompt: boolean; // 認証プロンプトをスキップしたか
    auth_prompt_count: number; // 認証促進回数
  };

  // 統計情報
  usage_stats: {
    total_items_added: number; // 総追加アイテム数
    total_lists_created: number; // 総作成リスト数
    days_used: number; // 使用日数
    feature_usage: Record<string, number>; // 機能別使用回数
  };

  // 更新情報
  updated_at: string;
}

// ============================================================================
// ヘルパー型
// ============================================================================

export interface LocalStorageData {
  items_local: LocalFoodItem[];
  shopping_lists_local: LocalShoppingList[];
  user_preferences: LocalUserPreferences;
  sync_status: LocalSyncStatus;
  app_metadata: LocalAppMetadata;
}

// デフォルト値を生成するためのファクトリー関数用型
export type LocalStorageDefaults = {
  [K in LocalStorageKey]: LocalStorageData[K];
};
