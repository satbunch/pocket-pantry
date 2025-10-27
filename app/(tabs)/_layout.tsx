/**
 * タブナビゲーションレイアウト
 */
import { Tabs } from 'expo-router';
import { useRouter } from 'expo-router';
import { List, PlusCircle, ShoppingBasket, Settings } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function TabsLayout() {
  const router = useRouter();

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
          title: '食材リスト',
          tabBarLabel: '食材リスト',
          headerTitle: '食材リスト',
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="plus"
        options={{
          title: '食材を追加',
          tabBarLabel: '食材を追加',
          headerTitle: '食材を追加',
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
          tabBarButton: props => (
            <TouchableOpacity
              {...(props as Record<string, unknown>)}
              onPress={() => router.push('/(modals)/add_ingredient')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping_list/index"
        options={{
          title: '買い物リスト',
          tabBarLabel: '買い物リスト',
          headerTitle: '買い物リスト',
          tabBarIcon: ({ color, size }) => <ShoppingBasket color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: '設定',
          tabBarLabel: '設定',
          headerTitle: '設定',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
