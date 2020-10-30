import React, { useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton } from '@ionic/react'
import { RouteComponentProps } from 'react-router-dom';
import SubmitButton from '../components/SubmitButton';
import TextEntry from '../components/TextEntry';
import { observable } from "mobx"
import { getClosestStation, Station } from '../utils/getClosestStation'

class HomePageState {
    @observable
    homeLat: number = 50
    setLat = (homeLat: number) => {
        this.homeLat = homeLat
        //console.log(`in setLat: `, homeLat, ` this.lat: `, this.homeLat)
    }
    @observable
    homeLong: number = -122
    setLong = (homeLong: number) => {
        this.homeLong = homeLong
    }

    @observable
    weatherStation: string = ""
    setWeatherStation = (newStation: string) => {
      this.weatherStation = newStation;
    }
}

const HomePage: React.FC<RouteComponentProps> = ({history}) => {
    const state = React.useRef(new HomePageState()).current

    const onLatLongChange = (lat: number, long: number) => {
      state.setLat(lat)
      state.setLong(long)

      const closestStation: Station | null = getClosestStation({lat: lat, long: long});

      if (closestStation) {
        state.setWeatherStation(closestStation.station);
        alert(`${state.weatherStation}, ${state.homeLat}, ${state.homeLong}`);
      }
      else {
        // TODO: error handling: get new input from user
      }
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
            <div>
              <h1>Lat: {state.homeLat}</h1>
              <h1>Long: {state.homeLong}</h1>
              <h1>Station: {state.weatherStation}</h1>
            </div>
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
