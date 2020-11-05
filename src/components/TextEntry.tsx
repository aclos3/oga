import React, {useState} from 'react';
import './TextEntry.css';
import { observable } from "mobx"
import { IonInput, IonLabel, IonItem, IonButton, IonLoading, IonToast } from '@ionic/react';
import { Controller, useForm } from 'react-hook-form';
import { setTextRange } from 'typescript';
import {getCityStateCoordinates, LocationData} from '../utils/getCoordinates';
import { formatCityStateInput, inputIsCityState } from '../utils/userValidation';

interface TextEntryProps {
    initialLat: number | null;
    initialLong: number | null;
    onSubmit: (homeLat: number, homeLong: number) => void
}
interface DataError {
    showError: boolean;
    message?: string;
}

//interface CityStateApiData {
//    records: { 
//        fields: { 
//            geo_point_2d: { //
//                value: number; 
//            } []; 
//        }
//    } [];
//}

class EntryData {
    @observable
    textEntry: any = ""
    setText = (textEntry: any) => {
        this.textEntry = textEntry
    }

    @observable
    lat: any = ""
    setLat = (lat: any) => {
        this.lat = lat
    }

    @observable
    long: any = ""
    setLong = (long: any) => {
        this.long = long
    }
}

const TextEntry: React.FC<TextEntryProps> = (props: TextEntryProps) => { 
    const state = React.useRef(new EntryData()).current
    const { control, handleSubmit } = useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<DataError>({ showError: false });
    let myData: { records: { fields: { geopoint: { value: any; } []; }} []; };
    const apiStr = 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q='
    
    React.useEffect(() => {
        state.setLat(props.initialLat)
        state.setLong(props.initialLong)
    }, [props.initialLat, props.initialLong, state])

    const getZipCodeData = async () => {
        setLoading(true);
        await fetch(apiStr + String(state.textEntry), {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            myData = data;
            console.log(`api str: `, state.textEntry)
            if(myData.records[0] === undefined) { alert(`No results found for your entry. Please check the validity of your zipcode or city/state pair.`)}
            else {
                if(myData.records[0].fields.geopoint[0] === undefined) {alert(`Latitude not found.`)}
                else if(myData.records[0].fields.geopoint[1] === undefined) {alert(`Longitude not found.`)}
                else if(myData.records[0].fields.geopoint[0] && myData.records[0].fields.geopoint[1]) {
                    state.setLat(myData.records[0].fields.geopoint[0])
                    state.setLong(myData.records[0].fields.geopoint[1])
                    props.onSubmit(state.lat, state.long)
                }
                else { alert(`Latitude/Longitude data for the desired zip code was not found.`)}
            }
            setLoading(false);
        })
        .catch((error) => {
            setLoading(false)
            console.error(error)
        });
    }

    const getCityStateData = async () => {
        setLoading(true);
        const locationData: LocationData = await getCityStateCoordinates(state.textEntry);
        
        if (locationData.hasError) {
            console.log(locationData.errorMessage);
            alert('No results found for your entry. Please check the validity of your city/state pair.');
        }
        else {
            state.setLat(locationData.latitude);
            state.setLong(locationData.longitude);
            props.onSubmit(state.lat, state.long)
        }

        setLoading(false);
    }

    const getValid = (data: any) => {
        state.setText(data.text)

        if (state.textEntry !== undefined) {
            state.setText(state.textEntry);

            if (inputIsCityState(state.textEntry)) {
                const formattedCityState = formatCityStateInput(state.textEntry);
                state.setText(formattedCityState);
                getCityStateData();
            }

            else if(!(isNaN(state.textEntry)) && state.textEntry.length === 5) {
                getZipCodeData();
            }
            else {
                alert(`Entry is invalid, please try again. You must enter a city, state pair or zip code.`);
            }
        }
        else {
            alert(`Entry is invalid, please try again. You must enter a city, state pair or zip code.`);
        }
    }

    return (
        <div className="zipContainer">
             <IonLoading
                isOpen={loading}
                onDidDismiss={() => setLoading(false)}
                message={'Getting Data...'}
            />
            <IonToast
                isOpen={true}
                onDidDismiss={() => setError({ message: "", showError: false })}
                message={error.message}
                duration={3000} />
             <form onSubmit={handleSubmit(getValid)}>
                <IonItem>
                    <IonLabel color="primary">City, State OR Zipcode: </IonLabel>
                    <Controller 
                        as={<IonInput placeholder="Type Here" type="text" />}
                        name="text"
                        control={control}
                        onChangeName="onIonChange"
                    />    
                </IonItem>
                Lat:<span className="latLong" >{state.lat}</span>   Long: <span className="latLong">{state.long}</span><br/>
                <IonButton color="primary" type="submit">Submit</IonButton>
            </form>
        </div>
    );
};
export default TextEntry;
