import React, { useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton } from '@ionic/react'
import { RouteComponentProps } from 'react-router-dom';
import SubmitButton from '../components/SubmitButton';
import TextEntry from '../components/TextEntry';
import { observable } from "mobx"

class HomePageState {
    @observable
    homeLat: Number = 50
    setLat = (homeLat: Number) => {
        this.homeLat = homeLat
        //console.log(`in setLat: `, homeLat, ` this.lat: `, this.homeLat)
    }
    @observable
    homeLong: Number = -122
    setLong = (homeLong: Number) => {
        this.homeLong = homeLong
    }
}

const HomePage: React.FC<RouteComponentProps> = ({history}) => {
    const state = React.useRef(new HomePageState()).current
    const onLatLongChange = (lat: Number, long: Number) => {
        state.setLat(lat)
        state.setLong(long)
    }
    
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Organic Gardening App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className = "homeContainer">
            <TextEntry
                initialLat={state.homeLat}
                initialLong={state.homeLong}
                onSubmit={onLatLongChange}
            ></TextEntry>
            <br></br>
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
