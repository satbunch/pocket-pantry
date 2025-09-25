import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../../src/contexts';
import { Button } from '../../../src/components/ui/Button';
import { LocalStorage } from '../../../src/services/localStorage';

export default function SettingsScreen() {
  const { session, signOut } = useAuth();

  // データクリア
  const handleClearData = () => {
    Alert.alert('データクリア', 'すべてのローカルデータを削除しますか？この操作は取り消せません。', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          try {
            await LocalStorage.clear();
            Alert.alert('完了', 'データをクリアしました');
          } catch (error) {
            console.error('Failed to clear data:', error);
            Alert.alert('エラー', 'データクリアに失敗しました');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {!session && (
        <View style={styles.guestBanner}>
          <Text style={styles.guestBannerText}>🚀 ゲストモードで利用中</Text>
        </View>
      )}

      <View style={styles.content}>
        {/* ユーザー状態 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アカウント</Text>
          {session ? (
            <View style={styles.userInfo}>
              <Text style={styles.userEmail}>{session.user.email}</Text>
              <Text style={styles.userStatus}>✅ ログイン済み</Text>
            </View>
          ) : (
            <View style={styles.guestInfo}>
              <Text style={styles.guestText}>👤 ゲストモードで利用中</Text>
              <Text style={styles.guestSubtext}>ログインすると家族とデータを共有できます</Text>
            </View>
          )}
        </View>

        {/* アクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アクション</Text>

          {!session ? (
            <View style={styles.actionButtons}>
              <Button title="ログイン / 新規登録" onPress={() => router.push('/(auth)/login')} variant="primary" />
              <Text style={styles.actionHint}>💡 家族共有・データバックアップが利用できます</Text>
            </View>
          ) : (
            <View style={styles.actionButtons}>
              <Button title="ログアウト" onPress={signOut} variant="outline" />
            </View>
          )}
        </View>

        {/* データ管理 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>データ管理</Text>
          <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
            <Text style={styles.dangerButtonText}>🗑️ すべてのデータをクリア</Text>
          </TouchableOpacity>
          <Text style={styles.dangerHint}>⚠️ この操作は取り消せません</Text>
        </View>

        {/* アプリ情報 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アプリ情報</Text>
          <Text style={styles.appInfo}>PocketPantry v1.0.0</Text>
          <Text style={styles.appInfo}>ローカルファースト食材管理アプリ</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  guestBanner: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  guestBannerText: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'flex-start',
  },
  userEmail: {
    fontSize: 16,
    color: '#1D1D1F',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  guestInfo: {
    alignItems: 'flex-start',
  },
  guestText: {
    fontSize: 16,
    color: '#1D1D1F',
    marginBottom: 4,
  },
  guestSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
  },
  actionHint: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dangerButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFE5E5',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  dangerButtonText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    fontWeight: '500',
  },
  dangerHint: {
    fontSize: 12,
    color: '#FF5722',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  appInfo: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
});
