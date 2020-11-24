import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonContent, IonText, IonList, IonItem, IonButton, IonLabel, IonBackButton } from '@ionic/react'
import { RouteComponentProps } from 'react-router';
import React, { useState } from 'react';
import '../App.css'
import './InfoPage.css';

interface ContainerProps extends RouteComponentProps<{
  id: string
}> {}


const InfoPage: React.FC<ContainerProps> = ({ match, history }) => { 
    const [ FrostData, displayFrost ] = useState(false);
    const toggleFrost = () => {
      displayFrost(!FrostData)
    }

    const [ LocationData, displayLocation ] = useState(false);
    const toggleLocation = () => {
      displayLocation(!LocationData)
    }

    const [ TeamData, displayTeam ] = useState(false);
    const toggleTeam = () => {
      displayTeam(!TeamData)
    }

    const [ PartnersData, displayPartners ] = useState(false);
    const togglePartners = () => {
      displayPartners(!PartnersData)
    }
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="app-toolbar">
            <IonButtons className="app-title-button app-left-title-button">
                <IonBackButton></IonBackButton>
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
          {
            FrostData
            ? <IonItem onClick={ toggleFrost }>
                <p>
                  All of the weather data presented on this app came directly 
                  from the National Oceanic and Atmospheric Administration (NOAA).
                </p>
              </IonItem>
            : <IonItem onClick={ toggleFrost }>
                <IonLabel>Frost Data</IonLabel>
              </IonItem>
          }
          {
            LocationData
            ? <IonItem onClick={ toggleLocation }>
                <p>
                The app uses location infromation from a variety of sources. 
                The user location is either obtained directly from the phone's GPS
                unit or it is obtained from API calls based on the zip code or 
                the city, state entered by the user. Once user loaction is obtained,
                the app uses the haversine formula to find the nearest NOAA weather 
                station.
                </p>
              </IonItem>
            : <IonItem onClick={ toggleLocation }>
                <IonLabel>Location Data</IonLabel>
              </IonItem>
          }
          {
            TeamData
            ? <IonItem onClick={ toggleTeam }>
                <p>This app was created by undergrads at Oregon State University as
                  part of thier capstone project.
                <ul>Developers:</ul>
                  <li>Andrew Clos</li>
                  <li>Kirsten Corrao</li>
                  <li>John Lebens</li></p>
              </IonItem>
            : <IonItem onClick={ toggleTeam }>
                <IonLabel>The Team</IonLabel>
              </IonItem>
          }
          {
            PartnersData
            ? <IonItem onClick={ togglePartners }>
                <p>
                Frost Finder App was a collaboration between Oregon State University 
                and the garden extension program.
                </p>
              </IonItem>
            : <IonItem onClick={ togglePartners }>
                <IonLabel>Our Partners</IonLabel>
              </IonItem>
          }
          </IonList>
        </IonContent>
      
    </IonPage>
  );
};
export default InfoPage;
