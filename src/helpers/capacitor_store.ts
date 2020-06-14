import 'capacitor-secure-storage-plugin';
import { Plugins } from '@capacitor/core';

const { SecureStoragePlugin } = Plugins;


interface StorageValue {
  value: any
}

class CapacitorStore  {
  static async get(key: string): Promise<any> {
    return SecureStoragePlugin
      .get({ key })
      .then(({ value }: StorageValue) => value)
      .catch(() => null)
  }
  static async set(key: string, value: any): Promise<any> {
    return await SecureStoragePlugin.set({ key, value })
  }
  static async remove(key: string): Promise<any> {
    return await SecureStoragePlugin.remove({ key })
  }
  static async clear (): Promise<any> {
    return await SecureStoragePlugin.clear()
  }
};


export interface StorageInterface extends CapacitorStore {}

export default CapacitorStore;
