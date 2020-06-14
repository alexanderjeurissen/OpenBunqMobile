import { ReactNode } from 'react';
import { useRecoilValue, RecoilValueReadOnly, selector } from 'recoil';
import CurrentUserIdState from '../atoms/current_user_id_state';

const isAuthenticatedQuery: RecoilValueReadOnly<boolean> = selector({
  key: 'isAuthenticated',
  get: ({ get }) => {
    const currentUserId = get(CurrentUserIdState);
    return currentUserId !== -1;
  }
});
export default (component: ReactNode) => {
  const isAuthenticated: boolean = useRecoilValue(isAuthenticatedQuery);
  const Component = component;

  if(!isAuthenticated) {
    throw new Error('Requires authentication');
  } else {
    return Component;
  }
};
