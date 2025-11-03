/**
 * ゲストデータ移行サービス
 * Phase 1 (AsyncStorage) から Phase 2 (Supabase) へのデータ移行
 */

import { supabase } from './client';
import { getAllIngredients } from '@/services/localStorage/ingredients';
import { loadShoppingList } from '@/services/localStorage/shoppingList';
import type { Ingredient } from '@/types/ingredient';
import type { ShoppingListItem } from '@/types/shopping';
import type { SupabaseIngredient, SupabaseShoppingListItem } from '@/types/database';

/**
 * ゲストのローカルデータをSupabaseに移行
 * ユーザーが認証後、初めてクラウド化する際に呼び出す
 *
 * @param familyId - 移行先のファミリーID
 * @returns 移行結果（件数）
 */
export const migrateGuestDataToSupabase = async (
  familyId: string
): Promise<{ ingredientCount: number; shoppingListCount: number }> => {
  try {
    // 1. AsyncStorageからゲストデータを取得
    const guestIngredients = await getAllIngredients();
    const guestShoppingList = await loadShoppingList();

    let ingredientCount = 0;
    let shoppingListCount = 0;

    // 2. 食材データを移行
    if (guestIngredients && guestIngredients.length > 0) {
      const ingredientsForSupabase = guestIngredients.map((ingredient: Ingredient) =>
        convertIngredientToSupabase(ingredient, familyId)
      );

      const { error: ingredientError, count } = await supabase
        .from('ingredients')
        .upsert(ingredientsForSupabase, { onConflict: 'id' });

      if (ingredientError) {
        console.error('Failed to migrate ingredients:', ingredientError);
        throw new Error(`Ingredient migration failed: ${ingredientError.message}`);
      }

      ingredientCount = count || ingredientsForSupabase.length;
    }

    // 3. 買い物リストデータを移行
    if (guestShoppingList && guestShoppingList.length > 0) {
      // 買い物リスト自体を作成
      const { data: shoppingListData, error: listError } = await supabase
        .from('shopping_lists')
        .insert([
          {
            family_id: familyId,
            name: 'My Shopping List',
          },
        ])
        .select()
        .single();

      if (listError) {
        console.error('Failed to create shopping list:', listError);
        throw new Error(`Shopping list creation failed: ${listError.message}`);
      }

      if (shoppingListData) {
        // アイテムを移行
        const itemsForSupabase = guestShoppingList.map((item: ShoppingListItem) =>
          convertShoppingListItemToSupabase(item, shoppingListData.id)
        );

        const { error: itemError, count } = await supabase
          .from('shopping_list_items')
          .upsert(itemsForSupabase, { onConflict: 'id' });

        if (itemError) {
          console.error('Failed to migrate shopping list items:', itemError);
          throw new Error(`Shopping list item migration failed: ${itemError.message}`);
        }

        shoppingListCount = (count || itemsForSupabase.length) + 1; // リスト自体もカウント
      }
    }

    console.log(`Migration completed: ${ingredientCount} ingredients, ${shoppingListCount} shopping list items`);

    return {
      ingredientCount,
      shoppingListCount,
    };
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
};

/**
 * Ingredient型をSupabaseIngredient型に変換
 */
const convertIngredientToSupabase = (ingredient: Ingredient, familyId: string): SupabaseIngredient => {
  return {
    id: ingredient.id,
    family_id: familyId,
    name: ingredient.name,
    storage_category: ingredient.storageCategory,
    quantity: ingredient.quantity,
    unit_id: null, // Phase 1では単位IDは使用していないため null
    increment_amount: ingredient.incrementAmount,
    is_expiry_not_managed: ingredient.isExpiryNotManaged,
    expiry_date: ingredient.expiryDate,
    jan_code: null, // Phase 1では使用していない
    memo: ingredient.memo,
    last_synced_token: null,
    created_at: ingredient.createdAt,
    updated_at: ingredient.updatedAt,
  };
};

/**
 * ShoppingListItem型をSupabaseShoppingListItem型に変換
 */
const convertShoppingListItemToSupabase = (
  item: ShoppingListItem,
  shoppingListId: string
): SupabaseShoppingListItem => {
  return {
    id: item.id,
    shopping_list_id: shoppingListId,
    ingredient_id: null, // Phase 1では過去食材リンクは使用していない
    custom_name: item.name, // ローカルの name を custom_name にマップ
    quantity: item.quantity,
    is_checked: item.status === 'completed',
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
};
