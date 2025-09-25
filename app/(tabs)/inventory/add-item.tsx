import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { LocalStorage, STORAGE_KEYS } from '../../../src/services/localStorage';

type ItemCategory = 'refrigerator' | 'freezer' | 'pantry' | 'vegetable_room';

interface LocalItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export default function AddItemScreen() {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '1',
    unit: '個',
    expiry_date: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('refrigerator');
  const [loading, setLoading] = useState(false);

  // カテゴリ選択肢
  const categories = [
    { key: 'refrigerator', label: '冷蔵室', emoji: '🧊' },
    { key: 'freezer', label: '冷凍室', emoji: '❄️' },
    { key: 'pantry', label: '常温', emoji: '🏠' },
    { key: 'vegetable_room', label: '野菜室', emoji: '🥬' },
  ] as const;

  // 単位選択肢
  const units = ['個', 'パック', 'kg', 'g', 'L', 'ml', '本', '袋', '箱'];

  // フォーム送信
  const handleSubmit = async () => {
    // バリデーション
    if (!formData.name.trim()) {
      Alert.alert('入力エラー', '食材名を入力してください');
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      Alert.alert('入力エラー', '正しい数量を入力してください');
      return;
    }

    setLoading(true);
    try {
      // 新しい食材データを作成
      const newItem: LocalItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name.trim(),
        category: selectedCategory,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        expiry_date: formData.expiry_date || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 既存のデータを取得
      const existingItems = (await LocalStorage.getItem<LocalItem[]>(STORAGE_KEYS.ITEMS_LOCAL)) || [];

      // 新しいアイテムを追加
      const updatedItems = [...existingItems, newItem];

      // ローカルストレージに保存
      await LocalStorage.setItem(STORAGE_KEYS.ITEMS_LOCAL, updatedItems);

      Alert.alert('登録完了', '食材を登録しました！', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (error) {
      console.error('Failed to save item:', error);
      Alert.alert('エラー', '食材の登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ヘッダー */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backButton}>← 戻る</Text>
            </TouchableOpacity>
            <Text style={styles.title}>食材を追加</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* 食材名入力 */}
          <View style={styles.section}>
            <Text style={styles.label}>食材名 *</Text>
            <Input
              placeholder="例: 牛乳、たまご、トマトなど"
              value={formData.name}
              onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* カテゴリ選択 */}
          <View style={styles.section}>
            <Text style={styles.label}>保存場所 *</Text>
            <View style={styles.categoryGrid}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.key}
                  style={[styles.categoryButton, selectedCategory === category.key && styles.categoryButtonActive]}
                  onPress={() => setSelectedCategory(category.key)}
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text style={[styles.categoryText, selectedCategory === category.key && styles.categoryTextActive]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 数量・単位入力 */}
          <View style={styles.section}>
            <Text style={styles.label}>数量・単位 *</Text>
            <View style={styles.quantityContainer}>
              <View style={styles.quantityInput}>
                <Input
                  placeholder="1"
                  value={formData.quantity}
                  onChangeText={text => setFormData(prev => ({ ...prev, quantity: text }))}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.unitSelector}>
                {/* 簡易単位選択 - 将来的にはPickerに置き換え */}
                <TouchableOpacity style={styles.unitButton}>
                  <Text style={styles.unitButtonText}>{formData.unit}</Text>
                  <Text style={styles.unitArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 賞味期限入力 */}
          <View style={styles.section}>
            <Text style={styles.label}>賞味期限（任意）</Text>
            <Input
              placeholder="YYYY-MM-DD"
              value={formData.expiry_date}
              onChangeText={text => setFormData(prev => ({ ...prev, expiry_date: text }))}
              keyboardType="default"
            />
            <Text style={styles.hint}>例: 2025-08-15（空欄の場合は期限なし）</Text>
          </View>

          {/* 送信ボタン */}
          <View style={styles.submitContainer}>
            <Button title="食材を登録" onPress={handleSubmit} loading={loading} variant="primary" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
  },
  headerSpacer: {
    width: 50, // backButtonと同じ幅で中央揃え
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryButton: {
    width: '48%',
    marginRight: '2%',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E5E5E7',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  quantityInput: {
    flex: 1,
  },
  unitSelector: {
    width: 100,
  },
  unitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  unitButtonText: {
    fontSize: 16,
    color: '#1D1D1F',
    fontWeight: '500',
  },
  unitArrow: {
    fontSize: 12,
    color: '#8E8E93',
  },
  hint: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
    fontStyle: 'italic',
  },
  submitContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
});
