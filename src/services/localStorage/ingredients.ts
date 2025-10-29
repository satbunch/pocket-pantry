/**
 * 食材データのAsyncStorage管理サービス
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INGREDIENT_STORAGE_KEY, DEFAULT_INCREMENT_AMOUNTS } from '@/constants/ingredient';
import type { Ingredient, CreateIngredientInput, UpdateIngredientInput } from '@/types/ingredient';

/**
 * 全食材を取得
 */
export async function getAllIngredients(): Promise<Ingredient[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(INGREDIENT_STORAGE_KEY);
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
      incrementAmount: input.incrementAmount,
      isExpiryNotManaged: input.isExpiryNotManaged,
      expiryDate: input.expiryDate,
      memo: input.memo || '',
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...ingredients, newIngredient];
    await AsyncStorage.setItem(INGREDIENT_STORAGE_KEY, JSON.stringify(updated));

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

    ingredients[index] = updated;
    await AsyncStorage.setItem(INGREDIENT_STORAGE_KEY, JSON.stringify(ingredients));

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

    await AsyncStorage.setItem(INGREDIENT_STORAGE_KEY, JSON.stringify(filtered));
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
    await AsyncStorage.removeItem(INGREDIENT_STORAGE_KEY);
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
 * テスト用データをロード（開発時のみ）
 */
export async function loadTestData(): Promise<void> {
  try {
    const testIngredients: Ingredient[] = [
      {
        id: 'test-1',
        name: '牛乳',
        storageCategory: '冷蔵',
        quantity: 1000,
        unit: 'ml',
        incrementAmount: DEFAULT_INCREMENT_AMOUNTS['ml'],
        isExpiryNotManaged: false,
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3日後
        memo: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'test-2',
        name: 'チーズ',
        storageCategory: '冷蔵',
        quantity: 200,
        unit: 'g',
        incrementAmount: DEFAULT_INCREMENT_AMOUNTS['g'],
        isExpiryNotManaged: false,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7日後
        memo: 'スライスチーズ',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'test-3',
        name: 'トマト',
        storageCategory: '野菜室',
        quantity: 3,
        unit: '個',
        incrementAmount: DEFAULT_INCREMENT_AMOUNTS['個'],
        isExpiryNotManaged: false,
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5日後
        memo: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'test-4',
        name: '卵',
        storageCategory: '冷蔵',
        quantity: 12,
        unit: '個',
        incrementAmount: DEFAULT_INCREMENT_AMOUNTS['個'],
        isExpiryNotManaged: false,
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14日後
        memo: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'test-5',
        name: 'パスタ',
        storageCategory: '常温',
        quantity: 500,
        unit: 'g',
        incrementAmount: DEFAULT_INCREMENT_AMOUNTS['g'],
        isExpiryNotManaged: true,
        expiryDate: null,
        memo: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'test-6',
        name: 'りんご',
        storageCategory: '野菜室',
        quantity: 4,
        unit: '個',
        incrementAmount: DEFAULT_INCREMENT_AMOUNTS['個'],
        isExpiryNotManaged: false,
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10日後
        memo: 'フジりんご',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    await AsyncStorage.setItem(INGREDIENT_STORAGE_KEY, JSON.stringify(testIngredients));
    console.log('テストデータをロードしました');
  } catch (error) {
    console.error('テストデータのロードに失敗しました:', error);
  }
}
