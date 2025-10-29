/**
 * 食材登録フォームコンポーネント
 */
import { useState, memo } from 'react';
import {
  View,
  Text,
  Switch,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { THEME_COLORS } from '@/theme/colors';
import { STORAGE_OPTIONS, UNIT_OPTIONS, DEFAULT_INCREMENT_AMOUNTS } from '@/constants/ingredient';
import type { CreateIngredientInput, StorageCategory, UnitType } from '@/types/ingredient';

interface ButtonAreaProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const ButtonArea = memo(function ButtonArea({ isSubmitting, onCancel, onSubmit }: ButtonAreaProps) {
  return (
    <View style={{ marginTop: 24, flexDirection: 'row', justifyContent: 'flex-end' }}>
      <View style={{ marginRight: 12 }}>
        <Button title="キャンセル" onPress={onCancel} variant="secondary" disabled={isSubmitting} />
      </View>
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
  const [incrementAmount, setIncrementAmount] = useState(
    initialValues?.incrementAmount?.toString() ||
      (initialValues?.unit ? DEFAULT_INCREMENT_AMOUNTS[initialValues.unit]?.toString() || '1' : '1')
  );
  const [isExpiryManaged, setIsExpiryManaged] = useState(initialValues?.isExpiryManaged ?? true);
  const [expiryDate, setExpiryDate] = useState(initialValues?.expiryDate || '');
  const [memo, setMemo] = useState(initialValues?.memo || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

    if (!incrementAmount.trim()) {
      newErrors.incrementAmount = '増減量を入力してください';
    } else if (isNaN(Number(incrementAmount)) || Number(incrementAmount) <= 0) {
      newErrors.incrementAmount = '増減量は1以上の数値で入力してください';
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
        incrementAmount: Number(incrementAmount),
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

  const handleUnitChange = (selectedUnit: string) => {
    setUnit(selectedUnit);
    // 単位が変更された場合、デフォルトの増減量を自動設定
    const defaultAmount = DEFAULT_INCREMENT_AMOUNTS[selectedUnit] || 1;
    setIncrementAmount(defaultAmount.toString());
  };

  const handleFormTap = () => {
    Keyboard.dismiss();
  };

  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setExpiryDate(formattedDate);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }} keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={handleFormTap}>
          <View className="px-4">
            {/* 基本情報セクション */}
            <View>
              <Text className="text-sm text-gray-800 mt-2 mb-2">基本情報</Text>

              <View style={{ marginBottom: 10 }}>
                <Input label="食材名" value={name} onChangeText={setName} placeholder="例: 牛乳" error={errors.name} />
              </View>

              <View>
                <Dropdown
                  style={{
                    borderWidth: 1,
                    borderColor: errors.storageCategory ? THEME_COLORS.ui.borderError : THEME_COLORS.ui.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    height: 56,
                    backgroundColor: THEME_COLORS.ui.background,
                  }}
                  placeholderStyle={{
                    fontSize: 16,
                    color: THEME_COLORS.ui.textMuted,
                  }}
                  selectedTextStyle={{
                    fontSize: 16,
                    color: THEME_COLORS.ui.textPrimary,
                    fontWeight: '500',
                  }}
                  inputSearchStyle={{
                    height: 40,
                    fontSize: 16,
                  }}
                  data={STORAGE_OPTIONS.map(option => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  search={false}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="保存場所を選択"
                  value={storageCategory}
                  onChange={item => setStorageCategory(item.value)}
                />
              </View>
            </View>

            {/* 数量・単位セクション */}
            <View style={{ flexDirection: 'row' }}>
              {/* 数量 */}
              <View className="flex-1 rounded-xl p-5 shadow-sm" style={{ marginRight: 24 }}>
                <Text className="text-sm text-gray-800 mb-2">数量</Text>
                <Input
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="1"
                  keyboardType="numeric"
                  error={errors.quantity}
                />
              </View>

              {/* 単位 */}
              <View className="flex-1 rounded-xl p-5 shadow-sm">
                <Text className="text-sm text-gray-800 mb-2">単位</Text>
                <Dropdown
                  style={{
                    borderWidth: 1,
                    borderColor: errors.unit ? THEME_COLORS.ui.borderError : THEME_COLORS.ui.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    height: 56,
                    backgroundColor: THEME_COLORS.ui.background,
                  }}
                  placeholderStyle={{
                    fontSize: 16,
                    color: THEME_COLORS.ui.textMuted,
                  }}
                  selectedTextStyle={{
                    fontSize: 16,
                    color: THEME_COLORS.ui.textPrimary,
                    fontWeight: '500',
                  }}
                  inputSearchStyle={{
                    height: 40,
                    fontSize: 16,
                  }}
                  data={UNIT_OPTIONS.map(option => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  search={false}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="単位を選択"
                  value={unit}
                  onChange={item => handleUnitChange(item.value)}
                />
              </View>
            </View>

            {/* 増減量セクション */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <View style={{ width: '48%' }} className="rounded-xl p-5 shadow-sm">
                <Text className="text-sm text-gray-800 mb-2">増減量</Text>
                <Input
                  value={incrementAmount}
                  onChangeText={setIncrementAmount}
                  placeholder="1"
                  keyboardType="numeric"
                  error={errors.incrementAmount}
                />
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
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: errors.expiryDate ? THEME_COLORS.ui.borderError : THEME_COLORS.ui.border,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      height: 56,
                      backgroundColor: THEME_COLORS.ui.background,
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: expiryDate ? THEME_COLORS.ui.textPrimary : THEME_COLORS.ui.textMuted,
                        fontWeight: '500',
                      }}
                    >
                      {expiryDate || '賞味期限を選択'}
                    </Text>
                  </TouchableOpacity>
                  {errors.expiryDate && (
                    <Text style={{ color: THEME_COLORS.status.expired, fontSize: 12, marginTop: 4 }}>
                      {errors.expiryDate}
                    </Text>
                  )}

                  {showDatePicker && (
                    <DateTimePicker
                      value={expiryDate ? new Date(expiryDate) : new Date()}
                      mode="date"
                      display={Platform.OS === 'android' ? 'calendar' : 'inline'}
                      onChange={handleDateChange}
                    />
                  )}

                  {Platform.OS === 'ios' && showDatePicker && (
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                      <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                        <Text style={{ color: THEME_COLORS.ui.buttonPrimary, fontSize: 16, fontWeight: '500' }}>
                          完了
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
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
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}
