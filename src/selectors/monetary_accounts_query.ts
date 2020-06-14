import CurrentUserIdState from '../atoms/current_user_id_state';
import BunqClient, { BunqClientInterface } from '../atoms/bunq_client';
import { GetRecoilValue, selector } from 'recoil';
import ObjType from '../types/obj_type';


interface RecoilGet { get: GetRecoilValue }

export default selector({
  key: 'monetaryAccountsQuery',
  get: async ({ get }: any) => {
    const bunqClient: BunqClientInterface = get(BunqClient);

    const userId = get(CurrentUserIdState);

    // get accounts list
    const accounts: ObjType[] = await bunqClient.api.monetaryAccount.list(userId);
    const flattenedAccounts: ObjType[] = accounts.map((account: ObjType) => ({ _type: Object.keys(account)[0], ...Object.values(account)[0] }));

    return flattenedAccounts;
  }
});
