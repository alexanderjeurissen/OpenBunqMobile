import React, { useState, useCallback, Suspense} from 'react';
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { IonCard } from '@ionic/react';

import {
  IonList,
  IonItem,
} from '@ionic/react';

import {
  IonButton,
  IonInput,
  IonLabel
} from '@ionic/react';

import { IonLoading } from '@ionic/react';

import { Plugins, PluginResultError } from '@capacitor/core';

import BunqErrorHandler from "../../helpers/bunq_error_handler";
import ToggleTabBarVisibility from "../../helpers/tab_bar";
import Flex from "react-flex-primitive";

import ObjType from '../../types/obj_type';

import CurrentUserIdState from '../../atoms/current_user_id_state';
import BunqClient, { BunqClientInterface } from '../../atoms/bunq_client';
import DerivedPasswordSelector from '../../selectors/derived_password_selector';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import useSecureStorageItem from '../../hooks/use_secure_storage_item';

import './setup.css';

const SetupForm: React.FC = () => {
  const bunqClient: BunqClientInterface = useRecoilValue(BunqClient);

  const [ apiKey, setApiKey ] = useSecureStorageItem('BUNQ_API_KEY', '');
  const [ deviceName, setDeviceName ] = useSecureStorageItem('BUNQ_DEVICE_NAME', 'Open Bunq Mobile');
  const [ _, setFaceIdEnabled ] = useSecureStorageItem('BUNQ_FACE_ID_ENABLED', 'false');
  const [ password, setPassword ] = useSecureStorageItem('BUNQ_PASSWORD', '');
  const [ showLoading, setShowLoading ] = useState(false);
  const [ encryptionIV, setEncryptionIV ] = useSecureStorageItem('BUNQ_ENCRYPTION_IV', null);
  const derivedPassword: ObjType = useRecoilValueLoadable(DerivedPasswordSelector);

  let history = useHistory();

  const createOrRegenerateEncryptionKey = useCallback(async () => {
    // NOTE: try to fetch the encryption IV from secure storage.
    // If it does not exist, generate a new encryption key using a new IV
    // and the provided password
    if(derivedPassword.state !== 'hasValue') throw Error('could not create encryption key');
    const { iv, key } = derivedPassword.contents;

    setEncryptionIV(iv)
    await bunqClient.changeEncryptionKey(key)

    return key;
  }, [ password, derivedPassword ]);

  const setupBunqClient = useCallback(async () => {
    setShowLoading(true);

    // load and refresh bunq client
    await bunqClient
      .run((apiKey as string), ['*'], 'PRODUCTION', await createOrRegenerateEncryptionKey())
      .catch((exception: any) => {
        BunqErrorHandler(exception)
      });

    // disable keep-alive since the server will stay online without the need for a constant active session
    bunqClient.setKeepAlive(false);

    // create/re-use a system installation
    await bunqClient.install().catch(e => { throw e; });

    // create/re-use a device installation
    await bunqClient.registerDevice((deviceName as string)).catch(e => { throw e; });

    // create/re-use a bunq session installation
    await bunqClient.registerSession().catch(e => { throw e; });

    if(!bunqClient.Session.sessionId) throw Error('Error: could not create session');

    await setupFaceId();

    ToggleTabBarVisibility();
    history.push('/accounts');
    setShowLoading(false);
  }, [BunqClient, createOrRegenerateEncryptionKey, apiKey, deviceName, history ])

  const setupFaceId = async () => {
    const { FaceId } = Plugins;

    // NOTE: Biometrics not available
    const isAvailable = await FaceId.isAvailable();

    if(!isAvailable) {
      console.log('Biometrics not available');
      setFaceIdEnabled('false');
      return
    }

    // NOTE: Biometrics available, try to authenticated
    FaceId.auth().then((event: any, nice: any) => {
      console.log('authenticated');
      setFaceIdEnabled('true');
    }).catch((error: PluginResultError) => {
      // handle rejection errors
      console.error(error.message);
      setFaceIdEnabled('false')
      setPassword('')
    });
  }

  return (
    <form onSubmit={e => { e.preventDefault(); setupBunqClient(); }}>
      <IonLoading isOpen={showLoading} message={'Please wait...'} />
      <IonList>
        <IonItem>
          <IonLabel position="floating">Api key</IonLabel>
          <IonInput
            name='api_key'
            type='text'
            onIonChange={e => setApiKey((e.target as HTMLInputElement).value)}
            value={(apiKey as string)}
            required
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Device name</IonLabel>
          <IonInput
            name='device_name'
            type='text'
            onIonChange={e => setDeviceName((e.target as HTMLInputElement).value)}
            value={(deviceName as string)}
            required
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            name='password'
            type='password'
            onIonChange={e => setPassword((e.target as HTMLInputElement).value)}
            value={password as string}
            required
          />
        </IonItem>
      </IonList>

      <div className="ion-padding">
        <Flex width='100%' justifyContent="space-between" alignItems="center">
          <Flex flexGrow={1} marginRight="8px">
          <IonButton expand="block" type="submit" class="ion-no-margin" style={{width: '100%'}}>Login</IonButton>
          </Flex>
        </Flex>
      </div>
    </form>
  );
}

const SetupPage: React.FC = () => {
  return (
    <IonPage className='setup-page'>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login with Bunq API</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent slot="fixed" fullscreen scroll-y="false">
        <Flex minHeight='100vh' justifyContent="center" alignItems="center" flexGrow={1}>
          <IonCard style={{width: '100vw' }}>
            <Suspense fallback={<IonLoading isOpen={true} message={'Please wait...'} />}>
              <SetupForm />
            </Suspense>
          </IonCard>
        </Flex>
      </IonContent>
    </IonPage>
  );
};

export default SetupPage;
