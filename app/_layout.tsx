import { Stack } from 'expo-router';

import '../global.css';

export default function rootLayout() {
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
        }}
      />
    </Stack>
  );
}
