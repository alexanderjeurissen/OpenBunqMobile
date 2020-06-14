import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { IonLoading } from '@ionic/react';

import { Plugins, PluginResultError } from '@capacitor/core';

import Flex from "../../components/flex";

import BunqErrorHandler from "../../helpers/bunq_error_handler";
import { derivePassword }  from "../../helpers/encryption";
import ToggleTabBarVisibility from "../../helpers/tab_bar";
import Storage from '../../helpers/capacitor_store';

import ObjType from '../../types/obj_type';

import useSecureStorageItem from '../../hooks/use_secure_storage_item';

import BunqClient, { BunqClientInterface } from '../../atoms/bunq_client';
import CurrentUserIdState from '../../atoms/current_user_id_state';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';

import './login.css';


const LoginPage: React.FC = () => {
  const bunqClient: BunqClientInterface = useRecoilValue(BunqClient);
  const [ apiKey ] = useSecureStorageItem('BUNQ_API_KEY', '');
  const [ deviceName ] = useSecureStorageItem('BUNQ_DEVICE_NAME', 'Open Bunq Mobile');
  const [ faceIdEnabled, setFaceIdEnabled ] = useSecureStorageItem('BUNQ_FACE_ID_ENABLED', 'false');
  const [ password, setPassword ] = useSecureStorageItem('BUNQ_PASSWORD', '');
  const [ showLoading, setShowLoading ] = useState(true);
  const setCurrentUserID = useSetRecoilState(CurrentUserIdState);

  let history = useHistory();

  // NOTE: fetch stored config parameters
  useEffect(() => {
    ToggleTabBarVisibility();
  }, [])

  const regenerateEncryptionKey = useCallback(async () => {
    // NOTE: try to fetch the encryption IV from secure storage.
    // If it does not exist, generate a new encryption key using a new IV
    // and the provided password
    const encryptionIv = await Storage.get('BUNQ_ENCRYPTION_IV')

    const derivedInfo = derivePassword(password as string, 32, (encryptionIv === null) ? false : encryptionIv);

    return derivedInfo.key;
  }, [password]);

  const initializeBunqClient = useCallback(async () => {
    setShowLoading(true);
    // load and refresh bunq client
    await bunqClient
      .run((apiKey as string), ['*'], 'PRODUCTION', await regenerateEncryptionKey())
      .catch((exception: any) => {
        BunqErrorHandler(exception)
        throw exception;
      });

    // disable keep-alive since the server will stay online without the need for a constant active session
    bunqClient.setKeepAlive(false);

    // create/re-use a system installation
    await bunqClient.install();

    // create/re-use a device installation
    await bunqClient.registerDevice((deviceName as string));

    // create/re-use a bunq session installation
    await bunqClient.registerSession();

    if(!bunqClient.Session.sessionId) return;
    const userInfo = Object.values(bunqClient.Session.userInfo)[0] as ObjType;
    setCurrentUserID(userInfo.id);

    ToggleTabBarVisibility();
    history.push('/accounts');
    setShowLoading(false);
  }, [BunqClient, regenerateEncryptionKey, apiKey, deviceName, history, setCurrentUserID])

  const unlockWithFaceId = async () => {
    const { FaceId } = Plugins;

    // NOTE: Biometrics not available
    const isAvailable = await FaceId.isAvailable();

    if(!isAvailable) {
      setPassword('');
      setFaceIdEnabled('false')
      setTimeout(unlockWithFaceId, 500);
      return
    }

    // NOTE: Biometrics available, try to authenticated
    FaceId.auth().then(() => {
      console.log('authenticated');
      setFaceIdEnabled('true');
      initializeBunqClient();
    }).catch((error: PluginResultError) => {
      // handle rejection errors
      console.error(error.message);
      setPassword('');
      setShowLoading(false);
      history.push('/setup');
    });
  };

  useEffect(() => {
    const login = async () => {
      if(apiKey !== '' && password !== '' && faceIdEnabled === 'true') {
        await unlockWithFaceId();
      } else {
        setShowLoading(false);
        history.push('/setup');
      }
    }

    login();
  }, [apiKey, faceIdEnabled, password])

  return (
    <IonPage className='login-page'>
      <IonHeader>
        <IonToolbar>
        </IonToolbar>
      </IonHeader>
      <IonContent slot="fixed" fullscreen scroll-y="false">
        <Flex minHeight='100vh' justifyContent="center" alignItems="flex-start" flexGrow={1}>
          <IonLoading isOpen={showLoading} message={'Looking for existing credentials...'} />
        </Flex>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
