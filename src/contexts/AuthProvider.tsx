/**
 * 認証プロバイダー
 * Supabaseのセッション管理とユーザー認証を処理
 * Phase 2: Profile・Family情報の管理も担当
 */

import React, { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase/client';
import { AuthContext } from './authContext';
import type { AuthContextType } from '@/types/auth';
import type { Profile, Family } from '@/types/database';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);

  // セッション変更を監視 + Profile・Family取得
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Profile情報を取得
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (profileError && (profileError as any).code !== 'PGRST116') {
            // PGRST116: レコード未検出（許容可）
            console.error('Profile fetch error:', profileError);
          }

          if (profileData) {
            setProfile(profileData as Profile);

            // Family情報を取得
            const { data: familyData, error: familyError } = await supabase
              .from('families')
              .select('*')
              .eq('id', profileData.family_id)
              .single();

            if (familyError) {
              console.error('Family fetch error:', familyError);
            }

            if (familyData) {
              setFamily(familyData as Family);
            }
          } else {
            setProfile(null);
            setFamily(null);
          }
        } catch (error) {
          console.error('Error fetching profile/family:', error);
          setProfile(null);
          setFamily(null);
        }
      } else {
        setProfile(null);
        setFamily(null);
      }

      setLoading(false);
    });

    // 初期セッション取得
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (profileError && (profileError as any).code !== 'PGRST116') {
            console.error('Profile fetch error:', profileError);
          }

          if (profileData) {
            setProfile(profileData as Profile);

            const { data: familyData, error: familyError } = await supabase
              .from('families')
              .select('*')
              .eq('id', profileData.family_id)
              .single();

            if (familyError) {
              console.error('Family fetch error:', familyError);
            }

            if (familyData) {
              setFamily(familyData as Family);
            }
          } else {
            setProfile(null);
            setFamily(null);
          }
        } catch (error) {
          console.error('Error fetching profile/family:', error);
          setProfile(null);
          setFamily(null);
        }
      }

      setLoading(false);
    };

    getSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    // サインアウト時にローカル状態もリセット
    setProfile(null);
    setFamily(null);
  };

  const value: AuthContextType = {
    session,
    user,
    profile,
    family,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
