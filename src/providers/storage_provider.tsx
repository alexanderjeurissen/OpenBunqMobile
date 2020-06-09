import React from 'react';
import CapacitorStore from '../helpers/CapacitorStore';

export const StorageContext = React.createContext(CapacitorStore());

interface StorageProviderProps {
   children: React.ReactNode
}
export default ({ children }: StorageProviderProps) => (
 <StorageContext.Provider value={CapacitorStore()}>
   {children}
 </StorageContext.Provider>
)
