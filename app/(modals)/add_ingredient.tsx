/**
 * 食材登録モーダル画面
 */
import { router } from 'expo-router';
import { IngredientForm } from '@/components/forms/IngredientForm';
import { useIngredients } from '@/hooks/useIngredients';
import type { CreateIngredientInput } from '@/types/ingredient';

export default function AddIngredientScreen() {
  const { addIngredient } = useIngredients();

  const handleSubmit = async (input: CreateIngredientInput) => {
    try {
      await addIngredient(input);
      router.back();
    } catch (error) {
      console.error('Failed to add ingredient:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return <IngredientForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}
