/**
 * 認証関連の型定義
 */

import type { Session, User } from '@supabase/supabase-js';
import type { Profile, Family } from './database';

export interface AuthUser extends User {
  email?: string;
}

export interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  profile: Profile | null; // Phase 2: ユーザープロフィール
  family: Family | null; // Phase 2: 所属ファミリー
  loading: boolean;
  signUp: (email: string, password: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}
