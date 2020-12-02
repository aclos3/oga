
import { IonPage, IonHeader, IonLoading, IonToolbar, IonTitle, IonContent, IonButtons, IonPopover, IonButton, IonIcon } from '@ionic/react';
import { arrowBack, helpCircle } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import { Station, getClosestStationAndFrostData } from '../utils/getClosestStation';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import './ResultsPage.css';
import DisplayFrostDates from '../components/DisplayFrostDates';

const IGNORE_WORDS = ['HCN', 'N', 'E', 'S', 'W', 'NE', 'NW', 'SE', 'SW', 'NNE', 'NNW', 'SSE', 'SSW', 'ENE', 'WNW', 'ESE', 'WSW'];

type ContainerProps = RouteComponentProps<{
    id: string;
}>

interface FrostDates {
  light: string;
  moderate: string;
  severe: string;
}

const ResultsPage: React.FC<ContainerProps> = ({ match, history }) => { 
  const [station, setStation] = useState<Station>({station: '0', latitude: 0, longitude: 0, elevation: 0, state: '0', city: '0', distance: 0});
  const [springFrostJulian, setSpringFrostJulian] = useState<FrostDates>({light: '0', moderate: '0', severe: '0'});
  const [fallFrostJulian, setFallFrostJulian] = useState<FrostDates>({light: '0', moderate: '0', severe: '0'});
  const [frostFreeJulian, setFrostFreeJulian] = useState<FrostDates>({light: '0', moderate: '0', severe: '0'});
  const [loading, setLoading] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState(false);
  const [userElevation, setUserElevation] = useState<number>(0);
    
  // fetches frost dates after station ID updates (from history URL)
  useEffect( () => {
    const urlLatLongElev = match.params.id;
    const [lat, long, elevation] = urlLatLongElev.split(',');

    //Set elevation
    if(elevation) { setUserElevation(parseFloat(elevation)); }

    //make sure these values are not null or undefined
    if(lat && long) {
      //get a list of stations sorted by distance from the user.
      const [closestStation, stationFrostData] = getClosestStationAndFrostData({lat: parseFloat(lat), long: parseFloat(long)});

      if(closestStation && stationFrostData) {
        setLoading(true);

        // population station and frost date variables
        setStation(closestStation);
        setFallFrostJulian({
          severe: stationFrostData.fallSevere,
          moderate: stationFrostData.fallModerate,
          light: stationFrostData.fallLight
        });
        setSpringFrostJulian({
          severe: stationFrostData.springSevere,
          moderate: stationFrostData.springModerate,
          light: stationFrostData.springLight
        });
        setFrostFreeJulian({
          severe: stationFrostData.frostFreeSevere,
          moderate: stationFrostData.frostFreeModerate,
          light: stationFrostData.frostFreeLight
        });
        setLoading(false);
      }
      else { alert('Error: The station list is empty!');}
    }
  }, [match.params.id]);
    
  //these two helper functions are for styling purposes. To convert negative/positive lat and long
  //to North, East, South, or West
  const isLatPositive = () => {
    if(station.latitude >= 0) { return 'N'; }
    else { return 'S';}
  };
  const isLongPositive = () => {
    if(station.longitude >= 0) { return 'E'; }
    else { return 'W';}
  };
  //this function makes sure only the first letter of each word remains capitalized and removes extraneous spaces at the end of the string
  //the function also checks for certain words to omit and for some abbreviations to expand.
  const stringUpper = () => {
    const upWords = station.city.split(' ');
    for (let i = 0; i < upWords.length; i++) {
      if(upWords[i] !== undefined && upWords[i] && upWords[i] !== ' ') {
        //Spell out words like "Airport", "Center," "Field," etc.
        if(upWords[i] === 'AP') { upWords[i] = 'Airport '; }
        else if (upWords[i] === 'FLD') {upWords[i] = 'Field ';}
        else if (upWords[i] === 'STN') {upWords[i] = 'Station ';}
        else if (upWords[i] === 'CTR') {upWords[i] = 'Center ';}
        //check for special ignored words (N, E, S, W, HCN, etc)
        else if(IGNORE_WORDS.indexOf(upWords[i]) >= 0) { upWords[i] = '';}
        //check for 'Mc' or 'De'
        else if(upWords[i][0] && upWords[i][1] && upWords[i][2]) {
          if((upWords[i][0] === 'M' && upWords[i][1] === 'C') || (upWords[i][0] === 'D' && upWords[i][1] === 'E')) { 
            upWords[i] = upWords[i][0] + upWords[i][1].toLowerCase() + upWords[i][2] + upWords[i].substr(3).toLowerCase() + ' ';
          }
          //otherwise lowercase all but the first character of the string
          else { upWords[i] = upWords[i][0] + upWords[i].substr(1).toLowerCase() + ' ';}
        }
      }
    }
    return upWords.join(' ').trim();
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className='app-toolbar'>
            <IonButtons className='app-title-button app-left-title-button'>
              <IonButton routerLink='/dashboard'>
                <IonIcon icon={arrowBack} className='app-icon'> </IonIcon>
              </IonButton>
            </IonButtons>
            <IonTitle className='app-title'>Frost Date Finder</IonTitle>
            <div className='app-title-button app-right-title-button'>
              <IonButtons>
                <IonButton onClick={e => {
                  e.preventDefault();
                  history.push('/dashboard/info');
                }}>
                  <IonIcon icon={helpCircle} className='app-icon'></IonIcon>
                </IonButton>
              </IonButtons>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className='app-page-container'>
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
            <h5 className='station-popover-header'>Station Information</h5>
            <p>ID: {station.station}</p>
            <p>Station Lat: {Math.abs(parseFloat(station.latitude.toPrecision(4)))}&#176;{isLatPositive()}</p>
            <p>Station Long: {Math.abs(parseFloat(station.longitude.toPrecision(5)))}&#176;{isLongPositive()}</p>
            <p>Station Elevation: {station.elevation.toFixed(0)} feet</p>
            <p>Local Elevation: {userElevation.toFixed(0)} feet</p>
            <p>Distance: {Math.round(station.distance)} miles</p>
            <IonButton onClick={() => setShowPopover(false)}>Close</IonButton>
          </IonPopover>

          <h1 className='app-page-header'>Your Frost Dates</h1> 

          <div className='station-container'>
            <div className='station-col'>
              <p>Station: {stringUpper()}, {station.state}</p>
              <IonButton onClick={() => setShowPopover(true)}>More Information</IonButton>
            </div>
          </div>
          <DisplayFrostDates
            title='Light Freeze (32° F)'
            springFrost={springFrostJulian.light}
            fallFrost={fallFrostJulian.light}
            frostFree={frostFreeJulian.light}
          >
          </DisplayFrostDates>
          <DisplayFrostDates
            title='Moderate Freeze (28° F)'
            springFrost={springFrostJulian.moderate}
            fallFrost={fallFrostJulian.moderate}
            frostFree={frostFreeJulian.moderate}
          >
          </DisplayFrostDates>
          <DisplayFrostDates
            title='Severe Freeze (24° F)'
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

ResultsPage.propTypes = {
  match: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired
};

export default ResultsPage;
