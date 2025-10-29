/**
 * 食材（Ingredient）の型定義
 */

export type StorageCategory = '冷蔵' | '冷凍' | '常温' | '野菜室';

export type UnitType = '個' | 'g' | 'kg' | 'ml' | '本' | '袋' | 'パック' | '枚';

export interface Ingredient {
  id: string;
  name: string;
  storageCategory: StorageCategory;
  quantity: number;
  unit: UnitType;
  incrementAmount: number; // 増減ボタンで増減する量
  isExpiryNotManaged: boolean; // true = 賞味期限を管理しない, false = 賞味期限を管理する
  expiryDate: string | null; // ISO 8601形式 (YYYY-MM-DD)
  memo: string;
  createdAt: string; // ISO 8601形式
  updatedAt: string; // ISO 8601形式
}

export interface CreateIngredientInput {
  name: string;
  storageCategory: StorageCategory;
  quantity: number;
  unit: UnitType;
  incrementAmount: number;
  isExpiryNotManaged: boolean; // true = 賞味期限を管理しない, false = 賞味期限を管理する
  expiryDate: string | null;
  memo?: string;
}

export interface UpdateIngredientInput {
  id: string;
  name?: string;
  storageCategory?: StorageCategory;
  quantity?: number;
  unit?: UnitType;
  incrementAmount?: number;
  isExpiryNotManaged?: boolean; // true = 賞味期限を管理しない, false = 賞味期限を管理する
  expiryDate?: string | null;
  memo?: string;
}
