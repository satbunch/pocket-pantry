/**
 * 買い物リスト画面
 */
import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useShoppingList } from '@/hooks/useShoppingList';
import { ShoppingListItemComponent } from './_components/ShoppingListItem';

export default function ShoppingListScreen() {
  const { items, loadItems, addItem, deleteItem, updateItem } = useShoppingList();
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

  // アイテム更新
  const handleUpdate = async (id: string, updates: { name?: string; quantity?: number }) => {
    await updateItem(id, updates);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* 登録フォーム */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <Text className="text-lg font-bold text-gray-800 mb-3">新しい買い物を追加</Text>

        {/* 入力フォーム（横並び） */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {/* 食材名入力 */}
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="食材名"
            placeholderTextColor="#d1d5db"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: errors.name ? '#ef4444' : '#d1d5db',
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 8,
              fontSize: 14,
            }}
          />

          {/* 数量入力 */}
          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            placeholder="数量"
            placeholderTextColor="#d1d5db"
            keyboardType="numeric"
            style={{
              width: 80,
              borderWidth: 1,
              borderColor: errors.quantity ? '#ef4444' : '#d1d5db',
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 8,
              fontSize: 14,
            }}
          />

          {/* 登録ボタン */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? '#d1d5db' : '#3b82f6',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              {isSubmitting ? '登録...' : '登録'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* エラーメッセージ */}
        <View style={{ marginTop: 8 }}>
          {errors.name && <Text style={{ fontSize: 12, color: '#ef4444' }}>{errors.name}</Text>}
          {errors.quantity && <Text style={{ fontSize: 12, color: '#ef4444' }}>{errors.quantity}</Text>}
        </View>
      </View>

      {/* 買い物リスト */}
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ShoppingListItemComponent item={item} onDelete={handleDelete} onUpdate={handleUpdate} />
        )}
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
