import BunqJSClient from "@bunq-community/bunq-js-client";
import CapacitorStore from '../helpers/capacitor_store';

import { atom } from 'recoil';

export interface BunqClientInterface extends BunqJSClient {};

export default atom({
  key: 'BunqClient',
  default: new BunqJSClient(CapacitorStore)
});
