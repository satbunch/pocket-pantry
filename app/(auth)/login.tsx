/**
 * ログイン画面
 * メール・パスワード認証
 */

import { useState } from 'react';
import { View, ScrollView, Alert, Text } from 'react-native';
import { router } from 'expo-router';
import { Button, Input } from '@rneui/themed';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)/inventory');
    } catch (error) {
      Alert.alert('ログインエラー', error instanceof Error ? error.message : 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="flex-grow">
      <View className="flex-1 justify-center px-6 py-12">
        {/* ロゴ・タイトル */}
        <View className="mb-8">
          <View className="h-16 w-16 rounded-full bg-blue-500 self-center mb-6" />
          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">Pocket Pantry</Text>
          <Text className="text-gray-600 text-center">食材管理アプリ</Text>
        </View>

        {/* ログインフォーム */}
        <View className="space-y-4 mb-6">
          <Input
            placeholder="メールアドレス"
            value={email}
            onChangeText={setEmail}
            inputMode="email"
            autoCapitalize="none"
            editable={!loading}
            leftIcon={{ name: 'mail', type: 'ionicon', color: '#9CA3AF' }}
          />
          <Input
            placeholder="パスワード"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            leftIcon={{ name: 'lock-closed', type: 'ionicon', color: '#9CA3AF' }}
          />
        </View>

        {/* ログインボタン */}
        <Button
          title="ログイン"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          containerStyle={{ marginBottom: 16 }}
          buttonStyle={{ backgroundColor: '#3B82F6', paddingVertical: 12 }}
          titleStyle={{ fontSize: 16, fontWeight: '600' }}
        />

        {/* サインアップリンク */}
        <View className="flex-row justify-center items-center">
          <Text className="text-gray-600 text-sm mr-2">アカウントをお持ちではありませんか？</Text>
          <Button
            type="clear"
            title="サインアップ"
            onPress={handleSignup}
            disabled={loading}
            titleStyle={{ color: '#3B82F6', fontSize: 14 }}
            containerStyle={{ paddingHorizontal: 0 }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
