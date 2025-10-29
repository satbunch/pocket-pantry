/**
 * 食材管理画面（食材一覧）
 */
import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Overlay } from '@rneui/themed';
import { Button } from '@/components/ui/Button';
import { useFocusEffect, router } from 'expo-router';
import { useIngredients } from '@/hooks/useIngredients';
import type { StorageCategory } from '@/types/ingredient';
import { IngredientListItem } from './_components/IngredientListItem';

const STORAGE_CATEGORIES: StorageCategory[] = ['冷蔵', '冷凍', '常温', '野菜室'];

export default function InventoryScreen() {
  const { ingredients, loadIngredients, deleteIngredient, updateIngredient } = useIngredients();
  const [selectedCategory, setSelectedCategory] = useState<StorageCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);
  const [selectedIngredientName, setSelectedIngredientName] = useState<string>('');

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

  // 数量変更
  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      // 0になったら削除確認ダイアログ表示
      const ingredient = ingredients.find(item => item.id === id);
      if (ingredient) {
        setSelectedIngredientId(id);
        setSelectedIngredientName(ingredient.name);
        setShowDeleteDialog(true);
      }
    } else {
      // 数量を更新
      await updateIngredient({ id, quantity: newQuantity });
      await loadIngredients();
    }
  };

  // 削除確認ダイアログ - 終わった
  const handleDeleteConfirm = async () => {
    if (selectedIngredientId) {
      await deleteIngredient(selectedIngredientId);
      setShowDeleteDialog(false);
      setSelectedIngredientId(null);
      setSelectedIngredientName('');
    }
  };

  // 削除確認ダイアログ - まだある
  const handleDeleteCancel = async () => {
    if (selectedIngredientId) {
      await updateIngredient({ id: selectedIngredientId, quantity: 0 });
      await loadIngredients();
      setShowDeleteDialog(false);
      setSelectedIngredientId(null);
      setSelectedIngredientName('');
    }
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
        renderItem={({ item }) => (
          <IngredientListItem
            item={item}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onQuantityChange={handleQuantityChange}
          />
        )}
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

      {/* 削除確認ダイアログ */}
      <Overlay isVisible={showDeleteDialog} onBackdropPress={() => setShowDeleteDialog(false)}>
        <View style={{ padding: 20, minWidth: 280 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>終わった?</Text>
          <Text style={{ fontSize: 16, marginBottom: 24, color: '#374151' }}>
            {selectedIngredientName}を冷蔵庫から削除しますか？
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View style={{ marginRight: 12 }}>
              <Button title="まだある" onPress={handleDeleteCancel} variant="secondary" />
            </View>
            <Button title="終わった" onPress={handleDeleteConfirm} variant="primary" />
          </View>
        </View>
      </Overlay>
    </View>
  );
}
