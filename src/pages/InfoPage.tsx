import { IonPage, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonIcon, IonContent, IonText, IonList, IonItem } from '@ionic/react'
import { helpCircle} from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import React from 'react';
import '../App.css'
import './InfoPage.css';

interface ContainerProps extends RouteComponentProps<{
}> {}


const InfoPage: React.FC<ContainerProps> = ({ match, history }) => { 
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="app-toolbar">
            <IonButtons className="app-title-button app-left-title-button">
              <IonBackButton />
            </IonButtons>
            <IonTitle className="results-title">Frost Date Finder</IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>
        <IonContent>
          <IonText>
            <h1 className='about-title'> About Page</h1>
          </IonText>
          <IonList>
            <IonItem><a href="/dashboard/info#frost-data"> Frost Data </a></IonItem>
            <IonItem><a href="/dashboard/info#location-data"> Location Data </a></IonItem>
            <IonItem><a href="/dashboard/info#the-team"> The Team </a></IonItem>
            <IonItem><a href="/dashboard/info#our-partners"> Our Partners </a></IonItem>
            <div id="frost-data">
              <h3>Frost Data</h3>
                <p>All of the weather data presented on this app came directly 
                  from the National Oceanic and Atmospheric Administration (NOAA). </p>
            </div>
            <div id="location-data">
              <h3>Location Data</h3>
            </div>
            <div id="the-team">
              <h3>The Team</h3>
            </div>
            <div id="our-partners">
              <h3>Our Partners</h3>
            </div>
          </IonList>
        </IonContent>
      
    </IonPage>
  );
};
export default InfoPage;
