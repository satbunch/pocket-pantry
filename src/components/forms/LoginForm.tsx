import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('メールアドレスを入力してください');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('正しいメールアドレスを入力してください');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('パスワードを入力してください');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('パスワードは６文字以上で入力してください');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // ログイン処理
  const handleLogin = async () => {
    // バリデーション
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      setLoading(true);

      const { error } = await signIn(email, password);

      if (error) {
        // Supabaseエラーを日本語でユーザーフレンドリーに登録
        let errorMessage = 'ログインに失敗しました';

        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'メールアドレスまたはパスワードが間違っています';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'メールアドレスの確認が完了していません';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'ログイン試行回数が上限に達しました。しばらく待ってから再試行してください';
        }

        Alert.alert('ログインエラー', errorMessage);
      } else {
        // ログイン成功
        onLoginSuccess?.();
      }
    } catch {
      Alert.alert('エラー', '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = () => {
    handleLogin();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ログイン</Text>
        <Text style={styles.subtitle}>PocketPantryにログインして、食材管理を始めましょう</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="メールアドレス"
          placeholder="example@email.com"
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (emailError) validateEmail(text);
          }}
          error={emailError}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <Input
          label="パスワード"
          placeholder="パスワードを入力"
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (passwordError) validatePassword(text);
          }}
          error={passwordError}
          secureTextEntry
          autoComplete="current-password"
          onSubmitEditing={handlePasswordSubmit}
          returnKeyType="done"
        />

        <Button
          title={loading ? 'ログイン中...' : 'ログイン'}
          onPress={handleLogin}
          loading={loading}
          disabled={!email || !password}
          style={styles.loginButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  loginButton: {
    marginTop: 8,
  },
});
