//Source code:
//https://stackoverflow.com/questions/43872975/regular-expression-to-match-u-s-cities-allowing-certain-special-characters
import React, {useState} from 'react';
import './TextEntry.css';
import { observable } from 'mobx';
import { IonInput, IonItem, IonButton, IonLoading, IonToast } from '@ionic/react';
import { Controller, useForm } from 'react-hook-form';
import {getCityStateCoordinates, getZipCoordinates, LocationData} from '../utils/getCoordinates';

interface TextEntryProps {
  initialLat: number | null;
  initialLong: number | null;
  initialElev: number | null;
  onSubmit: (homeLat: number, homeLong: number, homeElev: number) => void;
}
interface DataError {
  showError: boolean;
  message?: string;
}

class EntryData {
  @observable
  textEntry: any = ''
  setText = (textEntry: any) => {
    this.textEntry = textEntry;
  }
  @observable
  lat: any = ''
  setLat = (lat: any) => {
    this.lat = lat;
  }
  @observable
  long: any = ''
  setLong = (long: any) => {
    this.long = long;
  }
  @observable
  elev: any = ''
  setElev = (elev: any) => {
    this.elev = elev;
  }
  @observable
  cityName: any = ''
  setCityName = (cityName: any) => {
    this.cityName = cityName;
  }
  @observable
  stateCode: any = ''
  setStateCode = (stateCode: any) => {
    this.stateCode = stateCode;
  }
}
const TextEntry: React.FC<TextEntryProps> = (props: TextEntryProps) => { 
  const state = React.useRef(new EntryData()).current;
  const { control, handleSubmit } = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<DataError>({ showError: false });
    
  React.useEffect(() => {
    state.setLat(props.initialLat);
    state.setLong(props.initialLong);
    state.setElev(props.initialElev);
  }, [props.initialLat, props.initialLong, props.initialElev, state]);
  //called when the text entry is determined to be a zip code
  const getZipCodeData = async () => {
    setLoading(true);
    const locationData: LocationData = await getZipCoordinates(state.textEntry); //gets the lat/long associated with this zipcode
    if (locationData.hasError) {
      console.log(locationData.errorMessage);
      alert('No results found for your entry. Please check the validity of your five digit zip code.');
    }
    else { 
      state.setLat(locationData.latitude);
      state.setLong(locationData.longitude);
      state.setElev(locationData.elevation);
      props.onSubmit(state.lat, state.long, state.elev);
    }
    setLoading(false);
  };
  //called when the text entry is determined to be a city, state
  const getCityStateData = async () => {
    setLoading(true);
    const locationData: LocationData = await getCityStateCoordinates(state.textEntry, state.cityName.toUpperCase(), state.stateCode.toUpperCase());
        
    if (locationData.hasError) {
      console.log(locationData.errorMessage);
      alert('No results found for your entry. Please check the validity of your city/state pair.');
    }
    else {
      state.setLat(locationData.latitude);
      state.setLong(locationData.longitude);
      state.setElev(locationData.elevation);
      props.onSubmit(state.lat, state.long, state.elev);
    }
    setLoading(false);
  };
  //perform input validation on the user entered text and then determine if it is a zipcode or city, state
  const getValid = (data: any) => {
    state.setText(data.text);
    const regExp = /^[a-zA-Z',.\s-]+,[ ]?[A-Za-z]{2}$/; //regex to check if format is comma separated city state pair
    let commaCount = 0;
    let buildCityName = '';
    let buildStateCode = '';
    //catch an empty string being passed
    if(state.textEntry === undefined) {
      alert('Error in text entry.');
    }
    else {  //find the comma index and count(there should be only 0 or 1 of them)
      let idx = 0;
      for(let i = 0; i < state.textEntry.length; i++) {
        if(state.textEntry.charAt(i) === ',') { 
          idx = i;
          commaCount+=1;
        }
      } //get the city name and set state variable.
      for(let i = 0; i < idx; i++) { buildCityName += state.textEntry.charAt(i); }
      state.setCityName(buildCityName);
      //remove spaces after comma
      for(let i = idx + 1; i < state.textEntry.length; i++) {
        if(state.textEntry.charAt(i) === ' ') {
          state.setText(state.textEntry.substring(0, i) + state.textEntry.substring(i + 1));
          i--;
        }
        // add the character to the state code
        else { buildStateCode += state.textEntry.charAt(i).toUpperCase(); }
      }
      state.setStateCode(buildStateCode);
    }
    //determine if the entry is a city/state pair
    if(regExp.test(state.textEntry) && commaCount === 1) {
      state.setText(state.textEntry.replace(/,/g, ',+\''));
      getCityStateData();
    }
    //determine if entry is a valid zip code
    else if(!(isNaN(state.textEntry)) && state.textEntry.length === 5) { getZipCodeData(); }
    //check for more than two characters after comma
    else {alert('Entry is invalid, please try again. You must use the two letter postal abbreviation for the state.');}
  };
  return (
    <div className="text-entry">
      <IonLoading
        isOpen={loading}
        onDidDismiss={() => setLoading(false)}
        message={'Getting Data...'}
      />
      <IonToast
        isOpen={true}
        onDidDismiss={() => setError({ message: '', showError: false })}
        message={error.message}
        duration={3000} 
      />
      <form onSubmit={handleSubmit(getValid)}>
        <IonItem className="location-form">
          <Controller 
            as={<IonInput placeholder="Example: Salem, OR" type="text" />}
            name="text"
            control={control}
            onChangeName="onIonChange"
          />    
        </IonItem>
        <IonButton type="submit">Submit</IonButton>
      </form>
    </div>
  );
};
export default TextEntry;
