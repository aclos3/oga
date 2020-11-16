import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle } from '@ionic/react'
import { RouteComponentProps } from 'react-router-dom';
import DeviceLocation from '../components/DeviceLocation';
import TextEntry from '../components/TextEntry';
import { Station } from '../utils/getClosestStation'
import './HomePage.css';

export interface ExportStation {
  latLong: string
} 

const HomePage: React.FC<RouteComponentProps> = ({history},props) => {
    const [lat, setLat] = useState<number>(0);
    const [long, setLong] = useState<number>(0);
    const [weatherStation, setWeatherStation] = useState<Station>({
        station: "",
        latitude: 0,
        longitude: 0,
        elevation: 0,
        state: "",
        city: "",
        distance: 888888
    });

    const onLatLongChange =  (newLat: number, newLong: number) => {
        setLat(newLat);
        setLong(newLong);
        let noaa_station = newLat.toString() + `_` + newLong.toString()
        history.push('/dashboard/station/' + noaa_station);
    }
    
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="home-title">Frost Date Finder</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="home-container">
          <h3>Get Your Frost Dates</h3>
          <div className="content-container">
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
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
