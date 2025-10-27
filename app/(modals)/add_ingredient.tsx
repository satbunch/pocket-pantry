/**
 * 食材登録モーダル画面
 */
import { router } from 'expo-router';
import { IngredientForm } from '@/components/forms/IngredientForm';
import { useIngredients } from '@/hooks/useIngredients';
import { useNotifications } from '@/hooks/useNotifications';
import type { CreateIngredientInput } from '@/types/ingredient';

export default function AddIngredientScreen() {
  const { addIngredient } = useIngredients();
  const { scheduleNotification } = useNotifications();

  const handleSubmit = async (input: CreateIngredientInput) => {
    try {
      const ingredient = await addIngredient(input);
      // 賞味期限通知をスケジュール
      if (ingredient) {
        await scheduleNotification(ingredient);
      }
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
