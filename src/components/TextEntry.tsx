import React, {useState} from 'react';
import './TextEntry.css';
import { observable } from "mobx"
import { IonInput, IonLabel, IonItem, IonButton, IonLoading, IonToast } from '@ionic/react';
import { Controller, useForm } from 'react-hook-form';

interface ContainerProps {}
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
}

const TextEntry: React.FC<ContainerProps> = () => { 
    const state = React.useRef(new EntryData()).current
    const { control, handleSubmit } = useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<DataError>({ showError: false });
    let myData: { records: { fields: { geopoint: { value: any; } []; }} []; };
    const apiStr = 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q='
    
    const getData = async () => {
        setLoading(true);
        await fetch(apiStr + String(state.textEntry), {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            myData = data;
            if(myData.records[0] === undefined) { alert(`No results found for your entry. Please check for typos.`)}
            else {
                if(myData.records[0].fields.geopoint[0] && myData.records[0].fields.geopoint[1]) {
                    state.setLat(myData.records[0].fields.geopoint[0])
                    state.setLong(myData.records[0].fields.geopoint[1])
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

    const getValid = (data: any) => {

        state.setText(data.text)
        let regExp = /^[\w ]+,[ ]?[A-Za-z]{2}$/ //regex to check if format is comma separated city state pair
        
        //determine if the entry is a city/state pair
        if(regExp.test(state.textEntry)) {
            console.log(`City state syntax valid!`)
             //add space after comma
             state.setText(state.textEntry.replace(/,/g, ', '))
             getData()
        }
        //determine if entry is a valid zip code
        else if(!(isNaN(state.textEntry)) && state.textEntry.length === 5) {
            console.log(`zip valid`)
            getData()
        }
        else {console.log(`invalid`)}
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
                </IonItem>Lat:<span className="latLong" >{state.lat}</span>   Long: <span className="latLong">{state.long}</span><br/>
                <IonButton color="primary" type="submit">Submit</IonButton>
            </form>
        </div>
    );
};
export default TextEntry;
