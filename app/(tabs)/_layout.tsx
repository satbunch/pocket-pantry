/**
 * タブナビゲーションレイアウト
 */
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tabs.Screen
        name="inventory/index"
        options={{
          title: '在庫',
          tabBarLabel: '在庫',
          headerTitle: '食材管理',
        }}
      />
    </Tabs>
  );
}
