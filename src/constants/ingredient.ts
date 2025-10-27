/**
 * 食材関連の定数定義
 */

export type PickerOption = { label: string; value: string };

/**
 * AsyncStorage用のキー名
 */
export const INGREDIENT_STORAGE_KEY = '@PocketPantry:ingredients';

/**
 * 保存場所オプション
 */
export const STORAGE_OPTIONS: PickerOption[] = [
  { label: '冷蔵', value: '冷蔵' },
  { label: '冷凍', value: '冷凍' },
  { label: '常温', value: '常温' },
  { label: '野菜室', value: '野菜室' },
];

/**
 * 数量単位オプション
 */
export const UNIT_OPTIONS: PickerOption[] = [
  { label: '個', value: '個' },
  { label: 'g', value: 'g' },
  { label: 'kg', value: 'kg' },
  { label: 'ml', value: 'ml' },
  { label: '本', value: '本' },
  { label: '袋', value: '袋' },
  { label: 'パック', value: 'パック' },
  { label: '枚', value: '枚' },
];
