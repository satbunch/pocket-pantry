import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { X } from 'lucide-react-native';
import { theme } from '@/theme/paper';
import { setupNotificationHandler } from '@/services/notifications/scheduler';

import '../global.css';

export default function RootLayout() {
  useEffect(() => {
    // 通知ハンドラーを初期化
    setupNotificationHandler();
  }, []);
  return (
    <PaperProvider theme={theme}>
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
                onPress={() => router.back()}
                className="ml-4 p-2 rounded-full active:bg-gray-100"
                activeOpacity={0.7}
              >
                <X size={24} color="#374151" />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
