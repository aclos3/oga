import stationsJSON from '../data/station_lat_long.json';
import frostJSON from '../data/frost_data.json';

export interface Station {
    station: string,
    latitude: number,
    longitude: number,
    distance: number
}

export interface FrostData {
    station: string,
    fst_t24fp90: number,
    fst_t28fp90: number,
    fst_t32fp90: number,
    lst_t24fp90: number,
    lst_t28fp90: number,
    lst_t32fp90: number,
    gsl_t24fp90: number,
    gsl_t28fp90: number,
    gsl_t32fp90: number
}

export interface Coordinates {
    lat: number,
    long: number
}

//get all weather stations
export function getWeatherStations(): Station[] {
    const stations: Station[] = stationsJSON.map( (data) => {
        return {
            station: data.station,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
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
            fst_t24fp90: parseFloat(data["ann-tmin-prbfst-t24fp90"]),
            fst_t28fp90: parseFloat(data["ann-tmin-prbfst-t28fp90"]),
            fst_t32fp90: parseFloat(data["ann-tmin-prbfst-t32fp90"]),
            lst_t24fp90: parseFloat(data["ann-tmin-prblst-t24fp90"]),
            lst_t28fp90: parseFloat(data["ann-tmin-prblst-t28fp90"]),
            lst_t32fp90: parseFloat(data["ann-tmin-prblst-t32fp90"]),
            gsl_t24fp90: parseFloat(data["ann-tmin-prbgsl-t24fp90"]),
            gsl_t28fp90: parseFloat(data["ann-tmin-prbgsl-t28fp90"]),
            gsl_t32fp90: parseFloat(data["ann-tmin-prbgsl-t32fp90"])
        };
    });
    return frostData;
}

const stations: Station[] = getWeatherStations();
const frostData: FrostData[] = getFrostData();

// returns closest weather station (station ID, latitude, and longitude) to a given point (latitude and longitude)

export function getClosestStation(origin: Coordinates): Station | null {
    let smallestDistance: number = Infinity;
    let closestStation: Station | null = null;
    
    for (let station of stations) {
        const distance: number = getDistanceFromLatLongInKm(origin, {lat: station.latitude, long: station.longitude});
        station.distance = distance
        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestStation = station;
        }
    }
    getClosestStationList(origin)
    return closestStation;
}

// returns a list sorted by distance from the origin
export function getClosestStationList(origin: Coordinates): Station[] | null {
    let smallestDistance: number = Infinity;
    let closestStation: Station[] | null = null;
    //let stationArr: { id: number, lat: number, long: number}[] = [];

    let count = 0
    for(let station of stations) {
        
        if (count < 20) {
            console.log(`station list: `, station)
        }
        count += 1
    }
    return closestStation;
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
