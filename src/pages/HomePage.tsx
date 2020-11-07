import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle } from '@ionic/react'
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
          <IonTitle className="title">Oregon Gardening Application</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="home-container">
          <h3>Get Your Frost Dates</h3>
          <div className="content-container">
            <div className="content-row">
              <IonCard className="location-card">
                <IonCardHeader>
                  <IonCardTitle>
                    Use your device's location
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <DeviceLocation
                    initialLat={lat}
                    initialLong={long}
                    onSubmit={onLatLongChange}
                  ></DeviceLocation>
                </IonCardContent>
              </IonCard>
            </div>
            <div className="content-row">
              <IonCard className="location-card">
                  <IonCardHeader>
                    <IonCardTitle>
                      Enter your zip code or city, state
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <TextEntry
                      initialLat={lat}
                      initialLong={long}
                      onSubmit={onLatLongChange}
                    ></TextEntry>
                  </IonCardContent>
                </IonCard>
            </div> 
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
