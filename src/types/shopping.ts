/**
 * 買い物リスト（Shopping List）の型定義
 */

export type ShoppingListItemStatus = 'pending' | 'completed';

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  status: ShoppingListItemStatus;
  createdAt: string; // ISO 8601形式
  updatedAt: string; // ISO 8601形式
}

export interface CreateShoppingListItemInput {
  name: string;
  quantity: number;
}

export interface UpdateShoppingListItemInput {
  id: string;
  name?: string;
  quantity?: number;
  status?: ShoppingListItemStatus;
}
