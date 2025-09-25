import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../../src/contexts';
import { Button } from '../../../src/components/ui/Button';

export default function ShoppingScreen() {
  const { session } = useAuth();

  return (
    <View style={styles.container}>
      {!session && (
        <View style={styles.guestBanner}>
          <Text style={styles.guestBannerText}>🚀 ゲストモードで利用中 | 買い物リスト機能</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.emoji}>🛒</Text>
        <Text style={styles.title}>買い物リスト</Text>
        <Text style={styles.subtitle}>
          食材の買い物リストを管理できます{'\n'}
          （次回実装予定）
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="+ 買い物リストを作成"
            onPress={() => console.log('買い物リスト作成（実装予定）')}
            variant="primary"
          />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
});
