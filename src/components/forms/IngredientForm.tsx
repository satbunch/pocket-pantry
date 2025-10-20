/**
 * 食材登録フォームコンポーネント
 */
import { useState } from 'react';
import { View, Text, Switch, ScrollView } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Picker, type PickerOption } from '@/components/ui/Picker';
import { Button } from '@/components/ui/Button';
import type { CreateIngredientInput, StorageCategory, UnitType } from '@/types/ingredient';

const STORAGE_OPTIONS: PickerOption[] = [
  { label: '冷蔵', value: '冷蔵' },
  { label: '冷凍', value: '冷凍' },
  { label: '常温', value: '常温' },
  { label: '野菜室', value: '野菜室' },
];

const UNIT_OPTIONS: PickerOption[] = [
  { label: '個', value: '個' },
  { label: 'g', value: 'g' },
  { label: 'ml', value: 'ml' },
  { label: '本', value: '本' },
  { label: '袋', value: '袋' },
];

export interface IngredientFormProps {
  onSubmit: (input: CreateIngredientInput) => Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<CreateIngredientInput>;
}

export function IngredientForm({ onSubmit, onCancel, initialValues }: IngredientFormProps) {
  const [name, setName] = useState(initialValues?.name || '');
  const [storageCategory, setStorageCategory] = useState<string>(initialValues?.storageCategory || '');
  const [quantity, setQuantity] = useState(initialValues?.quantity?.toString() || '');
  const [unit, setUnit] = useState<string>(initialValues?.unit || '');
  const [isExpiryManaged, setIsExpiryManaged] = useState(initialValues?.isExpiryManaged ?? true);
  const [expiryDate, setExpiryDate] = useState(initialValues?.expiryDate || '');
  const [memo, setMemo] = useState(initialValues?.memo || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = '食材名を入力してください';
    }

    if (!storageCategory) {
      newErrors.storageCategory = '保存場所を選択してください';
    }

    if (!quantity.trim()) {
      newErrors.quantity = '数量を入力してください';
    } else if (isNaN(Number(quantity)) || Number(quantity) < 0) {
      newErrors.quantity = '数量は0以上の数値で入力してください';
    }

    if (!unit) {
      newErrors.unit = '単位を選択してください';
    }

    if (isExpiryManaged && expiryDate) {
      const date = new Date(expiryDate);
      if (isNaN(date.getTime())) {
        newErrors.expiryDate = '正しい日付形式で入力してください（例: 2025-12-31）';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const input: CreateIngredientInput = {
        name: name.trim(),
        storageCategory: storageCategory as StorageCategory,
        quantity: Number(quantity),
        unit: unit as UnitType,
        isExpiryManaged,
        expiryDate: isExpiryManaged && expiryDate ? expiryDate : null,
        memo: memo.trim(),
      };

      await onSubmit(input);
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Input label="食材名" value={name} onChangeText={setName} placeholder="例: 牛乳" error={errors.name} />

        <Picker
          label="保存場所"
          value={storageCategory}
          options={STORAGE_OPTIONS}
          onValueChange={setStorageCategory}
          error={errors.storageCategory}
        />

        <View className="flex-row gap-4">
          <Input
            label="数量"
            value={quantity}
            onChangeText={setQuantity}
            placeholder="1"
            keyboardType="numeric"
            error={errors.quantity}
            className="flex-1"
          />

          <Picker
            label="単位"
            value={unit}
            options={UNIT_OPTIONS}
            onValueChange={setUnit}
            error={errors.unit}
            className="flex-1"
          />
        </View>

        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-semibold text-gray-700">賞味期限を管理</Text>
            <Switch value={isExpiryManaged} onValueChange={setIsExpiryManaged} />
          </View>
        </View>

        {isExpiryManaged && (
          <Input
            label="賞味期限"
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholder="2025-12-31"
            error={errors.expiryDate}
          />
        )}

        <Input
          label="メモ（任意）"
          value={memo}
          onChangeText={setMemo}
          placeholder="保存に関するメモなど"
          multiline
          numberOfLines={3}
        />

        <View className="flex-row gap-3 mt-6">
          <Button title="キャンセル" onPress={onCancel} variant="secondary" className="flex-1" />
          <Button title="登録" onPress={handleSubmit} variant="primary" disabled={isSubmitting} className="flex-1" />
        </View>
      </View>
    </ScrollView>
  );
}
