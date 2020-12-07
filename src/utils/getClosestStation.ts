import stationsJSON from '../data/station_details.json';
import frostJSON from '../data/frost_data.json';

export interface Station {
  station: string;
  latitude: number;
  longitude: number;
  elevation: number;
  state: string;
  city: string;
  distance: number;
}

interface FrostData {
  station: string;
  fallSevere: string;
  fallModerate: string;
  fallLight: string;
  springSevere: string;
  springModerate: string;
  springLight: string;
  frostFreeSevere: string;
  frostFreeModerate: string;
  frostFreeLight: string;
  quality: string;
}

interface Coordinates {
  lat: number;
  long: number;
}

const METERS_TO_FEET = 3.28084;
const KM_TO_MILES = 0.621371;

//create arrays for stations and frost datae data
const stations: Station[] = getWeatherStations();
const frostData: FrostData[] = getFrostData();

// get closest station and its frost data
export function getClosestStationAndFrostData(origin: Coordinates): [Station | null, FrostData | null] {
  const stationsSortedByDistance: Station[] | null = getClosestStationList(origin);
  let closestStation: Station | null = null;
  let stationFrostData: FrostData | null = null;
  let frostIdx = -1;

  if (stationsSortedByDistance) {
    //loop until a station with data is found, not all climate normals weather stations contain the frost data we're looking for
    for (let i = 0; i < stationsSortedByDistance.length; i++) {
      //compare the two lists to see if the station ID exists in both
      frostIdx = frostData.findIndex(o => o.station === stationsSortedByDistance[i].station);
      if (frostIdx >= 0) {  //matching station was found, stop i, populate station information
        closestStation = {
          station: stationsSortedByDistance[i].station,
          latitude: stationsSortedByDistance[i].latitude,
          longitude: stationsSortedByDistance[i].longitude,
          elevation: stationsSortedByDistance[i].elevation * METERS_TO_FEET,
          state: stationsSortedByDistance[i].state,
          city: stationsSortedByDistance[i].city, 
          distance: stationsSortedByDistance[i].distance * KM_TO_MILES
        };

        stationFrostData = frostData[frostIdx];
        break;
      }
    }
  }

  return [closestStation, stationFrostData];
}

//get all weather stations from JSON file
function getWeatherStations(): Station[] {
  const stations: Station[] = stationsJSON.map( (data) => {
    return {
      station: data.id,
      latitude: data.latitude,
      longitude: data.longitude,
      elevation: data.elevation,
      state: data.state,
      city: data.city,
      distance: Infinity
    };
  });
  return stations;
}

//get all station frost data from JSON file
function getFrostData(): FrostData[] {
  if (frostJSON instanceof Array) {
    const frostData: FrostData[] = frostJSON.map( (data) => {
      return {
        station: data.station,
        fallSevere: data['ann-tmin-prbfst-t24Fp30'],
        fallModerate: data['ann-tmin-prbfst-t28Fp30'],
        fallLight: data['ann-tmin-prbfst-t32Fp30'],
        springSevere: data['ann-tmin-prblst-t24Fp30'],
        springModerate: data['ann-tmin-prblst-t28Fp30'],
        springLight: data['ann-tmin-prblst-t32Fp30'],
        frostFreeSevere: data['ann-tmin-prbgsl-t24Fp30'],
        frostFreeModerate: data['ann-tmin-prbgsl-t28Fp30'],
        frostFreeLight: data['ann-tmin-prbgsl-t32Fp30'],
        quality: data['quality']
      };
    });
    return frostData;
  }
  return [];
}

// returns a list sorted by distance from the origin
function getClosestStationList(origin: Coordinates): Station[] | null {
  //get station distances
  for (const station of stations) {
    station.distance = getDistanceFromLatLongInKm(origin, {lat: station.latitude, long: station.longitude});
  }
  //sort stations by distance from user
  stations.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
  return stations;
}

const convertDegreesToRadians = (degree: number) => {
  return degree * (Math.PI / 180);
}; 

// haversine formula: https://en.wikipedia.org/wiki/Haversine_formula
// variable names a and c come from formula
// source of code: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula/21623206#21623206
export const getDistanceFromLatLongInKm = (pointA: Coordinates, pointB: Coordinates) => {
  const earthRadiusInKM = 6371;
  const latitudeDifferenceInRadians: number = convertDegreesToRadians(pointB.lat - pointA.lat);
  const longitudeDifferenceInRadians: number = convertDegreesToRadians(pointB.long - pointA.long); 
  const a: number = 
      Math.sin(latitudeDifferenceInRadians / 2) * Math.sin(latitudeDifferenceInRadians / 2) +
      Math.cos(convertDegreesToRadians(pointA.lat)) * Math.cos(convertDegreesToRadians(pointB.lat)) * 
      Math.sin(longitudeDifferenceInRadians / 2) * Math.sin(longitudeDifferenceInRadians / 2); 
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const distance: number = earthRadiusInKM * c;
  return distance;
};
