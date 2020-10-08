import React, { useState } from 'react';
import './ExploreContainer.css';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { IonButton, IonLoading, IonToast } from '@ionic/react';

interface ContainerProps { }
interface LocationError {
    showError: boolean;
    message?: string;
}

const ExploreContainer: React.FC<ContainerProps> = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<LocationError>({ showError: false });
    const [position, setPosition] = useState<Geoposition>();
    const geolocation = new Geolocation();

    const getLocation = async () => {
        setLoading(true);

        try {
            const position = await geolocation.getCurrentPosition();
            //const position = await Geolocation.getCurrentPosition();
            setPosition(position);
            setLoading(false);
            setError({ showError: false });
        } catch (e) {
            setError({ showError: true, message: e.message });
            setLoading(false);
        }
    }
    return (
    //<div className="container">
    //  <strong>Ready to create an app?</strong>
    //  <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
    //</div>
        <div className="container">
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
            <IonButton color="primary" onClick={getLocation}>{position ? `${position.coords.latitude} ${position.coords.longitude}` : "Get Location"}</IonButton>
        </div>
  );
};

export default ExploreContainer;
