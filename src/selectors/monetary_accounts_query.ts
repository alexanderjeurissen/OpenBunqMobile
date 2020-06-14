import CurrentUserIdState from '../atoms/current_user_id_state';
import BunqClient, { BunqClientInterface } from '../atoms/bunq_client';
import RefreshQueryTrigger from '../atoms/refresh_query_trigger';
import { GetRecoilValue, selector, DefaultValue } from 'recoil';
import ObjType from '../types/obj_type';


interface RecoilGet { get: GetRecoilValue }

const KEY: string = 'monetaryAccountsQuery';
export default selector({
  key: KEY,
  get: async ({ get }: any) => {
    get(RefreshQueryTrigger(KEY));
    const bunqClient: BunqClientInterface = get(BunqClient);

    const userId = get(CurrentUserIdState);

    // get accounts list
    const accounts: ObjType[] = await bunqClient.api.monetaryAccount.list(userId);
    const flattenedAccounts: ObjType[] = accounts.map((account: ObjType) => ({ _type: Object.keys(account)[0], ...Object.values(account)[0] }));

    return flattenedAccounts;
  },
  set: ({ set }, value) => {
    if (value instanceof DefaultValue) {
      set(RefreshQueryTrigger(KEY), (v: number) => v + 1);
    }
  }

});
