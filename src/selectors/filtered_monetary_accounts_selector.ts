import { GetRecoilValue, selector } from 'recoil';
import ObjType from '../types/obj_type';
import MonetaryAccountsFilterState from '../atoms/monetary_accounts_filter_state';
import MonetaryAccountsState from '../atoms/monetary_accounts_state';


interface RecoilGet { get: GetRecoilValue }

export default selector({
  key: 'filteredMonetaryAccounts',
  get: ({ get }: any) => {
    const monetaryAccounts: ObjType[] = get(MonetaryAccountsState);
    const filter: ObjType = get(MonetaryAccountsFilterState);

    return monetaryAccounts.filter((account: ObjType) => account.status === filter.status)
  }
});
