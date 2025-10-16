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
          headerTitle: '在庫',
        }}
      />
      <Tabs.Screen
        name="shopping_list/index"
        options={{
          title: '買い物リスト',
          tabBarLabel: '買い物リスト',
          headerTitle: '買い物リスト',
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: '設定',
          tabBarLabel: '設定',
          headerTitle: '設定',
        }}
      />
    </Tabs>
  );
}
