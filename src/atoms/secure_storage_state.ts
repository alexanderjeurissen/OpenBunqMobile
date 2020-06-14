import Storage from '../helpers/capacitor_store';
const { atomFamily, selectorFamily } = require('recoil');

export default atomFamily({
  key: 'SecureStorage/atom',
  default: selectorFamily({
    key: 'SecureStorage/selector',
    get: (key: string) => async ({ get }: any): Promise<string> => {
      return await Storage.get(key)
    }
  })
});
