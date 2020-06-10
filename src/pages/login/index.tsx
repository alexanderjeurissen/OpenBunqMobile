import React, { useState, useContext, useEffect, useCallback } from 'react';
import { IonLoading } from '@ionic/react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import {
  IonCard,
  IonIcon,
} from '@ionic/react';

import { trashOutline } from 'ionicons/icons';

import {
  IonList,
  IonItem,
} from '@ionic/react';

import {
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';

import {
  IonButton,
  IonInput,
  IonLabel
} from '@ionic/react';

import { Plugins, PluginResultError } from '@capacitor/core';

import { derivePassword }  from "../../helpers/encryption";

import { BunqContext } from "../../providers/bunq_provider";
import { StorageContext } from "../../providers/storage_provider";
import BunqErrorHandler from "../../helpers/bunq_error_handler";
import ToggleTabBarVisibility from "../../helpers/tab_bar";
import Flex from "../../components/flex";

import './login.css';

const unlockWithFaceId = () => {
  const { FaceId } = Plugins;

  // check if device supports Face ID or Touch ID
  FaceId.isAvailable().then((checkResult: any) => {
    if(checkResult.value) {
      FaceId.auth().then(() => {
        console.log('authenticated');
      }).catch((error: PluginResultError) => {
        // handle rejection errors
        console.error(error.message);
      });
    } else {
      console.error('fallback ??');
      // use custom fallback authentication here
    }
  });
};

/* const SignUp: React.FC = () => { */

/* } */
const LoginPage: React.FC = ({ history }: any) => {
  const { BunqClient } = useContext(BunqContext)!;
  const Storage = useContext(StorageContext);

  const [showLoading, setShowLoading] = useState(false);
  const [apiKey , setApiKey ] = useState('');
  const [deviceName , setDeviceName ] = useState('');
  const [ password, setPassword ] = useState('');

  // NOTE: fetch stored config parameters
  // and set them in state
  useEffect(() => {
    const fetchConfigFromStorage = async () => {
      const storedApiKey = await Storage.get('BUNQ_API_KEY')
      setApiKey(storedApiKey || '');

      const storedDeviceName = await Storage.get('BUNQ_DEVICE_NAME')
      setDeviceName(storedDeviceName || '');
    }

    fetchConfigFromStorage();
    ToggleTabBarVisibility();
  }, [Storage])

  const createOrRegenerateEncryptionKey = useCallback(async () => {
    // NOTE: try to fetch the encryption IV from secure storage.
    // If it does not exist, generate a new encryption key using a new IV
    // and the provided password
    const encryptionIv = await Storage.get('BUNQ_ENCRYPTION_IV')

    const derivedInfo = derivePassword(password, 32, (encryptionIv === null) ? false : encryptionIv);

    Storage.set('BUNQ_ENCRYPTION_IV', derivedInfo.iv)

    return derivedInfo.key;
  }, [Storage, password]);

  const setup = useCallback(async () => {
    // load and refresh bunq client
    await BunqClient
      .run(apiKey, ['*'], 'PRODUCTION', await createOrRegenerateEncryptionKey())
      .catch((exception: any) => {
        BunqErrorHandler(exception)
        throw exception;
      });

    // disable keep-alive since the server will stay online without the need for a constant active session
    BunqClient.setKeepAlive(true);

    // create/re-use a system installation
    await BunqClient.install();

    // create/re-use a device installation
    await BunqClient.registerDevice(deviceName);

    // create/re-use a bunq session installation
    await BunqClient.registerSession();

    ToggleTabBarVisibility();
    history.push('/accounts');
    setShowLoading(false);
  }, [BunqClient, createOrRegenerateEncryptionKey, apiKey, deviceName, history])

  const setBunqApiKey = useCallback((value: string) => {
    Storage.set('BUNQ_API_KEY', value);
    setApiKey(value);
  }, [Storage])

  const setBunqDeviceName = useCallback((value: string) => {
    Storage.set('BUNQ_DEVICE_NAME', value);
    setDeviceName(value);
  }, [Storage])

  const clearStorage = useCallback(() => {
    Storage.clear();
    Storage.set('AXIOS_INVALIDATE_CACHE', true);
    setApiKey('');
    setDeviceName('');
  }, [Storage]);

  return (
    <IonPage className='login-page'>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login with Bunq</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading
          isOpen={showLoading}
          message={'Please wait...'}
        />
        <IonGrid>
          <IonRow>
            <IonCol size='12'>
              <IonCard style={{ alignSelf: 'center'}}>
                <form onSubmit={e => {
                    e.preventDefault();
                    setShowLoading(true);
                    setup();
                }}>
                  <IonList>
                    <IonItem>
                      <IonLabel position="floating">Api key</IonLabel>
                      <IonInput
                        name='api_key'
                        type='text'
                        onIonChange={e => setBunqApiKey((e.target as HTMLInputElement).value)}
                        value={apiKey}
                        required
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">Device name</IonLabel>
                      <IonInput
                        name='device_name'
                        type='text'
                        onIonChange={e => setBunqDeviceName((e.target as HTMLInputElement).value)}
                        value={deviceName}
                        required
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">Password</IonLabel>
                      <IonInput
                        name='password'
                        type='password'
                        onIonChange={e => setPassword((e.target as HTMLInputElement).value)}
                        value={password}
                        required
                      />
                    </IonItem>
                  </IonList>

                  <div className="ion-padding">
                    <Flex width='100%' justifyContent="space-between" alignItems="center">
                      <Flex flexGrow={1} marginRight="8px">
                      <IonButton expand="block" type="submit" class="ion-no-margin" style={{width: '100%'}}>Login</IonButton>
                      </Flex>
                      {apiKey && (<IonButton color='danger' expand="block" type="reset" class="ion-no-margin" onClick={e => clearStorage()}><IonIcon icon={trashOutline} /></IonButton>)}
                    </Flex>
                  </div>
                </form>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
