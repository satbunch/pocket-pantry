import AsyncStorage from '@react-native-async-storage/async-storage';

export class LocalStorage {
  // データを保存
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Failed to save data for key: ${key}`, error);
      throw new Error(`LocalStorage.setItem failed: ${error}`);
    }
  }

  // データを取得
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) {
        return null;
      }
      return JSON.parse(jsonValue) as T;
    } catch (error) {
      console.error(`Failed to get data for key: ${key}`, error);
      return null;
    }
  }

  // データを削除
  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove data for key: ${key}`, error);
      throw new Error(`LocalStorage.removeItem failed: ${error}`);
    }
  }

  // 複数のキーのデータを一括取得
  static async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const values = await AsyncStorage.multiGet(keys);
      const result: Record<string, T | null> = {};

      values.forEach(([key, value]) => {
        if (value !== null) {
          try {
            result[key] = JSON.parse(value) as T;
          } catch {
            result[key] = null;
          }
        } else {
          result[key] = null;
        }
      });

      return result;
    } catch (error) {
      console.error(`Failed to get multiple items`, error);
      throw new Error(`LocalStorage.getMultiple failed: ${error}`);
    }
  }

  // 複数のデータを一括保存
  static async setMultiple<T>(data: Record<string, T>): Promise<void> {
    try {
      const keyValuePairs: [string, string][] = Object.entries(data).map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);

      await AsyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      console.error(`Failed to set multiple items`, error);
      throw new Error(`LocalStorage.setMultiple failed: ${error}`);
    }
  }

  // 指定したキーのデータが存在するかチェック
  static async hasItem(key: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Failed to check existance for key: ${key}`, error);
      return false;
    }
  }

  // すべてのキーを取得
  static async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error(`Failed to get all keys`, error);
      return [];
    }
  }

  // ストレージをクリア（開発・テスト用）
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error(`Failed to clear storage`, error);
      throw new Error(`LocalStorage.clear failed: ${error}`);
    }
  }

  // ストレージの使用容量を取得（概算）
  static async getStorageSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const allData = await AsyncStorage.multiGet(keys);

      let totalSize = 0;
      allData.forEach(([key, value]) => {
        if (value) {
          // 文字列のバイト数を概算(UTF-8)
          totalSize += new Blob([key + value]).size;
        }
      });

      return totalSize;
    } catch (error) {
      console.error(`Failed to calculate storage size`, error);
      return 0;
    }
  }
}
