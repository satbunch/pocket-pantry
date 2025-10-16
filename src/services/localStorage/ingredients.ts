/**
 * 食材データのAsyncStorage管理サービス
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Ingredient, CreateIngredientInput, UpdateIngredientInput, IngredientStatus } from '@/types/ingredient';

const STORAGE_KEY = '@PocketPantry:ingredients';

/**
 * 全食材を取得
 */
export async function getAllIngredients(): Promise<Ingredient[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('食材の取得に失敗しました:', error);
    return [];
  }
}

/**
 * IDで食材を取得
 */
export async function getIngredientById(id: string): Promise<Ingredient | null> {
  try {
    const ingredients = await getAllIngredients();
    return ingredients.find(ingredient => ingredient.id === id) || null;
  } catch (error) {
    console.error('食材の取得に失敗しました:', error);
    return null;
  }
}

/**
 * 保存場所でフィルタして取得
 */
export async function getIngredientsByCategory(category: string): Promise<Ingredient[]> {
  try {
    const ingredients = await getAllIngredients();
    return ingredients.filter(ingredient => ingredient.storageCategory === category);
  } catch (error) {
    console.error('食材の取得に失敗しました:', error);
    return [];
  }
}

/**
 * 新しい食材を作成
 */
export async function createIngredient(input: CreateIngredientInput): Promise<Ingredient> {
  try {
    const ingredients = await getAllIngredients();
    const now = new Date().toISOString();

    const newIngredient: Ingredient = {
      id: generateId(),
      name: input.name,
      storageCategory: input.storageCategory,
      quantity: input.quantity,
      unit: input.unit,
      ingredientStatus: determineStatus(input.quantity),
      isExpiryManaged: input.isExpiryManaged,
      expiryDate: input.expiryDate,
      memo: input.memo || '',
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...ingredients, newIngredient];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return newIngredient;
  } catch (error) {
    console.error('食材の作成に失敗しました:', error);
    throw new Error('食材の作成に失敗しました');
  }
}

/**
 * 食材を更新
 */
export async function updateIngredient(input: UpdateIngredientInput): Promise<Ingredient | null> {
  try {
    const ingredients = await getAllIngredients();
    const index = ingredients.findIndex(ingredient => ingredient.id === input.id);

    if (index === -1) {
      throw new Error('食材が見つかりません');
    }

    const updated = {
      ...ingredients[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    // 在庫数が更新された場合はステータスも更新
    if (input.quantity !== undefined) {
      updated.ingredientStatus = determineStatus(input.quantity);
    }

    ingredients[index] = updated;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));

    return updated;
  } catch (error) {
    console.error('食材の更新に失敗しました:', error);
    return null;
  }
}

/**
 * 食材を削除
 */
export async function deleteIngredient(id: string): Promise<boolean> {
  try {
    const ingredients = await getAllIngredients();
    const filtered = ingredients.filter(ingredient => ingredient.id !== id);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('食材の削除に失敗しました:', error);
    return false;
  }
}

/**
 * 全食材を削除（開発用）
 */
export async function clearAllIngredients(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('食材の全削除に失敗しました:', error);
  }
}

/**
 * ユニークIDを生成
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 在庫数から自動的にステータスを判定
 */
function determineStatus(quantity: number): IngredientStatus {
  if (quantity === 0) return 'out';
  if (quantity <= 2) return 'low';
  return 'in_stock';
}
