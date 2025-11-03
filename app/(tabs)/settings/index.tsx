/**
 * 設定画面
 */
import { useEffect, useState } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, Keyboard, Switch, Text } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { loadTestData } from '@/services/localStorage/ingredients';
import { sendTestNotification } from '@/services/notifications/scheduler';
import { loadNotificationSettings, setNotificationEnabled } from '@/services/localStorage/notificationSettings';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { isAuthenticated, profile } = useAuth();

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await loadNotificationSettings();
      setNotificationsEnabled(settings.isEnabled);
    };
    loadSettings();
  }, []);

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

  const handleSendTestNotification = async () => {
    try {
      await sendTestNotification();
      alert('テスト通知を送信しました');
    } catch (error) {
      console.error('Failed to send test notification:', error);
      alert('テスト通知の送信に失敗しました');
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    try {
      setNotificationsEnabled(value);
      await setNotificationEnabled(value);
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
      alert('通知設定の変更に失敗しました');
    }
  };

  const handleNavigateToAuth = () => {
    router.push('/(auth)/login');
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView className="flex-1 bg-white">
        <View className="p-4">
          {/* 家族共有 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-4">家族共有</Text>
            {isAuthenticated && profile ? (
              <View className="bg-gray-50 p-4 rounded-lg">
                <Text className="text-gray-800 font-medium mb-2">家族: {profile.family_id}</Text>
                <Text className="text-gray-600 text-sm">ニックネーム: {profile.name}</Text>
              </View>
            ) : (
              <View>
                <View className="bg-blue-50 p-4 rounded-lg mb-3">
                  <Text className="text-gray-700 text-sm mb-2">家族でデータを共有して、みんなで食材管理ができます</Text>
                  <Text className="text-gray-600 text-xs">
                    • リアルタイム同期{'\n'}• クラウドバックアップ{'\n'}• 複数デバイス対応
                  </Text>
                </View>
                <Button title="家族共有を始める" onPress={handleNavigateToAuth} variant="primary" />
              </View>
            )}
          </View>

          {/* 通知設定 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-4">通知設定</Text>
            <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-lg">
              <Text className="text-gray-800">賞味期限アラート</Text>
              <Switch value={notificationsEnabled} onValueChange={handleToggleNotifications} />
            </View>
            <Text className="text-xs text-gray-500 mt-2">食材の賞味期限が近いときにお知らせします</Text>
          </View>

          {/* 開発ツール */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-4">開発ツール</Text>
            <Button title="テストデータをロード" onPress={handleLoadTestData} disabled={isLoading} variant="primary" />
            <Text className="text-xs text-gray-500 mt-2">AsyncStorageにテスト用の食材データを入れます</Text>

            <View className="mt-4">
              <Button title="テスト通知を送信" onPress={handleSendTestNotification} variant="primary" />
              <Text className="text-xs text-gray-500 mt-2">テスト用の通知を即座に送信します</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
