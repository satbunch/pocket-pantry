/**
 * 食材編集モーダル画面
 */
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { IngredientForm } from '@/components/forms/IngredientForm';
import { useIngredients } from '@/hooks/useIngredients';
import { getIngredientById } from '@/services/localStorage/ingredients';
import type { CreateIngredientInput } from '@/types/ingredient';

export default function EditIngredientScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { updateIngredient } = useIngredients();
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<CreateIngredientInput | null>(null);

  useEffect(() => {
    const loadIngredient = async () => {
      if (!id) return;
      try {
        const ingredient = await getIngredientById(id);
        if (ingredient) {
          setInitialValues({
            name: ingredient.name,
            storageCategory: ingredient.storageCategory,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            isExpiryManaged: ingredient.isExpiryManaged,
            expiryDate: ingredient.expiryDate,
            memo: ingredient.memo,
          });
        }
      } catch (error) {
        console.error('Failed to load ingredient:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIngredient();
  }, [id]);

  const handleSubmit = async (input: CreateIngredientInput) => {
    if (!id) return;
    try {
      await updateIngredient({
        id,
        ...input,
      });
      router.back();
    } catch (error) {
      console.error('Failed to update ingredient:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return isLoading || !initialValues ? (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  ) : (
    <IngredientForm onSubmit={handleSubmit} onCancel={handleCancel} initialValues={initialValues} />
  );
}
