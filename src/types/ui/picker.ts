/**
 * Picker コンポーネントの型定義
 */

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
