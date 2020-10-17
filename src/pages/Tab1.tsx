import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import SubmitButton from '../components/SubmitButton';
import './Tab1.css';
import { isConstructorDeclaration } from 'typescript';


const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Oregon Gardening</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SubmitButton/>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
