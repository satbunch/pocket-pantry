/**
 * カードコンポーネント
 */
import type { ReactNode } from 'react';
import { View } from 'react-native';

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return <View className={`bg-white rounded-lg p-4 my-2 shadow-sm ${className}`}>{children}</View>;
}
