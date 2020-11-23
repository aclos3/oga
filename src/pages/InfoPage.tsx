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
          <div className="results-toolbar">
            <IonButtons className="results-title-button">
              <IonBackButton />
            </IonButtons>
            <IonTitle className="results-title">Frost Date Finder</IonTitle>
            <IonIcon icon={helpCircle} className="results-title-button"></IonIcon>
          </div>
        </IonToolbar>
        <IonContent>
          <IonText>
            <h1 className='about-title'>
              About The App
            </h1>
          </IonText>
        </IonContent>
      </IonHeader>
    </IonPage>
  );
};
export default InfoPage;
