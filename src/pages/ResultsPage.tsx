import { IonPage, IonHeader, IonLoading, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonPopover, IonButton, IonItem, IonLabel, IonSelectOption, IonSelect } from '@ionic/react'
import { RouteComponentProps } from 'react-router';
import { getClosestStationList, Station, getFrostData, FrostData } from '../utils/getClosestStation';
import React, {useEffect, useState} from 'react';
import './ResultsPage.css';
import DisplayFrostDates from '../components/DisplayFrostDates'
import { stat } from 'fs';

interface ContainerProps {}
interface DataError {
    showError: boolean;
    message?: string;
}

interface ContainerProps extends RouteComponentProps<{
    id: string
}> {}

interface FrostDatesJulian {
    light: string,
    moderate: string,
    severe: string
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
    distance: number,
    idx: number
}

interface Percentage {
    percent: string
}
export interface FrostDatesBySeverity {
  title: string,
  springFrost: string,
  fallFrost: string,
  frostFree: string
}

const customAlertOptions = {
    header: 'Probability Percentage',
    subHeader: 'The likelihood of reaching the minimum temperature',
    message: '10 to 90 percent',
    translucent: true
};



const ResultsPage: React.FC<ContainerProps> = ({match, history}) => { 
    const [userLatLong] = useState<string>(match.params.id);
    const [stationID, setStation] = useState<StationUsed>({stationID: "0", lat: 0, long: 0, elevation: 0, state: "0", city: "0", distance: 0, idx: 0});
    const [springFrostJulian, setSpringFrostJulian] = useState<FrostDates>({light: "0", moderate: "0", severe: "0"});
    const [fallFrostJulian, setFallFrostJulian] = useState<FrostDates>({light: "0", moderate: "0", severe: "0"});
    const [frostFreeJulian, setFrostFreeJulian] = useState<FrostDatesJulian>({light: "0", moderate: "0", severe: "0"});
    const [loading, setLoading] = useState<boolean>(false);
    const [showPopover, setShowPopover] = useState(false);
    const [percentage, setPercent] = useState<string>("90");
    //const [dataPercentStr, setPerStr] = useState<string>({})
    const frostData: FrostData[] = getFrostData();
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
                
                let checking = 0
                console.log(`Percentage is: `, percentage) 
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
                            distance: closestStation[checking].distance,
                            idx: stationIdx
                        });
                        checking = -1 
                    }
                    else { checking++} //station not found, move to text closest
                }
                setLoading(true); 
                //console.log(`Percentage is: `, percentage)
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
    
    const changePercent = (per: string) => {
        setPercent(per)
        //const frostData: FrostData[] = getFrostData();
        if(per === "10") {
            setFallFrostJulian({
                severe: frostData[stationID.idx].fst_t24fp10,
                moderate: frostData[stationID.idx].fst_t28fp10,
                light: frostData[stationID.idx].fst_t32fp10
            });
            setSpringFrostJulian({
                severe: frostData[stationID.idx].lst_t24fp10,
                moderate: frostData[stationID.idx].lst_t28fp10,
                light: frostData[stationID.idx].lst_t32fp10
            });
            setFrostFreeJulian({
                severe: frostData[stationID.idx].gsl_t24fp10,
                moderate: frostData[stationID.idx].gsl_t28fp10,
                light: frostData[stationID.idx].gsl_t32fp10
            });
        }
        else if(per === "20") {
            setFallFrostJulian({
                severe: frostData[stationID.idx].fst_t24fp20,
                moderate: frostData[stationID.idx].fst_t28fp20,
                light: frostData[stationID.idx].fst_t32fp20
            });
            setSpringFrostJulian({
                severe: frostData[stationID.idx].lst_t24fp20,
                moderate: frostData[stationID.idx].lst_t28fp20,
                light: frostData[stationID.idx].lst_t32fp20
            });
            setFrostFreeJulian({
                severe: frostData[stationID.idx].gsl_t24fp20,
                moderate: frostData[stationID.idx].gsl_t28fp20,
                light: frostData[stationID.idx].gsl_t32fp20
            });
        }
        else if(per === "30") {
            setFallFrostJulian({
                severe: frostData[stationID.idx].fst_t24fp30,
                moderate: frostData[stationID.idx].fst_t28fp30,
                light: frostData[stationID.idx].fst_t32fp30
            });
            setSpringFrostJulian({
                severe: frostData[stationID.idx].lst_t24fp30,
                moderate: frostData[stationID.idx].lst_t28fp30,
                light: frostData[stationID.idx].lst_t32fp30
            });
            setFrostFreeJulian({
                severe: frostData[stationID.idx].gsl_t24fp30,
                moderate: frostData[stationID.idx].gsl_t28fp30,
                light: frostData[stationID.idx].gsl_t32fp30
            });
        }
        else if(per === "40") {
            setFallFrostJulian({
                severe: frostData[stationID.idx].fst_t24fp40,
                moderate: frostData[stationID.idx].fst_t28fp40,
                light: frostData[stationID.idx].fst_t32fp40
            });
            setSpringFrostJulian({
                severe: frostData[stationID.idx].lst_t24fp40,
                moderate: frostData[stationID.idx].lst_t28fp40,
                light: frostData[stationID.idx].lst_t32fp40
            });
            setFrostFreeJulian({
                severe: frostData[stationID.idx].gsl_t24fp40,
                moderate: frostData[stationID.idx].gsl_t28fp40,
                light: frostData[stationID.idx].gsl_t32fp40
            });
        }
        else if(per === "50") {
            setFallFrostJulian({
                severe: frostData[stationID.idx].fst_t24fp50,
                moderate: frostData[stationID.idx].fst_t28fp50,
                light: frostData[stationID.idx].fst_t32fp50
            });
            setSpringFrostJulian({
                severe: frostData[stationID.idx].lst_t24fp50,
                moderate: frostData[stationID.idx].lst_t28fp50,
                light: frostData[stationID.idx].lst_t32fp50
            });
            setFrostFreeJulian({
                severe: frostData[stationID.idx].gsl_t24fp50,
                moderate: frostData[stationID.idx].gsl_t28fp50,
                light: frostData[stationID.idx].gsl_t32fp50
            });
        }
        else if(per === "60") {
            setFallFrostJulian({
                severe: frostData[stationID.idx].fst_t24fp60,
                moderate: frostData[stationID.idx].fst_t28fp60,
                light: frostData[stationID.idx].fst_t32fp60
            });
            setSpringFrostJulian({
                severe: frostData[stationID.idx].lst_t24fp60,
                moderate: frostData[stationID.idx].lst_t28fp60,
                light: frostData[stationID.idx].lst_t32fp60
            });
            setFrostFreeJulian({
                severe: frostData[stationID.idx].gsl_t24fp60,
                moderate: frostData[stationID.idx].gsl_t28fp60,
                light: frostData[stationID.idx].gsl_t32fp60
            });
        }
        else if(per === "70") {
            setFallFrostJulian({
                severe: frostData[stationID.idx].fst_t24fp70,
                moderate: frostData[stationID.idx].fst_t28fp70,
                light: frostData[stationID.idx].fst_t32fp70
            });
            setSpringFrostJulian({
                severe: frostData[stationID.idx].lst_t24fp70,
                moderate: frostData[stationID.idx].lst_t28fp70,
                light: frostData[stationID.idx].lst_t32fp70
            });
            setFrostFreeJulian({
                severe: frostData[stationID.idx].gsl_t24fp70,
                moderate: frostData[stationID.idx].gsl_t28fp70,
                light: frostData[stationID.idx].gsl_t32fp70
            });
        }
        else if(per === "80") {
            setFallFrostJulian({
                severe: frostData[stationID.idx].fst_t24fp80,
                moderate: frostData[stationID.idx].fst_t28fp80,
                light: frostData[stationID.idx].fst_t32fp80
            });
            setSpringFrostJulian({
                severe: frostData[stationID.idx].lst_t24fp80,
                moderate: frostData[stationID.idx].lst_t28fp80,
                light: frostData[stationID.idx].lst_t32fp80
            });
            setFrostFreeJulian({
                severe: frostData[stationID.idx].gsl_t24fp80,
                moderate: frostData[stationID.idx].gsl_t28fp80,
                light: frostData[stationID.idx].gsl_t32fp80
            });
        }
        else if(per === "90") {
            setFallFrostJulian({
                severe: frostData[stationID.idx].fst_t24fp90,
                moderate: frostData[stationID.idx].fst_t28fp90,
                light: frostData[stationID.idx].fst_t32fp90
            });
            setSpringFrostJulian({
                severe: frostData[stationID.idx].lst_t24fp90,
                moderate: frostData[stationID.idx].lst_t28fp90,
                light: frostData[stationID.idx].lst_t32fp90
            });
            setFrostFreeJulian({
                severe: frostData[stationID.idx].gsl_t24fp90,
                moderate: frostData[stationID.idx].gsl_t28fp90,
                light: frostData[stationID.idx].gsl_t32fp90
            });
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
          <IonPopover
            isOpen={showPopover}
            cssClass='station-popover'
            onDidDismiss={e => setShowPopover(false)}
          >
            <h5>Station Information</h5>
            <p>ID: {stationID.stationID}</p>
            <p>Distance: {Math.round(stationID.distance)}km</p>
            <IonButton onClick={() => setShowPopover(false)}>Close</IonButton>
          </IonPopover>
          <h3>Your Frost Dates</h3> 

          <div className="station-container">
            <div className="station-col">
              <p>Station: {stationID.city}, {stationID.state}</p>
              <p>Elevation: {stationID.elevation}m</p>
              <IonButton onClick={() => setShowPopover(true)}>More Information</IonButton>
            </div>
          </div>
          <IonItem className="percent-card">
            <IonLabel>Probability Selection</IonLabel>
                <IonSelect interfaceOptions={customAlertOptions} interface="alert" value={percentage} onIonChange={e => changePercent(e.detail.value)}>
                    <IonSelectOption value="10">10%</IonSelectOption>
                    <IonSelectOption value="20">20%</IonSelectOption>
                    <IonSelectOption value="30">30%</IonSelectOption>
                    <IonSelectOption value="40">40%</IonSelectOption>
                    <IonSelectOption value="50">50%</IonSelectOption>
                    <IonSelectOption value="60">60%</IonSelectOption>
                    <IonSelectOption value="70">70%</IonSelectOption>
                    <IonSelectOption value="80">80%</IonSelectOption>
                    <IonSelectOption value="90">90%</IonSelectOption>
                </IonSelect>
          </IonItem>
          <DisplayFrostDates
            title="Light Freeze (32° F)"
            springFrost={springFrostJulian.light}
            fallFrost={fallFrostJulian.light}
            frostFree={frostFreeJulian.light}
            >
          </DisplayFrostDates>

          <DisplayFrostDates
            title="Moderate Freeze (28° F)"
            springFrost={springFrostJulian.moderate}
            fallFrost={fallFrostJulian.moderate}
            frostFree={frostFreeJulian.moderate}
            >
          </DisplayFrostDates>

          <DisplayFrostDates
            title="Severe Freeze (24° F)"
            springFrost={springFrostJulian.severe}
            fallFrost={fallFrostJulian.severe}
            frostFree={frostFreeJulian.severe}
            >
          </DisplayFrostDates>

        </div>
      </IonContent>
    </IonPage>
  );
};
export default ResultsPage;
