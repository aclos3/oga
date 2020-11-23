import { IonPage, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonIcon, IonContent, IonText } from '@ionic/react'
import { helpCircle} from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import React from 'react';
import '../App.css'
import './InfoPage.css';

interface ContainerProps extends RouteComponentProps<{
}> {}

const InfoPage: React.FC<ContainerProps> = ({ match, history }) => { 
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="app-toolbar">
            <IonButtons className="app-title-button app-left-title-button">
              <IonBackButton />
            </IonButtons>
            <IonTitle className="results-title">Frost Date Finder</IonTitle>
          </div>
        </IonToolbar>
        <IonContent>
          <IonText>
            <h1 className='about-title'>
              About The App
            </h1>
            <p>This app was designed and created by a group of </p>
          </IonText>
        </IonContent>
      </IonHeader>
    </IonPage>
  );
};
export default InfoPage;
