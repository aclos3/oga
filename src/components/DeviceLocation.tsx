import React, { useState } from 'react';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { IonButton, IonLoading, IonToast } from '@ionic/react';
import { observable } from 'mobx';
import { getElevation } from '../utils/getUserElevation';

interface DeviceLocationProps {
    initialLat: number | null;
    initialLong: number | null;
    initialElev: number | null;
    onSubmit: (homeLat: number, homeLong: number, homeElev: number) => void;
 }
interface LocationError {
    showError: boolean;
    message?: string;
}
class DeviceData {
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
}
const DeviceLocation: React.FC<DeviceLocationProps> = (props: DeviceLocationProps) => {
  const state = React.useRef(new DeviceData()).current;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<LocationError>({ showError: false });
  const [position, setPosition] = useState<Geoposition>();
  const geolocation = new Geolocation();

  React.useEffect(() => {
    state.setLat(props.initialLat);
    state.setLong(props.initialLong);
    state.setElev(props.initialElev);
  }, [props.initialLat, props.initialLong, props.initialElev, state]);

  const getLocation = async () => {
    const options = {  //Device GPS location settings
      enableHighAccuracy: true,
      timeout: 8000
    };
    setLoading(true);
    try { //use the device geolocation to get coordinates and possibly elevation
      const position = await geolocation.getCurrentPosition(options);
      setPosition(position);
      setLoading(false);
      setError({ showError: false });
      state.setLat(position.coords.latitude);
      state.setLong(position.coords.longitude);
      //check for evelvation from device
            
      if(!position.coords.altitude) { //if no elevation from device, call the separate getElevation function
        const apiElev = await getElevation(state.lat, state.long);
        state.setElev(apiElev.elevation);
      }
      else { //otherwise, use device's location
        state.setElev(position.coords.altitude);
      }
      props.onSubmit(state.lat, state.long, state.elev);
    } catch (e) {
      let msg = e.message;
      if(msg === 'Timeout expired') {msg += '. Make sure your device location service is enabled.';}
      setError({ showError: true, message: msg });
      setLoading(false);
    }
  };
  return (
    <div>
      <IonLoading
        isOpen={loading}
        onDidDismiss={() => setLoading(false)}
        message={'Getting Location...'}
      />
      <IonToast
        isOpen={error.showError}
        onDidDismiss={() => setError({ message: '', showError: false })}
        message={error.message}
        duration={5000}
      />
      <IonButton onClick={getLocation}>Use My Location</IonButton>
    </div>
  );
};
export default DeviceLocation;
