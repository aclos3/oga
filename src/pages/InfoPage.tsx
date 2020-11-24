import { IonPage, IonHeader, IonLoading, IonToolbar, IonTitle, IonBackButton, IonButtons, IonIcon } from '@ionic/react';
import { helpCircle } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import React from 'react';
import '../App.css';
import './ResultsPage.css';

type ContainerProps = RouteComponentProps<{
  id: string;
}>

const InfoPage: React.FC<ContainerProps> = () => { 
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="results-toolbar">
            <IonButtons className="results-title-button">
              <IonBackButton />
            </IonButtons>
            <IonTitle className="results-title">Frost Date Finder</IonTitle>
            <IonIcon icon={helpCircle} className="results-title-button"></IonIcon>
          </div>
        </IonToolbar>
      </IonHeader>
    </IonPage>
  );
};
export default IonPage;
