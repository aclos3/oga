import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton } from '@ionic/react'
import { RouteComponentProps } from 'react-router-dom';
import DeviceLocation from '../components/DeviceLocation';
import TextEntry from '../components/TextEntry';
import ViewLatLongStation from '../components/DisplayLatLongStation';
import { observable } from "mobx"
import { getClosestStation, Station } from '../utils/getClosestStation'

const HomePage: React.FC<RouteComponentProps> = ({history}) => {
    const [lat, setLat] = useState<number>(0);
    const [long, setLong] = useState<number>(0);
    const [weatherStation, setWeatherStation] = useState<Station>({
      station: "",
      latitude: 0,
      longitude: 0
    });

    const onLatLongChange =  (newLat: number, newLong: number) => {
      setLat(newLat);
      setLong(newLong);

      const closestStation: Station | null = getClosestStation({lat: newLat, long: newLong});

      if (closestStation) {
        setWeatherStation(closestStation);
        console.log(`${weatherStation.station}, ${weatherStation.latitude}, ${weatherStation.longitude}`);
        history.push('/dashboard/users/GHCND:USC00350265');
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
            <ViewLatLongStation
              lat={lat}
              long={long}
              stationName={weatherStation.station}
            />
            <TextEntry
                initialLat={lat}
                initialLong={long}
                onSubmit={onLatLongChange}
            ></TextEntry>
            <br></br>
            <DeviceLocation
                initialLat={lat}
                initialLong={long}
                onSubmit={onLatLongChange}
            ></DeviceLocation>
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
