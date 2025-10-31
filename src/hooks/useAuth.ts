/**
 * 認証フック
 * AuthContextを使用して認証状態にアクセス
 */

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import type { AuthContextType } from '@/types/auth';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
