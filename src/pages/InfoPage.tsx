import { IonPage, IonHeader, IonLoading, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonPopover, IonButton, IonIcon } from '@ionic/react';
import { helpCircle, arrowBackCircle } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import { getClosestStationList, Station, getFrostData, FrostData } from '../utils/getClosestStation';
import React, {useEffect, useState} from 'react';
import '../App.css';
import './ResultsPage.css';
import DisplayFrostDates from '../components/DisplayFrostDates';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

type ContainerProps = RouteComponentProps<{
    id: string;
}>

const InfoPage: React.FC<ContainerProps> = ({ match }) => { 
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="results-toolbar">
            <IonButtons className="results-title-button">
              <IonBackButton />
            </IonButtons>
            <IonTitle className="results-title">Frost Date Finder</IonTitle>
            <IonIcon icon={helpCircle} className="results-title-button"></IonIcon>
          </div>
        </IonToolbar>
      </IonHeader>
    </IonPage>
  );
};
export default IonPage;
