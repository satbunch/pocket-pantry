/**
 * 買い物リストアイテム（表示モード）
 */
import { View, Text, TouchableOpacity } from 'react-native';
import { CheckBox } from '@rneui/themed';
import { Trash2, Edit2 } from 'lucide-react-native';
import { THEME_COLORS } from '@/theme/colors';
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
        backgroundColor: THEME_COLORS.ui.background,
        borderBottomWidth: 1,
        borderBottomColor: THEME_COLORS.ui.border,
        opacity: isCompleted ? 0.6 : 1,
      }}
    >
      {/* チェックボックス */}
      <CheckBox
        checked={isCompleted}
        onPress={() => onToggleStatus(item.id)}
        checkedColor={THEME_COLORS.ui.buttonPrimary}
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
            color: isCompleted ? THEME_COLORS.ui.textMuted : THEME_COLORS.ui.textPrimary,
            textDecorationLine: isCompleted ? 'line-through' : 'none',
          }}
        >
          {item.name}
        </Text>
        <Text className="text-sm mt-1" style={{ color: THEME_COLORS.ui.textMuted }}>
          数量: {item.quantity}
        </Text>
      </View>

      {/* 編集ボタン */}
      <TouchableOpacity
        onPress={onEdit}
        className="ml-4 p-2 rounded-full active:bg-blue-50"
        activeOpacity={0.7}
        disabled={isCompleted}
      >
        <Edit2 size={20} color={isCompleted ? THEME_COLORS.ui.border : THEME_COLORS.ui.buttonPrimary} />
      </TouchableOpacity>

      {/* 削除ボタン */}
      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        className="ml-2 p-2 rounded-full active:bg-red-50"
        activeOpacity={0.7}
      >
        <Trash2 size={20} color={THEME_COLORS.ui.delete} />
      </TouchableOpacity>
    </View>
  );
}
