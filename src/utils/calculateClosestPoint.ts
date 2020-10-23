export interface Position {
    lat: number,
    long: number
}

// uses Haversine formula, which gives the great-circle distance between two latitude-longitude pairs
// will have some error from assuming that earth is a perfect sphere
export const getClosestPoint = (origin: Position, locations: Position[]): Position => {
    let smallestDistance: number = Infinity;
    let closestPosition: Position = {
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
const getDistanceFromLatLongInKm = (pointA: Position, pointB: Position) => {
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
