import BunqClient, { BunqClientInterface } from '../atoms/bunq_client';

import { GetRecoilValue, selector } from 'recoil';

interface RecoilGet { get: GetRecoilValue }

export default selector({
  key: 'isAuthenticatedQuery',
  get: async ({ get }: any) => {
    const bunqClient: BunqClientInterface = get(BunqClient);

    return bunqClient.Session.sessionId !== null;
  }
});
