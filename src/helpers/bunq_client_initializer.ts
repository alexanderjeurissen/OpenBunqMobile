// import { useCallback } from 'react';

// export default useCallback(async () => {
//     setShowLoading(true);
//     // load and refresh bunq client
//     await bunqClient
//       .run((apiKey as string), ['*'], 'PRODUCTION', await createOrRegenerateEncryptionKey())
//       .catch((exception: any) => {
//         BunqErrorHandler(exception)
//         throw exception;
//       });

//     // disable keep-alive since the server will stay online without the need for a constant active session
//     bunqClient.setKeepAlive(false);

//     // create/re-use a system installation
//     await bunqClient.install();

//     // create/re-use a device installation
//     await bunqClient.registerDevice((deviceName as string));

//     // create/re-use a bunq session installation
//     await bunqClient.registerSession();

//     if(!bunqClient.Session.sessionId) return;
//     const userInfo = Object.values(bunqClient.Session.userInfo)[0] as ObjType;
//     setCurrentUserID(userInfo.id);

//     await setupFaceId();

//     ToggleTabBarVisibility();
//     history.push('/accounts');
//     setShowLoading(false);
//   }, [BunqClient, createOrRegenerateEncryptionKey, apiKey, deviceName, history, setCurrentUserID])

export default () => {};
