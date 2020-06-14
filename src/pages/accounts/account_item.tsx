import React from 'react';
import Flex from "react-flex-primitive";

import { IonIcon } from '@ionic/react';
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

import {
  IonItem,
  IonLabel,
  IonText
} from '@ionic/react';

import { useRecoilState } from 'recoil';


interface AccountSettingsInterface {
  color: string;
  icon: string;
}
interface AccountBalanceInterface {
  value: number;
  currency: string;
}
export interface AccountInterface {
  description: string
  balance: AccountBalanceInterface;
  setting: AccountSettingsInterface;
  _type: string;
}
interface AccountItemProps {
  account: AccountInterface,
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
  'BUSINESS_EXPENSES': business,
  'CASH': cash
}

const CurrencyGlyphMap: KeyValue = {
  'EUR': '€'
}

export default ({ account }: AccountItemProps) => {
  const { color, icon }: AccountSettingsInterface = account.setting;
  const { description, balance } = account;

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
