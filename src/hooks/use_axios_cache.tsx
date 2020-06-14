import { useEffect } from 'react';
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter'
import CapacitorStore from '../helpers/capacitor_store';
import ObjType from '../types/obj_type';

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
    // Attempt reading stale cache data when response status is:
    // 399 NOT MODIFIED:	    Same as a 304, it implies you have a local cached copy of the data
    // 429 RATE LIMIT:        Too many API calls have been made in a too short period
    // 491 MAINTENANCE ERROR: bunq is in maintenance mode
    readOnError: (error: ObjType, request: ObjType) => {
      const { response: { status } } = error;
      return status === 399 ||
             status === 429 ||
             status === 491
    },
    // Deactivate `clearOnStale` option so that we can actually read stale cache data
    clearOnStale: false
    })

    axios.defaults.adapter = cache.adapter;
  }, [])
}
