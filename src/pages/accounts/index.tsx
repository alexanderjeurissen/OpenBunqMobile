
import React, { useContext, useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButton } from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './accounts.css';
import BunqContext from "../../helpers/bunq_context";
import { ellipse } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

import {
  IonList,
  IonItem,
} from '@ionic/react';

const AccountsPage: React.FC = () => {
  const bunqClient = useContext(BunqContext);
  const [monetaryAccounts, setMonetaryAccounts ] = useState([]);

  useEffect(() => {
    const fetchMonetaryAccounts = async () => {
        // get user info connected to this account
        const users = await bunqClient.getUsers(true);

        // get the direct user object
        const userInfo = users[Object.keys(users)[0]];

        // get accounts list
        const accounts = await bunqClient.api.monetaryAccount.list(userInfo.id);
        setMonetaryAccounts(accounts);
    }

    fetchMonetaryAccounts()
  }, [bunqClient, monetaryAccounts, setMonetaryAccounts])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Accounts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Accounts</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {Object.values(monetaryAccounts).map((account: object) => {
            const accountType = Object.keys(account)[0];
            const accountDetails = Object.values(account)[0];

            if(accountDetails.status === "CANCELLED") return null;

            console.log(account);
            return <IonItem>
              <React.Fragment>
              <IonIcon icon={ellipse} style={{color: `${accountDetails.setting.color}`}} />
              {accountType}: {accountDetails.description}: {accountDetails.balance.value}
              </React.Fragment>
            </IonItem>;
            /* return <IonItem>{accountType}: {account.description}: { account.hasOwnProperty('balance') ? account.balance.value : null }</IonItem>; */
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AccountsPage;
