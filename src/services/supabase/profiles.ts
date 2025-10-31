/**
 * Profiles テーブル操作サービス
 * ユーザープロフィール情報の CRUD 操作
 */

import { supabase } from './client';
import type { Profile } from '@/types/database';

/**
 * プロフィール情報を作成
 * @param userId - Supabase Auth user ID
 * @param familyId - 所属ファミリーID
 * @param name - ユーザー表示名
 */
export const createProfile = async (userId: string, familyId: string, name: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        family_id: familyId,
        name,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create profile: ${error.message}`);
  }

  return data as Profile;
};

/**
 * プロフィール情報を取得
 * @param userId - Supabase Auth user ID
 */
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

  if (error) {
    // PGRST116: レコード未検出（許容可）
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return data as Profile;
};

/**
 * プロフィール情報を更新
 * @param userId - Supabase Auth user ID
 * @param updates - 更新内容（name など）
 */
export const updateProfile = async (
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'created_at'>>
): Promise<Profile> => {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return data as Profile;
};

/**
 * プロフィール情報を削除
 * @param userId - Supabase Auth user ID
 */
export const deleteProfile = async (userId: string): Promise<void> => {
  const { error } = await supabase.from('profiles').delete().eq('id', userId);

  if (error) {
    throw new Error(`Failed to delete profile: ${error.message}`);
  }
};
