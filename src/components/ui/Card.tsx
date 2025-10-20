/**
 * カードコンポーネント (React Native Paper)
 */
import type { ReactNode } from 'react';
import { Card as PaperCard } from 'react-native-paper';

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return <PaperCard className={className}>{children}</PaperCard>;
}
