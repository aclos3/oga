import stationsJSON from '../data/station_lat_long.json';
import frostJSON from '../data/frost_data.json';

export interface Station {
    station: string,
    latitude: number,
    longitude: number,
    elevation: number,
    state: string,
    city: string,
    distance: number
}

export interface FrostData {
    station: string,
    fst_t24fp10: string,
    fst_t28fp10: string,
    fst_t32fp10: string,
    lst_t24fp10: string,
    lst_t28fp10: string,
    lst_t32fp10: string,
    gsl_t24fp10: string,
    gsl_t28fp10: string,
    gsl_t32fp10: string,

    fst_t24fp20: string,
    fst_t28fp20: string,
    fst_t32fp20: string,
    lst_t24fp20: string,
    lst_t28fp20: string,
    lst_t32fp20: string,
    gsl_t24fp20: string,
    gsl_t28fp20: string,
    gsl_t32fp20: string,

    fst_t24fp30: string,
    fst_t28fp30: string,
    fst_t32fp30: string,
    lst_t24fp30: string,
    lst_t28fp30: string,
    lst_t32fp30: string,
    gsl_t24fp30: string,
    gsl_t28fp30: string,
    gsl_t32fp30: string,

    fst_t24fp40: string,
    fst_t28fp40: string,
    fst_t32fp40: string,
    lst_t24fp40: string,
    lst_t28fp40: string,
    lst_t32fp40: string,
    gsl_t24fp40: string,
    gsl_t28fp40: string,
    gsl_t32fp40: string,

    fst_t24fp50: string,
    fst_t28fp50: string,
    fst_t32fp50: string,
    lst_t24fp50: string,
    lst_t28fp50: string,
    lst_t32fp50: string,
    gsl_t24fp50: string,
    gsl_t28fp50: string,
    gsl_t32fp50: string,

    fst_t24fp60: string,
    fst_t28fp60: string,
    fst_t32fp60: string,
    lst_t24fp60: string,
    lst_t28fp60: string,
    lst_t32fp60: string,
    gsl_t24fp60: string,
    gsl_t28fp60: string,
    gsl_t32fp60: string,

    fst_t24fp70: string,
    fst_t28fp70: string,
    fst_t32fp70: string,
    lst_t24fp70: string,
    lst_t28fp70: string,
    lst_t32fp70: string,
    gsl_t24fp70: string,
    gsl_t28fp70: string,
    gsl_t32fp70: string,

    fst_t24fp80: string,
    fst_t28fp80: string,
    fst_t32fp80: string,
    lst_t24fp80: string,
    lst_t28fp80: string,
    lst_t32fp80: string,
    gsl_t24fp80: string,
    gsl_t28fp80: string,
    gsl_t32fp80: string,

    fst_t24fp90: string,
    fst_t28fp90: string,
    fst_t32fp90: string,
    lst_t24fp90: string,
    lst_t28fp90: string,
    lst_t32fp90: string,
    gsl_t24fp90: string,
    gsl_t28fp90: string,
    gsl_t32fp90: string,
    
    quality: string
}

export interface Coordinates {
    lat: number,
    long: number
}

//get all weather stations
export function getWeatherStations(): Station[] {
    const stations: Station[] = stationsJSON.map( (data) => {
        return {
            station: data.id,
            latitude: data.latitude,
            longitude: data.longitude,
            elevation: data.elevation,
            state: data.state,
            city: data.city,
            distance: 999999
        };
    });
    return stations;
}

