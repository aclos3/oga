import React, {useState} from 'react';
import { observable } from "mobx"
import { IonInput, IonLabel, IonItem, IonButton, IonLoading, IonToast } from '@ionic/react';
import { Controller, useForm } from 'react-hook-form';

export interface LatLongStation {
    lat: number,
    long: number,
    stationName: string
  }

const ViewLatLongStation: React.FC<LatLongStation> = (props) => { 
    return (
        <div>
            <h1>Lat: {props.lat}</h1>
            <h1>Long: {props.long}</h1>
            <h1>Station: {props.stationName}</h1>
        </div>
    );
};
export default ViewLatLongStation;
