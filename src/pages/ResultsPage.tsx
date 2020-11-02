//import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons } from '@ionic/react'
import { RouteComponentProps } from 'react-router';

import React, {useEffect, useState} from 'react';
import { observable } from "mobx"
import { IonButton, IonLoading, IonToast } from '@ionic/react';
import moment from "moment-timezone"
import { momentToDate } from "../utils/utils"
import get_NOAA_API_Key from './get_NOAA_API_Key';
//Station
var d = new Date()
const THIS_YEAR = d.getFullYear()

interface ContainerProps {}
interface DataError {
    showError: boolean;
    message?: string;
}

interface ContainerProps extends RouteComponentProps<{
  id: string;
}> {}

interface FrostDatesJulian {
  light: number,
  moderate: number,
  severe: number
}

interface FrostDates {
  light: Date,
  moderate: Date,
  severe: Date
}

const ResultsPage: React.FC<ContainerProps> = ({match, history}) => { 
  const [stationID, setStation] = useState<string>(match.params.id);
  const [springFrostJulian, setSpringFrostJulian] = useState<FrostDatesJulian>({light: 0, moderate: 0, severe: 0});
  const [fallFrostJulian, setFallFrostJulian] = useState<FrostDatesJulian>({light: 0, moderate: 0, severe: 0});
  const [frostFreeJulian, setFrostFreeJulian] = useState<FrostDatesJulian>({light: 0, moderate: 0, severe: 0});
  const [springFrostDates, setSpringFrostDates] = useState<FrostDates>({light: new Date(new Date().getFullYear(), 0, 1), moderate: new Date(new Date().getFullYear(), 0, 1), severe: new Date(new Date().getFullYear(), 0, 1)});
  const [fallFrostDates, setFallFrostDates] = useState<FrostDates>({light: new Date(), moderate: new Date(), severe: new Date()});

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<DataError>({ showError: false });
  let myData: { results: { value: any; }[]; };
  const apiStr = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=NORMAL_ANN&datatypeid=ANN-TMIN-PRBLST-T24FP90&datatypeid=ANN-TMIN-PRBLST-T28FP90&datatypeid=ANN-TMIN-PRBLST-T32FP90&datatypeid=ANN-TMIN-PRBFST-T24FP90&datatypeid=ANN-TMIN-PRBFST-T28FP90&datatypeid=ANN-TMIN-PRBFST-T32FP90&datatypeid=ANN-TMIN-PRBGSL-T24FP90&datatypeid=ANN-TMIN-PRBGSL-T28FP90&datatypeid=ANN-TMIN-PRBGSL-T32FP90&startdate=2010-01-01&enddate=2010-01-01';

  // fetches frost dates after station ID updates
  // must declare async function INSIDE of useEffect to avoid error concerning return of Promise in callback function
  useEffect( () => {
    async function getData () {
      setLoading(true);
      const headers = new Headers();
      let API_key = get_NOAA_API_Key();
      headers.append('token', API_key);
      const stationStr = '&stationid=GHCND:' + stationID;
      await fetch(apiStr + stationStr, {
        method: 'GET',
        headers: headers,
        })
      .then(response => response.json())
      .then(data => {
          myData = data;
          console.log(`my data: `, myData.results)
          setFallFrostJulian({
            severe: myData.results[0].value,
            moderate: myData.results[1].value,
            light: myData.results[2].value
          });
          setSpringFrostJulian({
            severe: myData.results[6].value,
            moderate: myData.results[7].value,
            light: myData.results[8].value
          });
          setFrostFreeJulian({
            severe: myData.results[3].value,
            moderate: myData.results[4].value,
            light: myData.results[5].value
          });

          //fix leap years
          var isLeap = new Date(THIS_YEAR, 1, 29).getMonth() == 1
          if(isLeap) {
              var i;
              for(i = 0; i < myData.results.length; i++ ) {
                  if(myData.results[i].value > 59 && i !== 3 && i !== 4 && i !== 5) { myData.results[i].value += 1}
              }
          }

          setFallFrostDates({
            light: momentToDate(moment([2020]).add(myData.results[2].value - 1, 'd')),
            moderate: momentToDate(moment([2020]).add(myData.results[1].value - 1, 'd')),
            severe: momentToDate(moment([2020]).add(myData.results[0].value - 1, 'd'))
          });

          setSpringFrostDates({
            light: momentToDate(moment([2020]).add(myData.results[8].value - 1, 'd')),
            moderate: momentToDate(moment([2020]).add(myData.results[7].value - 1, 'd')),
            severe: momentToDate(moment([2020]).add(myData.results[6].value - 1, 'd'))
          });

          setLoading(false);
      })
      .catch((error) => {
          setLoading(false)
          console.error(error);
      });
    }

    getData();
  }, [stationID]);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Frost/Freeze Dates</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>
          <IonLoading
              isOpen={loading}
              onDidDismiss={() => setLoading(false)}
              message={'Getting Data...'}
          />
          <IonToast
              isOpen={true}
              onDidDismiss={() => setError({ message: "", showError: false })}
              message={error.message}
              duration={3000}
          />

          <br/> Station: {match.params.id} 
              <h4>Spring Freeze Dates</h4>
              <h5>Last Severe Freeze: {springFrostJulian.severe} - {springFrostDates.severe.toDateString()}</h5>
              <h5>Last Moderate Freeze: {springFrostJulian.moderate} - {springFrostDates.moderate.toDateString()}</h5>
              <h5>Last Light Freeze: {springFrostJulian.light} - {springFrostDates.light.toDateString()}</h5>
              <h4>Fall Freeze Dates</h4>
              <h5>First Severe Freeze: {fallFrostJulian.severe} - {fallFrostDates.severe.toDateString()}</h5>
              <h5>First Moderate Freeze: {fallFrostJulian.moderate} - {fallFrostDates.moderate.toDateString()}</h5>
              <h5>First Light Freeze: {fallFrostJulian.light} - {fallFrostDates.light.toDateString()}</h5>
              <h4>Freeze Free Period (days)</h4>
              <h5>Severe: {frostFreeJulian.severe}</h5>
              <h5>Moderate: {frostFreeJulian.moderate}</h5>
              <h5>Light: {frostFreeJulian.light}</h5>
      </div>
      </IonContent>
    </IonPage>
  
  );
};

export default ResultsPage;
