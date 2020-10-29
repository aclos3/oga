import * as stationsJSON from '../data/station_lat_long.json';

export interface Station {
    station: string,
    latitude: number,
    longitude: number
}

export interface Coordinates {
    lat: number,
    long: number
}

// prepare stations array: fill with stations from JSON file
let stations: Station[] = [];

for (let key in stationsJSON) {
    if (stationsJSON.hasOwnProperty(key)) {
        stations.push({
            station: stationsJSON[key].station,
            latitude: parseFloat(stationsJSON[key].latitude),
            longitude: parseFloat(stationsJSON[key].longitude)
        });
    }
}

// returns closest weather station (station ID, latitude, and longitude) to a given point (latitude and longitude)
export function getClosestStation(origin: Coordinates): Station | null {
    let smallestDistance: number = Infinity;
    let closestStation: Station | null = null;
    
    for (let station of stations) {
        const distance: number = getDistanceFromLatLongInKm(origin, {lat: station.latitude, long: station.longitude});
        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestStation = station;
        }
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
