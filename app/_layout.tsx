import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { TouchableOpacity, Alert, ActivityIndicator, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ThemeProvider } from '@rneui/themed';
import { X } from 'lucide-react-native';
import { setupNotificationHandler } from '@/services/notifications/scheduler';
import { AuthProvider } from '@/contexts/AuthProvider';
import { useAuth } from '@/hooks/useAuth';

import '../global.css';

/**
 * 認証フロー判定と画面遷移を担当するコンポーネント
 */
function RootLayoutNav() {
  const { isAuthenticated, profile, loading } = useAuth();

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

  // ローディング中は表示
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // 認証されていない場合は認証画面へ
  if (!isAuthenticated) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(auth)" />
      </Stack>
    );
  }

  // 認証済みだがプロフィールがない場合（ゲストからの移行中）はファミリー選択画面へ
  if (!profile) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(auth)/family-create" />
        <Stack.Screen name="(auth)/family-join" />
      </Stack>
    );
  }

  // 認証済み＆プロフィール完成 → メイン画面
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
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </AuthProvider>
  );
}
