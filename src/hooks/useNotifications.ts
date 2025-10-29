/**
 * 通知管理用のカスタムフック
 */
import { useCallback } from 'react';
import { scheduleExpiryNotification, cancelNotification } from '@/services/notifications/scheduler';
import {
  loadNotificationSettings,
  setNotificationEnabled,
  saveNotificationId,
  removeNotificationId,
  getNotificationId,
} from '@/services/localStorage/notificationSettings';
import type { Ingredient } from '@/types/ingredient';

export function useNotifications() {
  /**
   * 通知設定を読み込む
   */
  const loadSettings = useCallback(async () => {
    return await loadNotificationSettings();
  }, []);

  /**
   * 通知有効/無効を切り替え
   */
  const toggleNotifications = useCallback(async (isEnabled: boolean) => {
    await setNotificationEnabled(isEnabled);
  }, []);

  /**
   * 食材の賞味期限通知をスケジュール
   */
  const scheduleNotification = useCallback(async (ingredient: Ingredient) => {
    if (ingredient.isExpiryNotManaged || !ingredient.expiryDate) {
      return null;
    }

    try {
      const notificationId = await scheduleExpiryNotification(ingredient);
      if (notificationId) {
        await saveNotificationId(ingredient.id, notificationId);
        return notificationId;
      }
      return null;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  }, []);

  /**
   * 通知をキャンセル
   */
  const cancelExpiryNotification = useCallback(async (ingredientId: string) => {
    try {
      const notificationId = await getNotificationId(ingredientId);
      if (notificationId) {
        await cancelNotification(notificationId);
        await removeNotificationId(ingredientId);
      }
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }, []);

  return {
    loadSettings,
    toggleNotifications,
    scheduleNotification,
    cancelExpiryNotification,
  };
}
