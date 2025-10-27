/**
 * 買い物リスト管理用のカスタムフック
 */
import { useState, useCallback } from 'react';
import type { ShoppingListItem, CreateShoppingListItemInput } from '@/types/shopping';
import {
  loadShoppingList,
  addShoppingListItem,
  deleteShoppingListItem,
  updateShoppingListItemStatus,
} from '@/services/localStorage/shoppingList';

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);

  /**
   * 買い物リストを読み込む
   */
  const load = useCallback(async () => {
    try {
      const loadedItems = await loadShoppingList();
      setItems(loadedItems);
    } catch (error) {
      console.error('Failed to load shopping list:', error);
    }
  }, []);

  /**
   * 買い物リストにアイテムを追加
   */
  const add = useCallback(async (input: CreateShoppingListItemInput) => {
    try {
      const newItem = await addShoppingListItem(input);
      setItems(prevItems => [...prevItems, newItem]);
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  }, []);

  /**
   * 買い物リストアイテムを削除
   */
  const remove = useCallback(async (id: string) => {
    try {
      await deleteShoppingListItem(id);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  }, []);

  /**
   * 買い物リストアイテムのステータスを更新
   */
  const updateStatus = useCallback(async (id: string, status: 'pending' | 'completed') => {
    try {
      const updatedItem = await updateShoppingListItemStatus(id, status);
      if (updatedItem) {
        setItems(prevItems => prevItems.map(item => (item.id === id ? updatedItem : item)));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      throw error;
    }
  }, []);

  return {
    items,
    loadItems: load,
    addItem: add,
    deleteItem: remove,
    updateItemStatus: updateStatus,
  };
}
