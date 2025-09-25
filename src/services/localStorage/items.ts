import { LocalStorage } from './index';
import { LocalFoodItem, FoodCategory, StorageLocation, LocalStorageKey } from './schemas';

export class LocalFoodItemsService {
  private static readonly STORAGE_KEY: LocalStorageKey = 'items_local';

  // すべての食材を取得
  static async getAllItems(): Promise<LocalFoodItem[]> {
    const items = await LocalStorage.getItem<LocalFoodItem[]>(this.STORAGE_KEY);
    return items || [];
  }

  // IDで食材を取得
  static async getItemById(id: string): Promise<LocalFoodItem | null> {
    const items = await this.getAllItems();
    return items.find(item => item.id === id) || null;
  }

  // 食材を追加
  static async addItem(
    itemData: Omit<LocalFoodItem, 'id' | 'created_at' | 'updated_at' | 'local_only' | 'sync_pending'>
  ): Promise<LocalFoodItem> {
    const now = new Date().toISOString();
    const newItem: LocalFoodItem = {
      ...itemData,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
      local_only: true,
      sync_pending: false,
    };

    const items = await this.getAllItems();
    items.push(newItem);
    await LocalStorage.setItem(this.STORAGE_KEY, items);

    return newItem;
  }

  // 食材を更新
  static async updateItem(
    id: string,
    updates: Partial<Omit<LocalFoodItem, 'id' | 'created_at'>>
  ): Promise<LocalFoodItem | null> {
    const items = await this.getAllItems();
    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
      return null;
    }

    const updateItem: LocalFoodItem = {
      ...items[index],
      ...updates,
      updated_at: new Date().toISOString(),
      sync_pending: true,
    };

    items[index] = updateItem;
    await LocalStorage.setItem(this.STORAGE_KEY, items);

    return updateItem;
  }

  // 食材を削除
  static async deleteItem(id: string): Promise<boolean> {
    const items = await this.getAllItems();
    const filteredItems = items.filter(item => item.id !== id);

    if (filteredItems.length === items.length) {
      return false; // アイテムが見つからなかった
    }

    await LocalStorage.setItem(this.STORAGE_KEY, filteredItems);
    return true;
  }

  // 複数の食材を削除
  static async deleteItems(ids: string[]): Promise<number> {
    const items = await this.getAllItems();
    const idsSet = new Set(ids);
    const filteredItems = items.filter(item => !idsSet.has(item.id));

    const deletedCount = items.length - filteredItems.length;
    await LocalStorage.setItem(this.STORAGE_KEY, filteredItems);

    return deletedCount;
  }

  // カテゴリ別に食材を取得
  static async getItemsByCategory(category: FoodCategory): Promise<LocalFoodItem[]> {
    const items = await this.getAllItems();
    return items.filter(item => item.category === category);
  }

  // 保存場所別に食材を取得
  static async getItemsByLocation(location: StorageLocation): Promise<LocalFoodItem[]> {
    const items = await this.getAllItems();
    return items.filter(item => item.location === location);
  }

  // 賞味期限で食材を検索
  static async getItemExpiringWithin(days: number): Promise<LocalFoodItem[]> {
    const items = await this.getAllItems();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    return items.filter(item => {
      if (!item.expiry_date) return false;
      const expiryDate = new Date(item.expiry_date);
      return expiryDate <= targetDate;
    });
  }

  // 期限切れの食材を取得
  static async getExpiredItems(): Promise<LocalFoodItem[]> {
    const items = await this.getAllItems();
    const now = new Date();

    return items.filter(item => {
      if (!item.expiry_date) return false;
      const expiryDate = new Date(item.expiry_date);
      return expiryDate < now;
    });
  }

  // 食材名で検索
  static async searchItems(query: string): Promise<LocalFoodItem[]> {
    const items = await this.getAllItems();
    const lowerQuery = query.toLowerCase();

    return items.filter(
      item =>
        item.name.toLowerCase().includes(lowerQuery) || (item.notes && item.notes.toLowerCase().includes(lowerQuery))
    );
  }

  // 食材をソート
  static sortItems(
    items: LocalFoodItem[],
    sortBy: 'name' | 'expiry' | 'category' | 'created' = 'name',
    order: 'asc' | 'desc' = 'asc'
  ): LocalFoodItem[] {
    const sortedItems = [...items].sort((a, b) => {
      let compersion = 0;

      switch (sortBy) {
        case 'name':
          compersion = a.name.localeCompare(b.name, 'ja');
          break;
        case 'expiry': {
          const aExpiry = a.expiry_date || '9999-12-31';
          const bExpiry = b.expiry_date || '9999-12-31';
          compersion = aExpiry.localeCompare(bExpiry);
          break;
        }
        case 'category':
          compersion = a.category.localeCompare(b.category, 'ja');
          break;
        case 'created':
          compersion = a.created_at.localeCompare(b.created_at);
          break;
      }

      return order === 'asc' ? compersion : -compersion;
    });

    return sortedItems;
  }

  // 同期待ちの食材を取得
  static async getPendingSyncItem(): Promise<LocalFoodItem[]> {
    const items = await this.getAllItems();
    return items.filter(item => item.sync_pending);
  }

  // 食材の統計情報を取得
  static async getItemStats(): Promise<{
    total: number;
    byCategory: Record<FoodCategory, number>;
    byLocation: Record<StorageLocation, number>;
    expiring: number;
    expired: number;
  }> {
    const items = await this.getAllItems();
    const expiring = await this.getItemExpiringWithin(3);
    const expired = await this.getExpiredItems();

    const byCategory: Record<FoodCategory, number> = {} as any;
    const byLocation: Record<StorageLocation, number> = {} as any;

    items.forEach(item => {
      byCategory[item.category] = (byCategory[item.category] || 0) + 1;
      byLocation[item.location] = (byLocation[item.location] || 0) + 1;
    });

    return {
      total: items.length,
      byCategory,
      byLocation,
      expiring: expiring.length,
      expired: expired.length,
    };
  }

  // 期限切れ食材を自動削除
  static async cleanupExpiredItems(daysAfterExpiry: number = 7): Promise<number> {
    const items = await this.getAllItems();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAfterExpiry);

    const itemsToKeep = items.filter(item => {
      if (!item.expiry_date) return true;
      const expiryDate = new Date(item.expiry_date);
      return expiryDate >= cutoffDate;
    });

    const deletedCount = items.length - itemsToKeep.length;
    await LocalStorage.setItem(this.STORAGE_KEY, itemsToKeep);

    return deletedCount;
  }

  // UUIDの生成
  private static generateId(): string {
    return 'xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // 全データをエクスポート（バックアップ用）
  static async exportData(): Promise<{
    items: LocalFoodItem[];
    exported_at: string;
    version: string;
  }> {
    const items = await this.getAllItems();
    return {
      items,
      exported_at: new Date().toISOString(),
      version: '1.0',
    };
  }

  // データをインポート（復元用）
  static async importData(data: { items: LocalFoodItem[] }): Promise<number> {
    const currentItems = await this.getAllItems();
    const currentIds = new Set(currentItems.map(item => item.id));

    const newItems = data.items.filter(item => !currentIds.has(item.id));
    const allItems = [...currentItems, ...newItems];

    await LocalStorage.setItem(this.STORAGE_KEY, allItems);
    return newItems.length;
  }
}
