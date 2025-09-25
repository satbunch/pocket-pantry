// app/(tabs)/_layout.tsx（改良版）
import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * メインアプリのタブナビゲーションレイアウト
 * SafeArea完全対応版
 */
export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E7',
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8), // SafeAreaまたは最小8px
          height: 60 + Math.max(insets.bottom, 8), // 動的な高さ調整
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5E7',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
          color: '#1D1D1F',
        },
      }}
    >
      <Tabs.Screen
        name="inventory"
        options={{
          title: '在庫',
          tabBarIcon: ({ color, focused }) => <TabIcon name="inventory" color={color} focused={focused} />,
          headerTitle: '在庫管理',
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: '買い物',
          tabBarIcon: ({ color, focused }) => <TabIcon name="shopping" color={color} focused={focused} />,
          headerTitle: '買い物リスト',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color, focused }) => <TabIcon name="settings" color={color} focused={focused} />,
          headerTitle: '設定',
        }}
      />
    </Tabs>
  );
}

/**
 * タブアイコンコンポーネント
 */
interface TabIconProps {
  name: 'inventory' | 'shopping' | 'settings';
  color: string;
  focused: boolean;
}

function TabIcon({ name, color, focused }: TabIconProps) {
  const iconMap = {
    inventory: '📦',
    shopping: '🛒',
    settings: '⚙️',
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Text
        style={{
          fontSize: focused ? 24 : 20,
          marginBottom: 2,
          opacity: focused ? 1 : 0.7,
        }}
      >
        {iconMap[name]}
      </Text>
    </View>
  );
}
