import { IonPage, IonHeader, IonLoading, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonPopover, IonButton, IonIcon } from '@ionic/react';
import { helpCircle } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import { getClosestStationList, Station, getFrostData, FrostData } from '../utils/getClosestStation';
import React, {useEffect, useState} from 'react';
import '../App.css';
import './ResultsPage.css';
import DisplayFrostDates from '../components/DisplayFrostDates';

const FEET_TO_METERS = 0.3048;

interface ContainerProps {}

type ContainerProps = RouteComponentProps<{
  id: string;
}>

interface FrostDatesJulian {
  light: string;
  moderate: string;
  severe: string;
} 
interface FrostDates {
  light: string;
  moderate: string;
  severe: string;
}
interface StationUsed {
  stationID: string;
  lat: number;
  long: number;
  elevation: number;
  state: string;
  city: string;
  distance: number;
}

export interface FrostDatesBySeverity {
  title: string;
  springFrost: string;
  fallFrost: string;
  frostFree: string;
}

const ResultsPage: React.FC<ContainerProps> = ({ match }) => { 
  const [userLatLongElev] = useState<string>(match.params.id);
  const [stationID, setStation] = useState<StationUsed>({stationID: '0', lat: 0, long: 0, elevation: 0, state: '0', city: '0', distance: 0});
  const [springFrostJulian, setSpringFrostJulian] = useState<FrostDates>({light: '0', moderate: '0', severe: '0'});
  const [fallFrostJulian, setFallFrostJulian] = useState<FrostDates>({light: '0', moderate: '0', severe: '0'});
  const [frostFreeJulian, setFrostFreeJulian] = useState<FrostDatesJulian>({light: '0', moderate: '0', severe: '0'});
  const [loading, setLoading] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState(false);
  const [userElevation, setUserElevation] = useState<number>(0);
    
  // fetches frost dates after station ID updates
  useEffect( () => {
    //split out the lat/long
    const latLong = userLatLongElev.split(',');
    let stationIdx = -1;
    //make sure these values are not null or undefined
    if(latLong[0] && latLong[1] && latLong[0] !== undefined && latLong[1] !== undefined) {
      //get a list of stations sorted by distance from the user.
      const closestStation: Station[] | null = getClosestStationList({lat: parseFloat(latLong[0]), long: parseFloat(latLong[1])});
      //Set elevation
      if(latLong[2] && latLong[2] !== undefined) { setUserElevation(parseFloat(latLong[2])* FEET_TO_METERS); }
      if(closestStation) {
        //get frost data list
        const frostData: FrostData[] = getFrostData();
        //loop until a station with data is found, not all climate normals weather stations contain the frost data we're looking for
        let checking = 0;
        while (checking >= 0) {
          //compare the two lists to see if the station ID exists in both
          stationIdx = frostData.findIndex(o => o.station === closestStation[checking].station);
          if(stationIdx >= 0) {  //matching station was found, stop checking, populate station information
            setStation({
              stationID: closestStation[checking].station,
              lat: closestStation[checking].latitude,
              long: closestStation[checking].longitude,
              elevation: closestStation[checking].elevation,
              state: closestStation[checking].state,
              city: closestStation[checking].city, 
              distance: closestStation[checking].distance
            });
            checking = -1; 
          }
          else { checking++;} //station not found, move to text closest
        }
        setLoading(true);
        //populate the frost data variables with data from the closest station
        setFallFrostJulian({
          severe: frostData[stationIdx].fst_t24fp30,
          moderate: frostData[stationIdx].fst_t28fp30,
          light: frostData[stationIdx].fst_t32fp30
        });
        setSpringFrostJulian({
          severe: frostData[stationIdx].lst_t24fp30,
          moderate: frostData[stationIdx].lst_t28fp30,
          light: frostData[stationIdx].lst_t32fp30
        });
        setFrostFreeJulian({
          severe: frostData[stationIdx].gsl_t24fp30,
          moderate: frostData[stationIdx].gsl_t28fp30,
          light: frostData[stationIdx].gsl_t32fp30
        });
        setLoading(false);
      }
      else { alert('Error: The station list is empty!');}
    }
  }, [userLatLongElev]);
    
  //these two helper functions are for styling purposes. To convert negative/positive lat and long
  //to North, East, South, or West
  const isLatPositive = () => {
    if(stationID.lat >= 0) { return 'N'; }
    else { return 'S';}
  };
  const isLongPositive = () => {
    if(stationID.long >= 0) { return 'E'; }
    else { return 'W';}
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="app-toolbar">
            <IonButtons className="app-title-button app-left-title-button">
              <IonBackButton />
            </IonButtons>
            <IonTitle className="app-title">Frost Date Finder</IonTitle>
            <div className="app-title-button app-right-title-button">
              <IonIcon icon={helpCircle}></IonIcon>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="app-page-container">
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
            <h5 className="station-popover-header">Station Information</h5>
            <p>ID: {stationID.stationID}</p>
            <p>Station Lat: {Math.abs(parseFloat(stationID.lat.toPrecision(4)))}&#176;{isLatPositive()}</p>
            <p>Station Long: {Math.abs(parseFloat(stationID.long.toPrecision(5)))}&#176;{isLongPositive()}</p>
            <p>Station Elevation: {stationID.elevation}m</p>
            <p>Local Elevation: {userElevation.toFixed(1)}m</p>
            <p>Distance: {Math.round(stationID.distance)}km</p>
            <IonButton onClick={() => setShowPopover(false)}>Close</IonButton>
          </IonPopover>

          <h1 className="app-page-header">Your Frost Dates</h1> 

          <div className="station-container">
            <div className="station-col">
              <p>Station: {stationID.city.charAt(0) + stationID.city.slice(1).toLowerCase()}, {stationID.state}</p>
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
