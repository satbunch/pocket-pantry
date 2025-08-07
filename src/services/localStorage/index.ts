// このファイル内で使用している型定義をインポート
import type { LocalFoodItem, FoodCategory, StorageLocation } from './schemas';

// 基本ラッパー
export { LocalStorage } from './storage';

// 型定義
export type {
  // キー・データソース
  LocalStorageKey,
  DataSource,

  // 食材関連
  LocalFoodItem,
  FoodCategory,
  StorageLocation,

  // 買い物リスト関連
  LocalShoppingList,
  LocalShoppingItem,

  // 設定・メタデータ
  LocalUserPreferences,
  LocalSyncStatus,
  LocalAppMetadata,

  // 統合型
  LocalStorageData,
  LocalStorageDefaults as LocalStorageDefaultsType,
} from './schemas';

// 便利な定数
export const STORAGE_LIMITS = {
  ANDROID_MAX_SIZE: 6 * 1024 * 1024, // 6MB
  RECOMMENDED_MAX_ITEMS: 1000,
  WARNING_USAGE_THRESHOLD: 80, // %
  CRITICAL_USAGE_THRESHOLD: 95, // %
} as const;

export const DEFAULT_CATEGORIES: readonly FoodCategory[] = [
  '野菜',
  '果物',
  '肉類',
  '魚介類',
  '乳製品',
  '卵',
  '穀物',
  '調味料',
  '冷凍食品',
  '菓子',
  '飲み物',
  'その他',
] as const;

export const DEFAULT_LOCATIONS: readonly StorageLocation[] = ['冷蔵庫', '冷凍庫', '野菜室', '常温', 'その他'] as const;

// ヘルパー関数
export const LocalStorageHelpers = {
  /**
   * 賞味期限までの日数を計算
   */
  getDaysUntilExpiry(expiryDate: string): number {
    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * 食材の緊急度を判定
   */
  getItemUrgency(item: LocalFoodItem): 'expired' | 'urgent' | 'warning' | 'normal' {
    if (!item.expiry_date) return 'normal';

    const days = LocalStorageHelpers.getDaysUntilExpiry(item.expiry_date);

    if (days < 0) return 'expired';
    if (days <= 1) return 'urgent';
    if (days <= 3) return 'warning';
    return 'normal';
  },

  /**
   * カテゴリの絵文字を取得
   */
  getCategoryEmoji(category: FoodCategory): string {
    const emojiMap: Record<FoodCategory, string> = {
      野菜: '🥬',
      果物: '🍎',
      肉類: '🥩',
      魚介類: '🐟',
      乳製品: '🥛',
      卵: '🥚',
      穀物: '🌾',
      調味料: '🧂',
      冷凍食品: '🧊',
      菓子: '🍪',
      飲み物: '🥤',
      その他: '📦',
    };
    return emojiMap[category] || '📦';
  },

  /**
   * 保存場所の絵文字を取得
   */
  getLocationEmoji(location: StorageLocation): string {
    const emojiMap: Record<StorageLocation, string> = {
      冷蔵庫: '❄️',
      冷凍庫: '🧊',
      野菜室: '🥬',
      常温: '🌡️',
      その他: '📦',
    };
    return emojiMap[location] || '📦';
  },

  /**
   * データサイズを人間が読みやすい形式に変換
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * 日付を相対的な表現に変換
   */
  formatRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '昨日';
    if (diffDays < 7) return `${diffDays}日前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
    return `${Math.floor(diffDays / 30)}ヶ月前`;
  },
} as const;
