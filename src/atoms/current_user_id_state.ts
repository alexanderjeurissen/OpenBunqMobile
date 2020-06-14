import { atom, selector } from 'recoil';
import BunqClient, { BunqClientInterface } from '../atoms/bunq_client';
import ObjType from '../types/obj_type';

export default atom({
  key: 'CurrentUserID',
  default: selector({
    key: 'CurrentUserId/selector',
    get: async ({ get }) => {
      const bunqClient: BunqClientInterface = get(BunqClient);

      // NOTE: there is no session object
      if(!bunqClient.Session.sessionId) return null;

      // NOTE: there is no userInfo object
      if(!bunqClient.Session.userInfo) return null;

      if(!Object.values(bunqClient.Session.userInfo).length) return null;

      const userInfo = Object.values(bunqClient.Session.userInfo)[0] as ObjType

      // NOTE: userInfo object is empty
      if(!Object.values(userInfo).length) return null;

      return userInfo.id;
    }
  })
});
