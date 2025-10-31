/**
 * ファミリー作成画面
 * 新しいファミリーを作成
 */

import { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Input, Text } from '@rneui/themed';
import { useAuth } from '@/hooks/useAuth';
import { createFamily } from '@/services/supabase/families';

export default function FamilyCreateScreen() {
  const [familyName, setFamilyName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCreateFamily = async () => {
    if (!familyName) {
      Alert.alert('エラー', 'ファミリー名を入力してください');
      return;
    }

    if (!user) {
      Alert.alert('エラー', 'ログインが必要です');
      return;
    }

    setLoading(true);
    try {
      await createFamily(familyName, user.id, user.email || 'User');
      router.replace('/(tabs)/inventory');
    } catch (error) {
      Alert.alert('エラー', error instanceof Error ? error.message : 'ファミリーの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="flex-grow">
      <View className="flex-1 justify-center px-6 py-12">
        {/* タイトル */}
        <View className="mb-8">
          <Text h2 className="text-center font-bold text-gray-900 mb-2">
            ファミリーを作成
          </Text>
          <Text className="text-center text-gray-600">家族で共有するグループを作成します</Text>
        </View>

        {/* フォーム */}
        <View className="space-y-4 mb-6">
          <Input
            placeholder="ファミリー名（例：田中家）"
            value={familyName}
            onChangeText={setFamilyName}
            editable={!loading}
            leftIcon={{ name: 'people', type: 'ionicon', color: '#9CA3AF' }}
          />
        </View>

        {/* 作成ボタン */}
        <Button
          title="ファミリーを作成"
          onPress={handleCreateFamily}
          loading={loading}
          disabled={loading}
          containerStyle={{ marginBottom: 16 }}
          buttonStyle={{ backgroundColor: '#3B82F6', paddingVertical: 12 }}
          titleStyle={{ fontSize: 16, fontWeight: '600' }}
        />

        {/* 招待コード入力へのリンク */}
        <Button
          title="招待コードで参加"
          type="outline"
          onPress={() => router.push('/(auth)/family-join')}
          disabled={loading}
          containerStyle={{ marginBottom: 16 }}
          buttonStyle={{ borderColor: '#3B82F6', paddingVertical: 12 }}
          titleStyle={{ color: '#3B82F6', fontSize: 16, fontWeight: '600' }}
        />
      </View>
    </ScrollView>
  );
}
