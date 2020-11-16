import { IonPage, IonHeader, IonLoading, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonPopover, IonButton } from '@ionic/react'
import { RouteComponentProps } from 'react-router';
import { getClosestStationList, Station, getFrostData, FrostData } from '../utils/getClosestStation';
import { elevation_data, get_elevation} from '../utils/getUserElevation';
import React, {useEffect, useState} from 'react';
import './ResultsPage.css';
import DisplayFrostDates from '../components/DisplayFrostDates'

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

interface UserInformation{
  user_elevation: number|null
}

export interface FrostDatesBySeverity {
  title: string,
  springFrost: string,
  fallFrost: string,
  frostFree: number
}

const ResultsPage: React.FC<ContainerProps> = ({match, history}) => { 
    const [userLatLong] = useState<string>(match.params.id);
    const [stationID, setStation] = useState<StationUsed>({stationID: "0", lat: 0, long: 0, elevation: 0, state: "0", city: "0", distance: 0});
    const [springFrostJulian, setSpringFrostJulian] = useState<FrostDates>({light: "0", moderate: "0", severe: "0"});
    const [fallFrostJulian, setFallFrostJulian] = useState<FrostDates>({light: "0", moderate: "0", severe: "0"});
    const [frostFreeJulian, setFrostFreeJulian] = useState<FrostDatesJulian>({light: 0, moderate: 0, severe: 0});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<DataError>({ showError: false });
    const [showPopover, setShowPopover] = useState(false);
    const [userElevation, setUserElevation] = useState<UserInformation>({user_elevation: null})
    
    // fetches frost dates after station ID updates
    // must declare async function INSIDE of useEffect to avoid error concerning return of Promise in callback function
    useEffect( () => {
    //split out the lat/long
        let latLong = userLatLong.split(',')
        let stationIdx = -1
        //make sure these values are not null or undefined
        if(latLong[0] && latLong[1] && latLong[0] !== undefined && latLong[1] !== undefined) {
            const closestStation: Station[] | null = getClosestStationList({lat: parseFloat(latLong[0]), long: parseFloat(latLong[1])})
            //This is where elevation data function is called
            async function fetchData (): Promise<UserInformation> {
              const elevation_data = await get_elevation(userLatLong)
              let return_data: UserInformation ={
                user_elevation: elevation_data.elevation
              }
              setUserElevation({
                user_elevation: elevation_data.elevation
              })
              return return_data
            }
            fetchData()
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
          <IonPopover
            isOpen={showPopover}
            cssClass='station-popover'
            onDidDismiss={e => setShowPopover(false)}
          >
            <h5>Station Information</h5>
            <p>ID: {stationID.stationID}</p>
            <p>Station Lat: {stationID.lat}</p>
            <p>Station Long: {stationID.long}</p>
            <p>Distance: {Math.round(stationID.distance)}km</p>
            <p>Your Elevation: {userElevation.user_elevation}m</p>
            <IonButton onClick={() => setShowPopover(false)}>Close</IonButton>
          </IonPopover>

          <h3>Your Frost Dates</h3> 

          <div className="station-container">
            <div className="station-col">
              <p>Station: {stationID.city}, {stationID.state}</p>
              <p>Station Elevation: {stationID.elevation}m</p>
              <IonButton onClick={() => setShowPopover(true)}>More Information</IonButton>
            </div>
          </div>

          <DisplayFrostDates
            title="Light Freeze (32° F)"
            springFrost={springFrostJulian.light}
            fallFrost={fallFrostJulian.light}
            frostFree={frostFreeJulian.light}
            >
          </DisplayFrostDates>

          <DisplayFrostDates
            title="Moderate Freeze (30° F)"
            springFrost={springFrostJulian.moderate}
            fallFrost={fallFrostJulian.moderate}
            frostFree={frostFreeJulian.moderate}
            >
          </DisplayFrostDates>

          <DisplayFrostDates
            title="Severe Freeze (28° F)"
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
