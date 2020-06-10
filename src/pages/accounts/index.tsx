
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,  IonIcon} from '@ionic/react';
import { IonRefresher, IonRefresherContent } from '@ionic/react';
import { IonLoading } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';

import { BunqContext } from "../../providers/bunq_provider";
import Flex from "../../components/flex";

import {
  ellipse,
} from 'ionicons/icons';

// NOTE: account icons
import {
  reader,
  restaurant,
  cart,
  medkit,
  star,
  save,
  pricetag,
  home,
  business,
  refresh,
  briefcase,
  cash,
} from 'ionicons/icons'

import './accounts.css';

import {
  IonList,
  IonItem,
  IonLabel,
  IonText
} from '@ionic/react';


interface AccountSettingsInterface {
  color: string;
  icon: string;
}
interface AccountBalanceInterface {
  value: number;
  currency: string;
}
interface AccountItemProps {
  accountType: string,
  accountDetails: {
    description: string
    balance: AccountBalanceInterface;
    setting: AccountSettingsInterface;
  }
}

type KeyValue = {  [key: string]: any }
const BunqIconMap: KeyValue = {
  'GENERAL': reader,
  'FOOD_AND_DRINK': restaurant,
  'GROCERIES': cart,
  'PERSONAL_CARE': medkit,
  'ENTERTAINMENT': star,
  'SHOPPING': pricetag,
  'HOUSEHOLD_EXPENSES': home,
  'FINANCE': briefcase,
  'SUBSCRIPTION': refresh,
  'VAULT': save,
  'BUSINESS_EXPENSES': business
}

const CurrencyGlyphMap: KeyValue = {
  'EUR': '€'
}

const AccountItem = ({ accountType, accountDetails }: AccountItemProps) => {
  const { color, icon }: AccountSettingsInterface = accountDetails.setting;
  const { description, balance } = accountDetails;

 return (
   <IonItem button onClick={() => { }} detail>
    <IonIcon slot="start" icon={BunqIconMap[icon]} style={{color: `${color}`}} />
    <IonLabel><h3>{description}</h3></IonLabel>
    <IonText slot="end">
      <Flex display="inline-flex" marginRight='2px'>{CurrencyGlyphMap[balance.currency]}</Flex>
     {balance.value}
    </IonText>
  </IonItem>
 );
}

const AccountsPage: React.FC = () => {
  const { MonetaryAccount, User } = useContext(BunqContext)!;
  const [monetaryAccounts, setMonetaryAccounts ] = useState([]);
  const [showLoading, setShowLoading] = useState(false);

  const fetchUserInfo = useCallback(async () => {
    // get user info connected to this account
    const users = await User.list();

    // get the direct user object
    return users[Object.keys(users)[0]];
  }, [User]);

  const fetchMonetaryAccounts = useCallback(async (event: CustomEvent<RefresherEventDetail> | undefined) => {
    const userInfo = await fetchUserInfo();
    // get accounts list
    const accounts = await MonetaryAccount.list(userInfo.id);

    setMonetaryAccounts(accounts);
  }, [fetchUserInfo, MonetaryAccount])

  const refreshAccounts = useCallback(async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchMonetaryAccounts();
    event.detail.complete();
  }, [fetchMonetaryAccounts])

  useEffect(() =>  {
    const fetchData = async () => {
      setShowLoading(true)
      await fetchMonetaryAccounts()
      setShowLoading(false)
    }

    fetchData();
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Accounts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading
          isOpen={showLoading}
          message={'Please wait...'}
        />
        <IonRefresher slot="fixed" onIonRefresh={refreshAccounts} pullFactor={0.5} pullMin={100} pullMax={200}>
          <IonRefresherContent>
          </IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Accounts</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList lines="full">
          {Object.values(monetaryAccounts).map((account: object, index: number) => {
            const accountType = Object.keys(account)[0];
            const accountDetails = Object.values(account)[0];

            if(accountDetails.status === "CANCELLED") return null;

            return <AccountItem key={index} accountType={accountType} accountDetails={accountDetails} />
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AccountsPage;
