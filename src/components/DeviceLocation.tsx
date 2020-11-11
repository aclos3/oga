import React, { useState } from 'react';
import './DeviceLocation.css';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { IonButton, IonLoading, IonToast } from '@ionic/react';
import { observable } from "mobx"
import TextEntry from './TextEntry';
import { errorMonitor } from 'stream';

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
            timeout: 5000
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
            setError({ showError: true, message: e.message });
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
                duration={3000}
            />
            <IonButton color="primary" onClick={getLocation} className="location-button">Use My Location</IonButton>
        </div>
  );
};
export default DeviceLocation;
