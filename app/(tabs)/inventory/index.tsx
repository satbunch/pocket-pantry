/**
 * 食材管理画面（食材一覧）
 */
import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
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
        return 'あり';
      case 'low':
        return '残りわずか';
      case 'out':
        return 'なし';
    }
  };

  // 食材アイテムのレンダリング
  const renderIngredient = ({ item }: { item: Ingredient }) => {
    const expiryStatus = getExpiryStatus(item.expiryDate);

    // タイトル部分（食材名 + 保管場所バッジ + ステータスバッジ）
    const title = (
      <View className="flex-row items-center">
        <Text className="text-base font-semibold mr-2">{item.name}</Text>
        <View className="bg-gray-200 px-2 py-0.5 rounded mr-2">
          <Text className="text-gray-700 text-xs font-semibold">{item.storageCategory}</Text>
        </View>
        {item.ingredientStatus !== 'in_stock' && (
          <View className={`${getStatusBgColor(item.ingredientStatus)} px-2 py-0.5 rounded`}>
            <Text className="text-white text-xs font-semibold">{getStatusLabel(item.ingredientStatus)}</Text>
          </View>
        )}
      </View>
    );

    // 説明部分（賞味期限、メモ）
    const descriptionLines = [];

    if (item.isExpiryManaged && item.expiryDate) {
      const expiryText = `${item.expiryDate}${
        expiryStatus === 'expired' ? ' (期限切れ)' : expiryStatus === 'soon' ? ' (まもなく期限)' : ''
      }`;
      descriptionLines.push(expiryText);
    }

    if (item.memo) {
      descriptionLines.push(item.memo);
    }

    const description = descriptionLines.join('\n');

    // 右側（数量表示）
    const right = () => (
      <View className="flex-row items-center">
        <Text className="text-base font-bold text-blue-600 mr-2">
          {item.quantity} {item.unit}
        </Text>
        <IconButton icon="delete" iconColor="#ef4444" size={20} onPress={() => handleDelete(item.id)} />
      </View>
    );

    return (
      <List.Item
        title={title}
        description={description}
        descriptionNumberOfLines={item.memo ? 4 : 2}
        right={right}
        style={{
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        }}
        descriptionStyle={{
          color: expiryStatus === 'expired' ? '#ef4444' : expiryStatus === 'soon' ? '#f97316' : '#6b7280',
          fontSize: 13,
        }}
      />
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
