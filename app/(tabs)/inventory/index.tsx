/**
 * 食材管理画面（食材一覧）
 */
import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { useIngredients } from '@/hooks/useIngredients';
import type { StorageCategory } from '@/types/ingredient';
import { IngredientListItem } from './_components/IngredientListItem';

const STORAGE_CATEGORIES: StorageCategory[] = ['冷蔵', '冷凍', '常温', '野菜室'];

export default function InventoryScreen() {
  const { ingredients, loadIngredients, deleteIngredient } = useIngredients();
  const [selectedCategory, setSelectedCategory] = useState<StorageCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

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
    await deleteIngredient(id);
  };

  // 食材編集
  const handleEdit = (id: string) => {
    router.push(`/(modals)/edit_ingredient?id=${id}`);
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
        renderItem={({ item }) => <IngredientListItem item={item} onDelete={handleDelete} onEdit={handleEdit} />}
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
