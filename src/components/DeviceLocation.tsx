import React, { useState } from 'react';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { IonButton, IonLoading, IonToast } from '@ionic/react';
import { getElevation } from '../utils/getUserElevation';

const METERS_TO_FEET = 3.28084;

interface DeviceLocationProps {
    onSubmit: (homeLat: number, homeLong: number, homeElev: number) => void;
}

interface LocationError {
    showError: boolean;
    message?: string;
}

const DeviceLocation: React.FC<DeviceLocationProps> = (props: DeviceLocationProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<LocationError>({ showError: false });
  const geolocation = new Geolocation();

  let lat: number | null = 0;
  let long: number | null = 0;
  let elev: number | null = 0;

  const getLocation = async () => {
    const options = {  //Device GPS location settings
      enableHighAccuracy: true,
      timeout: 8000
    };

    setLoading(true);

    try { //use the device geolocation to get coordinates and possibly elevation
      const position = await geolocation.getCurrentPosition(options);
      setLoading(false);
      setError({ showError: false });
      lat = position.coords.latitude;
      long = position.coords.longitude;
      
      // get user's elevation: if none from device, call the API
      if(!position.coords.altitude) {
        const apiElev = await getElevation(lat, long);
        elev = apiElev;
      }
      else { //otherwise, use device's location (convert it from meters to feet)
        elev = position.coords.altitude * METERS_TO_FEET;
      }

      props.onSubmit(lat, long, elev || 0);
    } catch (e) {
      let msg = e.message;
      if (msg === 'Timeout expired') {
        msg = 'Error, make sure your device location service is enabled.';
      }
      else if (msg === 'Illegal Access') {
        msg = 'Error, you must allow access to use your device\'s location.';
      }
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
