/**
 * 食材管理画面（在庫一覧）
 */
import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getAllIngredients, deleteIngredient } from '@/services/localStorage/ingredients';
import type { Ingredient, StorageCategory } from '@/types/ingredient';
import { mockIngredients } from '@/src/data/mockIngredients';

const STORAGE_CATEGORIES: StorageCategory[] = ['冷蔵', '冷凍', '常温', '野菜室'];

export default function InventoryScreen() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<StorageCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // 食材データを読み込み
  const loadIngredients = useCallback(async () => {
    // const data = await getAllIngredients();
    const data = mockIngredients;
    setIngredients(data);
  }, []);

  useEffect(() => {
    loadIngredients();
  }, [loadIngredients]);

  // プルリフレッシュ
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadIngredients();
    setRefreshing(false);
  }, [loadIngredients]);

  // カテゴリでフィルタ
  const filteredIngredients = ingredients.filter(ingredient => {
    if (selectedCategory === 'all') return true;
    return ingredient.storageCategory === selectedCategory;
  });

  // 食材削除
  const handleDelete = async (id: string) => {
    const success = await deleteIngredient(id);
    if (success) {
      await loadIngredients();
    }
  };

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
  const getStatusColor = (status: Ingredient['ingredientStatus']) => {
    switch (status) {
      case 'in_stock':
        return '#34C759';
      case 'low':
        return '#FF9500';
      case 'out':
        return '#FF3B30';
    }
  };

  // ステータスラベル
  const getStatusLabel = (status: Ingredient['ingredientStatus']) => {
    switch (status) {
      case 'in_stock':
        return '在庫あり';
      case 'low':
        return '残りわずか';
      case 'out':
        return 'なし';
    }
  };

  // 食材カードのレンダリング
  const renderIngredient = ({ item }: { item: Ingredient }) => {
    const expiryStatus = getExpiryStatus(item.expiryDate);

    return (
      <Card>
        <View style={styles.ingredientHeader}>
          <View style={styles.ingredientInfo}>
            <Text style={styles.ingredientName}>{item.name}</Text>
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, { backgroundColor: getStatusColor(item.ingredientStatus) }]}>
                <Text style={styles.badgeText}>{getStatusLabel(item.ingredientStatus)}</Text>
              </View>
              <Text style={styles.category}>{item.storageCategory}</Text>
            </View>
          </View>
          <Text style={styles.quantity}>
            {item.quantity} {item.unit}
          </Text>
        </View>

        {item.isExpiryManaged && item.expiryDate && (
          <View style={styles.expiryContainer}>
            <Text
              style={[
                styles.expiryText,
                expiryStatus === 'expired' && styles.expiryExpired,
                expiryStatus === 'soon' && styles.expirySoon,
              ]}
            >
              賞味期限: {item.expiryDate}
              {expiryStatus === 'expired' && ' (期限切れ)'}
              {expiryStatus === 'soon' && ' (まもなく期限)'}
            </Text>
          </View>
        )}

        {item.memo && <Text style={styles.memo}>{item.memo}</Text>}

        <View style={styles.actions}>
          <Button title="削除" onPress={() => handleDelete(item.id)} variant="danger" style={styles.deleteButton} />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* カテゴリフィルタ */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedCategory === 'all' && styles.filterButtonActive]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[styles.filterText, selectedCategory === 'all' && styles.filterTextActive]}>すべて</Text>
        </TouchableOpacity>
        {STORAGE_CATEGORIES.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.filterButton, selectedCategory === category && styles.filterButtonActive]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.filterText, selectedCategory === category && styles.filterTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 食材リスト */}
      <FlatList
        data={filteredIngredients}
        renderItem={renderIngredient}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>食材が登録されていません</Text>
            <Text style={styles.emptySubtext}>「+」ボタンから食材を追加しましょう</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#E5E5EA',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  category: {
    fontSize: 14,
    color: '#8E8E93',
  },
  quantity: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  expiryContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  expiryText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  expiryExpired: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  expirySoon: {
    color: '#FF9500',
    fontWeight: '600',
  },
  memo: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
  },
  actions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#C7C7CC',
  },
});
