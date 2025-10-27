/**
 * 通知スケジューリングサービス
 * 賞味期限の通知をスケジュールする
 */
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import type { Ingredient } from '@/types/ingredient';

/**
 * 通知ハンドラーを設定
 */
export function setupNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * 食材の賞味期限通知をスケジュール
 */
export async function scheduleExpiryNotification(ingredient: Ingredient): Promise<string | null> {
  if (!ingredient.isExpiryManaged || !ingredient.expiryDate) {
    return null;
  }

  try {
    const expiryDate = new Date(ingredient.expiryDate);
    const notificationDate = new Date(expiryDate);
    notificationDate.setHours(8, 0, 0, 0); // 朝8時に通知

    // 過去の日付の場合はスケジュールしない
    const now = new Date();
    if (notificationDate <= now) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '賞味期限のお知らせ',
        body: `${ingredient.name} が ${ingredient.expiryDate} に賞味期限を迎えます`,
        data: {
          ingredientId: ingredient.id,
          ingredientName: ingredient.name,
          expiryDate: ingredient.expiryDate,
        },
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: notificationDate,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
}

/**
 * 通知をキャンセル
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.dismissNotificationAsync(notificationId);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
}

/**
 * スケジュール済みの全通知を取得
 */
export async function getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to get scheduled notifications:', error);
    return [];
  }
}

/**
 * 全通知をキャンセル
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.error('Failed to cancel all notifications:', error);
  }
}

/**
 * テスト用：即座に通知を送信
 */
export async function sendTestNotification(): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'テスト通知',
        body: 'これはテスト用の通知です',
        data: {
          isTest: true,
        },
      },
      trigger: null, // 即座に配信
    });
  } catch (error) {
    console.error('Failed to send test notification:', error);
  }
}
