//Source code:
//https://stackoverflow.com/questions/43872975/regular-expression-to-match-u-s-cities-allowing-certain-special-characters
import React, {useState} from 'react';
import './TextEntry.css';
import { observable } from "mobx"
import { IonInput, IonItem, IonButton, IonLoading, IonToast } from '@ionic/react';
import { Controller, useForm } from 'react-hook-form';
import {getCityStateCoordinates, getZipCoordinates, LocationData} from '../utils/getCoordinates';


interface TextEntryProps {
    initialLat: number | null
    initialLong: number | null
    initialElev: number | null
    onSubmit: (homeLat: number, homeLong: number, homeElev: number) => void
}
interface DataError {
    showError: boolean;
    message?: string;
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
    @observable
    elev: any = ""
    setElev = (elev: any) => {
        this.elev = elev
    }
}

const TextEntry: React.FC<TextEntryProps> = (props: TextEntryProps) => { 
    const state = React.useRef(new EntryData()).current
    const { control, handleSubmit } = useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<DataError>({ showError: false });
    let myData: { records: { fields: { geopoint: { value: any; } []; }} []; };
    let myElev: { records: { fields: { elev_in_ft: {value: any } }} []; }
    const apiStr = 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q='
    
    React.useEffect(() => {
        state.setLat(props.initialLat)
        state.setLong(props.initialLong)
        state.setElev(props.initialElev)
    }, [props.initialLat, props.initialLong, props.initialElev, state])

    const getZipCodeData = async () => {
        setLoading(true);
        const locationData: LocationData = await getZipCoordinates(state.textEntry);
        
        if (locationData.hasError) {
            console.log(locationData.errorMessage);
            alert(`No results found for your entry. Please check the validity of your five digit zip code.`);
        }
        else {
            state.setLat(locationData.latitude)
            state.setLong(locationData.longitude)
            state.setElev(locationData.elevation)
            props.onSubmit(state.lat, state.long, state.elev)
        }
        setLoading(false);
    }

    const getCityStateData = async () => {
        setLoading(true);
        const locationData: LocationData = await getCityStateCoordinates(state.textEntry);
        
        if (locationData.hasError) {
            console.log(locationData.errorMessage);
            alert('No results found for your entry. Please check the validity of your city/state pair.');
        }
        else {
            state.setLat(locationData.latitude)
            state.setLong(locationData.longitude)
            state.setElev(locationData.elevation)
            props.onSubmit(state.lat, state.long, state.elev)
        }
        setLoading(false);
    }

    const getValid = (data: any) => {
        state.setText(data.text)
        let regExp = /^[a-zA-Z',.\s-]+,[ ]?[A-Za-z]{2}$/ //regex to check if format is comma separated city state pair
        
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
        <div className="text-entry">
            <IonLoading
                isOpen={loading}
                onDidDismiss={() => setLoading(false)}
                message={'Getting Data...'}
            />
            <IonToast
                isOpen={true}
                onDidDismiss={() => setError({ message: "", showError: false })}
                message={error.message}
                duration={1000} 
            />
            <form onSubmit={handleSubmit(getValid)}>
                <IonItem className="location-form">
                    {/* <IonLabel>Zip code or City, State:</IonLabel> */}
                    <Controller 
                        as={<IonInput placeholder="Example: Salem, OR" type="text" />}
                        name="text"
                        control={control}
                        onChangeName="onIonChange"
                    />    
                </IonItem>
                {/* Lat:<span className="latLong" >{state.lat}</span>   Long: <span className="latLong">{state.long}</span><br/> */}
                <IonButton color="primary" type="submit">Submit</IonButton>
            </form>
        </div>
    );
};
export default TextEntry;
