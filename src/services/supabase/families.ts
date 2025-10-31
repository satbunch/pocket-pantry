/**
 * Families テーブル操作サービス
 * ファミリーグループの CRUD 操作と招待コード処理
 */

import { supabase } from './client';
import { createProfile } from './profiles';
import type { Family, Profile } from '@/types/database';

/**
 * ファミリーを作成
 * @param name - ファミリー名
 * @param userId - 作成者のユーザーID
 * @param userName - 作成者の表示名
 * @returns 作成されたファミリー情報とプロフィール情報
 */
export const createFamily = async (
  name: string,
  userId: string,
  userName: string
): Promise<{ family: Family; profile: Profile }> => {
  // 1. ファミリーを作成
  const { data: familyData, error: familyError } = await supabase
    .from('families')
    .insert([
      {
        name,
        avatar_url: null,
        invite_code: generateInviteCode(),
      },
    ])
    .select()
    .single();

  if (familyError) {
    throw new Error(`Failed to create family: ${familyError.message}`);
  }

  const family = familyData as Family;

  // 2. プロフィールを作成
  const profile = await createProfile(userId, family.id, userName);

  return { family, profile };
};

/**
 * ファミリー情報を取得
 * @param familyId - ファミリーID
 */
export const getFamily = async (familyId: string): Promise<Family | null> => {
  const { data, error } = await supabase.from('families').select('*').eq('id', familyId).single();

  if (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch family: ${error.message}`);
  }

  return data as Family;
};

/**
 * 招待コードからファミリーを検索
 * @param inviteCode - 招待コード
 */
export const getFamilyByInviteCode = async (inviteCode: string): Promise<Family | null> => {
  const { data, error } = await supabase.from('families').select('*').eq('invite_code', inviteCode).single();

  if (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch family by invite code: ${error.message}`);
  }

  return data as Family;
};

/**
 * ファミリーに参加（招待コード経由）
 * @param inviteCode - 招待コード
 * @param userId - ユーザーID
 * @param userName - ユーザー表示名
 */
export const joinFamilyByInviteCode = async (
  inviteCode: string,
  userId: string,
  userName: string
): Promise<{ family: Family; profile: Profile }> => {
  // 1. 招待コードからファミリーを検索
  const family = await getFamilyByInviteCode(inviteCode);
  if (!family) {
    throw new Error('Invalid invite code');
  }

  // 2. プロフィールを作成
  const profile = await createProfile(userId, family.id, userName);

  return { family, profile };
};

/**
 * ファミリー情報を更新
 * @param familyId - ファミリーID
 * @param updates - 更新内容（name, avatar_url など）
 */
export const updateFamily = async (
  familyId: string,
  updates: Partial<Omit<Family, 'id' | 'created_at'>>
): Promise<Family> => {
  const { data, error } = await supabase.from('families').update(updates).eq('id', familyId).select().single();

  if (error) {
    throw new Error(`Failed to update family: ${error.message}`);
  }

  return data as Family;
};

/**
 * 招待コードを更新（新規招待コードを生成）
 * @param familyId - ファミリーID
 */
export const regenerateInviteCode = async (familyId: string): Promise<Family> => {
  const { data, error } = await supabase
    .from('families')
    .update({ invite_code: generateInviteCode() })
    .eq('id', familyId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to regenerate invite code: ${error.message}`);
  }

  return data as Family;
};

/**
 * 招待コードを生成
 * フォーマット: XXXX-XXXX-XXXX（大文字英数字）
 */
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) {
      code += '-';
    }
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}
