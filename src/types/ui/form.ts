/**
 * FormField コンポーネントの型定義
 */
import React from 'react';

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}
