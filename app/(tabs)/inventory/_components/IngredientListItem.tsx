/**
 * 食材リストアイテムコンポーネント
 */
import { View, Text, TouchableOpacity } from 'react-native';
import { CircleMinus, CirclePlus, Trash2 } from 'lucide-react-native';
import { Badge } from '@rneui/themed';
import { STORAGE_CATEGORY_COLORS } from '@/constants/colors';
import type { Ingredient } from '@/types/ingredient';

interface IngredientListItemProps {
  item: Ingredient;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
  onQuantityChange: (id: string, newQuantity: number) => void;
}

export function IngredientListItem({ item, onDelete, onEdit, onQuantityChange }: IngredientListItemProps) {
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

  const handleDecrement = () => {
    const newQuantity = Math.max(0, item.quantity - item.incrementAmount);
    onQuantityChange(item.id, newQuantity);
  };

  const handleIncrement = () => {
    const newQuantity = item.quantity + item.incrementAmount;
    onQuantityChange(item.id, newQuantity);
  };

  const expiryStatus = getExpiryStatus(item.expiryDate);
  const expiryText =
    item.isExpiryManaged && item.expiryDate
      ? `${item.expiryDate}${expiryStatus === 'expired' ? ' (期限切れ)' : expiryStatus === 'soon' ? ' (まもなく期限)' : ''}`
      : '';
  const description = [expiryText, item.memo].filter(Boolean).join('\n');
  const descriptionColor = expiryStatus === 'expired' ? '#ef4444' : expiryStatus === 'soon' ? '#f97316' : '#6b7280';

  return (
    <TouchableOpacity
      onPress={() => onEdit?.(item.id)}
      className="bg-white border-b border-gray-200 flex-row items-center px-4 py-2"
    >
      <View className="flex-1">
        <View className="flex-row items-center mb-1 gap-2">
          <Text className="text-base font-semibold">{item.name}</Text>
          <Badge
            value={item.storageCategory}
            badgeStyle={{
              paddingHorizontal: 6,
              height: 18,
              backgroundColor: STORAGE_CATEGORY_COLORS[item.storageCategory as keyof typeof STORAGE_CATEGORY_COLORS],
            }}
            textStyle={{ fontSize: 10, fontWeight: '600' }}
          />
        </View>
        {description ? (
          <Text numberOfLines={item.memo ? 4 : 2} style={{ color: descriptionColor, fontSize: 13 }}>
            {description}
          </Text>
        ) : null}
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity onPress={handleDecrement} className="p-1">
          <CircleMinus size={20} color="#6b7280" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-blue-600 min-w-[40px] text-center">{item.quantity}</Text>
        <TouchableOpacity onPress={handleIncrement} className="p-1">
          <CirclePlus size={20} color="#6b7280" />
        </TouchableOpacity>
        <Text className="text-sm text-gray-500 min-w-[28px] ml-1">{item.unit}</Text>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Trash2 size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
