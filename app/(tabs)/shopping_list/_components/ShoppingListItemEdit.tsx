/**
 * 買い物リストアイテム（編集モード）
 */
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Save, X } from 'lucide-react-native';

interface ShoppingListItemEditProps {
  name: string;
  quantity: string;
  onNameChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ShoppingListItemEdit({
  name,
  quantity,
  onNameChange,
  onQuantityChange,
  onSave,
  onCancel,
}: ShoppingListItemEditProps) {
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
      {/* 食材名入力 */}
      <TextInput
        value={name}
        onChangeText={onNameChange}
        placeholder="食材名"
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: '#d1d5db',
          borderRadius: 6,
          paddingHorizontal: 10,
          paddingVertical: 8,
          fontSize: 14,
          marginRight: 8,
        }}
      />

      {/* 数量入力 */}
      <TextInput
        value={quantity}
        onChangeText={onQuantityChange}
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
          marginRight: 8,
        }}
      />

      {/* 保存ボタン */}
      <TouchableOpacity
        onPress={onSave}
        className="p-2 rounded-full active:bg-green-50"
        activeOpacity={0.7}
        style={{ marginRight: 8 }}
      >
        <Save size={20} color="#22c55e" />
      </TouchableOpacity>

      {/* キャンセルボタン */}
      <TouchableOpacity onPress={onCancel} className="p-2 rounded-full active:bg-gray-100" activeOpacity={0.7}>
        <X size={20} color="#6b7280" />
      </TouchableOpacity>
    </View>
  );
}
