/**
 * サインアップ画面
 * メール・パスワード登録とユーザー名設定
 */

import { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Input, Text } from '@rneui/themed';
import { useAuth } from '@/hooks/useAuth';
import { createFamily } from '@/services/supabase/families';
import { migrateGuestDataToSupabase } from '@/services/supabase/migration';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();

  const handleSignup = async () => {
    // バリデーション
    if (!email || !password || !confirmPassword || !userName) {
      Alert.alert('エラー', 'すべての項目を入力してください');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('エラー', 'パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      Alert.alert('エラー', 'パスワードは6文字以上である必要があります');
      return;
    }

    setLoading(true);
    try {
      // 1. ユーザー登録
      await signUp(email, password);

      // 2. ユーザーIDを取得（サインアップ直後は user が設定される）
      if (!user) {
        throw new Error('ユーザーIDを取得できません');
      }

      // 3. ファミリーを作成
      const { family } = await createFamily('My Family', user.id, userName);

      // 4. ゲストデータを移行
      try {
        const result = await migrateGuestDataToSupabase(family.id);
        console.log(`Migrated ${result.ingredientCount} ingredients and ${result.shoppingListCount} shopping items`);
      } catch (migrationError) {
        // 移行エラーは通知するが、サインアップ自体は成功させる
        console.warn('Guest data migration failed:', migrationError);
      }

      // 5. ホーム画面へ遷移
      router.replace('/(tabs)/inventory');
    } catch (error) {
      Alert.alert('サインアップエラー', error instanceof Error ? error.message : 'サインアップに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="flex-grow">
      <View className="flex-1 justify-center px-6 py-12">
        {/* タイトル */}
        <View className="mb-8">
          <Text h2 className="text-center font-bold text-gray-900 mb-2">
            アカウント作成
          </Text>
          <Text className="text-center text-gray-600">メールアドレスで登録</Text>
        </View>

        {/* フォーム */}
        <View className="space-y-4 mb-6">
          <Input
            placeholder="ユーザー名"
            value={userName}
            onChangeText={setUserName}
            editable={!loading}
            leftIcon={{ name: 'person', type: 'ionicon', color: '#9CA3AF' }}
          />
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
            placeholder="パスワード（6文字以上）"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            leftIcon={{ name: 'lock-closed', type: 'ionicon', color: '#9CA3AF' }}
          />
          <Input
            placeholder="パスワード（確認）"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
            leftIcon={{ name: 'lock-closed', type: 'ionicon', color: '#9CA3AF' }}
          />
        </View>

        {/* サインアップボタン */}
        <Button
          title="アカウントを作成"
          onPress={handleSignup}
          loading={loading}
          disabled={loading}
          containerStyle={{ marginBottom: 16 }}
          buttonStyle={{ backgroundColor: '#3B82F6', paddingVertical: 12 }}
          titleStyle={{ fontSize: 16, fontWeight: '600' }}
        />

        {/* ログイン画面へのリンク */}
        <View className="flex-row justify-center items-center">
          <Text className="text-gray-600 text-sm mr-2">すでにアカウントをお持ちですか？</Text>
          <Button
            type="clear"
            title="ログイン"
            onPress={handleBackToLogin}
            disabled={loading}
            titleStyle={{ color: '#3B82F6', fontSize: 14 }}
            containerStyle={{ paddingHorizontal: 0 }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
