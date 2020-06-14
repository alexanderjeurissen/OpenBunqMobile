import React, { useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButton } from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './insights.css';

const InsightsPage: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Insights</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Insights</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Insights page" />
      </IonContent>
    </IonPage>
  );
};

export default InsightsPage;
