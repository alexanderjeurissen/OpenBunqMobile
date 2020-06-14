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

import Flex from "react-flex-primitive";

import BunqErrorHandler from "../../helpers/bunq_error_handler";
import ToggleTabBarVisibility from "../../helpers/tab_bar";

import ObjType from '../../types/obj_type';

import useSecureStorageItem from '../../hooks/use_secure_storage_item';

import BunqClient, { BunqClientInterface } from '../../atoms/bunq_client';
import CurrentUserIdState from '../../atoms/current_user_id_state';
import DerivedPasswordSelector from '../../selectors/derived_password_selector';
import { useSetRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';

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

  const initializeBunqClient = useRecoilCallback(async ({getPromise}) => {
    setShowLoading(true);
    console.log('we are here');
    const derivedPassword: ObjType = await getPromise(DerivedPasswordSelector);
    console.log('wow');
    console.info(JSON.stringify(derivedPassword));
    // load and refresh bunq client
    await bunqClient
      .run((apiKey as string), ['*'], 'PRODUCTION', derivedPassword.key)
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

    ToggleTabBarVisibility();
    history.push('/accounts');
    setShowLoading(false);
  }, [ bunqClient, apiKey, deviceName, history ])

  const unlockWithFaceId = async () => {
    const { FaceId } = Plugins;

    // NOTE: Biometrics not available
    const isAvailable = await FaceId.isAvailable();

    if(!isAvailable) {
      setFaceIdEnabled('false')
      history.push('/setup');
      return
    }

    // NOTE: Biometrics available, try to authenticated
    FaceId.auth().then(() => {
      console.info('authenticated');
      setFaceIdEnabled('true');
      initializeBunqClient();
    }).catch(async (error: PluginResultError) => {
      console.error(error);
      setPassword('');
      setShowLoading(false);
      history.push('/setup');
      throw error;
    });
  };

  useEffect(() => {
    const login = async () => {
      /* throw new Error(`apiKey: ${apiKey}, password: ${password} faceIdEnabled: ${faceIdEnabled}`) */
      if(apiKey && password && faceIdEnabled === 'true') {
        await unlockWithFaceId();
      } else {
        setShowLoading(false);
        history.push('/setup');
      }
    }

    login();
  }, [])

  return (
    <IonPage className='login-page'>
      <IonContent slot="fixed" fullscreen scroll-y="false">
        <Flex minHeight='100vh' justifyContent="center" alignItems="flex-start" flexGrow={1}>
          <IonLoading isOpen={showLoading} message={'Looking for existing credentials...'} />
        </Flex>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
