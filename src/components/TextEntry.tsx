//Source code:
//https://stackoverflow.com/questions/43872975/regular-expression-to-match-u-s-cities-allowing-certain-special-characters
import React, {useState} from 'react';
import './TextEntry.css';
import { IonInput, IonItem, IonButton, IonLoading, IonToast } from '@ionic/react';
import { Controller, useForm } from 'react-hook-form';
import {getCityStateCoordinates, getZipCoordinates, LocationData} from '../utils/getCoordinates';

interface TextEntryProps {
  onSubmit: (homeLat: number, homeLong: number, homeElev: number) => void;
}
interface DataError {
  showError: boolean;
  message?: string;
}

const TextEntry: React.FC<TextEntryProps> = (props: TextEntryProps) => { 
  const { control, handleSubmit } = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<DataError>({ showError: false });
  
  //called when the text entry is determined to be a zip code
  const getZipCodeData = async (zip: string) => {
    setLoading(true);
    const locationData: LocationData = await getZipCoordinates(zip); //gets the lat/long associated with this zipcode
    if (locationData.hasError) {
      console.log(locationData.errorMessage);
      setError({showError: true, message: 'No results found for your entry. Please check the validity of your five digit zip code.'});
    }
    else if (locationData.latitude && locationData.longitude && locationData.elevation) { 
      props.onSubmit(locationData.latitude, locationData.longitude, locationData.elevation);
    }
    setLoading(false);
  };

  //called when the text entry is determined to be a city, state
  const getCityStateData = async (cityName: string, stateCode: string) => {
    setLoading(true);
    const locationData: LocationData = await getCityStateCoordinates(cityName.toUpperCase(), stateCode.toUpperCase());
        
    if (locationData.hasError) {
      console.log(locationData.errorMessage);
      setError({showError: true, message: 'No results found for your entry. Please check the validity of your city/state pair.'});
    }
    else if (locationData.latitude && locationData.longitude && locationData.elevation) {
      props.onSubmit(locationData.latitude, locationData.longitude, locationData.elevation);
    }
    setLoading(false);
  };

  //perform input validation on the user entered text and then determine if it is a zipcode or city, state
  const getValid = (data: any) => {
    let textEntry = data.text;
    const regExp = /^[a-zA-Z',.\s-]+,[ ]?[A-Za-z]{2}$/; //regex to check if format is comma separated city state pair
    let commaCount = 0;
    let buildCityName = '';
    let buildStateCode = '';
    //catch an empty string being passed
    if(textEntry === undefined || textEntry === '') {
      setError({showError: true, message: 'Error, input appears to be blank'});
    }
    else {  //find the comma index and count(there should be only 0 or 1 of them)
      let idx = 0;
      for(let i = 0; i < textEntry.length; i++) {
        if(textEntry.charAt(i) === ',') { 
          idx = i;
          commaCount+=1;
        }
      } //get the city name and set state variable.
      for(let i = 0; i < idx; i++) { buildCityName += textEntry.charAt(i); }

      //remove spaces after comma
      for(let i = idx + 1; i < textEntry.length; i++) {
        if(textEntry.charAt(i) === ' ') {
          textEntry = textEntry.substring(0, i) + textEntry.substring(i + 1);
          i--;
        }
        // add the character to the state code
        else { buildStateCode += textEntry.charAt(i).toUpperCase(); }
      }
      //determine if the entry is a city/state pair
      if(regExp.test(textEntry) && commaCount === 1) {
        textEntry = textEntry.replace(/,/g, ',+\'');
        getCityStateData(buildCityName, buildStateCode);
      }
      //determine if entry is a valid zip code
      else if(!(isNaN(parseInt(textEntry))) && textEntry.length === 5) { getZipCodeData(textEntry); }
      //check for more than two characters after comma
      else {setError({showError: true, message: 'Entry is invalid, please try again. You must enter a five digit zip code or a city name followed by a comma and the two letter postal abbreviation of the state.'});}
    }
  };

  return (
    <div className="text-entry">
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
