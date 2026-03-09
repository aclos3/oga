
import { IonPage, IonHeader, IonLoading, IonToolbar, IonTitle, IonContent, IonButtons, IonPopover, IonButton, IonIcon, IonToast } from '@ionic/react';
import { arrowBack, helpCircle } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import { Station, getClosestStationAndFrostData } from '../utils/getClosestStation';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import './ResultsPage.css';
import DisplayFrostDates from '../components/DisplayFrostDates';

// words in station names to expand or ignore
const EXPAND_WORDS: {[key: string]: string} = {
  'AP': 'Airport',
  'FLD': 'Field',
  'STN': 'Station',
  'CTR': 'Center',
  'RGNL': 'Regional',
  'UNIV': 'University'
};
const IGNORE_WORDS = ['HCN', 'N', 'E', 'S', 'W', 'NE', 'NW', 'SE', 'SW', 'NNE', 'NNW', 'SSE', 'SSW', 'ENE', 'WNW', 'ESE', 'WSW'];

type ContainerProps = RouteComponentProps<{
    id: string;
}>

interface FrostDates {
  light: string;
  moderate: string;
  severe: string;
}

interface DataError {
  showError: boolean;
  message?: string;
}

const ResultsPage: React.FC<ContainerProps> = ({ match, history }) => { 
  const [station, setStation] = useState<Station>({station: '0', latitude: 0, longitude: 0, elevation: 0, state: '0', city: '0', distance: 0});
  const [springFrostJulian, setSpringFrostJulian] = useState<FrostDates>({light: '0', moderate: '0', severe: '0'});
  const [fallFrostJulian, setFallFrostJulian] = useState<FrostDates>({light: '0', moderate: '0', severe: '0'});
  const [frostFreeJulian, setFrostFreeJulian] = useState<FrostDates>({light: '0', moderate: '0', severe: '0'});
  const [loading, setLoading] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState(false);
  const [userElevation, setUserElevation] = useState<number>(0);
  const [error, setError] = useState<DataError>({ showError: false });
    
  // fetches frost dates after station ID updates (from history URL)
  useEffect( () => {
    const urlLatLongElev = match.params.id;
    const [lat, long, elevation] = urlLatLongElev.split(',');

    //Set elevation
    if(elevation) { setUserElevation(parseFloat(elevation)); }

    // if there's a lat long in the URL, get the closest station and its frost data and set the state variables to display
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
      else { setError({showError: true, message: 'No station was found. Try another location.'});}
    }
  }, [match.params.id]);
    
  //these two helper functions are for styling purposes. To convert negative/positive lat and long to N/S/E/W
  const isLatPositive = () => { return station.latitude >= 0 ? 'N' : 'S'; };
  const isLongPositive = () => { return station.longitude >= 0 ? 'E' : 'W'; };

  //this function makes sure only the first letter of each word remains capitalized and removes extraneous spaces at the end of the string
  //the function also checks for certain words to omit and for some abbreviations to expand.
  const capitalizeStationName = () => {
    const upWords: string[] = station.city.split(' ');
    let word = '';

    for (let i = 0; i < upWords.length; i++) {
      word = upWords[i];

      if(word && word !== ' ') {
        if (EXPAND_WORDS[word]) { upWords[i] = EXPAND_WORDS[word]; }
        else if (IGNORE_WORDS.includes(word)) { upWords[i] = '';}
        // capitalize names like McNary properly
        else if (word.length >= 2 && ((word[0] === 'M' && word[1] === 'C'))) {
          upWords[i] = upWords[i][0] + upWords[i][1].toLowerCase() + upWords[i][2] + upWords[i].substr(3).toLowerCase();
        }
        else { upWords[i] = word[0] + word.substr(1).toLowerCase();}
      }
    }

    return upWords.join(' ').trim();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="app-toolbar">
            <IonButtons className="app-title-button app-left-title-button">
              <IonButton routerLink="/dashboard">
                <IonIcon icon={arrowBack} className="app-icon"> </IonIcon>
              </IonButton>
            </IonButtons>
            <IonTitle className="app-title">Frost Date Finder</IonTitle>
            <div className="app-title-button app-right-title-button">
              <IonButtons>
                <IonButton onClick={e => {
                  e.preventDefault();
                  history.push('/dashboard/info');
                }}>
                  <IonIcon icon={helpCircle} className="app-icon"></IonIcon>
                </IonButton>
              </IonButtons>
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
          <IonToast
            isOpen={error.showError}
            onDidDismiss={() => setError({ message: '', showError: false })}
            message={error.message}
            duration={3000} 
          />
          <IonPopover
            isOpen={showPopover}
            cssClass="station-popover"
            onDidDismiss={e => setShowPopover(false)}
          >
            <h5 className="station-popover-header">Station Information</h5>
            <p>ID: {station.station}</p>
            <p>Station Lat: {Math.abs(parseFloat(station.latitude.toPrecision(4)))}&#176;{isLatPositive()}</p>
            <p>Station Long: {Math.abs(parseFloat(station.longitude.toPrecision(5)))}&#176;{isLongPositive()}</p>
            <p>Station Elevation: {station.elevation.toFixed(0)} feet</p>
            <p>Local Elevation: {userElevation.toFixed(0)} feet</p>
            <p>Distance: {Math.round(station.distance)} miles</p>
            <IonButton onClick={() => setShowPopover(false)}>Close</IonButton>
          </IonPopover>

          <h1 className="app-page-header">Your Frost Dates</h1> 
          <div className="station-container">
            <div className="station-col">
              <p>Station: {capitalizeStationName()}, {station.state}</p>
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

ResultsPage.propTypes = {
  match: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired
};

export default ResultsPage;
