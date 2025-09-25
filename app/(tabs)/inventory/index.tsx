import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../../src/contexts';
import { LoadingSpinner } from '../../../src/components/ui/LoadingSpinner';
import { Button } from '../../../src/components/ui/Button';
import {
  LocalStorage,
  LocalFoodItemsService,
  type LocalFoodItem,
  LocalStorageHelpers,
} from '../../../src/services/localStorage';

// ローカル食材データの型定義
interface LocalItem {
  id: string;
  name: string;
  category: 'refrigerator' | 'freezer' | 'pantry' | 'vegetable_room';
  quantity: number;
  unit: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export default function InventoryScreen() {
  const { session } = useAuth();
  const [items, setItems] = useState<LocalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 食材データの読み込み
  const loadItems = useCallback(async () => {
    try {
      const storedItems = await LocalStorage.getItem<LocalItem[]>(STORAGE_KEYS.ITEMS_LOCAL);
      setItems(storedItems || []);
    } catch (error) {
      console.error('Failed to load items:', error);
      Alert.alert('エラー', '食材データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // 初回データ読み込み
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // リフレッシュ処理
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, [loadItems]);

  // カテゴリフィルタリング
  const filteredItems = items.filter(item => selectedCategory === 'all' || item.category === selectedCategory);

  // 食材削除
  const deleteItem = useCallback(
    async (itemId: string) => {
      Alert.alert('削除確認', 'この食材を削除しますか？', [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedItems = items.filter(item => item.id !== itemId);
              await LocalStorage.setItem(STORAGE_KEYS.ITEMS_LOCAL, updatedItems);
              setItems(updatedItems);
            } catch (error) {
              console.error('Failed to delete item:', error);
              Alert.alert('エラー', '食材の削除に失敗しました');
            }
          },
        },
      ]);
    },
    [items]
  );

  // 食材アイテムのレンダリング
  const renderItem = ({ item }: { item: LocalItem }) => {
    const categoryLabels = {
      refrigerator: '冷蔵',
      freezer: '冷凍',
      pantry: '常温',
      vegetable_room: '野菜室',
    };

    const isExpiringSoon =
      item.expiry_date && new Date(item.expiry_date) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2日以内

    return (
      <TouchableOpacity
        style={[styles.itemCard, isExpiringSoon && styles.itemCardExpiring]}
        onPress={() => router.push(`/(tabs)/inventory/edit/${item.id}`)}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item.id)}>
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemDetails}>
          <Text style={styles.itemQuantity}>
            {item.quantity} {item.unit}
          </Text>
          <Text style={styles.itemCategory}>{categoryLabels[item.category]}</Text>
        </View>

        {item.expiry_date && (
          <Text style={[styles.expiryDate, isExpiringSoon && styles.expiryDateWarning]}>
            期限: {new Date(item.expiry_date).toLocaleDateString('ja-JP')}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  // カテゴリフィルタ
  const categoryOptions = [
    { key: 'all', label: '全て' },
    { key: 'refrigerator', label: '冷蔵' },
    { key: 'freezer', label: '冷凍' },
    { key: 'pantry', label: '常温' },
    { key: 'vegetable_room', label: '野菜室' },
  ];

  const renderCategoryFilter = () => (
    <View style={styles.filterContainer}>
      {categoryOptions.map(option => (
        <TouchableOpacity
          key={option.key}
          style={[styles.filterButton, selectedCategory === option.key && styles.filterButtonActive]}
          onPress={() => setSelectedCategory(option.key)}
        >
          <Text style={[styles.filterButtonText, selectedCategory === option.key && styles.filterButtonTextActive]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // 空状態のレンダリング
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📦</Text>
      <Text style={styles.emptyTitle}>まだ食材が登録されていません</Text>
      <Text style={styles.emptySubtitle}>最初の食材を登録して、食材管理を始めましょう！</Text>
      {!session && (
        <View style={styles.guestHint}>
          <Text style={styles.guestHintText}>💡 ログイン不要ですぐに始められます</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" />
        <Text style={styles.loadingText}>食材データを読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ユーザー状態表示 */}
      {!session && (
        <View style={styles.guestBanner}>
          <Text style={styles.guestBannerText}>
            🚀 ゲストモードで利用中 |
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.guestBannerLink}> ログインして家族共有</Text>
            </TouchableOpacity>
          </Text>
        </View>
      )}

      {/* カテゴリフィルタ */}
      {items.length > 0 && renderCategoryFilter()}

      {/* 食材リスト */}
      {filteredItems.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* 食材追加ボタン */}
      <View style={styles.addButtonContainer}>
        <Button title="+ 食材を追加" onPress={() => router.push('/(tabs)/inventory/add-item')} variant="primary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  guestBanner: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  guestBannerText: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
  },
  guestBannerLink: {
    color: '#1976D2',
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F1F1F1',
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemCardExpiring: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    flex: 1,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  itemCategory: {
    fontSize: 14,
    color: '#8E8E93',
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  expiryDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  expiryDateWarning: {
    color: '#FF9800',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  guestHint: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  guestHintText: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '500',
  },
  addButtonContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
});
