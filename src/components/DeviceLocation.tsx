import React, { useState } from 'react';
import './DeviceLocation.css';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { IonButton, IonLoading, IonToast } from '@ionic/react';
import { observable } from "mobx"

interface DeviceLocationProps {
    initialLat: number | null;
    initialLong: number | null;
    onSubmit: (homeLat: number, homeLong: number) => void
 }
interface LocationError {
    showError: boolean;
    message?: string;
}

class DeviceData {
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
const DeviceLocation: React.FC<DeviceLocationProps> = (props: DeviceLocationProps) => {
    const state = React.useRef(new DeviceData()).current
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<LocationError>({ showError: false });
    const [position, setPosition] = useState<Geoposition>();
    const geolocation = new Geolocation();

    React.useEffect(() => {
        state.setLat(props.initialLat)
        state.setLong(props.initialLong)
    }, [props.initialLat, props.initialLong, state])

    const getLocation = async () => {
        let options = {
            enableHighAccuracy: true,
            timeout: 8000
        }
        setLoading(true);
        try {
            const position = await geolocation.getCurrentPosition(options);
            setPosition(position);
            setLoading(false);
            setError({ showError: false });
            state.setLat(position.coords.latitude)
            state.setLong(position.coords.longitude)
            props.onSubmit(state.lat, state.long)
        } catch (e) {
            let msg = e.message
            if(msg === `Timeout expired`) {msg += `. Make sure your device location service is enabled.`}
            setError({ showError: true, message: msg });
            setLoading(false);
        }
    }
    return (
        <div>
            <IonLoading
                isOpen={loading}
                onDidDismiss={() => setLoading(false)}
                message={'Getting Location...'}
            />
            <IonToast
                isOpen={error.showError}
                onDidDismiss={() => setError({ message: "", showError: false })}
                message={error.message}
                duration={5000}
            />
            <IonButton color="primary" onClick={getLocation}>Use My Location</IonButton>
        </div>
  );
};
export default DeviceLocation;
