
import React, { useState, useCallback, Suspense } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import { IonList } from '@ionic/react';
import { IonLoading } from '@ionic/react';
import { IonSegment, IonSegmentButton, IonButton, IonLabel } from '@ionic/react';
import { IonSearchbar } from '@ionic/react';
import { IonRefresher, IonRefresherContent } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';

import ErrorBoundary from '../../components/error_boundary';

import './accounts.css';


import MonetaryAccountsFilterState from '../../atoms/monetary_accounts_filter_state';
import MonetaryAccountsState from '../../atoms/monetary_accounts_state';
import FilteredMonetaryAccountsSelector from '../../selectors/filtered_monetary_accounts_selector';

import { useRecoilValue, useRecoilState, useResetRecoilState } from 'recoil';

import ObjType from '../../types/obj_type';
import AccountItem, { AccountInterface } from './account_item'

const AccountList = () => {
  const monetaryAccounts = useRecoilValue(FilteredMonetaryAccountsSelector);

  return (
    <IonList lines="full" style={{minHeight: '100vh'}}>
      {Object.values(monetaryAccounts as ObjType).map((account: AccountInterface, index: number) => (
        <AccountItem key={index} account={account} />
      ))}
    </IonList>
  )
}
const AccountsPage: React.FC = () => {
  const resetMonetaryAccountState = useResetRecoilState(MonetaryAccountsState);
  const [ filterState, setFilterState ] = useRecoilState(MonetaryAccountsFilterState);

  const segments = [{ value: 'ACTIVE', label: 'Active'}, { value: 'CANCELLED', label: 'inactive' }];
  const [searchFocus, setSearchFocus] = useState(false);

  const refreshAccounts = useCallback(async (event: CustomEvent<RefresherEventDetail>) => {
    await resetMonetaryAccountState();
    event.detail.complete();
  }, [resetMonetaryAccountState])

  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar hidden={searchFocus}>
          <IonTitle size="large">Accounts</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={''}
            onFocus={e => setSearchFocus(true)}
            onIonChange={e => console.log(e.detail.value!)}
          />
          <IonSegment value={filterState.status} onIonChange={e => setFilterState({...filterState, status: e.detail.value || 'ACTIVE' })}>
            { segments.map(({ value, label}) => (
            <IonSegmentButton value={value}>
              <IonLabel>{label}</IonLabel>
            </IonSegmentButton>
            ))}
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent start-y="55" fullscreen force-overscroll={true}>
        <IonRefresher onIonRefresh={refreshAccounts} pullFactor={0.5} pullMin={100} pullMax={200}>
          <IonRefresherContent>
          </IonRefresherContent>
        </IonRefresher>
        <Suspense fallback={<IonLoading isOpen={true} message={'Please wait...'} />}>
          <ErrorBoundary>
            <AccountList />
          </ErrorBoundary>
        </Suspense>
      </IonContent>
    </IonPage>
  );
};

export default AccountsPage;
