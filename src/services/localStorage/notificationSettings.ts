/**
 * 通知設定のローカルストレージ管理
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_SETTINGS_KEY = '@PocketPantry:notification_settings';

export interface NotificationSettings {
  isEnabled: boolean;
  notificationIds: Record<string, string>; // ingredientId -> notificationId
}

const defaultSettings: NotificationSettings = {
  isEnabled: true,
  notificationIds: {},
};

/**
 * 通知設定を読み込む
 */
export async function loadNotificationSettings(): Promise<NotificationSettings> {
  try {
    const data = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (!data) {
      // デフォルト設定を保存
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return JSON.parse(data) as NotificationSettings;
  } catch (error) {
    console.error('Failed to load notification settings:', error);
    return defaultSettings;
  }
}

/**
 * 通知有効/無効を設定
 */
export async function setNotificationEnabled(isEnabled: boolean): Promise<void> {
  try {
    const settings = await loadNotificationSettings();
    settings.isEnabled = isEnabled;
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to set notification enabled:', error);
  }
}

/**
 * 通知IDを保存
 */
export async function saveNotificationId(ingredientId: string, notificationId: string): Promise<void> {
  try {
    const settings = await loadNotificationSettings();
    settings.notificationIds[ingredientId] = notificationId;
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save notification ID:', error);
  }
}

/**
 * 通知IDを削除
 */
export async function removeNotificationId(ingredientId: string): Promise<void> {
  try {
    const settings = await loadNotificationSettings();
    delete settings.notificationIds[ingredientId];
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to remove notification ID:', error);
  }
}

/**
 * 食材IDから通知IDを取得
 */
export async function getNotificationId(ingredientId: string): Promise<string | null> {
  try {
    const settings = await loadNotificationSettings();
    return settings.notificationIds[ingredientId] || null;
  } catch (error) {
    console.error('Failed to get notification ID:', error);
    return null;
  }
}
