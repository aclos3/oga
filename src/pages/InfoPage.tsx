import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonContent, IonText, IonList, IonItem, IonButton, IonLabel, IonBackButton } from '@ionic/react'
import { RouteComponentProps } from 'react-router';
import React, { useState } from 'react';
import '../App.css'
import './InfoPage.css';

interface ContainerProps extends RouteComponentProps<{
  id: string
}> {}


const InfoPage: React.FC<ContainerProps> = ({ match, history }) => { 
    const [ FrostData, displayFrost ] = useState(true);
    const toggleFrost = () => {
      displayFrost(!FrostData)
    }

    const [ LocationData, displayLocation ] = useState(true);
    const toggleLocation = () => {
      displayLocation(!LocationData)
    }

    const [ TeamData, displayTeam ] = useState(true);
    const toggleTeam = () => {
      displayTeam(!TeamData)
    }

    const [ PartnersData, displayPartners ] = useState(true);
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
            <h1 className='about-title'>About Page</h1>
          </IonText>
          <IonList>
          {
            FrostData
            ? <IonItem>
                <p><h3><u>Frost Data:</u></h3>
                  The climate data presented on this application comes directly 
                  from the National Oceanic and Atmospheric Administration (NOAA). Specifically, NOAA's 
                  <a href="https://www.ncdc.noaa.gov/data-access/land-based-station-data/land-based-datasets/climate-normals/1981-2010-normals-data" target="_blank">
                      1981-2010 U.S. Climate Normals.</a>
                </p>
              </IonItem>
            : <IonItem>
                <IonLabel>Frost Data</IonLabel>
              </IonItem>
          }
          {
            LocationData
            ? <IonItem>
                <p><h3><u>Location Data:</u></h3>
                This application uses location information from several sources. 
                The user location is either obtained directly from the device GPS or browser
                or it is obtained from API calls based on the zip code or 
                the city and state entered by the user. Once the user's loaction is obtained,
                the app employs the haversine formula to determine the nearest NOAA weather 
                stations.
                </p>
              </IonItem>
            : <IonItem>
                <IonLabel>Location Data</IonLabel>
              </IonItem>
          }
          {
            TeamData
            ? <IonItem>
                <p><h3><u>The Team:</u></h3>
                This application was created by a team of three undergraduates at Oregon State University as
                  part of their senior capstone project. 
                <br/><br/>
                    <u>Developers:</u>
                
                    <ul>
                        <li>Andrew Clos</li>
                        <li>Kirsten Corrao</li>
                        <li>John Lebens</li>
                    </ul>
                </p>
              </IonItem>
            : <IonItem>
                <IonLabel>The Team</IonLabel>
              </IonItem>
          }
          {
            PartnersData
            ? <IonItem>
                <p><h3><u>Our Partners:</u></h3>
                The Frost Finder App was a collaboration between Oregon State University 
                and the garden extension program.
                </p>
              </IonItem>
            : <IonItem>
                <IonLabel>Our Partners</IonLabel>
              </IonItem>
          }
          </IonList>
        </IonContent>
      
    </IonPage>
  );
};
export default InfoPage;
