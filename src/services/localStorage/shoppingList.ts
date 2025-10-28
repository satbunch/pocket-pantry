/**
 * 買い物リストのローカルストレージ管理
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ShoppingListItem, CreateShoppingListItemInput } from '@/types/shopping';

const SHOPPING_LIST_STORAGE_KEY = '@PocketPantry:shopping_list';

/**
 * 買い物リストを読み込む
 */
export async function loadShoppingList(): Promise<ShoppingListItem[]> {
  try {
    const data = await AsyncStorage.getItem(SHOPPING_LIST_STORAGE_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data) as ShoppingListItem[];
  } catch (error) {
    console.error('Failed to load shopping list:', error);
    return [];
  }
}

/**
 * 買い物リストに新しいアイテムを追加
 */
export async function addShoppingListItem(input: CreateShoppingListItemInput): Promise<ShoppingListItem> {
  try {
    const items = await loadShoppingList();
    const newItem: ShoppingListItem = {
      id: Date.now().toString(),
      name: input.name,
      quantity: input.quantity,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    items.push(newItem);
    await AsyncStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(items));
    return newItem;
  } catch (error) {
    console.error('Failed to add shopping list item:', error);
    throw error;
  }
}

/**
 * 買い物リストアイテムを削除
 */
export async function deleteShoppingListItem(id: string): Promise<void> {
  try {
    const items = await loadShoppingList();
    const filteredItems = items.filter(item => item.id !== id);
    await AsyncStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(filteredItems));
  } catch (error) {
    console.error('Failed to delete shopping list item:', error);
    throw error;
  }
}

/**
 * 買い物リストアイテムのステータスを更新
 */
export async function updateShoppingListItemStatus(
  id: string,
  status: 'pending' | 'completed'
): Promise<ShoppingListItem | null> {
  try {
    const items = await loadShoppingList();
    const item = items.find(i => i.id === id);
    if (!item) {
      return null;
    }

    item.status = status;
    item.updatedAt = new Date().toISOString();
    await AsyncStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(items));
    return item;
  } catch (error) {
    console.error('Failed to update shopping list item status:', error);
    throw error;
  }
}

/**
 * 買い物リストアイテムを更新
 */
export async function updateShoppingListItem(
  id: string,
  updates: { name?: string; quantity?: number }
): Promise<ShoppingListItem | null> {
  try {
    const items = await loadShoppingList();
    const item = items.find(i => i.id === id);
    if (!item) {
      return null;
    }

    if (updates.name !== undefined) {
      item.name = updates.name;
    }
    if (updates.quantity !== undefined) {
      item.quantity = updates.quantity;
    }
    item.updatedAt = new Date().toISOString();
    await AsyncStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(items));
    return item;
  } catch (error) {
    console.error('Failed to update shopping list item:', error);
    throw error;
  }
}

/**
 * 買い物リスト全体をクリア
 */
export async function clearShoppingList(): Promise<void> {
  try {
    await AsyncStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Failed to clear shopping list:', error);
    throw error;
  }
}

/**
 * 購入済みで24時間以上経過したアイテムを削除
 */
export async function cleanupCompletedItems(): Promise<void> {
  try {
    const items = await loadShoppingList();
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24時間（ミリ秒）

    // 購入済みで24時間以上経過したアイテムを除外
    const filteredItems = items.filter(item => {
      if (item.status !== 'completed') {
        return true; // 未購入アイテムは保持
      }
      const updatedAt = new Date(item.updatedAt).getTime();
      const elapsed = now - updatedAt;
      return elapsed < twentyFourHours; // 24時間未満のものは保持
    });

    // 削除されたアイテムがある場合のみ保存
    if (filteredItems.length !== items.length) {
      await AsyncStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(filteredItems));
      console.log(`Cleaned up ${items.length - filteredItems.length} completed items`);
    }
  } catch (error) {
    console.error('Failed to cleanup completed items:', error);
  }
}
