/**
 * 認証画面グループのレイアウト
 * スタックナビゲーション: login → signup → family-create/family-join
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="family-create" />
      <Stack.Screen name="family-join" />
    </Stack>
  );
}
