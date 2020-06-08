import 'capacitor-secure-storage-plugin';
import { Plugins } from '@capacitor/core';

const { SecureStoragePlugin } = Plugins;

interface StorageInterface {
  get(key: string): Promise<any> | any;
  set(key: string, value: any): Promise<any> | void;
  remove(key: string): Promise<any> | void;
  clear(): Promise<any> | void;
}

interface StorageValue {
  value: any
}

export default (): StorageInterface => {
  return {
    get: async (key: string): Promise<any> => (
      SecureStoragePlugin
        .get({ key })
        .then(({ value }: StorageValue) => value)
        .catch(() => null)
    ),
    set: async (key: string, value: any): Promise<any> => await SecureStoragePlugin.set({ key, value }),
    remove: async (key: string): Promise<any> => await SecureStoragePlugin.remove({ key }),
    clear: async (): Promise<any> => await SecureStoragePlugin.clear()
  };
};
