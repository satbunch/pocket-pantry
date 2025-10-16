/**
 * 食材（Ingredient）の型定義
 */

export type StorageCategory = '冷蔵' | '冷凍' | '常温' | '野菜室';

export type IngredientStatus = 'in_stock' | 'low' | 'out';

export type UnitType = '個' | 'g' | 'ml' | '本' | '袋';

export interface Ingredient {
  id: string;
  name: string;
  storageCategory: StorageCategory;
  quantity: number;
  unit: UnitType;
  ingredientStatus: IngredientStatus;
  isExpiryManaged: boolean;
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
  isExpiryManaged: boolean;
  expiryDate: string | null;
  memo?: string;
}

export interface UpdateIngredientInput {
  id: string;
  name?: string;
  storageCategory?: StorageCategory;
  quantity?: number;
  unit?: UnitType;
  ingredientStatus?: IngredientStatus;
  isExpiryManaged?: boolean;
  expiryDate?: string | null;
  memo?: string;
}
