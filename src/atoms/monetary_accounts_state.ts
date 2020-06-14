import { atom } from 'recoil';
import MonetaryAccountsQuery from '../selectors/monetary_accounts_query';

export default atom({
  key: 'monetaryAccountsState',
  default: MonetaryAccountsQuery
});
