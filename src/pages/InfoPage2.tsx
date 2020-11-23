import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonContent, IonText, IonList, IonItem, IonButton } from '@ionic/react'
import { RouteComponentProps } from 'react-router';
import React from 'react';
import '../App.css'
import './InfoPage2.css';
import { arrowBack } from 'ionicons/icons';

interface ContainerProps extends RouteComponentProps<{
}> {}

const InfoPage2: React.FC<ContainerProps> = ({ match, history }) => { 
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="app-toolbar">
            <IonButtons className="app-title-button app-left-title-button">
              <IonButton href="/dashboard">
                <IonIcon icon={arrowBack}> </IonIcon>
              </IonButton>
            </IonButtons>
            <IonTitle className="results-title">Frost Date Finder</IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>
        <IonContent scrollEvents={true}>
          <IonText>
            <h1 className='about-title'> About Page</h1>
          </IonText>
          <IonList>
            <IonItem><a href="/dashboard/info2#frost-data"> Frost Data </a></IonItem>
            <IonItem><a href="/dashboard/info2#location-data"> Location Data </a></IonItem>
            <IonItem><a href="/dashboard/info2#the-team"> The Team </a></IonItem>
            <IonItem><a href="/dashboard/info2#our-partners"> Our Partners </a></IonItem>
            <div id="frost-data">
              <h3>Frost Data</h3>
                <p>All of the weather data presented on this app came directly 
                  from the National Oceanic and Atmospheric Administration (NOAA). </p>
            </div>
            <div id="location-data">
              <h3>Location Data</h3>
              <p>The app uses location infromation from a variety of sources. 
                The user location is either obtained directly from the phone's GPS
                unit or it is obtained from API calls based on the zip code or 
                the city, state entered by the user. Once user loaction is obtained,
                the app uses the haversine formula to find the nearest NOAA weather 
                station.
              </p>
            </div>
            <div id="the-team">
              <h3>The Team</h3>
              <p>This app was created by undergrads at Oregon State University as
                part of thier capstone project. </p>
                <ul>The Team:</ul>
                <li>Andrew Clos</li>
                <li>Kirsten Corrao</li>
                <li>John Lebens</li>
            </div>
            <div id="our-partners">
              <h3>Our Partners</h3>
              <p>Frost Finder App was a collaboration between Oregon State University 
                and the garden extension program.
              </p>
            </div>
          </IonList>
        </IonContent>
      
    </IonPage>
  );
};
export default InfoPage2;
