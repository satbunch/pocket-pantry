/**
 * ファミリー参加画面
 * 招待コードでファミリーに参加
 */

import { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Input, Text } from '@rneui/themed';
import { useAuth } from '@/hooks/useAuth';
import { joinFamilyByInviteCode } from '@/services/supabase/families';

export default function FamilyJoinScreen() {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleJoinFamily = async () => {
    if (!inviteCode) {
      Alert.alert('エラー', '招待コードを入力してください');
      return;
    }

    if (!user) {
      Alert.alert('エラー', 'ログインが必要です');
      return;
    }

    setLoading(true);
    try {
      await joinFamilyByInviteCode(inviteCode.toUpperCase(), user.id, user.email || 'User');
      router.replace('/(tabs)/inventory');
    } catch (error) {
      Alert.alert('エラー', error instanceof Error ? error.message : 'ファミリーへの参加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCreateFamily = () => {
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="flex-grow">
      <View className="flex-1 justify-center px-6 py-12">
        {/* タイトル */}
        <View className="mb-8">
          <Text h2 className="text-center font-bold text-gray-900 mb-2">
            招待コードで参加
          </Text>
          <Text className="text-center text-gray-600">家族から受け取った招待コードを入力</Text>
        </View>

        {/* フォーム */}
        <View className="space-y-4 mb-6">
          <Input
            placeholder="招待コード（例：XXXX-XXXX-XXXX）"
            value={inviteCode}
            onChangeText={setInviteCode}
            autoCapitalize="characters"
            editable={!loading}
            leftIcon={{ name: 'key', type: 'ionicon', color: '#9CA3AF' }}
          />
        </View>

        {/* 参加ボタン */}
        <Button
          title="ファミリーに参加"
          onPress={handleJoinFamily}
          loading={loading}
          disabled={loading}
          containerStyle={{ marginBottom: 16 }}
          buttonStyle={{ backgroundColor: '#3B82F6', paddingVertical: 12 }}
          titleStyle={{ fontSize: 16, fontWeight: '600' }}
        />

        {/* 新規ファミリー作成へのリンク */}
        <Button
          title="新しいファミリーを作成"
          type="outline"
          onPress={handleBackToCreateFamily}
          disabled={loading}
          containerStyle={{ marginBottom: 16 }}
          buttonStyle={{ borderColor: '#3B82F6', paddingVertical: 12 }}
          titleStyle={{ color: '#3B82F6', fontSize: 16, fontWeight: '600' }}
        />
      </View>
    </ScrollView>
  );
}
