import Storage from '../helpers/capacitor_store';
import StorageState from '../atoms/secure_storage_state';
const { selectorFamily } = require('recoil');

export default selectorFamily({
  key: 'SecureStorage/selector',
  get: (key: string, defaultValue: string = '') => async ({ get }: any): Promise<string> => {
    const atomValue = get(StorageState(key));
    if(atomValue !== '') return await Promise.resolve(atomValue);

    // NOTE: value is not in storage yet
    return await Storage.get(key) || defaultValue
  },

  set: (key: string) => async ({ set }: any, newValue: string) => {
    await Storage.set(key, newValue);
    set(StorageState(key), newValue);
  },
});
