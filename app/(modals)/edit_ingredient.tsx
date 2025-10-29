/**
 * 食材編集モーダル画面
 */
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Overlay } from '@rneui/themed';
import { Button } from '@/components/ui/Button';
import { IngredientForm } from '@/components/forms/IngredientForm';
import { useIngredients } from '@/hooks/useIngredients';
import { getIngredientById } from '@/services/localStorage/ingredients';
import type { CreateIngredientInput } from '@/types/ingredient';

export default function EditIngredientScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { updateIngredient, deleteIngredient } = useIngredients();
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<CreateIngredientInput | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingInput, setPendingInput] = useState<CreateIngredientInput | null>(null);

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
            incrementAmount: ingredient.incrementAmount,
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

    // 数量が0の場合は削除確認ダイアログを表示
    if (input.quantity === 0) {
      setPendingInput(input);
      setShowDeleteDialog(true);
      return;
    }

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

  const handleDeleteConfirm = async () => {
    if (!id) return;
    try {
      await deleteIngredient(id);
      setShowDeleteDialog(false);
      router.back();
    } catch (error) {
      console.error('Failed to delete ingredient:', error);
    }
  };

  const handleDeleteCancel = async () => {
    if (!id || !pendingInput) return;
    try {
      // 数量0のまま更新
      await updateIngredient({
        id,
        ...pendingInput,
      });
      setShowDeleteDialog(false);
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
    <>
      <IngredientForm onSubmit={handleSubmit} onCancel={handleCancel} initialValues={initialValues} />
      <Overlay isVisible={showDeleteDialog} onBackdropPress={() => setShowDeleteDialog(false)}>
        <View style={{ padding: 20, minWidth: 280 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>終わった?</Text>
          <Text style={{ fontSize: 16, marginBottom: 24, color: '#374151' }}>
            {initialValues.name}を冷蔵庫から削除しますか？
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View style={{ marginRight: 12 }}>
              <Button title="まだある" onPress={handleDeleteCancel} variant="secondary" />
            </View>
            <Button title="終わった" onPress={handleDeleteConfirm} variant="primary" />
          </View>
        </View>
      </Overlay>
    </>
  );
}
