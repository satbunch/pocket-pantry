/**
 * 買い物リストアイテム（表示モード）
 */
import { View, Text, TouchableOpacity } from 'react-native';
import { CheckBox } from '@rneui/themed';
import { Trash2, Edit2 } from 'lucide-react-native';
import type { ShoppingListItem } from '@/types/shopping';

interface ShoppingListItemViewProps {
  item: ShoppingListItem;
  onDelete: (id: string) => void;
  onEdit: () => void;
  onToggleStatus: (id: string) => void;
}

export function ShoppingListItemView({ item, onDelete, onEdit, onToggleStatus }: ShoppingListItemViewProps) {
  const isCompleted = item.status === 'completed';

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
        opacity: isCompleted ? 0.6 : 1,
      }}
    >
      {/* チェックボックス */}
      <CheckBox
        checked={isCompleted}
        onPress={() => onToggleStatus(item.id)}
        checkedColor="#3b82f6"
        containerStyle={{
          margin: 0,
          marginLeft: 0,
          marginRight: 8,
          padding: 0,
          backgroundColor: 'transparent',
          borderWidth: 0,
        }}
      />

      {/* アイテム情報 */}
      <View className="flex-1" style={{ marginLeft: 4 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: isCompleted ? '#9ca3af' : '#1f2937',
            textDecorationLine: isCompleted ? 'line-through' : 'none',
          }}
        >
          {item.name}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">数量: {item.quantity}</Text>
      </View>

      {/* 編集ボタン */}
      <TouchableOpacity
        onPress={onEdit}
        className="ml-4 p-2 rounded-full active:bg-blue-50"
        activeOpacity={0.7}
        disabled={isCompleted}
      >
        <Edit2 size={20} color={isCompleted ? '#d1d5db' : '#3b82f6'} />
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
