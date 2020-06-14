import SecureStorageSelector from '../selectors/secure_storage_selector';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';

export const useSecureStorageItemValue = (key: string) => {
  return useRecoilValue(SecureStorageSelector(key));
}
export const useSetSecureStorageItem = (key: string) => {
  return useSetRecoilState(SecureStorageSelector(key));
}
export default (key: string, defaultValue: any = '') => {
  return useRecoilState(SecureStorageSelector(key, defaultValue));
}
