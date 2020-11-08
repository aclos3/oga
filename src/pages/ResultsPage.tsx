import { IonPage, IonHeader, IonLoading, IonToast, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react'
import { RouteComponentProps } from 'react-router';
import { getClosestStationList, Station, getFrostData, FrostData } from '../utils/getClosestStation';
import React, {useEffect, useState} from 'react';
import './ResultsPage.css';

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
interface StationUsed {
    stationID: string,
    lat: number,
    long: number,
    elevation: number,
    state: string,
    city: string,
    distance: number
}
const ResultsPage: React.FC<ContainerProps> = ({match, history}) => { 
    const [userLatLong] = useState<string>(match.params.id);
    const [stationID, setStation] = useState<StationUsed>({stationID: "0", lat: 0, long: 0, elevation: 0, state: "0", city: "0", distance: 0});
    const [springFrostJulian, setSpringFrostJulian] = useState<FrostDates>({light: "0", moderate: "0", severe: "0"});
    const [fallFrostJulian, setFallFrostJulian] = useState<FrostDates>({light: "0", moderate: "0", severe: "0"});
    const [frostFreeJulian, setFrostFreeJulian] = useState<FrostDatesJulian>({light: 0, moderate: 0, severe: 0});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<DataError>({ showError: false });
    // fetches frost dates after station ID updates
    // must declare async function INSIDE of useEffect to avoid error concerning return of Promise in callback function
    useEffect( () => {
    //split out the lat/long
        let latLong = userLatLong.split('_')
        let stationIdx = -1
        //make sure these values are not null or undefined
        if(latLong[0] && latLong[1] && latLong[0] !== undefined && latLong[1] !== undefined) {
            const closestStation: Station[] | null = getClosestStationList({lat: parseFloat(latLong[0]), long: parseFloat(latLong[1])})
            if(closestStation) {
                //get frost data list
                const frostData: FrostData[] = getFrostData();
                let checking = 0
                while (checking >= 0) { //loop until a station with data is found
                    stationIdx = frostData.findIndex(o => o.station === closestStation[checking].station)
                    if(stationIdx >= 0) {  //station found, stop checking
                        setStation({
                            stationID: closestStation[checking].station,
                            lat: closestStation[checking].latitude,
                            long: closestStation[checking].longitude,
                            elevation: closestStation[checking].elevation,
                            state: closestStation[checking].state,
                            city: closestStation[checking].city, 
                            distance: closestStation[checking].distance
                        });
                        checking = -1 
                    }
                    else { checking++} //station not found, move to text closest
                }
                setLoading(true); 
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
                setLoading(false);
            }
            else { console.log(`Closest station has no data!`)}
        }
    }, [userLatLong]);

    const checkApiReturn = (dayNum: any) => {
        if(dayNum === "-4444") {  //-4444 is the code for year round frost risk
            return "Year-Round Frost Risk"
        }
        else if (dayNum === "-6666") { //-6666 is the code for undefined parameter/insufficent data
            return "Insufficient Data"
        }
        else if ( dayNum === "-7777") { //-7777 is the code for non-zero value that rounds to zero
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
          <IonButtons slot="start" className="back-button">
            <IonBackButton />
          </IonButtons>
          <IonTitle className="results-title">Frost Date Finder</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="results-container">
          <IonLoading
              isOpen={loading}
              onDidDismiss={() => setLoading(false)}
              message={'Getting Data...'}
          />
          <h3>Your Frost Dates</h3> 
          <IonCard className="results-card">
            <IonCardHeader>
              <IonCardTitle>
              Your Weather Station
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <ul className="results-list">
                <li className="station-item">ID: {stationID.stationID}</li>
                <li className="station-item">City: {stationID.city}, {stationID.state}</li>
                <li className="station-item">Elevation: {stationID.elevation}(meters)</li>
                <li className="station-item">Distance: {stationID.distance}</li>
              </ul>
            </IonCardContent>
          </IonCard>
          
          <IonCard className="results-card">
            <IonCardHeader>
              <IonCardTitle>
              Spring Freeze Dates
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <ul className="results-list">
                <li>Last Severe Freeze: <span className="frost-date">{checkApiReturn(springFrostJulian.severe)}</span></li>
                <li>Last Moderate Freeze: <span className="frost-date">{checkApiReturn(springFrostJulian.moderate)}</span></li>
                <li>Last Light Freeze: <span className="frost-date">{checkApiReturn(springFrostJulian.light)}</span></li>
              </ul>
            </IonCardContent>
          </IonCard>

          <IonCard className="results-card">
            <IonCardHeader>
              <IonCardTitle>
              Fall Freeze Dates
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <ul className="results-list">
                <li>First Severe Freeze: <span className="frost-date">{checkApiReturn(fallFrostJulian.severe)}</span></li>
                <li>First Moderate Freeze: <span className="frost-date">{checkApiReturn(fallFrostJulian.moderate)}</span></li>
                <li>First Light Freeze: <span className="frost-date">{checkApiReturn(fallFrostJulian.light)}</span></li>
              </ul>
            </IonCardContent>
          </IonCard>

          <IonCard className="results-card">
            <IonCardHeader>
              <IonCardTitle>
              Frost Free Period (Days)
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <ul className="results-list">
                <li>Severe: {frostFreeJulian.severe}</li>
                <li>Moderate: {frostFreeJulian.moderate}</li>
                <li>Light: {frostFreeJulian.light}</li>
              </ul>
            </IonCardContent>
          </IonCard>
      </div>
      </IonContent>
    </IonPage>
  );
};
export default ResultsPage;
