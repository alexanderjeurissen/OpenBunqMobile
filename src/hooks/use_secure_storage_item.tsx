import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import Storage from '../helpers/capacitor_store';
import StorageAtom from '../atoms/secure_storage_state';
import { useRecoilState, RecoilState } from 'recoil';

export default (key: string, defaultValue?: any): Array<any> => {
  const [ lastKnownValue, setLastKnownValue ] =  useState('');
  const [ storageState, setStorageState ] = useRecoilState(StorageAtom(key));


  // NOTE: If storage is empty, set AtomState the defaultValue
  // Which will trigger a storage sync as a side effect
  useEffect(() => {
    if(storageState === null && defaultValue !== null && typeof defaultValue !== 'undefined') {
      setStorageState(defaultValue);
    }
  })
  // NOTE: Subscribe Storage to atom changes
  useEffect(() => {
    const syncStorage = async () => {
      await Storage.set(key, storageState);
      setLastKnownValue(storageState as string);
    }

    if(storageState !== lastKnownValue) syncStorage()
  }, [ storageState ]);

  return [ storageState, setStorageState ];
}
