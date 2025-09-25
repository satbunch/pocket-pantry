import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/contexts';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    // 🎯 新しいゲストファーストロジック
    if (session) {
      // 認証済みユーザー：タブ画面に移動
      if (inAuthGroup) {
        router.replace('/(tabs)/inventory');
      }
    } else {
      // 未認証ユーザー：ゲストモードでタブ画面に移動
      // 認証画面にいる場合のみログイン画面を表示
      if (!inTabsGroup && !inAuthGroup) {
        router.replace('/(tabs)/inventory');
      }
    }
  }, [session, loading, segments, router]);

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
