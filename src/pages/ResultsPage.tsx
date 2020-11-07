import { IonPage, IonHeader, IonLoading, IonToast, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons } from '@ionic/react'
import { RouteComponentProps } from 'react-router';
import { getClosestStationList, Station, getFrostData, FrostData } from '../utils/getClosestStation';
import React, {useEffect, useState} from 'react';
import moment from "moment-timezone"
import { momentToDate } from "../utils/utils"
//import get_NOAA_API_Key from './get_NOAA_API_Key';

//Station
var d = new Date()
const THIS_YEAR = d.getFullYear()

interface ContainerProps {}
interface DataError {
    showError: boolean;
    message?: string;
}

interface ContainerProps extends RouteComponentProps<{
    id: string
}> {}

interface FrostDatesJulian {
  light: number,
  moderate: number,
  severe: number
} 

interface FrostDates {
  light: string,
  moderate: string,
  severe: string
}

const ResultsPage: React.FC<ContainerProps> = ({match, history}) => { 
  const [stationID, setStation] = useState<string>(match.params.id);
  const [springFrostJulian, setSpringFrostJulian] = useState<FrostDates>({light: "0", moderate: "0", severe: "0"});
  const [fallFrostJulian, setFallFrostJulian] = useState<FrostDates>({light: "0", moderate: "0", severe: "0"});
  const [frostFreeJulian, setFrostFreeJulian] = useState<FrostDatesJulian>({light: 0, moderate: 0, severe: 0});
  //const [springFrostDates, setSpringFrostDates] = useState<FrostDates>({light: new Date(new Date().getFullYear(), 0, 1), moderate: new Date(new Date().getFullYear(), 0, 1), severe: new Date(new Date().getFullYear(), 0, 1)});
  //const [fallFrostDates, setFallFrostDates] = useState<FrostDates>({light: new Date(), moderate: new Date(), severe: new Date()});

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<DataError>({ showError: false });
  
  // fetches frost dates after station ID updates
  // must declare async function INSIDE of useEffect to avoid error concerning return of Promise in callback function
    useEffect( () => {
    //split out the lat/long
        let latLong = stationID.split('_')
        let stationIdx = -1
        
        console.log(`station ID: `, latLong)
        //make sure these values are not null or undefined
        if(latLong[0] && latLong[1] && latLong[0] !== undefined && latLong[1] !== undefined) {
            const closestStation: Station[] | null = getClosestStationList({lat: parseFloat(latLong[0]), long: parseFloat(latLong[1])})
            
            if(closestStation) {
                //get frost data list
                const frostData: FrostData[] = getFrostData();
                let checking = 0
                while (checking >= 0) { //loop until a station with data is found
                    console.log(checking, ` checking: `, closestStation[checking].station, `. Distance: `, closestStation[checking].distance)
                    stationIdx = frostData.findIndex(o => o.station === closestStation[checking].station)
                    if(stationIdx >= 0) {
                        checking = -1
                        console.log(`station idx: `, stationIdx, `station: `, frostData[stationIdx].station, ` frost stuff: `, frostData[stationIdx].gsl_t24fp90)
                    } //station found, stop checking
                    else { checking++} //station not found, move to text closest
                    
                } 

                setLoading(true); 
                    console.log(`ready with station: `, closestStation[stationIdx].station)
                    setFallFrostJulian({
                        severe: frostData[stationIdx].fst_t24fp90,
                        moderate: frostData[stationIdx].fst_t28fp90,
                        light: frostData[stationIdx].fst_t32fp90
                    });
                    setSpringFrostJulian({
                        severe: frostData[stationIdx].lst_t24fp90,
                        moderate: frostData[stationIdx].lst_t28fp90,
                        light: frostData[stationIdx].lst_t32fp90
                    });
                    setFrostFreeJulian({
                        severe: frostData[stationIdx].gsl_t24fp90,
                        moderate: frostData[stationIdx].gsl_t28fp90,
                        light: frostData[stationIdx].gsl_t32fp90
                    });
                    //fix leap years
                    //var isLeap = new Date(THIS_YEAR, 1, 29).getMonth() == 1
                    //if(isLeap) {
                    //   var i;
                    //    for(i = 0; i < myData.results.length; i++ ) {
                    //        if(myData.results[i].value > 59 && i !== 3 && i !== 4 && i !== 5) { myData.results[i].value += 1}
                    //    }
                    //}
                    //setFallFrostDates({
                    //    light: momentToDate(moment([2020]).add(11 - 1, 'd')),
                    //    moderate: momentToDate(moment([2020]).add(11 - 1, 'd')),
                    //    severe: momentToDate(moment([2020]).add(11 - 1, 'd'))
                    //});
                    //setSpringFrostDates({
                    //    light: momentToDate(moment([2020]).add(11 - 1, 'd')),
                    //    moderate: momentToDate(moment([2020]).add(11- 1, 'd')),
                    //    severe: momentToDate(moment([2020]).add(11 - 1, 'd'))
                    //});
                    setLoading(false);
            }
            else { console.log(`closest is null`)}
        }
    }, [stationID]);
  
    const checkApiReturn = (dayNum: any) => {
        if(dayNum === -4444) {  //-4444 is the code for year round frost risk
            return "Year-Round Frost Risk"
        }
        else if (dayNum === -6666) { //-6666 is the code for undefined parameter/insufficent data
            return "Insufficient Data"
        }
        else if ( dayNum === -7777) { //-7777 is the code for non-zero value that rounds to zero
            return "0 (rounded)"
        }
        else {
            let retStr = dayNum.toString()
            return retStr
        }
    }

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
              <h5>Last Severe Freeze: <strong>{checkApiReturn(springFrostJulian.severe)}</strong></h5>
              <h5>Last Moderate Freeze: <strong>{checkApiReturn(springFrostJulian.moderate)}</strong></h5>
              <h5>Last Light Freeze: <strong>{checkApiReturn(springFrostJulian.light)}</strong></h5>
              <h4>Fall Freeze Dates</h4>
              <h5>First Severe Freeze: <strong>{checkApiReturn(fallFrostJulian.severe)}</strong></h5>
              <h5>First Moderate Freeze: <strong>{checkApiReturn(fallFrostJulian.moderate)}</strong></h5>
              <h5>First Light Freeze: <strong>{checkApiReturn(fallFrostJulian.light)}</strong></h5>
              <h4>Freeze Free Period (days)</h4>
              <h5>Severe: <strong>{frostFreeJulian.severe}</strong></h5>
              <h5>Moderate: <strong>{frostFreeJulian.moderate}</strong></h5>
              <h5>Light: <strong>{frostFreeJulian.light}</strong></h5>
      </div>
      </IonContent>
    </IonPage>
  
  );
};

export default ResultsPage;
