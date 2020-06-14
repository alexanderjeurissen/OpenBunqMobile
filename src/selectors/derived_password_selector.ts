import StorageAtom from '../atoms/secure_storage_state';
import { selector } from 'recoil';
import derivePassword from "../helpers/encryption";

export default selector({
  key: 'derivedPassword/selector',
  get: async ({ get }: any) => {
    console.log('inside selector 1');
    const password: string = get(StorageAtom('BUNQ_PASSWORD', ''));
    console.log('inside selector 2');
    const encryptionIV: string | null = get(StorageAtom('BUNQ_ENCRYPTION_IV', ));
    console.log('inside selector 3');
    if(!encryptionIV) return derivePassword(password, false);

    return derivePassword(password, encryptionIV);
  }
});
