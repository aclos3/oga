import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonIcon } from '@ionic/react'
import { helpCircle, } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router-dom';
import DeviceLocation from '../components/DeviceLocation';
import TextEntry from '../components/TextEntry';
import '../App.css'
import './HomePage.css';

export interface ExportStation {
  latLong: string
} 

const HomePage: React.FC<RouteComponentProps> = ({history},props) => {
    const [lat, setLat] = useState<number>(0);
    const [long, setLong] = useState<number>(0);
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
          <div className="home-toolbar">
            <div className="home-title-button"></div>
            <IonTitle className="home-title">Frost Date Finder</IonTitle>
            <IonIcon icon={helpCircle} className="home-title-button"></IonIcon>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="home-container">
          <h1 className="page-header">Enter your location</h1>
          <div className="content-container">
            <IonCard className="location-card">
              <IonCardHeader>
                <IonCardTitle className="location-card-title">
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
                  <IonCardTitle className="location-card-title">
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
