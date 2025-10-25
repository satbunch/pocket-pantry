/**
 * 食材リストアイテムコンポーネント
 */
import { View, Text } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import type { Ingredient } from '@/types/ingredient';

interface IngredientListItemProps {
  item: Ingredient;
  onDelete: (id: string) => void;
}

export function IngredientListItem({ item, onDelete }: IngredientListItemProps) {
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

  // ステータスバッジの色
  const getStatusBgColor = (status: Ingredient['ingredientStatus']) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-500';
      case 'low':
        return 'bg-orange-500';
      case 'out':
        return 'bg-red-500';
    }
  };

  // ステータスラベル
  const getStatusLabel = (status: Ingredient['ingredientStatus']) => {
    switch (status) {
      case 'in_stock':
        return 'あり';
      case 'low':
        return '残りわずか';
      case 'out':
        return 'なし';
    }
  };

  const expiryStatus = getExpiryStatus(item.expiryDate);
  const expiryText =
    item.isExpiryManaged && item.expiryDate
      ? `${item.expiryDate}${expiryStatus === 'expired' ? ' (期限切れ)' : expiryStatus === 'soon' ? ' (まもなく期限)' : ''}`
      : '';
  const description = [expiryText, item.memo].filter(Boolean).join('\n');
  const descriptionColor = expiryStatus === 'expired' ? '#ef4444' : expiryStatus === 'soon' ? '#f97316' : '#6b7280';

  return (
    <List.Item
      title={
        <View className="flex-row items-center">
          <Text className="text-base font-semibold mr-2">{item.name}</Text>
          <View className="bg-gray-200 px-2 py-0.5 rounded mr-2">
            <Text className="text-gray-700 text-xs font-semibold">{item.storageCategory}</Text>
          </View>
          {item.ingredientStatus !== 'in_stock' && (
            <View className={`${getStatusBgColor(item.ingredientStatus)} px-2 py-0.5 rounded`}>
              <Text className="text-white text-xs font-semibold">{getStatusLabel(item.ingredientStatus)}</Text>
            </View>
          )}
        </View>
      }
      description={description}
      descriptionNumberOfLines={item.memo ? 4 : 2}
      right={() => (
        <View className="flex-row items-center">
          <Text className="text-base font-bold text-blue-600 mr-2">{item.quantity}</Text>
          <IconButton icon="delete" iconColor="#ef4444" size={20} onPress={() => onDelete(item.id)} />
          <Text className="text-base text-sm font-bold text-grey-600 mr-2">{item.unit}</Text>
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
  );
}
