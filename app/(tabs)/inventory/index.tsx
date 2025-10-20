/**
 * 食材管理画面（在庫一覧）
 */
import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { deleteIngredient } from '@/services/localStorage/ingredients';
import type { Ingredient, StorageCategory } from '@/types/ingredient';
import { mockIngredients } from '@/data/mockIngredients';

const STORAGE_CATEGORIES: StorageCategory[] = ['冷蔵', '冷凍', '常温', '野菜室'];

export default function InventoryScreen() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<StorageCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // 食材データを読み込み
  const loadIngredients = useCallback(async () => {
    const data = mockIngredients;
    setIngredients(data);
  }, []);

  useEffect(() => {
    loadIngredients();
  }, [loadIngredients]);

  // 画面がフォーカスされたときにリロード
  useFocusEffect(
    useCallback(() => {
      loadIngredients();
    }, [loadIngredients])
  );

  // プルリフレッシュ
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadIngredients();
    setRefreshing(false);
  }, [loadIngredients]);

  // カテゴリでフィルタ
  const filteredIngredients = ingredients.filter(ingredient => {
    if (selectedCategory === 'all') return true;
    return ingredient.storageCategory === selectedCategory;
  });

  // 食材削除
  const handleDelete = async (id: string) => {
    const success = await deleteIngredient(id);
    if (success) {
      await loadIngredients();
    }
  };

  // 賞味期限の状態を判定
  const getExpiryStatus = (expiryDate: string | null): 'expired' | 'soon' | 'ok' => {
    if (!expiryDate) return 'ok';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    const diffDays = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'expired';
    if (diffDays <= 3) return 'soon';
    return 'ok';
  };

  // ステータスバッジの色
  const getStatusBgColor = (status: Ingredient['ingredientStatus']) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-500';
      case 'low':
        return 'bg-orange-500';
      case 'out':
        return 'bg-red-500';
    }
  };

  // ステータスラベル
  const getStatusLabel = (status: Ingredient['ingredientStatus']) => {
    switch (status) {
      case 'in_stock':
        return '在庫あり';
      case 'low':
        return '残りわずか';
      case 'out':
        return 'なし';
    }
  };

  // 食材カードのレンダリング
  const renderIngredient = ({ item }: { item: Ingredient }) => {
    const expiryStatus = getExpiryStatus(item.expiryDate);

    return (
      <Card>
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-lg font-semibold mb-2">{item.name}</Text>
            <View className="flex-row items-center">
              <View className={`${getStatusBgColor(item.ingredientStatus)} px-2 py-1 rounded mr-2`}>
                <Text className="text-white text-xs font-semibold">{getStatusLabel(item.ingredientStatus)}</Text>
              </View>
              <Text className="text-sm text-gray-500">{item.storageCategory}</Text>
            </View>
          </View>
          <Text className="text-xl font-bold text-blue-600">
            {item.quantity} {item.unit}
          </Text>
        </View>

        {item.isExpiryManaged && item.expiryDate && (
          <View className="mt-2">
            <Text
              className={`text-sm ${
                expiryStatus === 'expired'
                  ? 'text-red-500 font-semibold'
                  : expiryStatus === 'soon'
                    ? 'text-orange-500 font-semibold'
                    : 'text-gray-500'
              }`}
            >
              賞味期限: {item.expiryDate}
              {expiryStatus === 'expired' && ' (期限切れ)'}
              {expiryStatus === 'soon' && ' (まもなく期限)'}
            </Text>
          </View>
        )}

        {item.memo && <Text className="text-sm text-gray-500 mt-2">{item.memo}</Text>}

        <View className="mt-3 flex-row justify-end">
          <Button title="削除" onPress={() => handleDelete(item.id)} variant="danger" className="px-4 py-2" />
        </View>
      </Card>
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* カテゴリフィルタ */}
      <View className="flex-row p-4 bg-white border-b border-gray-200">
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === 'all' ? 'bg-blue-500' : 'bg-gray-200'}`}
          onPress={() => setSelectedCategory('all')}
        >
          <Text className={`text-sm font-semibold ${selectedCategory === 'all' ? 'text-white' : 'text-black'}`}>
            すべて
          </Text>
        </TouchableOpacity>
        {STORAGE_CATEGORIES.map(category => (
          <TouchableOpacity
            key={category}
            className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === category ? 'bg-blue-500' : 'bg-gray-200'}`}
            onPress={() => setSelectedCategory(category)}
          >
            <Text className={`text-sm font-semibold ${selectedCategory === category ? 'text-white' : 'text-black'}`}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 食材リスト */}
      <FlatList
        data={filteredIngredients}
        renderItem={renderIngredient}
        keyExtractor={item => item.id}
        className="px-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
            <Text className="text-lg font-semibold text-gray-500 mb-2">食材が登録されていません</Text>
            <Text className="text-sm text-gray-400">「+」ボタンから食材を追加しましょう</Text>
          </View>
        }
      />
    </View>
  );
}
