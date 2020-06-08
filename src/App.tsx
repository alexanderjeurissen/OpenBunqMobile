import React from 'react';
import { Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { analytics, list, wallet } from 'ionicons/icons';
import AccountsPage from './pages/accounts/index';
import EventsPage from './pages/events/index';
import InsightsPage from './pages/insights/index';
import LoginPage from './pages/login/index';

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

import BunqJSClient from '@bunq-community/bunq-js-client';
import CapacitorStore from './helpers/CapacitorStore';
import BunqContext from './helpers/bunq_context';

import ProtectedRoute from './components/protected_route';

const App: React.FC = () => {
  const bunqClient = new BunqJSClient(CapacitorStore());

  return (
    <IonApp>
      <BunqContext.Provider value={bunqClient}>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/login" component={LoginPage} />
              <ProtectedRoute path="/accounts" component={AccountsPage}  />
              <ProtectedRoute path="/events" component={EventsPage}  />
              <ProtectedRoute path="/insights" component={InsightsPage}  />
              <ProtectedRoute path="/" component={AccountsPage} />
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
      </BunqContext.Provider>
    </IonApp>
  );
};

export default App;
