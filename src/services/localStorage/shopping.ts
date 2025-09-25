import { LocalStorage } from './index';
import { LocalShoppingList, LocalShoppingItem, LocalStorageKey } from './schemas';

/**
 * 買い物リストのローカル管理サービス
 */
export class LocalShoppingService {
  private static readonly STORAGE_KEY: LocalStorageKey = 'shopping_lists_local';

  /**
   * 全ての買い物リストを取得
   */
  static async getAllLists(): Promise<LocalShoppingList[]> {
    const lists = await LocalStorage.getItem<LocalShoppingList[]>(this.STORAGE_KEY);
    return lists || [];
  }

  /**
   * IDでリストを取得
   */
  static async getListById(id: string): Promise<LocalShoppingList | null> {
    const lists = await this.getAllLists();
    return lists.find(list => list.id === id) || null;
  }

  /**
   * 新しい買い物リストを作成
   */
  static async createList(name: string): Promise<LocalShoppingList> {
    const now = new Date().toISOString();
    const newList: LocalShoppingList = {
      id: this.generateId(),
      name,
      items: [],
      created_at: now,
      updated_at: now,
      completed: false,
      local_only: true,
      sync_pending: false,
    };

    const lists = await this.getAllLists();
    lists.push(newList);
    await LocalStorage.setItem(this.STORAGE_KEY, lists);

    return newList;
  }

  /**
   * リストを更新
   */
  static async updateList(
    id: string,
    updates: Partial<Pick<LocalShoppingList, 'name' | 'completed'>>
  ): Promise<LocalShoppingList | null> {
    const lists = await this.getAllLists();
    const index = lists.findIndex(list => list.id === id);

    if (index === -1) {
      return null;
    }

    const updatedList: LocalShoppingList = {
      ...lists[index],
      ...updates,
      updated_at: new Date().toISOString(),
      sync_pending: true,
    };

    lists[index] = updatedList;
    await LocalStorage.setItem(this.STORAGE_KEY, lists);

    return updatedList;
  }

  /**
   * リストを削除
   */
  static async deleteList(id: string): Promise<boolean> {
    const lists = await this.getAllLists();
    const filteredLists = lists.filter(list => list.id !== id);

    if (filteredLists.length === lists.length) {
      return false; // リストが見つからなかった
    }

    await LocalStorage.setItem(this.STORAGE_KEY, filteredLists);
    return true;
  }

  /**
   * リストにアイテムを追加
   */
  static async addItemToList(
    listId: string,
    itemData: Omit<LocalShoppingItem, 'id' | 'created_at' | 'checked'>
  ): Promise<LocalShoppingItem | null> {
    const lists = await this.getAllLists();
    const list = lists.find(l => l.id === listId);

    if (!list) {
      return null;
    }

    const newItem: LocalShoppingItem = {
      ...itemData,
      id: this.generateId(),
      checked: false,
      created_at: new Date().toISOString(),
    };

    list.items.push(newItem);
    list.updated_at = new Date().toISOString();
    list.sync_pending = true;

    await LocalStorage.setItem(this.STORAGE_KEY, lists);
    return newItem;
  }

  /**
   * リストのアイテムを更新
   */
  static async updateListItem(
    listId: string,
    itemId: string,
    updates: Partial<Omit<LocalShoppingItem, 'id' | 'created_at'>>
  ): Promise<LocalShoppingItem | null> {
    const lists = await this.getAllLists();
    const list = lists.find(l => l.id === listId);

    if (!list) {
      return null;
    }

    const itemIndex = list.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return null;
    }

    const updatedItem: LocalShoppingItem = {
      ...list.items[itemIndex],
      ...updates,
    };

    list.items[itemIndex] = updatedItem;
    list.updated_at = new Date().toISOString();
    list.sync_pending = true;

