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

class DataState {
  //Julian Day number of fall and spring frost severities
  @observable
  fall24 = 0
  setFall24 = (fall24: number) => {
      this.fall24 = fall24
  }
  @observable
  fall28 = 0
  setFall28 = (fall28: number) => {
      this.fall28 = fall28
  }
  @observable
  fall32 = 0
  setFall32 = (fall32: number) => {
      this.fall32 = fall32
  }
  @observable
  spr24 = 0
  setSpr24 = (spr24: number) => {
      this.spr24 = spr24
  }
  @observable
  spr28 = 0
  setSpr28 = (spr28: number) => {
      this.spr28 = spr28
  }
  @observable
  spr32 = 0
  setSpr32 = (spr32: number) => {
      this.spr32 = spr32
  }

  //Date of fall and spring frost severities
  @observable
  fall24Date: Date = new Date(new Date().getFullYear(), 0, 1)
  setfall24Date = (fall24Date: Date) => {
      this.fall24Date = fall24Date
  }
  @observable
  fall28Date: Date = new Date(new Date().getFullYear(), 0, 1)
  setfall28Date = (fall28Date: Date) => {
      this.fall28Date = fall28Date
  }
  @observable
  fall32Date: Date = new Date(new Date().getFullYear(), 0, 1)
  setfall32Date = (fall32Date: Date) => {
      this.fall32Date = fall32Date
  }

  @observable
  spr24Date: Date = new Date(new Date().getFullYear(), 0, 1)
  setspr24Date = (spr24Date: Date) => {
      this.spr24Date = spr24Date
  }
  @observable
  spr28Date: Date = new Date(new Date().getFullYear(), 0, 1)
  setspr28Date = (spr28Date: Date) => {
      this.spr28Date = spr28Date
  }
  @observable
  spr32Date: Date = new Date(new Date().getFullYear(), 0, 1)
  setspr32Date = (spr32Date: Date) => {
      this.spr32Date = spr32Date
  }
  //climate normal station ID number
  @observable
  stationID: string = "Station ID:"
  setID = (stationID: string) => {
      this.stationID = stationID
  }
}

const ResultsPage: React.FC<ContainerProps> = ({match, history}) => { 
  const [stationID, setStation] = useState<string>(match.params.id);
  const state = React.useRef(new DataState()).current
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<DataError>({ showError: false });
  let myData: { results: { value: any; }[]; };
  const apiStr = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=NORMAL_ANN&datatypeid=ANN-TMIN-PRBLST-T24FP90&datatypeid=ANN-TMIN-PRBLST-T28FP90&datatypeid=ANN-TMIN-PRBLST-T32FP90&datatypeid=ANN-TMIN-PRBFST-T24FP90&datatypeid=ANN-TMIN-PRBFST-T28FP90&datatypeid=ANN-TMIN-PRBFST-T32FP90&startdate=2010-01-01&enddate=2010-01-01';
  //let stationID = match.params.id;
  //let stationStr = '&stationid=GHCND:' + stationID;
  //getData();

  // must declare function INSIDE of useEffect to avoid error concerning return of Promise in callback function
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
          state.setFall24(myData.results[0].value);
          state.setFall28(myData.results[1].value);
          state.setFall32(myData.results[2].value);
          state.setSpr24(myData.results[3].value);
          state.setSpr28(myData.results[4].value);
          state.setSpr32(myData.results[5].value);
          
          //fix leap years
          var isLeap = new Date(THIS_YEAR, 1, 29).getMonth() == 1
          if(isLeap) {
              var i;
              for(i = 0; i < myData.results.length; i++ ) {
                  if(myData.results[i].value > 59) { myData.results[i].value += 1}
              }
          }
          state.setfall24Date(momentToDate(moment([2020]).add(myData.results[0].value - 1, 'd')))
          state.setfall28Date(momentToDate(moment([2020]).add(myData.results[1].value - 1, 'd')))
          state.setfall32Date(momentToDate(moment([2020]).add(myData.results[2].value - 1, 'd')))
          state.setspr24Date(momentToDate(moment([2020]).add(myData.results[3].value - 1, 'd')))
          state.setspr28Date(momentToDate(moment([2020]).add(myData.results[4].value - 1, 'd')))
          state.setspr32Date(momentToDate(moment([2020]).add(myData.results[5].value - 1, 'd')))
          
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
          {/* <IonButton color="primary" onClick={getData}>Make API Call</IonButton> */}
          <br/> Station: {match.params.id} 
              <h4>Spring Freeze Dates</h4>
              <h5>Last Severe Freeze: {state.spr24} - {state.spr24Date.toDateString()}</h5>
              <h5>Last Moderate Freeze: {state.spr28} - {state.spr28Date.toDateString()}</h5>
              <h5>Last Light Freeze: {state.spr32} - {state.spr32Date.toDateString()}</h5>
              <h4>Fall Freeze Dates</h4>
              <h5>First Severe Freeze: {state.fall24} - {state.fall24Date.toDateString()}</h5>
              <h5>First Moderate Freeze: {state.fall28} - {state.fall28Date.toDateString()}</h5>
              <h5>First Light Freeze: {state.fall32} - {state.fall32Date.toDateString()}</h5>
      </div>
      </IonContent>
    </IonPage>
  
  );
};

export default ResultsPage;
