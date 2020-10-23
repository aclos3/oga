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
        await fetch(apiStr + String(state.textEntry.text), {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            myData = data;
            if(myData.records[0] === undefined) { alert(`Invalid Zipcode. Please check the zipcode for errors.`)}
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
        state.setText(data)
        if(isNaN(state.textEntry.text) || state.textEntry.text.length !== 5) {
            alert(`Please enter a valid five digit zipcode.`)
        }
        else {getData()}
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
                    <IonLabel color="primary">Zip Code: </IonLabel>
                    <Controller 
                        as={<IonInput type="text" />}
                        name="text"
                        control={control}
                        onChangeName="onIonChange"
                    />    
                </IonItem>Lat:<span className="latLong">{state.lat}</span>   Long: <span className="latLong">{state.long}</span><br/>
                <IonButton color="primary" type="submit">Submit</IonButton>
            </form>
        </div>
    );
};
export default TextEntry;
