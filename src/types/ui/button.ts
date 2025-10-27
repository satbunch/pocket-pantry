/**
 * Button コンポーネントの型定義
 */

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}
