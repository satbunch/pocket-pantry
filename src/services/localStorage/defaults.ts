import { LocalUserPreferences, LocalSyncStatus, LocalAppMetadata, LocalFoodItem, LocalShoppingList } from './schemas';

/**
 * ローカルストレージのデフォルト値を生成するファクトリー関数群
 */
export class LocalStorageDefaults {
  /**
   * デフォルトのユーザー設定を生成
   */
  static createUserPreferences(): LocalUserPreferences {
    return {
      notifications: {
        expiry_alerts: true,
        expiry_days_before: 3,
        shopping_reminders: true,
        family_updates: true,
      },
      display: {
        default_view: 'list',
        sort_by: 'expiry',
        sort_order: 'asc',
        show_expired: false,
        group_by_category: true,
      },
      input: {
        default_location: '冷蔵庫',
        auto_suggest_expiry: true,
        photo_auto_compress: true,
      },
      data: {
        auto_backup_prompt: true,
        max_local_items: 1000,
        auto_cleanup_expired: false,
      },
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * デフォルトの同期状態を生成
   */
  static createSyncStatus(): LocalSyncStatus {
    return {
      auth_state: 'guest',
      sync_stats: {
        pending_items: 0,
        pending_lists: 0,
        failed_syncs: 0,
        total_synced_items: 0,
      },
      sync_settings: {
        auto_sync: false,
        sync_on_wifi_only: true,
        sync_interval_minutes: 30,
      },
    };
  }

  /**
   * デフォルトのアプリメタデータを生成
   */
  static createAppMetadata(): LocalAppMetadata {
    const now = new Date().toISOString();
    return {
      app_version: '1.0.0',
      data_version: '1.0',
      first_launch_at: now,
      last_launch_at: now,
      onboarding: {
        completed: false,
        current_step: 0,
        skipped_auth_prompt: false,
        auth_prompt_count: 0,
      },
      usage_stats: {
        total_items_added: 0,
        total_lists_created: 0,
        days_used: 1,
        feature_usage: {},
      },
      updated_at: now,
    };
  }

  /**
   * サンプル食材データを生成（初回デモ用）
   */
  static createSampleFoodItems(): LocalFoodItem[] {
    const now = new Date().toISOString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    return [
      {
        id: 'sample-1',
        name: '卵',
        category: '卵',
        quantity: 6,
        unit: '個',
        purchase_date: now,
        expiry_date: nextWeek.toISOString(),
        location: '冷蔵庫',
        notes: 'サンプルデータです',
        created_at: now,
        updated_at: now,
        local_only: true,
        sync_pending: false,
      },
      {
        id: 'sample-2',
        name: '牛乳',
        category: '乳製品',
        quantity: 1,
        unit: 'パック',
        purchase_date: now,
        expiry_date: tomorrow.toISOString(),
        location: '冷蔵庫',
        notes: '要注意：明日期限切れ',
        created_at: now,
        updated_at: now,
        local_only: true,
        sync_pending: false,
      },
    ];
  }

  /**
   * サンプル買い物リストを生成（初回デモ用）
   */
  static createSampleShoppingList(): LocalShoppingList {
    const now = new Date().toISOString();

    return {
      id: 'sample-list-1',
      name: '今週の買い物',
      items: [
        {
          id: 'sample-item-1',
          name: 'パン',
          quantity: 1,
          unit: '袋',
          checked: false,
          category: '穀物',
          estimated_price: 150,
          created_at: now,
        },
        {
          id: 'sample-item-2',
          name: '玉ねぎ',
          quantity: 3,
          unit: '個',
          checked: true,
          category: '野菜',
          estimated_price: 100,
          created_at: now,
        },
      ],
      created_at: now,
      updated_at: now,
      completed: false,
      local_only: true,
      sync_pending: false,
    };
  }

  /**
   * 初回セットアップ用のデータセットを生成
   */
  static createInitialDataSet(includeSamples: boolean = true): {
    items_local: LocalFoodItem[];
    shopping_lists_local: LocalShoppingList[];
    user_preferences: LocalUserPreferences;
    sync_status: LocalSyncStatus;
    app_metadata: LocalAppMetadata;
  } {
    return {
      items_local: includeSamples ? this.createSampleFoodItems() : [],
      shopping_lists_local: includeSamples ? [this.createSampleShoppingList()] : [],
      user_preferences: this.createUserPreferences(),
      sync_status: this.createSyncStatus(),
      app_metadata: this.createAppMetadata(),
    };
  }

  /**
   * 設定のマイグレーション（バージョンアップ対応）
   */
  static migrateUserPreferences(existingPrefs: Partial<LocalUserPreferences>): LocalUserPreferences {
    const defaultPrefs = this.createUserPreferences();

    return {
      notifications: {
        ...defaultPrefs.notifications,
        ...existingPrefs.notifications,
      },
      display: {
        ...defaultPrefs.display,
        ...existingPrefs.display,
      },
      input: {
        ...defaultPrefs.input,
        ...existingPrefs.input,
      },
      data: {
        ...defaultPrefs.data,
        ...existingPrefs.data,
      },
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * 同期状態のマイグレーション
   */
  static migrateSyncStatus(existingStatus: Partial<LocalSyncStatus>): LocalSyncStatus {
    const defaultStatus = this.createSyncStatus();

    return {
      auth_state: existingStatus.auth_state || defaultStatus.auth_state,
      user_id: existingStatus.user_id,
      family_id: existingStatus.family_id,
      sync_stats: {
        ...defaultStatus.sync_stats,
        ...existingStatus.sync_stats,
      },
      sync_settings: {
        ...defaultStatus.sync_settings,
        ...existingStatus.sync_settings,
      },
      last_error: existingStatus.last_error,
    };
  }

  /**
   * アプリメタデータのマイグレーション
   */
  static migrateAppMetadata(existingMetadata: Partial<LocalAppMetadata>): LocalAppMetadata {
    const defaultMetadata = this.createAppMetadata();

    return {
      app_version: existingMetadata.app_version || defaultMetadata.app_version,
      data_version: existingMetadata.data_version || defaultMetadata.data_version,
      first_launch_at: existingMetadata.first_launch_at || defaultMetadata.first_launch_at,
      last_launch_at: new Date().toISOString(), // 常に現在時刻に更新
      onboarding: {
        ...defaultMetadata.onboarding,
        ...existingMetadata.onboarding,
      },
      usage_stats: {
        ...defaultMetadata.usage_stats,
        ...existingMetadata.usage_stats,
      },
      updated_at: new Date().toISOString(),
    };
  }
}
