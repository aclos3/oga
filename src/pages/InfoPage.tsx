import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import React from 'react';
import '../App.css';
import './InfoPage.css';

type ContainerProps = RouteComponentProps<{
}>

const InfoPage: React.FC<ContainerProps> = () => { 
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="app-toolbar">
            <IonButtons className="app-title-button app-left-title-button">
              <IonBackButton></IonBackButton>
            </IonButtons>
            <IonTitle className="app-title">Frost Date Finder</IonTitle>
            <div className="app-title-button app-right-title-button"></div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="app-page-container">
          <h1 className="app-page-header"> About Page</h1>

          <IonCard className="app-card">
            <IonCardHeader className="info-card-header">
              <IonCardTitle className="app-card-title info-card-title">Frost Data</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                The climate data presented on this application comes directly 
                from the National Oceanic and Atmospheric Administration (NOAA). Specifically, NOAA's 
                <a href="https://www.ncdc.noaa.gov/data-access/land-based-station-data/land-based-datasets/climate-normals/1981-2010-normals-data" target="_blank" rel="noopener noreferrer">
                1981-2010 U.S. Climate Normals.</a>
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard className="app-card">
            <IonCardHeader className="info-card-header">
              <IonCardTitle className="app-card-title info-card-title">Location Data</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                This application uses location information from several sources. 
                The user location is either obtained directly from the device GPS or browser
                or it is obtained from API calls based on the zip code or 
                the city and state entered by the user. Once the user's loaction is obtained,
                the app employs the Haversine formula to determine the nearest NOAA weather 
                stations.
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard className="app-card">
            <IonCardHeader className="info-card-header">
              <IonCardTitle className="app-card-title info-card-title">Development Team</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                The Frost Date Finder App was a collaboration between Oregon State University Extension Service and the 
                Oregon State University College of Engineering.This application was created by a team of three computer science undergraduates
                as part of their senior capstone project: Andrew Clos, Kirsten Corrao, and John Lebens. 
              </p>
            </IonCardContent>
          </IonCard>

        </div>
      </IonContent>
    </IonPage>
  );
};
export default InfoPage;
