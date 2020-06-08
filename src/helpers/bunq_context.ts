import React from 'react';

import BunqJSClient from "@bunq-community/bunq-js-client";

export default React.createContext(new BunqJSClient());
