import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react'
import { RouteComponentProps } from 'react-router-dom';
import DeviceLocation from '../components/DeviceLocation';
import TextEntry from '../components/TextEntry';
import ViewLatLongStation from '../components/DisplayLatLongStation';
import { observable } from "mobx"
import { getClosestStation, Station } from '../utils/getClosestStation'
import './HomePage.css';

export interface ExportStation {
  station: string
} 

const HomePage: React.FC<RouteComponentProps> = ({history},props) => {
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
        console.log(`${weatherStation.station}, ${weatherStation.latitude}, ${weatherStation.longitude}`);
        let noaa_station = closestStation.station;
        history.push('/dashboard/station/' + noaa_station);
      }
      else {
        // TODO: error handling: get new input from user
      }
    }
    
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Oregon Gardening Application</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="home-container">
          <h3>Get Your Frost Dates</h3>
          <div className="content-container">
            <div className="content-row">
              <h6>Use your device's location</h6>
              <DeviceLocation
                    initialLat={lat}
                    initialLong={long}
                    onSubmit={onLatLongChange}
              ></DeviceLocation>
            </div>
            <div className="content-row">
              <h6>Enter your zip code or city, state</h6>
              <TextEntry
                    initialLat={lat}
                    initialLong={long}
                    onSubmit={onLatLongChange}
                ></TextEntry>
            </div> 
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
