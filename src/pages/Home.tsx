import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import SubmitButton from '../components/SubmitButton';
import DataOutput from '../components/DataOutput';
import TextEntry from '../components/TextEntry';
import './Home.css';



const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Oregon Gardening</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Geolocation</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className = "homeContainer">
            <TextEntry/>
            <SubmitButton/>
            <DataOutput/>
        </div>
      </IonContent>
    </IonPage> 
  );
};

export default Home;
