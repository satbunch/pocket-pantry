/**
 * 食材登録フォームコンポーネント
 */
import { useState } from 'react';
import { View, Text, Switch, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Input } from '@/components/ui/Input';
// import { Picker, type PickerOption } from '@/components/ui/Picker';
import { Picker } from '@react-native-picker/picker';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { STORAGE_OPTIONS, UNIT_OPTIONS } from '@/constants/ingredient';
import type { CreateIngredientInput, StorageCategory, UnitType } from '@/types/ingredient';

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
  const [pickerVisible, setPickerVisible] = useState(false);

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
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-5 gap-5">
          {/* 基本情報セクション */}
          <View className="bg-white rounded-xl p-5 shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">基本情報</Text>

            <View className="mb-5">
              <FormField error={errors.name} required>
                <Input label="食材名" value={name} onChangeText={setName} placeholder="例: 牛乳" error={errors.name} />
              </FormField>
            </View>

            <View>
              <FormField error={errors.storageCategory} required>
                <TouchableOpacity
                  onPress={() => setPickerVisible(true)}
                  style={{
                    padding: 12,
                    borderWidth: 1,
                    borderColor: errors.storageCategory ? '#EF4444' : '#D1D5DB',
                    borderRadius: 8,
                  }}
                >
                  <Text>
                    {storageCategory
                      ? STORAGE_OPTIONS.find(option => option.value === storageCategory)?.label
                      : '保存場所を選択'}
                  </Text>
                </TouchableOpacity>
                <Modal visible={pickerVisible} transparent animationType="slide">
                  <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <View style={{ backgroundColor: 'white' }}>
                      <Picker
                        selectedValue={storageCategory}
                        onValueChange={itemValue => {
                          setStorageCategory(itemValue);
                          setPickerVisible(false);
                        }}
                      >
                        {STORAGE_OPTIONS.map(option => (
                          <Picker.Item key={option.value} label={option.label} value={option.value} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </Modal>
              </FormField>
            </View>
          </View>

          {/* 数量セクション */}
          <View className="bg-white rounded-xl p-5 shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">数量</Text>

            <View className="flex-row gap-4">
              <View className="flex-1">
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

              <View className="flex-1">
                <FormField error={errors.unit} required>
                  <Picker selectedValue={unit} onValueChange={itemValue => setUnit(itemValue)}>
                    <Picker.Item label="単位を選択" />
                    {UNIT_OPTIONS.map(option => (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                </FormField>
              </View>
            </View>
          </View>

          {/* 賞味期限セクション */}
          <View className="bg-white rounded-xl p-5 shadow-sm">
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
          <View className="bg-white rounded-xl p-5 shadow-sm">
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
          <View className="flex-row gap-3">
            <Button
              title="キャンセル"
              onPress={onCancel}
              variant="secondary"
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button
              title={isSubmitting ? '登録中...' : '登録'}
              onPress={handleSubmit}
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
