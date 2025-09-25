import { LocalStorage } from './index';
import { LocalFoodItemsService } from './items';
import { LocalShoppingService } from './shopping';
import { LocalStorageDefaults } from './defaults';
import {
  LocalStorageKey,
  LocalUserPreferences,
  LocalSyncStatus,
  LocalAppMetadata,
  LocalFoodItem,
  LocalShoppingList,
} from './schemas';

/**
 * ローカルストレージの統合管理サービス
 * アプリの初期化、データ整合性、バックアップ・復元を担当
 */
export class LocalStorageManager {
  /**
   * アプリ初回起動時の初期化
   */
  static async initialize(includeSampleData: boolean = true): Promise<{
    isFirstLaunch: boolean;
    dataInitialized: boolean;
  }> {
    try {
      // 初回起動かどうかを確認
      const appMetadata = await LocalStorage.getItem<LocalAppMetadata>('app_metadata');
      const isFirstLaunch = !appMetadata;

      if (isFirstLaunch) {
        // 初回起動時のデータセットアップ
        const initialData = LocalStorageDefaults.createInitialDataSet(includeSampleData);

        await LocalStorage.setMultiple(initialData);

        console.log('✅ ローカルストレージ初期化完了');
        return { isFirstLaunch: true, dataInitialized: true };
      } else {
        // 既存データのマイグレーション確認
        await this.migrateDataIfNeeded();

        // 最終起動時刻を更新
        await this.updateLastLaunchTime();

        return { isFirstLaunch: false, dataInitialized: true };
      }
    } catch (error) {
      console.error('❌ ローカルストレージ初期化失敗:', error);
      return { isFirstLaunch: false, dataInitialized: false };
    }
  }

  /**
   * データバージョンのマイグレーション
   */
  static async migrateDataIfNeeded(): Promise<void> {
    const currentAppVersion = '1.0.0';
    const currentDataVersion = '1.0';

    const appMetadata = await LocalStorage.getItem<LocalAppMetadata>('app_metadata');

    if (!appMetadata) {
      return; // 初回起動はinitializeで処理
    }

    // アプリバージョンの更新が必要かチェック
    if (appMetadata.app_version !== currentAppVersion || appMetadata.data_version !== currentDataVersion) {
      console.log('📱 データマイグレーション開始');

      // 各データの段階的マイグレーション
      await this.migrateUserPreferences();
      await this.migrateSyncStatus();
      await this.migrateAppMetadata();

      console.log('✅ データマイグレーション完了');
    }
  }

  /**
   * ユーザー設定のマイグレーション
   */
  private static async migrateUserPreferences(): Promise<void> {
    const existing = await LocalStorage.getItem<Partial<LocalUserPreferences>>('user_preferences');
    if (existing) {
      const migrated = LocalStorageDefaults.migrateUserPreferences(existing);
      await LocalStorage.setItem('user_preferences', migrated);
    }
  }

  /**
   * 同期状態のマイグレーション
   */
  private static async migrateSyncStatus(): Promise<void> {
    const existing = await LocalStorage.getItem<Partial<LocalSyncStatus>>('sync_status');
    if (existing) {
      const migrated = LocalStorageDefaults.migrateSyncStatus(existing);
      await LocalStorage.setItem('sync_status', migrated);
    }
  }

  /**
   * アプリメタデータのマイグレーション
   */
  private static async migrateAppMetadata(): Promise<void> {
    const existing = await LocalStorage.getItem<Partial<LocalAppMetadata>>('app_metadata');
    if (existing) {
      const migrated = LocalStorageDefaults.migrateAppMetadata(existing);
      await LocalStorage.setItem('app_metadata', migrated);
    }
  }

  /**
   * 最終起動時刻を更新
   */
  static async updateLastLaunchTime(): Promise<void> {
    const metadata = await LocalStorage.getItem<LocalAppMetadata>('app_metadata');
    if (metadata) {
      metadata.last_launch_at = new Date().toISOString();
      metadata.updated_at = new Date().toISOString();
      await LocalStorage.setItem('app_metadata', metadata);
    }
  }

