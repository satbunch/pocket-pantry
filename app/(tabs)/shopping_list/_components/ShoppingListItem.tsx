/**
 * 買い物リストアイテムコンポーネント
 */
import { View, Text, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import type { ShoppingListItem } from '@/types/shopping';

interface ShoppingListItemProps {
  item: ShoppingListItem;
  onDelete: (id: string) => void;
}

export function ShoppingListItemComponent({ item, onDelete }: ShoppingListItemProps) {
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

      {/* 削除ボタン */}
      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        className="ml-4 p-2 rounded-full active:bg-red-50"
        activeOpacity={0.7}
      >
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}
