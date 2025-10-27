/**
 * 買い物リスト画面
 */
import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useShoppingList } from '@/hooks/useShoppingList';
import { ShoppingListItemComponent } from './_components/ShoppingListItem';

export default function ShoppingListScreen() {
  const { items, loadItems, addItem, deleteItem } = useShoppingList();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 画面がフォーカスされたときにリロード
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  // フォーム検証
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = '食材名を入力してください';
    }

    if (!quantity.trim()) {
      newErrors.quantity = '数量を入力してください';
    } else if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = '数量は0より大きい数値で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信
  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addItem({
        name: name.trim(),
        quantity: Number(quantity),
      });
      // 登録後にフォームをクリア
      setName('');
      setQuantity('');
      setErrors({});
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // アイテム削除
  const handleDelete = async (id: string) => {
    await deleteItem(id);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* 登録フォーム */}
      <View className="bg-white border-b border-gray-200 px-4 py-5">
        <Text className="text-lg font-bold text-gray-800 mb-4">新しい買い物を追加</Text>

        {/* 食材名入力 */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            食材名 <Text className="text-red-500">*</Text>
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: errors.name ? '#ef4444' : '#d1d5db',
              borderRadius: 8,
              paddingHorizontal: 12,
              height: 44,
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: name ? '#111827' : '#9ca3af',
              }}
              onLongPress={() => {}} // テキスト選択対応
            >
              {name || 'を入力'}
            </Text>
          </View>
          {errors.name && <Text className="text-xs text-red-500 mt-1">{errors.name}</Text>}
        </View>

        {/* 数量入力 */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            数量 <Text className="text-red-500">*</Text>
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: errors.quantity ? '#ef4444' : '#d1d5db',
              borderRadius: 8,
              paddingHorizontal: 12,
              height: 44,
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: quantity ? '#111827' : '#9ca3af',
              }}
            >
              {quantity || 'を入力'}
            </Text>
          </View>
          {errors.quantity && <Text className="text-xs text-red-500 mt-1">{errors.quantity}</Text>}
        </View>

        {/* 登録ボタン */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#d1d5db' : '#3b82f6',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
          activeOpacity={0.7}
        >
          <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
            {isSubmitting ? '登録中...' : '登録'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 買い物リスト */}
      <FlatList
        data={items}
        renderItem={({ item }) => <ShoppingListItemComponent item={item} onDelete={handleDelete} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
            <Text className="text-lg font-semibold text-gray-500 mb-2">買い物リストが空です</Text>
            <Text className="text-sm text-gray-400">上のフォームから買い物を追加しましょう</Text>
          </View>
        }
      />
    </View>
  );
}