  /**
   * 使用統計を更新
   */
  static async updateUsageStats(feature: string): Promise<void> {
    const metadata = await LocalStorage.getItem<LocalAppMetadata>('app_metadata');
    if (metadata) {
      metadata.usage_stats.feature_usage[feature] = (metadata.usage_stats.feature_usage[feature] || 0) + 1;
      metadata.updated_at = new Date().toISOString();
      await LocalStorage.setItem('app_metadata', metadata);
    }
  }

  /**
   * データ整合性チェック
   */
  static async validateDataIntegrity(): Promise<{
    isValid: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    try {
      // 必須データの存在確認
      const requiredKeys: LocalStorageKey[] = [
        'items_local',
        'shopping_lists_local',
        'user_preferences',
        'sync_status',
        'app_metadata',
      ];

      for (const key of requiredKeys) {
        const exists = await LocalStorage.hasItem(key);
        if (!exists) {
          issues.push(`必須データが不足: ${key}`);
        }
      }

      // 食材データの整合性チェック
      const items = await LocalFoodItemsService.getAllItems();
      items.forEach((item, index) => {
        if (!item.id || !item.name || !item.category) {
          issues.push(`食材データの必須フィールド不足: index ${index}`);
        }
        if (item.expiry_date && isNaN(new Date(item.expiry_date).getTime())) {
          issues.push(`無効な賞味期限: ${item.name}`);
        }
      });

      // 買い物リストの整合性チェック
      const lists = await LocalShoppingService.getAllLists();
      lists.forEach((list, index) => {
        if (!list.id || !list.name) {
          issues.push(`買い物リストの必須フィールド不足: index ${index}`);
        }
        list.items.forEach((item, itemIndex) => {
          if (!item.id || !item.name) {
            issues.push(`買い物リストアイテムの必須フィールド不足: list ${index}, item ${itemIndex}`);
          }
        });
      });

      return {
        isValid: issues.length === 0,
        issues,
      };
    } catch (error) {
      issues.push(`整合性チェック中にエラー: ${error}`);
      return { isValid: false, issues };
    }
  }

  /**
   * 破損データの自動修復
   */
  static async repairCorruptedData(): Promise<{
    repaired: boolean;
    repairedItems: string[];
  }> {
    const repairedItems: string[] = [];

    try {
      // 必須データが不足している場合はデフォルト値で復元
      const requiredDefaults = LocalStorageDefaults.createInitialDataSet(false);

      for (const [key, defaultValue] of Object.entries(requiredDefaults)) {
        const exists = await LocalStorage.hasItem(key as LocalStorageKey);
        if (!exists) {
          await LocalStorage.setItem(key as LocalStorageKey, defaultValue);
          repairedItems.push(`${key}をデフォルト値で復元`);
        }
      }

      // 無効な食材データをフィルタリング
      const items = await LocalFoodItemsService.getAllItems();
      const validItems = items.filter(item => item.id && item.name && item.category);
      if (validItems.length !== items.length) {
        await LocalStorage.setItem('items_local', validItems);
        repairedItems.push(`無効な食材データを除去: ${items.length - validItems.length}件`);
      }

      // 無効な買い物リストデータをフィルタリング
      const lists = await LocalShoppingService.getAllLists();
      const validLists = lists
        .filter(list => list.id && list.name)
        .map(list => ({
          ...list,
          items: list.items.filter(item => item.id && item.name),
        }));

      const totalItems = lists.reduce((sum, list) => sum + list.items.length, 0);
      const validTotalItems = validLists.reduce((sum, list) => sum + list.items.length, 0);

      if (validLists.length !== lists.length || validTotalItems !== totalItems) {
        await LocalStorage.setItem('shopping_lists_local', validLists);
        repairedItems.push(`無効な買い物リストデータを修復`);
      }

      return {
        repaired: repairedItems.length > 0,
        repairedItems,
      };
    } catch (error) {
      console.error('データ修復中にエラー:', error);
      return { repaired: false, repairedItems: [] };
    }
  }

