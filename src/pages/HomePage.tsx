import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton } from '@ionic/react'
import { Link, RouteComponentProps } from 'react-router-dom';
import SubmitButton from '../components/SubmitButton';
import TextEntry from '../components/TextEntry';

const HomePage: React.FC<RouteComponentProps> = ({history}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Organic Gardening App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className = "homeContainer">
            <TextEntry/>
            <SubmitButton/>
        </div>
        <IonList>
          <IonItem>
            <IonButton onClick={e => {
              e.preventDefault();
              history.push('/dashboard/users/GHCND:USC00350265')
            }}>
              <IonLabel>Get Results</IonLabel>
            </IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;