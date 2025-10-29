/**
 * 食材リストアイテムコンポーネント
 */
import { View, Text, TouchableOpacity } from 'react-native';
import { CircleMinus, CirclePlus, Trash2 } from 'lucide-react-native';
import { Badge } from '@rneui/themed';
import { THEME_COLORS } from '@/theme/colors';
import { MAX_INGREDIENT_QUANTITY } from '@/constants/ingredient';
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
    const newQuantity = Math.min(MAX_INGREDIENT_QUANTITY, item.quantity + item.incrementAmount);
    onQuantityChange(item.id, newQuantity);
  };

  const expiryStatus = getExpiryStatus(item.expiryDate);
  const expiryText =
    item.isExpiryManaged && item.expiryDate
      ? `${item.expiryDate}${expiryStatus === 'expired' ? ' (期限切れ)' : expiryStatus === 'soon' ? ' (まもなく期限)' : ''}`
      : '';
  const description = [expiryText, item.memo].filter(Boolean).join('\n');
  const descriptionColor = THEME_COLORS.status[expiryStatus];

  return (
    <TouchableOpacity
      onPress={() => onEdit?.(item.id)}
      className="bg-white border-b border-gray-200 flex-row items-center justify-between px-4 py-3"
    >
      <View className="flex-1 justify-center">
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-semibold flex-shrink" numberOfLines={1}>
            {item.name}
          </Text>
          <View style={{ flexShrink: 0 }}>
            <Badge
              value={item.storageCategory}
              badgeStyle={{
                paddingHorizontal: 6,
                height: 18,
                backgroundColor: THEME_COLORS.storage[item.storageCategory as keyof typeof THEME_COLORS.storage],
              }}
              textStyle={{ fontSize: 10, fontWeight: '600' }}
            />
          </View>
        </View>
        <Text numberOfLines={1} style={{ color: descriptionColor, fontSize: 13, minHeight: 18 }}>
          {description}
        </Text>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity onPress={handleDecrement} className="p-1">
          <CircleMinus size={20} color={THEME_COLORS.ui.icon} />
        </TouchableOpacity>
        <Text className="text-lg font-bold min-w-[40px] text-center" style={{ color: THEME_COLORS.ui.quantity }}>
          {item.quantity}
        </Text>
        <TouchableOpacity onPress={handleIncrement} className="p-1">
          <CirclePlus size={20} color={THEME_COLORS.ui.icon} />
        </TouchableOpacity>
        <Text className="text-sm min-w-[28px] ml-1" style={{ color: THEME_COLORS.ui.unitText }}>
          {item.unit}
        </Text>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Trash2 size={22} color={THEME_COLORS.ui.delete} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
