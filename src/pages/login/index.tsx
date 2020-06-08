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

import { download } from 'ionicons/icons';

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

import 'capacitor-secure-storage-plugin';
import { derivePassword }  from "../../helpers/encryption";

import BunqContext from "../../helpers/bunq_context";
import BunqErrorHandler from "../../helpers/bunq_error_handler";

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
  const bunqClient = useContext(BunqContext);
  const { SecureStoragePlugin } = Plugins;

  const [showLoading, setShowLoading] = useState(false);
  const [apiKey , setApiKey ] = useState('');
  const [deviceName , setDeviceName ] = useState('');
  const [ password, setPassword ] = useState('');

  // NOTE: fetch stored config parameters
  // and set them in state
  useEffect(() => {
    const fetchConfigFromStorage = async () => {
      const { value: storedApiKey } = await SecureStoragePlugin.get({ key: 'BUNQ_API_KEY' }).catch(() => ({value: ''}));
      setApiKey(storedApiKey);

      const { value: storedDeviceName } = await SecureStoragePlugin.get({ key: 'BUNQ_DEVICE_NAME' }).catch(() => ({value: ''}))
      setDeviceName(storedDeviceName);

      SecureStoragePlugin.remove({ key: 'BUNQ_ENCRYPTION_KEY' })
    }

    fetchConfigFromStorage();
  }, [SecureStoragePlugin])

  const createOrRegenerateEncryptionKey = useCallback(() => (
    // NOTE: try to fetch the encryption IV from secure storage.
    // If it does not exist, generate a new encryption key using a new IV
    // and the provided password
    SecureStoragePlugin.get({ key: 'BUNQ_ENCRYPTION_IV' }).then(({ value }: any) => {
      const derivedInfo = derivePassword(password, 32, value);

      return derivedInfo.key;
    }).catch(() => {
      // NOTE: IV is not present yet let's generate one
      const derivedInfo = derivePassword(password, 32, false);

      SecureStoragePlugin.set({ key: 'BUNQ_ENCRYPTION_IV', value: derivedInfo.iv})

      return derivedInfo.key;
    })
  ), [SecureStoragePlugin, password]);

  const setup = useCallback(async () => {
    // load and refresh bunq client
    await bunqClient
      .run(apiKey, ['*'], 'PRODUCTION', await createOrRegenerateEncryptionKey())
      .catch((exception: any) => {
        BunqErrorHandler(exception)
        throw exception;
      });

    // disable keep-alive since the server will stay online without the need for a constant active session
    bunqClient.setKeepAlive(true);

    // create/re-use a system installation
    await bunqClient.install();

    // create/re-use a device installation
    await bunqClient.registerDevice(deviceName);

    // create/re-use a bunq session installation
    await bunqClient.registerSession();

    history.push('/accounts');
    setShowLoading(false);
  }, [bunqClient, createOrRegenerateEncryptionKey, apiKey, deviceName])

  const setBunqApiKey = useCallback((value: string) => {
    SecureStoragePlugin.set({ key: 'BUNQ_API_KEY', value });
    setApiKey(value);
  }, [SecureStoragePlugin])

  const setBunqDeviceName = useCallback((value: string) => {
    SecureStoragePlugin.set({ key: 'BUNQ_DEVICE_NAME', value });
    setDeviceName(value);
  }, [SecureStoragePlugin])

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
                  <IonButton expand="block" type="submit" class="ion-no-margin" onClick={e => {
                    setShowLoading(true);
                    setup()
                  }}>Login</IonButton>
                </div>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
