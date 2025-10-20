/**
 * ピッカーコンポーネント
 */
import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';

export interface PickerOption {
  label: string;
  value: string;
}

export interface PickerProps {
  label: string;
  value: string;
  options: PickerOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export function Picker({
  label,
  value,
  options,
  onValueChange,
  placeholder = '選択してください',
  error,
  className = '',
}: PickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View className={`mb-4 ${className}`}>
      <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className={`border rounded-lg px-4 py-3 ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        <Text className={selectedOption ? 'text-black' : 'text-gray-400'}>{displayText}</Text>
      </TouchableOpacity>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}

      <Modal visible={isOpen} transparent animationType="slide">
        <TouchableOpacity className="flex-1 bg-black/50 justify-end" activeOpacity={1} onPress={() => setIsOpen(false)}>
          <View className="bg-white rounded-t-3xl max-h-96">
            <View className="border-b border-gray-200 p-4">
              <Text className="text-lg font-semibold text-center">{label}</Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-4 border-b border-gray-100 ${item.value === value ? 'bg-blue-50' : ''}`}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    className={`text-base ${item.value === value ? 'text-blue-600 font-semibold' : 'text-gray-800'}`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
