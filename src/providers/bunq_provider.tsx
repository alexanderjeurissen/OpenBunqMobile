import React from 'react';

import BunqJSClient from "@bunq-community/bunq-js-client";
import CapacitorStore from '../helpers/CapacitorStore';

export const BunqContext = React.createContext(new BunqJSClient());

interface BunqProviderProps {
   children: React.ReactNode
}
export default ({ children }: BunqProviderProps) => {
  const bunqClient = new BunqJSClient(CapacitorStore());

  return (
    <BunqContext.Provider value={bunqClient}>
      {children}
    </BunqContext.Provider>
  );
}
