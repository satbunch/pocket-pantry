/**
 * Units マスターテーブル操作サービス
 * 単位情報の読み込み（単位はマスターデータなので読み込みのみ）
 */

import { supabase } from './client';
import type { Unit } from '@/types/database';

/**
 * 全ての単位を取得
 */
export const getAllUnits = async (): Promise<Unit[]> => {
  const { data, error } = await supabase.from('unit_master').select('*').order('created_at', {
    ascending: true,
  });

  if (error) {
    throw new Error(`Failed to fetch units: ${error.message}`);
  }

  return (data as Unit[]) || [];
};

/**
 * 単位IDから単位情報を取得
 * @param unitId - ユニットID
 */
export const getUnitById = async (unitId: string): Promise<Unit | null> => {
  const { data, error } = await supabase.from('unit_master').select('*').eq('id', unitId).single();

  if (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch unit: ${error.message}`);
  }

  return data as Unit;
};

/**
 * 単位値から単位情報を取得
 * @param value - 単位値（piece, g, ml など）
 */
export const getUnitByValue = async (value: string): Promise<Unit | null> => {
  const { data, error } = await supabase.from('unit_master').select('*').eq('value', value).single();

  if (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch unit by value: ${error.message}`);
  }

  return data as Unit;
};
