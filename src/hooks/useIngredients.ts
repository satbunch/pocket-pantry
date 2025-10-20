/**
 * 食材管理カスタムフック
 */
import { useState, useCallback } from 'react';
import type { Ingredient, CreateIngredientInput, UpdateIngredientInput } from '@/types/ingredient';
import {
  getAllIngredients,
  createIngredient,
  updateIngredient as updateIngredientService,
  deleteIngredient as deleteIngredientService,
} from '@/services/localStorage/ingredients';

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 食材一覧を読み込み
  const loadIngredients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllIngredients();
      setIngredients(data);
    } catch (err) {
      setError('食材の読み込みに失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 食材を追加
  const addIngredient = useCallback(async (input: CreateIngredientInput) => {
    try {
      setLoading(true);
      setError(null);
      const newIngredient = await createIngredient(input);
      setIngredients(prev => [...prev, newIngredient]);
      return newIngredient;
    } catch (err) {
      setError('食材の追加に失敗しました');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 食材を更新
  const updateIngredient = useCallback(async (input: UpdateIngredientInput) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await updateIngredientService(input);
      if (updated) {
        setIngredients(prev => prev.map(item => (item.id === updated.id ? updated : item)));
        return updated;
      }
      return null;
    } catch (err) {
      setError('食材の更新に失敗しました');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 食材を削除
  const deleteIngredient = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const success = await deleteIngredientService(id);
      if (success) {
        setIngredients(prev => prev.filter(item => item.id !== id));
      }
      return success;
    } catch (err) {
      setError('食材の削除に失敗しました');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ingredients,
    loading,
    error,
    loadIngredients,
    addIngredient,
    updateIngredient,
    deleteIngredient,
  };
}
