import { atom } from 'recoil';

export default atom({
  key: 'monetaryAccountsFilterState',
  default: { status: 'ACTIVE' }
});
