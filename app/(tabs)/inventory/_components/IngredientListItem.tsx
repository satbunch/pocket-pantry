/**
 * 食材リストアイテムコンポーネント
 */
import { View, Text } from 'react-native';
import { List, IconButton } from 'react-native-paper';
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
    <View>
      <List.Item
        onPress={() => onEdit?.(item.id)}
        title={
          <View className="flex-row items-center">
            <Text className="text-base font-semibold mr-2">{item.name}</Text>
            <View className="bg-gray-200 px-2 py-0.5 rounded mr-2">
              <Text className="text-gray-700 text-xs font-semibold">{item.storageCategory}</Text>
            </View>
          </View>
        }
        description={description}
        descriptionNumberOfLines={item.memo ? 4 : 2}
        right={() => (
          <View className="flex-row items-center -mr-3">
            <IconButton icon="minus" size={16} style={{ margin: 0, marginHorizontal: -4 }} onPress={handleDecrement} />
            <Text className="text-base font-bold text-blue-600 min-w-[32px] text-center">{item.quantity}</Text>
            <IconButton icon="plus" size={16} style={{ margin: 0, marginHorizontal: -4 }} onPress={handleIncrement} />
            <Text className="text-xs font-normal text-gray-500 min-w-[24px] ml-0.5">{item.unit}</Text>
            <IconButton
              icon="delete"
              iconColor="#ef4444"
              size={20}
              style={{ margin: 0, marginHorizontal: -8 }}
              onPress={() => onDelete(item.id)}
            />
          </View>
        )}
        style={{
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        }}
        descriptionStyle={{
          color: descriptionColor,
          fontSize: 13,
        }}
      />
    </View>
  );
}
