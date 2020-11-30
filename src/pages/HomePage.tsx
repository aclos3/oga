/*
Some Source code for reference:
https://stackblitz.com/edit/ionic-react-routing?file=src%2Fpages%2FDashboardPage.tsx
https://www.sitepoint.com/onclick-html-attribute/
*/
import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonIcon, IonButtons, IonButton } from '@ionic/react';
import { helpCircle, } from 'ionicons/icons';
import PropTypes from 'prop-types';
import { RouteComponentProps } from 'react-router-dom';
import DeviceLocation from '../components/DeviceLocation';
import TextEntry from '../components/TextEntry';
import '../App.css';
import './HomePage.css';

export interface ExportStation {
  latLong: string;
} 

const HomePage: React.FC<RouteComponentProps> = ({history}) => {
  //this function fires when either the 'Use My Location' or 'Submit' buttons on the homepage are clicked.
  const onLatLongChange =  (newLat: number, newLong: number, newElev: number) => {
    const userLoc = `${newLat.toString()},${newLong.toString()},${newElev.toString()}`;
    //the string is pushed to the dashboard as part of the url to be used by the next page (results page)
    history.push(`/dashboard/results/${userLoc}`);
        
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className='app-toolbar'>
            <div className='app-title-button'>
              <img className="logo" src="/assets/osu_crest.png" alt="Oregon State University Logo"/>
            </div>
            <IonTitle className='app-title'>Frost Date Finder</IonTitle>
            <div className='app-title-button app-right-title-button'>
              <IonButtons>
                <IonButton onClick={e => {
                  e.preventDefault();
                  history.push('/dashboard/info');
                }}>
                  <IonIcon icon={helpCircle} class='app-icon'></IonIcon>
                </IonButton>
              </IonButtons>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className='app-page-container'>
          <h1 className='app-page-header'>Enter your location</h1>
          <IonCard className='location-card'>
            <IonCardHeader>
              <IonCardTitle className='location-card-title'>
                  Use your device&apos;s location
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <DeviceLocation
                onSubmit={onLatLongChange}
              ></DeviceLocation>
            </IonCardContent>
          </IonCard>
          <IonCard className='location-card'>
            <IonCardHeader>
              <IonCardTitle className='location-card-title'>
                  Enter your zip code or city, state
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <TextEntry
                onSubmit={onLatLongChange}
              ></TextEntry>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

HomePage.propTypes = {
  history: PropTypes.any.isRequired
};

export default HomePage;
