import React, { useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButton } from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './events.css';
import { BunqContext } from "../../providers/bunq_provider";

const EventsPage: React.FC = () => {
  const bunqClient = useContext(BunqContext);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Events</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Events</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Events page" />
      </IonContent>
    </IonPage>
  );
};

export default EventsPage;
