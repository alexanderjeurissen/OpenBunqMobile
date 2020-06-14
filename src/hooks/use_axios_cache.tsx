import { useEffect } from 'react';
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter'
import CapacitorStore from '../helpers/capacitor_store';

interface AxiosCacheStore {
  clear: () => Promise<any>;
}
interface AxiosCacheConfig {
  store: AxiosCacheStore;
  uuid: string;
}

export default () => {
  useEffect(() => {
    // Create `axios-cache-adapter` instance
    const cache = setupCache({
      maxAge: 1 * 60 * 1000,
      invalidate: async (config: AxiosCacheConfig, request) => {
        if (request.clearCacheEntry) {
          const shouldPurgeCache = await CapacitorStore.get('AXIOS_INVALIDATE_CACHE');
          if(shouldPurgeCache) {
            await config.store.clear();
            await CapacitorStore.remove('AXIOS_INVALIDATE_CACHE');
          }
        }
      }
    })

    axios.defaults.adapter = cache.adapter;
  }, [])
}