//get all station frost data
export function getFrostData(): FrostData[] {
    const frostData: FrostData[] = frostJSON.map((data) => {
        return {
            station: data.station,
            fst_t24fp10: data["ann-tmin-prbfst-t24Fp10"],
            fst_t28fp10: data["ann-tmin-prbfst-t28Fp10"],
            fst_t32fp10: data["ann-tmin-prbfst-t32Fp10"],
            lst_t24fp10: data["ann-tmin-prblst-t24Fp10"],
            lst_t28fp10: data["ann-tmin-prblst-t28Fp10"],
            lst_t32fp10: data["ann-tmin-prblst-t32Fp10"],
            gsl_t24fp10: data["ann-tmin-prbgsl-t24Fp10"],
            gsl_t28fp10: data["ann-tmin-prbgsl-t28Fp10"],
            gsl_t32fp10: data["ann-tmin-prbgsl-t32Fp10"],

            fst_t24fp20: data["ann-tmin-prbfst-t24Fp20"],
            fst_t28fp20: data["ann-tmin-prbfst-t28Fp20"],
            fst_t32fp20: data["ann-tmin-prbfst-t32Fp20"],
            lst_t24fp20: data["ann-tmin-prblst-t24Fp20"],
            lst_t28fp20: data["ann-tmin-prblst-t28Fp20"],
            lst_t32fp20: data["ann-tmin-prblst-t32Fp20"],
            gsl_t24fp20: data["ann-tmin-prbgsl-t24Fp20"],
            gsl_t28fp20: data["ann-tmin-prbgsl-t28Fp20"],
            gsl_t32fp20: data["ann-tmin-prbgsl-t32Fp20"],
            
            fst_t24fp30: data["ann-tmin-prbfst-t24Fp30"],
            fst_t28fp30: data["ann-tmin-prbfst-t28Fp30"],
            fst_t32fp30: data["ann-tmin-prbfst-t32Fp30"],
            lst_t24fp30: data["ann-tmin-prblst-t24Fp30"],
            lst_t28fp30: data["ann-tmin-prblst-t28Fp30"],
            lst_t32fp30: data["ann-tmin-prblst-t32Fp30"],
            gsl_t24fp30: data["ann-tmin-prbgsl-t24Fp30"],
            gsl_t28fp30: data["ann-tmin-prbgsl-t28Fp30"],
            gsl_t32fp30: data["ann-tmin-prbgsl-t32Fp30"],

            fst_t24fp40: data["ann-tmin-prbfst-t24Fp40"],
            fst_t28fp40: data["ann-tmin-prbfst-t28Fp40"],
            fst_t32fp40: data["ann-tmin-prbfst-t32Fp40"],
            lst_t24fp40: data["ann-tmin-prblst-t24Fp40"],
            lst_t28fp40: data["ann-tmin-prblst-t28Fp40"],
            lst_t32fp40: data["ann-tmin-prblst-t32Fp40"],
            gsl_t24fp40: data["ann-tmin-prbgsl-t24Fp40"],
            gsl_t28fp40: data["ann-tmin-prbgsl-t28Fp40"],
            gsl_t32fp40: data["ann-tmin-prbgsl-t32Fp40"],

            fst_t24fp50: data["ann-tmin-prbfst-t24Fp50"],
            fst_t28fp50: data["ann-tmin-prbfst-t28Fp50"],
            fst_t32fp50: data["ann-tmin-prbfst-t32Fp50"],
            lst_t24fp50: data["ann-tmin-prblst-t24Fp50"],
            lst_t28fp50: data["ann-tmin-prblst-t28Fp50"],
            lst_t32fp50: data["ann-tmin-prblst-t32Fp50"],
            gsl_t24fp50: data["ann-tmin-prbgsl-t24Fp50"],
            gsl_t28fp50: data["ann-tmin-prbgsl-t28Fp50"],
            gsl_t32fp50: data["ann-tmin-prbgsl-t32Fp50"],

            fst_t24fp60: data["ann-tmin-prbfst-t24Fp60"],
            fst_t28fp60: data["ann-tmin-prbfst-t28Fp60"],
            fst_t32fp60: data["ann-tmin-prbfst-t32Fp60"],
            lst_t24fp60: data["ann-tmin-prblst-t24Fp60"],
            lst_t28fp60: data["ann-tmin-prblst-t28Fp60"],
            lst_t32fp60: data["ann-tmin-prblst-t32Fp60"],
            gsl_t24fp60: data["ann-tmin-prbgsl-t24Fp60"],
            gsl_t28fp60: data["ann-tmin-prbgsl-t28Fp60"],
            gsl_t32fp60: data["ann-tmin-prbgsl-t32Fp60"],

            fst_t24fp70: data["ann-tmin-prbfst-t24Fp70"],
            fst_t28fp70: data["ann-tmin-prbfst-t28Fp70"],
            fst_t32fp70: data["ann-tmin-prbfst-t32Fp70"],
            lst_t24fp70: data["ann-tmin-prblst-t24Fp70"],
            lst_t28fp70: data["ann-tmin-prblst-t28Fp70"],
            lst_t32fp70: data["ann-tmin-prblst-t32Fp70"],
            gsl_t24fp70: data["ann-tmin-prbgsl-t24Fp70"],
            gsl_t28fp70: data["ann-tmin-prbgsl-t28Fp70"],
            gsl_t32fp70: data["ann-tmin-prbgsl-t32Fp70"],

            fst_t24fp80: data["ann-tmin-prbfst-t24Fp80"],
            fst_t28fp80: data["ann-tmin-prbfst-t28Fp80"],
            fst_t32fp80: data["ann-tmin-prbfst-t32Fp80"],
            lst_t24fp80: data["ann-tmin-prblst-t24Fp80"],
            lst_t28fp80: data["ann-tmin-prblst-t28Fp80"],
            lst_t32fp80: data["ann-tmin-prblst-t32Fp80"],
            gsl_t24fp80: data["ann-tmin-prbgsl-t24Fp80"],
            gsl_t28fp80: data["ann-tmin-prbgsl-t28Fp80"],
            gsl_t32fp80: data["ann-tmin-prbgsl-t32Fp80"],

            fst_t24fp90: data["ann-tmin-prbfst-t24Fp90"],
            fst_t28fp90: data["ann-tmin-prbfst-t28Fp90"],
            fst_t32fp90: data["ann-tmin-prbfst-t32Fp90"],
            lst_t24fp90: data["ann-tmin-prblst-t24Fp90"],
            lst_t28fp90: data["ann-tmin-prblst-t28Fp90"],
            lst_t32fp90: data["ann-tmin-prblst-t32Fp90"],
            gsl_t24fp90: data["ann-tmin-prbgsl-t24Fp90"],
            gsl_t28fp90: data["ann-tmin-prbgsl-t28Fp90"],
            gsl_t32fp90: data["ann-tmin-prbgsl-t32Fp90"],
            quality: data["quality"]
        };
    });
    return frostData;
}

