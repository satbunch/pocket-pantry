/**
 * 設定画面
 */
import { useState } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text } from 'react-native-paper';
import { Button } from '@/components/ui/Button';
import { loadTestData } from '@/services/localStorage/ingredients';

export default function SettingsScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadTestData = async () => {
    try {
      setIsLoading(true);
      await loadTestData();
      alert('テストデータをロードしました');
    } catch (error) {
      console.error('Failed to load test data:', error);
      alert('テストデータのロードに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView className="flex-1 bg-white">
        <View className="p-4">
          {/* 開発ツール */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-4">開発ツール</Text>
            <Button title="テストデータをロード" onPress={handleLoadTestData} disabled={isLoading} variant="primary" />
            <Text className="text-xs text-gray-500 mt-2">AsyncStorageにテスト用の食材データを入れます</Text>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
