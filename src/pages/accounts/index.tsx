
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,  IonIcon} from '@ionic/react';
import { IonRefresher, IonRefresherContent } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';

import { BunqContext } from "../../providers/bunq_provider";
import Flex from "../../components/flex";

import {
  ellipse,
  chevronDownCircleOutline
} from 'ionicons/icons';


import './accounts.css';

import {
  IonList,
  IonItem,
} from '@ionic/react';


/* interface AccountItemProps { */
/*   accountType: string, */
/*   accountDetails: any */
/* } */

/* const AccountItem = ({ accountType, accountDetails }: AccountItemProps) => ( */
/*   <IonItem> */
/*     <React.Fragment> */
/*       <IonIcon icon={ellipse} style={{color: `${accountDetails.setting.color}`}} /> */
/*       {accountType}: {accountDetails.description}: {accountDetails.balance.value} */
/*     </React.Fragment> */
/*   </IonItem> */
/* ) */


const AccountsPage: React.FC = () => {
  const BunqClient = useContext(BunqContext);
  const [monetaryAccounts, setMonetaryAccounts ] = useState([]);


  const fetchMonetaryAccounts = useCallback(async () => {
    // get user info connected to this account
    const users = await BunqClient.getUsers(true);

    // get the direct user object
    const userInfo =  users[Object.keys(users)[0]];

    // get accounts list
    const accounts = await BunqClient.api.monetaryAccount.list(userInfo.id);

    setMonetaryAccounts(accounts);
  }, [BunqClient])

  const refreshAccounts = useCallback(async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchMonetaryAccounts();

    event.detail.complete();
  }, [fetchMonetaryAccounts])

  useEffect(() =>  {
    fetchMonetaryAccounts()
  }, [fetchMonetaryAccounts])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Accounts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* <IonHeader collapse="condense"> */}
        {/*   <IonToolbar> */}
        {/*     <IonTitle size="large">Accounts</IonTitle> */}
        {/*   </IonToolbar> */}
        {/* </IonHeader> */}
          <IonRefresher slot="fixed" onIonRefresh={refreshAccounts}>
            <IonRefresherContent>
            </IonRefresherContent>
          </IonRefresher>
              <IonList>
                {Object.values(monetaryAccounts).map((account: object) => {
                  const accountType = Object.keys(account)[0];
                  const accountDetails = Object.values(account)[0];

                  if(accountDetails.status === "CANCELLED") return null;

                  return (
                <IonItem>
                  <Flex alignItems="center" padding="3px">
                    <Flex marginRight="8px"><IonIcon icon={ellipse} style={{color: `${accountDetails.setting.color}`}} /></Flex>
                    <Flex>{accountType}: {accountDetails.description}: {accountDetails.balance.value}</Flex>
                  </Flex>
                </IonItem>
                  )
                })}
              </IonList>

      </IonContent>
    </IonPage>
  );
};

export default AccountsPage;
