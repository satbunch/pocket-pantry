/**
 * 買い物リストアイテムコンポーネント
 */
import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Trash2, Save, X, Edit2 } from 'lucide-react-native';
import type { ShoppingListItem } from '@/types/shopping';

interface ShoppingListItemProps {
  item: ShoppingListItem;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: { name?: string; quantity?: number }) => void;
}

export function ShoppingListItemComponent({ item, onDelete, onUpdate }: ShoppingListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQuantity, setEditQuantity] = useState(item.quantity.toString());

  const handleSave = () => {
    const updates: { name?: string; quantity?: number } = {};
    if (editName !== item.name) {
      updates.name = editName;
    }
    if (editQuantity !== item.quantity.toString()) {
      updates.quantity = Number(editQuantity);
    }
    if (Object.keys(updates).length > 0) {
      onUpdate(item.id, updates);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditQuantity(item.quantity.toString());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          gap: 8,
        }}
      >
        {/* 食材名入力 */}
        <TextInput
          value={editName}
          onChangeText={setEditName}
          placeholder="食材名"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 8,
            fontSize: 14,
          }}
        />

        {/* 数量入力 */}
        <TextInput
          value={editQuantity}
          onChangeText={setEditQuantity}
          placeholder="数量"
          keyboardType="numeric"
          style={{
            width: 60,
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 8,
            fontSize: 14,
          }}
        />

        {/* 保存ボタン */}
        <TouchableOpacity onPress={handleSave} className="p-2 rounded-full active:bg-green-50" activeOpacity={0.7}>
          <Save size={20} color="#22c55e" />
        </TouchableOpacity>

        {/* キャンセルボタン */}
        <TouchableOpacity onPress={handleCancel} className="p-2 rounded-full active:bg-gray-100" activeOpacity={0.7}>
          <X size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
      }}
    >
      {/* アイテム情報 */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-500 mt-1">数量: {item.quantity}</Text>
      </View>

      {/* 編集ボタン */}
      <TouchableOpacity
        onPress={() => setIsEditing(true)}
        className="ml-4 p-2 rounded-full active:bg-blue-50"
        activeOpacity={0.7}
      >
        <Edit2 size={20} color="#3b82f6" />
      </TouchableOpacity>

      {/* 削除ボタン */}
      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        className="ml-2 p-2 rounded-full active:bg-red-50"
        activeOpacity={0.7}
      >
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}