const stations: Station[] = getWeatherStations();

// returns a list sorted by distance from the origin
export function getClosestStationList(origin: Coordinates): Station[] | null {
    //get station distances
    for (let station of stations) {
        station.distance = getDistanceFromLatLongInKm(origin, {lat: station.latitude, long: station.longitude});
    }
    //sort stations by distance
    stations.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
    return stations;
}

// uses Haversine formula, which gives the great-circle distance between two latitude-longitude pairs
// will have some error from assuming that earth is a perfect sphere
export const getClosestPoint = (origin: Coordinates, locations: Coordinates[]): Coordinates => {
    let smallestDistance: number = Infinity;
    let closestPosition: Coordinates = {
        lat: 0,
        long: 0
    };
    
    for (let location of locations) {
        const distance: number = getDistanceFromLatLongInKm(origin, location);
        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestPosition = location;
        }
    }

    return closestPosition;
}

const convertDegreesToRadians = (degree: number) => {
    return degree * (Math.PI / 180);
} 

// haversine formula: https://en.wikipedia.org/wiki/Haversine_formula
// variable names a and c come from formula
// source of code: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula/21623206#21623206
export const getDistanceFromLatLongInKm = (pointA: Coordinates, pointB: Coordinates) => {
    const earthRadiusInKM: number = 6371;
    const latitudeDifferenceInRadians: number = convertDegreesToRadians(pointB.lat - pointA.lat);
    const longitudeDifferenceInRadians: number = convertDegreesToRadians(pointB.long - pointA.long); 

    const a: number = 
      Math.sin(latitudeDifferenceInRadians / 2) * Math.sin(latitudeDifferenceInRadians / 2) +
      Math.cos(convertDegreesToRadians(pointA.lat)) * Math.cos(convertDegreesToRadians(pointB.lat)) * 
      Math.sin(longitudeDifferenceInRadians / 2) * Math.sin(longitudeDifferenceInRadians / 2); 
    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const distance: number = earthRadiusInKM * c;

    return distance;
}
