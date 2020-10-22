import React, {useState} from 'react';
import './DataOutput.css';
import { from } from 'rxjs';
import { observable } from "mobx"
import { State } from 'ionicons/dist/types/stencil-public-runtime';
import { IonButton, IonLoading, IonToast } from '@ionic/react';
import moment, { Moment } from "moment-timezone"
import { momentToDate } from "../utils/utils"
import { MomentModule } from 'ngx-moment';
import { ɵgetInjectableDef } from '@angular/core';


var d = new Date()
const THIS_YEAR = d.getFullYear()


interface ContainerProps { 
    //fall28: Number
}

class DataState {
    @observable
    fall24 = 0
    setFall24 = (fall24: number) => {
        this.fall24 = fall24
    }
    @observable
    fall28 = 0
    setFall28 = (fall28: number) => {
        this.fall28 = fall28
    }
    @observable
    fall32 = 0
    setFall32 = (fall32: number) => {
        this.fall32 = fall32
    }
    @observable
    spr24 = 0
    setSpr24 = (spr24: number) => {
        this.spr24 = spr24
    }
    @observable
    spr28 = 0
    setSpr28 = (spr28: number) => {
        this.spr28 = spr28
    }
    @observable
    spr32 = 0
    setSpr32 = (spr32: number) => {
        this.spr32 = spr32
    }

    @observable
    fall24Date: Date = new Date(new Date().getFullYear(), 0, 1)
    setfall24Date = (fall24Date: Date) => {
        this.fall24Date = fall24Date
    }
    @observable
    fall28Date: Date = new Date(new Date().getFullYear(), 0, 1)
    setfall28Date = (fall28Date: Date) => {
        this.fall28Date = fall28Date
    }
    @observable
    fall32Date: Date = new Date(new Date().getFullYear(), 0, 1)
    setfall32Date = (fall32Date: Date) => {
        this.fall32Date = fall32Date
    }

    @observable
    spr24Date: Date = new Date(new Date().getFullYear(), 0, 1)
    setspr24Date = (spr24Date: Date) => {
        this.spr24Date = spr24Date
    }
    @observable
    spr28Date: Date = new Date(new Date().getFullYear(), 0, 1)
    setspr28Date = (spr28Date: Date) => {
        this.spr28Date = spr28Date
    }
    @observable
    spr32Date: Date = new Date(new Date().getFullYear(), 0, 1)
    setspr32Date = (spr32Date: Date) => {
        this.spr32Date = spr32Date
    }
    @observable
    stationID: string = "Station ID:"
    setID = (stationID: string) => {
        this.stationID = stationID
    }

}

const DataOutput: React.FC<ContainerProps> = () => { 
    const state = React.useRef(new DataState()).current
    const [loading, setLoading] = useState<boolean>(false);
    let myData: { results: { value: any; }[]; };
    const apiStr = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=NORMAL_ANN&datatypeid=ANN-TMIN-PRBLST-T24FP90&datatypeid=ANN-TMIN-PRBLST-T28FP90&datatypeid=ANN-TMIN-PRBLST-T32FP90&datatypeid=ANN-TMIN-PRBFST-T24FP90&datatypeid=ANN-TMIN-PRBFST-T28FP90&datatypeid=ANN-TMIN-PRBFST-T32FP90&startdate=2010-01-01&enddate=2010-01-01'
    let stationStr = '&stationid=GHCND:USC00350265'
    
    //gets the day number of 90 percent 28 degree frost probabilty
    const getData = async () => {
        setLoading(true);
        const headers = new Headers();
        headers.append('token', 'dIGnmnvBvpgQMZqGfFFmMJfvoxiBLNif');


        await fetch(apiStr + stationStr, {
        method: 'GET',
        headers: headers,
        })
        .then(response => response.json())
        .then(data => {
            myData = data;
            state.setFall24(myData.results[0].value);
            state.setFall28(myData.results[1].value);
            state.setFall32(myData.results[2].value);
            state.setSpr24(myData.results[3].value);
            state.setSpr28(myData.results[4].value);
            state.setSpr32(myData.results[5].value);
            
            //fix leap years
            var isLeap = new Date(THIS_YEAR, 1, 29).getMonth() == 1
            //console.log(`is leap: `, isLeap)
            if(isLeap) {
                var i;
                for(i = 0; i < myData.results.length; i++ ) {
                    if(myData.results[i].value > 59) { myData.results[i].value += 1}
                }
            }
            state.setfall24Date(momentToDate(moment([2020]).add(myData.results[0].value - 1, 'd')))
            state.setfall28Date(momentToDate(moment([2020]).add(myData.results[1].value - 1, 'd')))
            state.setfall32Date(momentToDate(moment([2020]).add(myData.results[2].value - 1, 'd')))
            state.setspr24Date(momentToDate(moment([2020]).add(myData.results[3].value - 1, 'd')))
            state.setspr28Date(momentToDate(moment([2020]).add(myData.results[4].value - 1, 'd')))
            state.setspr32Date(momentToDate(moment([2020]).add(myData.results[5].value - 1, 'd')))
            
            setLoading(false);
        })
        .catch((error) => {
            setLoading(false)
            console.error(error);
        });
    }
    return (

        <div>
            <IonLoading
                isOpen={loading}
                onDidDismiss={() => setLoading(false)}
                message={'Getting Data...'}
            />
            <IonButton color="primary" onClick={getData}>Make API Call</IonButton>
            <br/> Station: {stationStr} 
                <h5>Julian Day Number: {state.spr24} - {state.spr24Date.toString()}</h5>
                <h5>Julian Day Number: {state.spr28} - {state.spr28Date.toString()}</h5>
                <h5>Julian Day Number: {state.spr32} - {state.spr32Date.toString()}</h5>
                <h5>Julian Day Number: {state.fall24} - {state.fall24Date.toString()}</h5>
                <h5>Julian Day Number: {state.fall28} - {state.fall28Date.toString()}</h5>
                <h5>Julian Day Number: {state.fall32} - {state.fall32Date.toString()}</h5>
            
        </div>
    );
};

export default DataOutput;
