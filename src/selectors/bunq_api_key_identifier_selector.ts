import StorageAtom from '../atoms/secure_storage_state';
import derivePassword from "../helpers/encryption";

import { selector } from 'recoil';

export default selector({
  key: 'bunqApiKeyIdentifier/selector',
  get: async ({ get }: any) => {
    const apiKey: string | null = get(StorageAtom('BUNQ_API_KEY'));

    // NOTE: taken from BunqJSClient to ensure we get the right identifier.
    // We need to duplicate this logic so we can get the right identifier
    // to use with the KeyChainWrappre so we can delete the cached session
    // create a unique identifier for this api key
    if(apiKey === null) return null;

    const derivedApiKey = await derivePassword(apiKey.substring(0, 8), apiKey.substring(8, 16), 10000);

    return derivedApiKey.key;
  }
});
