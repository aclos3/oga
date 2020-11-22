import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonIcon } from '@ionic/react'
import { helpCircle, } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router-dom';
import DeviceLocation from '../components/DeviceLocation';
import TextEntry from '../components/TextEntry';
import { Station } from '../utils/getClosestStation'
import '../App.css'
import './HomePage.css';

export interface ExportStation {
  latLong: string
} 

const HomePage: React.FC<RouteComponentProps> = ({history},props) => {
    const [lat, setLat] = useState<number>(0);
    const [long, setLong] = useState<number>(0);
    const [elev, setElev] = useState<number>(0);
    const [weatherStation, setWeatherStation] = useState<Station>({
        station: "",
        latitude: 0,
        longitude: 0,
        elevation: 0,
        state: "",
        city: "",
        distance: 888888
    });

    const onLatLongChange =  (newLat: number, newLong: number, newElev: number) => {
        setLat(newLat)
        setLong(newLong)
        setElev(newElev)
        let userLoc = newLat.toString() + `,` + newLong.toString() + `,` + newElev.toString()
        history.push('/dashboard/station/' + userLoc);
    }
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="app-toolbar">
            <div className="app-title-button"></div>
            <IonTitle className="app-title">Frost Date Finder</IonTitle>
            <div className="app-title-button app-right-title-button">
              <IonIcon icon={helpCircle} id="question-icon"></IonIcon>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="app-page-container">
          <h1 className="app-page-header">Enter your location</h1>
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
                  initialElev={elev}
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
                    initialElev={elev}
                    onSubmit={onLatLongChange}
                  ></TextEntry>
                </IonCardContent>
              </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default HomePage;
