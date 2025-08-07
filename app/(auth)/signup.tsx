import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LoginForm } from '../../src/components/forms/LoginForm';

export default function SignupScreen() {
  const handleLoginSuccess = () => {};
  return (
    <View style={styles.container}>
      {/* アプリロゴ・タイトル部分 */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>PocketPantry</Text>
        <Text style={styles.appSubtitle}>家族みんなで食材管理</Text>
      </View>

      {/* ログインフォーム */}
      <View style={styles.formContainer}>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1D1D1F',
    marginBottom: 8,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  signupLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  signupLinkText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});
