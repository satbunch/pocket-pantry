/**
 * 食材登録フォームコンポーネント
 */
import { useState, memo } from 'react';
import { View, Text, Switch } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { STORAGE_OPTIONS, UNIT_OPTIONS } from '@/constants/ingredient';
import type { CreateIngredientInput, StorageCategory, UnitType } from '@/types/ingredient';

interface ButtonAreaProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const ButtonArea = memo(function ButtonArea({ isSubmitting, onCancel, onSubmit }: ButtonAreaProps) {
  return (
    <View style={{ marginTop: 24, flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
      <Button title="キャンセル" onPress={onCancel} variant="secondary" disabled={isSubmitting} />
      <Button
        title={isSubmitting ? '登録中...' : '登録'}
        onPress={onSubmit}
        variant="primary"
        disabled={isSubmitting}
      />
    </View>
  );
});

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
  const [storageCategoryDropdownOpen, setStorageCategoryDropdownOpen] = useState(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);

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
    <View className="flex-1 bg-gray-50">
      <View className="gap-5 px-4 py-5">
        {/* 基本情報セクション */}
        <View className="rounded-xl p-5 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">基本情報</Text>

          <View className="mb-5">
            <FormField error={errors.name} required>
              <Input label="食材名" value={name} onChangeText={setName} placeholder="例: 牛乳" error={errors.name} />
            </FormField>
          </View>

          <View>
            <FormField error={errors.storageCategory} required>
              <DropDownPicker
                open={storageCategoryDropdownOpen}
                setOpen={setStorageCategoryDropdownOpen}
                value={storageCategory}
                setValue={setStorageCategory}
                items={STORAGE_OPTIONS.map(option => ({
                  label: option.label,
                  value: option.value,
                }))}
                placeholder="保存場所を選択"
                containerStyle={{ marginBottom: 0, zIndex: 1000, height: 56 }}
                style={{
                  borderColor: errors.storageCategory ? '#EF4444' : '#D1D5DB',
                  height: 56,
                }}
                dropDownContainerStyle={{ zIndex: 1000 }}
              />
            </FormField>
          </View>
        </View>

        {/* 数量・単位セクション */}
        <View style={{ flexDirection: 'row', gap: 24 }}>
          {/* 数量 */}
          <View className="flex-1 rounded-xl p-5 shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">数量</Text>
            <FormField error={errors.quantity} required>
              <Input
                label="数量"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="1"
                keyboardType="numeric"
                error={errors.quantity}
              />
            </FormField>
          </View>

          {/* 単位 */}
          <View className="flex-1 rounded-xl p-5 shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">単位</Text>
            <FormField error={errors.unit} required>
              <DropDownPicker
                open={unitDropdownOpen}
                setOpen={setUnitDropdownOpen}
                value={unit}
                setValue={setUnit}
                items={UNIT_OPTIONS.map(option => ({
                  label: option.label,
                  value: option.value,
                }))}
                placeholder="単位を選択"
                containerStyle={{ marginBottom: 0, zIndex: 999, height: 56 }}
                style={{
                  borderColor: errors.unit ? '#EF4444' : '#D1D5DB',
                  height: 56,
                }}
                dropDownContainerStyle={{ zIndex: 999 }}
              />
            </FormField>
          </View>
        </View>

        {/* 賞味期限セクション */}
        <View
          style={{
            borderRadius: 12,
            paddingVertical: 20,
            marginTop: 8,
          }}
          className="shadow-sm"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">賞味期限</Text>
            <View className="flex-row items-center gap-3">
              <Text className="text-sm text-gray-600">{isExpiryManaged ? '管理する' : '管理しない'}</Text>
              <Switch value={isExpiryManaged} onValueChange={setIsExpiryManaged} />
            </View>
          </View>

          {isExpiryManaged && (
            <View>
              <Input
                label="賞味期限"
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="2025-12-31"
                error={errors.expiryDate}
              />
              <Text className="text-xs text-gray-500 mt-1">形式: YYYY-MM-DD</Text>
            </View>
          )}

          {!isExpiryManaged && <Text className="text-sm text-gray-500 italic">賞味期限は記録されません</Text>}
        </View>

        {/* メモセクション */}
        <View className="rounded-xl p-5 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-1">メモ</Text>
          <Text className="text-xs text-gray-500 mb-4">任意</Text>

          <Input
            label="メモ"
            value={memo}
            onChangeText={setMemo}
            placeholder="保存に関するメモなど"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* ボタンエリア */}
        <ButtonArea isSubmitting={isSubmitting} onCancel={onCancel} onSubmit={handleSubmit} />
      </View>
    </View>
  );
}
