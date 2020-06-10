import React from 'react';

import BunqJSClient from "@bunq-community/bunq-js-client";
import CapacitorStore from '../helpers/CapacitorStore';

export interface BunqClientInterface extends BunqJSClient {};

interface BunqContextType {
  BunqClient: BunqClientInterface;
  MonetaryAccount: any;
  User: any;
}
export const BunqContext = React.createContext<BunqContextType | undefined>(undefined);

interface BunqProviderProps {
   children: React.ReactNode
}
export default ({ children }: BunqProviderProps) => {
  const BunqClient = new BunqJSClient(CapacitorStore());

  const {
    monetaryAccount: MonetaryAccount,
    user: User
  } = BunqClient.api;

  return (
    <BunqContext.Provider value={{
      BunqClient,
      MonetaryAccount,
      User
    }}>
      {children}
    </BunqContext.Provider>
  );
}