    await LocalStorage.setItem(this.STORAGE_KEY, lists);
    return updatedItem;
  }

  /**
   * アイテムのチェック状態を切り替え
   */
  static async toggleItemCheck(listId: string, itemId: string): Promise<boolean | null> {
    const lists = await this.getAllLists();
    const list = lists.find(l => l.id === listId);

    if (!list) {
      return null;
    }

    const item = list.items.find(item => item.id === itemId);
    if (!item) {
      return null;
    }

    item.checked = !item.checked;
    list.updated_at = new Date().toISOString();
    list.sync_pending = true;

    await LocalStorage.setItem(this.STORAGE_KEY, lists);
    return item.checked;
  }

  /**
   * リストからアイテムを削除
   */
  static async removeItemFromList(listId: string, itemId: string): Promise<boolean> {
    const lists = await this.getAllLists();
    const list = lists.find(l => l.id === listId);

    if (!list) {
      return false;
    }

    const originalLength = list.items.length;
    list.items = list.items.filter(item => item.id !== itemId);

    if (list.items.length === originalLength) {
      return false; // アイテムが見つからなかった
    }

    list.updated_at = new Date().toISOString();
    list.sync_pending = true;

    await LocalStorage.setItem(this.STORAGE_KEY, lists);
    return true;
  }

  /**
   * チェック済みアイテムを一括削除
   */
  static async removeCheckedItems(listId: string): Promise<number> {
    const lists = await this.getAllLists();
    const list = lists.find(l => l.id === listId);

    if (!list) {
      return 0;
    }

    const originalLength = list.items.length;
    list.items = list.items.filter(item => !item.checked);
    const removedCount = originalLength - list.items.length;

    if (removedCount > 0) {
      list.updated_at = new Date().toISOString();
      list.sync_pending = true;
      await LocalStorage.setItem(this.STORAGE_KEY, lists);
    }

    return removedCount;
  }

  /**
   * リスト内のアイテムを検索
   */
  static async searchItemsInList(listId: string, query: string): Promise<LocalShoppingItem[]> {
    const list = await this.getListById(listId);
    if (!list) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    return list.items.filter(
      item =>
        item.name.toLowerCase().includes(lowerQuery) || (item.notes && item.notes.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * リストの統計情報を取得
   */
  static async getListStats(listId: string): Promise<{
    total: number;
    checked: number;
    unchecked: number;
    completion_rate: number;
    estimated_total_price: number;
  } | null> {
    const list = await this.getListById(listId);
    if (!list) {
      return null;
    }

    const total = list.items.length;
    const checked = list.items.filter(item => item.checked).length;
    const unchecked = total - checked;
    const completion_rate = total > 0 ? (checked / total) * 100 : 0;

    const estimated_total_price = list.items.reduce((sum, item) => {
      return sum + (item.estimated_price || 0);
    }, 0);

    return {
      total,
      checked,
      unchecked,
      completion_rate,
      estimated_total_price,
    };
  }

  /**
   * カテゴリ別にアイテムをグループ化
   */
  static groupItemsByCategory(items: LocalShoppingItem[]): Record<string, LocalShoppingItem[]> {
    const grouped: Record<string, LocalShoppingItem[]> = {};

    items.forEach(item => {
      const category = item.category || 'その他';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });

    return grouped;
  }

  /**
   * 食材履歴から買い物リストのサジェストを生成
   */
  static async generateSuggestions(existingFoodNames: string[]): Promise<string[]> {
    // 実装では過去の買い物履歴や食材データから推測
    // 今回は簡易的な実装
    const commonItems = [
      '卵',
      '牛乳',
      'パン',
      '米',
      '玉ねぎ',
      'じゃがいも',
      '人参',
      '豚肉',
      '鶏肉',
      '魚',
      '醤油',
      '味噌',
      '砂糖',
      '塩',
    ];

    // 既存の食材名から重複を除外
    const existingSet = new Set(existingFoodNames.map(name => name.toLowerCase()));
    return commonItems.filter(item => !existingSet.has(item.toLowerCase()));
  }

  /**
   * リストを複製
   */
  static async duplicateList(listId: string, newName?: string): Promise<LocalShoppingList | null> {
    const originalList = await this.getListById(listId);
    if (!originalList) {
      return null;
    }

    const now = new Date().toISOString();
    const duplicatedList: LocalShoppingList = {
      ...originalList,
      id: this.generateId(),
      name: newName || `${originalList.name} のコピー`,
      created_at: now,
      updated_at: now,
      completed: false,
      sync_pending: false,
      items: originalList.items.map(item => ({
        ...item,
        id: this.generateId(),
        checked: false,
        created_at: now,
      })),
    };

    const lists = await this.getAllLists();
    lists.push(duplicatedList);
    await LocalStorage.setItem(this.STORAGE_KEY, lists);

    return duplicatedList;
  }

  /**
   * アクティブなリスト（完了していない）を取得
   */
  static async getActiveLists(): Promise<LocalShoppingList[]> {
    const lists = await this.getAllLists();
    return lists.filter(list => !list.completed);
  }

  /**
   * 完了したリストを取得
   */
  static async getCompletedLists(): Promise<LocalShoppingList[]> {
    const lists = await this.getAllLists();
    return lists.filter(list => list.completed);
  }

  /**
   * 同期待ちのリストを取得
   */
  static async getPendingSyncLists(): Promise<LocalShoppingList[]> {
    const lists = await this.getAllLists();
    return lists.filter(list => list.sync_pending);
  }

  /**
   * UUID v4 生成（簡易版）
   */
  private static generateId(): string {
    return 'xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * 全データをエクスポート（バックアップ用）
   */
  static async exportData(): Promise<{
    lists: LocalShoppingList[];
    exported_at: string;
    version: string;
  }> {
    const lists = await this.getAllLists();
    return {
      lists,
      exported_at: new Date().toISOString(),
      version: '1.0',
    };
  }

  /**
   * データをインポート（復元用）
   */
  static async importData(data: { lists: LocalShoppingList[] }): Promise<number> {
    const currentLists = await this.getAllLists();
    const currentIds = new Set(currentLists.map(list => list.id));

    const newLists = data.lists.filter(list => !currentIds.has(list.id));
    const allLists = [...currentLists, ...newLists];

    await LocalStorage.setItem(this.STORAGE_KEY, allLists);
    return newLists.length;
  }
}
