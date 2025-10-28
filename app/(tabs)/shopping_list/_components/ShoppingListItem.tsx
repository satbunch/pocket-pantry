/**
 * 買い物リストアイテムコンポーネント（統合）
 */
import { useState } from 'react';
import type { ShoppingListItem } from '@/types/shopping';
import { ShoppingListItemView } from './ShoppingListItemView';
import { ShoppingListItemEdit } from './ShoppingListItemEdit';

interface ShoppingListItemProps {
  item: ShoppingListItem;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: { name?: string; quantity?: number }) => void;
  onToggleStatus: (id: string) => void;
}

export function ShoppingListItemComponent({ item, onDelete, onUpdate, onToggleStatus }: ShoppingListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQuantity, setEditQuantity] = useState(item.quantity.toString());

  const handleSave = () => {
    const updates: { name?: string; quantity?: number } = {};
    if (editName !== item.name) {
      updates.name = editName;
    }
    if (editQuantity !== item.quantity.toString()) {
      updates.quantity = Number(editQuantity);
    }
    if (Object.keys(updates).length > 0) {
      onUpdate(item.id, updates);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditQuantity(item.quantity.toString());
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return isEditing ? (
    <ShoppingListItemEdit
      name={editName}
      quantity={editQuantity}
      onNameChange={setEditName}
      onQuantityChange={setEditQuantity}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  ) : (
    <ShoppingListItemView item={item} onDelete={onDelete} onEdit={handleEdit} onToggleStatus={onToggleStatus} />
  );
}
