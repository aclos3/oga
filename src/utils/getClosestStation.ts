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
    fst_t24fp90: string,
    fst_t28fp90: string,
    fst_t32fp90: string,
    lst_t24fp90: string,
    lst_t28fp90: string,
    lst_t32fp90: string,
    gsl_t24fp90: number,
    gsl_t28fp90: number,
    gsl_t32fp90: number,
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
    const frostData: FrostData[] = frostJSON.map( (data) => {
        return {
            station: data.station,
            fst_t24fp90: data["ann-tmin-prbfst-t24fp90"],
            fst_t28fp90: data["ann-tmin-prbfst-t28fp90"],
            fst_t32fp90: data["ann-tmin-prbfst-t32fp90"],
            lst_t24fp90: data["ann-tmin-prblst-t24fp90"],
            lst_t28fp90: data["ann-tmin-prblst-t28fp90"],
            lst_t32fp90: data["ann-tmin-prblst-t32fp90"],
            gsl_t24fp90: data["ann-tmin-prbgsl-t24fp90"],
            gsl_t28fp90: data["ann-tmin-prbgsl-t28fp90"],
            gsl_t32fp90: data["ann-tmin-prbgsl-t32fp90"],
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
