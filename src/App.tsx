/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/shared.css';

import React, { Suspense, lazy, useEffect, useState } from 'react';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';

import { IonLoading } from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { analytics, list, wallet } from 'ionicons/icons';

import { Plugins, PluginResultError } from '@capacitor/core';

import useAxiosCache from './hooks/use_axios_cache';
import useXmlHttpRequestMonkeyPatch from './hooks/use_xml_http_request_monkey_patch';

import { RecoilRoot } from 'recoil';
import { Route, useHistory } from 'react-router-dom';
import ErrorBoundary from './components/error_boundary';

const AccountsPage = lazy(() => import('./pages/accounts/index'));
const EventsPage = lazy(() => import('./pages/events/index'));
const InsightsPage = lazy(() => import('./pages/insights/index'));
const LoginPage = lazy(() => import('./pages/login/index'));
const SetupPage = lazy(() => import('./pages/setup/index'));

const Router: React.FC = () => (
  <IonReactRouter>
    <IonTabs>
      <IonRouterOutlet>
          <Route path="/login" component={LoginPage} />
          <Route path="/accounts" component={AccountsPage}  />
          <Route path="/events" component={EventsPage}  />
          <Route path="/insights" component={InsightsPage}  />
          <Route path="/setup" component={SetupPage}  />
          <Route path="/" component={LoginPage} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="accounts" href="/accounts">
          <IonIcon icon={wallet} />
          <IonLabel>Accounts</IonLabel>
        </IonTabButton>
        <IonTabButton tab="events" href="/events">
          <IonIcon icon={list} />
          <IonLabel>Events</IonLabel>
        </IonTabButton>
        <IonTabButton tab="insights" href="/insights">
          <IonIcon icon={analytics} />
          <IonLabel>Insights</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonReactRouter>
);

const App: React.FC = () => {
  useXmlHttpRequestMonkeyPatch();
  useAxiosCache();
  /* useSessionGuard(); */
  return (
    <IonApp>
      <Suspense fallback={<IonLoading isOpen={true} message={'Please wait...'} />}>
        <ErrorBoundary>
          <RecoilRoot>
            <Router />
          </RecoilRoot>
        </ErrorBoundary>
      </Suspense>
    </IonApp>
  );
};

export default App;
