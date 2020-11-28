import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonText, IonList, IonItem, IonLabel, IonBackButton, IonButton, IonItemDivider, IonIcon, IonTabButton, IonTabs, IonTabBar } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import React, { useState } from 'react';
import '../App.css';
import './InfoPage.css';
import { calendar, pulseSharp } from 'ionicons/icons';

type ContainerProps = RouteComponentProps<{
}>

const InfoPage: React.FC<ContainerProps> = ({ match, history }) => { 
  const [ FrostData, displayFrost ] = useState(false);
  const toggleFrost = () => {
    displayFrost(!FrostData);
  };

  const [ LocationData, displayLocation ] = useState(false);
  const toggleLocation = () => {
    displayLocation(!LocationData);
  };

  const [ TeamData, displayTeam ] = useState(false);
  const toggleTeam = () => {
    displayTeam(!TeamData);
  };

  const [ PartnersData, displayPartners ] = useState(false);
  const togglePartners = () => {
    displayPartners(!PartnersData);
  };
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
        <IonText>
          <h1 className='about-title'> About Page</h1>
        </IonText>
        <IonList className = "toggleItems">
          <IonItem detail onClick ={ toggleFrost }>
            {
              FrostData
              ? 
                <p>
                  <h4><u>Frost Data:</u></h4>
                The climate data presented on this application comes directly 
                from the National Oceanic and Atmospheric Administration (NOAA). Specifically, NOAA's 
                <a href="https://www.ncdc.noaa.gov/data-access/land-based-station-data/land-based-datasets/climate-normals/1981-2010-normals-data" target="_blank" rel="noopener noreferrer">
                  1981-2010 U.S. Climate Normals.</a>
                </p>
              : 
                <h3>Frost Data</h3>
            }
          </IonItem>
          <IonItem detail onClick={ toggleLocation }>
            {
              LocationData
              ?
                <p>
                  <h4><u>Location Data:</u></h4>
                This application uses location information from several sources. 
                The user location is either obtained directly from the device GPS or browser
                or it is obtained from API calls based on the zip code or 
                the city and state entered by the user. Once the user's loaction is obtained,
                the app employs the Haversine formula to determine the nearest NOAA weather 
                stations.
                </p>
              : 
                <h3>Location Data</h3>
            }
          </IonItem>
          <IonItem detail onClick={ toggleTeam }>
          {
            TeamData
            ? 
              <p>
                <h4><u>The Team:</u></h4>
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
            : 
              <h3> Development Team</h3>          }
          </IonItem>
          <IonItem detail onClick={ togglePartners }>
            {
            PartnersData
            ?
              <p>
                <h4><u>Our Partners:</u></h4>
              The Frost Date Finder App was a collaboration between Oregon State University 
              and Oregon State University Extension Service.
              </p>
            : 
              <h3>Our Partners</h3>
            }
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
export default InfoPage;