  /**
   * 全データのバックアップを作成
   */
  static async createBackup(): Promise<{
    success: boolean;
    backup?: {
      items: LocalFoodItem[];
      shopping_lists: LocalShoppingList[];
      user_preferences: LocalUserPreferences;
      sync_status: LocalSyncStatus;
      app_metadata: LocalAppMetadata;
      created_at: string;
      version: string;
    };
    error?: string;
  }> {
    try {
      const [items, shopping_lists, user_preferences, sync_status, app_metadata] = await Promise.all([
        LocalFoodItemsService.getAllItems(),
        LocalShoppingService.getAllLists(),
        LocalStorage.getItem<LocalUserPreferences>('user_preferences'),
        LocalStorage.getItem<LocalSyncStatus>('sync_status'),
        LocalStorage.getItem<LocalAppMetadata>('app_metadata'),
      ]);

      const backup = {
        items,
        shopping_lists,
        user_preferences: user_preferences!,
        sync_status: sync_status!,
        app_metadata: app_metadata!,
        created_at: new Date().toISOString(),
        version: '1.0',
      };

      return { success: true, backup };
    } catch (error) {
      return {
        success: false,
        error: `バックアップ作成失敗: ${error}`,
      };
    }
  }

  /**
   * バックアップからデータを復元
   */
  static async restoreFromBackup(backup: any): Promise<{
    success: boolean;
    restored_items?: number;
    error?: string;
  }> {
    try {
      // バックアップデータの検証
      if (!backup.items || !backup.shopping_lists || !backup.user_preferences) {
        return { success: false, error: '無効なバックアップデータ' };
      }

      // データを復元
      await LocalStorage.setMultiple({
        items_local: backup.items,
        shopping_lists_local: backup.shopping_lists,
        user_preferences: backup.user_preferences,
        sync_status: backup.sync_status || LocalStorageDefaults.createSyncStatus(),
        app_metadata: backup.app_metadata || LocalStorageDefaults.createAppMetadata(),
      });

      const totalItems = backup.items.length + backup.shopping_lists.length;

      return {
        success: true,
        restored_items: totalItems,
      };
    } catch (error) {
      return {
        success: false,
        error: `復元失敗: ${error}`,
      };
    }
  }

  /**
   * ストレージ使用量の監視
   */
  static async getStorageInfo(): Promise<{
    total_size_bytes: number;
    items_count: number;
    lists_count: number;
    estimated_limit_usage: number; // Android 6MB制限に対する使用率
  }> {
    try {
      const [totalSize, items, lists] = await Promise.all([
        LocalStorage.getStorageSize(),
        LocalFoodItemsService.getAllItems(),
        LocalShoppingService.getAllLists(),
      ]);

      const androidLimit = 6 * 1024 * 1024; // 6MB
      const estimatedUsage = (totalSize / androidLimit) * 100;

      return {
        total_size_bytes: totalSize,
        items_count: items.length,
        lists_count: lists.length,
        estimated_limit_usage: Math.min(estimatedUsage, 100),
      };
    } catch (error) {
      console.error('ストレージ情報取得エラー:', error);
      return {
        total_size_bytes: 0,
        items_count: 0,
        lists_count: 0,
        estimated_limit_usage: 0,
      };
    }
  }

  /**
   * 古いデータのクリーンアップ
   */
  static async cleanupOldData(options?: {
    cleanupExpired?: boolean;
    cleanupCompletedLists?: boolean;
    daysThreshold?: number;
  }): Promise<{
    cleaned_items: number;
    cleaned_lists: number;
  }> {
    const { cleanupExpired = true, cleanupCompletedLists = true, daysThreshold = 30 } = options || {};

    let cleanedItems = 0;
    let cleanedLists = 0;

    try {
      // 期限切れ食材のクリーンアップ
      if (cleanupExpired) {
        cleanedItems = await LocalFoodItemsService.cleanupExpiredItems(7);
      }

      // 完了した古い買い物リストのクリーンアップ
      if (cleanupCompletedLists) {
        const lists = await LocalShoppingService.getAllLists();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

        const listsToKeep = lists.filter(list => {
          if (!list.completed) return true;
          const updatedDate = new Date(list.updated_at);
          return updatedDate >= cutoffDate;
        });

        cleanedLists = lists.length - listsToKeep.length;
        if (cleanedLists > 0) {
          await LocalStorage.setItem('shopping_lists_local', listsToKeep);
        }
      }

      return { cleaned_items: cleanedItems, cleaned_lists: cleanedLists };
    } catch (error) {
      console.error('クリーンアップエラー:', error);
      return { cleaned_items: 0, cleaned_lists: 0 };
    }
  }

