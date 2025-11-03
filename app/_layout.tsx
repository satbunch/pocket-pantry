import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { TouchableOpacity, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ThemeProvider } from '@rneui/themed';
import { X } from 'lucide-react-native';
import { setupNotificationHandler } from '@/services/notifications/scheduler';
import { AuthProvider } from '@/contexts/AuthProvider';

import '../global.css';

/**
 * ゲストファーストアプローチによるルートナビゲーション
 *
 * 基本方針：
 * - 起動時は常にメイン画面（タブ）を表示（認証不要）
 * - 認証画面は設定画面から「家族共有」を選択した時のみ表示
 * - ゲストモード（ローカルストレージ）で全機能が利用可能
 */
const RootLayoutNav = () => {
  useEffect(() => {
    // 通知ハンドラーを初期化
    setupNotificationHandler();

    // 通知受信時のリスナー
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      Alert.alert(title || '通知', body || '');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // ゲストファーストアプローチ：常にメイン画面を表示
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/add_ingredient"
        options={{
          presentation: 'modal',
          title: '食材を追加',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#111827',
          },
          headerShadowVisible: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              className="ml-4 p-2 rounded-full active:bg-gray-100"
              activeOpacity={0.7}
            >
              <X size={24} color="#374151" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(modals)/edit_ingredient"
        options={{
          presentation: 'modal',
          title: '食材を編集',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#111827',
          },
          headerShadowVisible: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              className="ml-4 p-2 rounded-full active:bg-gray-100"
              activeOpacity={0.7}
            >
              <X size={24} color="#374151" />
            </TouchableOpacity>
          ),
        }}
      />
      {/* 認証画面グループ：設定画面から家族共有を選択した時のみ表示 */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default RootLayout;
