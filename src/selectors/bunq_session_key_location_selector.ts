import EnvironmentAtom from '../atoms/environment_atom';
import BunqApiKeyIdentifierSelector from '../selectors/bunq_api_key_identifier_selector';

import { selector } from 'recoil';

export default selector({
  key: 'bunqSessionKeyLocation/selector',
  get: async ({ get }: any) => {
    const apiKeyIdentifier: string | null = get(BunqApiKeyIdentifierSelector);
    const environment: string = get(EnvironmentAtom);

    // NOTE: taken from BunqJSClient to ensure we get the right identifier.
    // We need to duplicate this logic so we can get the right session key location
    // to use with the KeyChainWrapper so we can delete the cached session
    if(apiKeyIdentifier === null) return null;

    return [
      `BUNQJSCLIENT_${environment}_SESSION_${apiKeyIdentifier}`,
      `BUNQJSCLIENT_${environment}_IV_${apiKeyIdentifier}`
    ];
  }
});
