import React, {useState} from 'react';
import './TextEntry.css';
import { observable } from "mobx"
import { IonInput, IonLabel, IonItem, IonButton, IonLoading, IonToast } from '@ionic/react';
import { Controller, useForm } from 'react-hook-form';
import { setTextRange } from 'typescript';
import {getCityStateCoordinates, LocationData} from '../utils/getCoordinates';

interface TextEntryProps {
    initialLat: Number
    initialLong: Number
    onSubmit: (homeLat: Number, homeLong: Number) => void
}
interface DataError {
    showError: boolean;
    message?: string;
}

interface CityStateApiData {
    records: { 
        fields: { 
            geo_point_2d: { 
                value: number; 
            } []; 
        }
    } [];
}

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
        let regExp = /^[\w ]+,[ ]?[A-Za-z]{2}$/ //regex to check if format is comma separated city state pair
        
        //catch an empty string being passed
        if(state.textEntry === undefined) {
            console.log(`textEntry @ getValid: `, state.textEntry)
        }
        else {  //find comma
            let idx = 0
            for(let i = 0; i < state.textEntry.length; i++) {
                if(state.textEntry.charAt(i) === ',') { idx = i }
            }
            //remove spaces after comma
            for(let i = idx; i < state.textEntry.length; i++) {
                if(state.textEntry.charAt(i) === ' ') {
                    state.setText(state.textEntry.substring(0, i) + state.textEntry.substring(i + 1))
                    i--
                }
            }
        }
        //console.log("replaced spaces after commas: ", state.textEntry, `text len: `, state.textEntry.length, `idx: `, idx)
        //determine if the entry is a city/state pair
        if(regExp.test(state.textEntry)) {
            //console.log(`City state syntax valid!`)
            state.setText(state.textEntry.replace(/,/g, ',+\''))
            //console.log("replaced spaces after commas: ", state.textEntry)
            getCityStateData();
        }
        //determine if entry is a valid zip code
        else if(!(isNaN(state.textEntry)) && state.textEntry.length === 5) {
            //console.log(`zip valid`)
            getZipCodeData();
        }
        //check for more than two characters after comma
        else {alert(`Entry is invalid, please try again. You must use the two letter postal abbreviation for the state.`)}
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
