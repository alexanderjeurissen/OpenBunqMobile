import 'capacitor-secure-storage-plugin';
import { Plugins } from '@capacitor/core';

const { SecureStoragePlugin } = Plugins;

interface StorageInterface {
  get(key: string): Promise<any> | any;
  set(key: string, value: any): Promise<any> | void;
  remove(key: string): Promise<any> | void;
}

export default (): StorageInterface => {
  return {
    get: async (key: string): Promise<any> => {
      const { value } =  SecureStoragePlugin.get({ key }).catch(() => ({ value: null}))
      return value;
    },
    set: async (key: string, value: any): Promise<any> => await SecureStoragePlugin.set({ key, value }),
    remove: async (key: string): Promise<any> => await SecureStoragePlugin.remove({ key })
  };
};
