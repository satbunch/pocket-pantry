/**
 * 認証関連の型定義
 */

import type { Session, User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  email?: string;
}

export interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}