  /**
   * 開発・デバッグ用：全データをリセット
   */
  static async resetAllData(includeSampleData: boolean = true): Promise<void> {
    try {
      await LocalStorage.clear();
      await this.initialize(includeSampleData);
      console.log('🔄 全データリセット完了');
    } catch (error) {
      console.error('❌ データリセット失敗:', error);
      throw error;
    }
  }

  /**
   * デバッグ情報の取得
   */
  static async getDebugInfo(): Promise<{
    storage_keys: readonly string[];
    data_integrity: { isValid: boolean; issues: string[] };
    storage_info: any;
    last_errors: string[];
  }> {
    try {
      const [keys, integrity, storageInfo] = await Promise.all([
        LocalStorage.getAllKeys(),
        this.validateDataIntegrity(),
        this.getStorageInfo(),
      ]);

      // 最近のエラーログを取得（実装では別途エラーログシステムが必要）
      const lastErrors: string[] = [];

      return {
        storage_keys: keys,
        data_integrity: integrity,
        storage_info: storageInfo,
        last_errors: lastErrors,
      };
    } catch (error) {
      return {
        storage_keys: [],
        data_integrity: { isValid: false, issues: [`デバッグ情報取得エラー: ${error}`] },
        storage_info: {},
        last_errors: [`デバッグ情報取得エラー: ${error}`],
      };
    }
  }

  /**
   * パフォーマンス監視：操作時間を測定
   */
  static async measurePerformance<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<{ result: T; duration_ms: number }> {
    const startTime = performance.now();

    try {
      const result = await operation();
      const duration = performance.now() - startTime;

      // パフォーマンスログ（実装では別途ログシステムへ）
      if (duration > 100) {
        // 100ms以上の場合は警告
        console.warn(`🐌 遅い操作検出: ${operationName} (${duration.toFixed(2)}ms)`);
      }

      return { result, duration_ms: duration };
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`❌ 操作失敗: ${operationName} (${duration.toFixed(2)}ms)`, error);
      throw error;
    }
  }

  /**
   * 健全性チェック：定期実行推奨
   */
  static async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // データ整合性チェック
      const integrity = await this.validateDataIntegrity();
      if (!integrity.isValid) {
        issues.push(...integrity.issues);
      }

      // ストレージ使用量チェック
      const storageInfo = await this.getStorageInfo();
      if (storageInfo.estimated_limit_usage > 80) {
        issues.push(`ストレージ使用量が高い: ${storageInfo.estimated_limit_usage.toFixed(1)}%`);
        recommendations.push('古いデータのクリーンアップを実行してください');
      }

      // アイテム数チェック
      if (storageInfo.items_count > 500) {
        issues.push(`食材数が多い: ${storageInfo.items_count}件`);
        recommendations.push('不要な食材データを削除することを検討してください');
      }

      // 同期状態チェック
      const syncStatus = await LocalStorage.getItem<LocalSyncStatus>('sync_status');
      if (syncStatus?.sync_stats?.failed_syncs && syncStatus.sync_stats.failed_syncs > 5) {
        issues.push(`同期エラーが多発: ${syncStatus.sync_stats.failed_syncs}回`);
        recommendations.push('ネットワーク接続を確認し、同期設定を見直してください');
      }

      // ステータス判定
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (issues.length > 0) {
        status = issues.some(
          issue => issue.includes('必須データ') || issue.includes('critical') || storageInfo.estimated_limit_usage > 95
        )
          ? 'critical'
          : 'warning';
      }

      return { status, issues, recommendations };
    } catch (error) {
      return {
        status: 'critical',
        issues: [`健全性チェック実行エラー: ${error}`],
        recommendations: ['アプリの再起動を試してください'],
      };
    }
  }
}
