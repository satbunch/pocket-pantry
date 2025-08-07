import { LocalStorage } from "./index";
import { LocalFoodItem, FoodCategory, StorageLocation, LocalStorageKey } from "./schemas";

export class LocalFoodItemService {
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

  // UUIDの生成
  private static generateId(): string {
    return 'xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
