import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons } from '@ionic/react'
import { RouteComponentProps } from 'react-router';
import DataOutput from '../components/DataOutput';

interface ResultsPageProps extends RouteComponentProps<{
  id: string;
}> {}

const ResultsPage: React.FC<ResultsPageProps> = ({match, history}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Freeze Dates</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <br />
        Station ID: {match.params.id}
        <DataOutput/>
      </IonContent>
    </IonPage>
  );
};

export default ResultsPage;