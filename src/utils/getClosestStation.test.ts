import { Coordinates, getClosestPoint, getClosestStation, getDistanceFromLatLongInKm, Station } from './getClosestStation'

const eugene: Coordinates = {lat: 44.032883, long: -123.090570};               // closest: Springfield
const medford: Coordinates = {lat: 42.282803, long: -122.771226};              // closest: Grants Pass
const steensMountain: Coordinates = {lat: 42.6202388, long: -118.6244009};     // closest: Malheur Lake
const burns: Coordinates = {lat: 43.5835747, long: -119.0585662};              // closest: Malheur Lake
const malheurLake: Coordinates = {lat: 43.3302915, long: -118.8115772};        // closest: Burns
const joseph: Coordinates = {lat: 45.3506504, long: -117.2287770};             // closest: La Grande
const laGrande: Coordinates = {lat: 45.3276834, long: -118.0967850};           // closest: Joseph       
const tillamook: Coordinates = {lat: 45.4564555, long: -123.8370981};          // closest: Oceanside
const oceanside: Coordinates = {lat: 45.4577467, long: -123.9673364};          // closest: Tillamook
const springfield: Coordinates = {lat: 44.0523465, long: -122.9966305};        // closest: Eugene
const grantsPass: Coordinates = {lat: 42.4382946, long: -123.3212346};         // closest: Medford

const locations: Coordinates[] = [eugene, medford, steensMountain, burns, malheurLake, joseph, laGrande, tillamook, oceanside, springfield, grantsPass];

describe('getClosestStation', () => {
    test("Distance to closest weather station <= 20 KM", () => {
        for (let location of locations) {
            const closestStation: Station | null = getClosestStation(location);
            expect(closestStation).not.toBeNull();

            if (closestStation !== null) {
                const distance = getDistanceFromLatLongInKm(location, {lat: closestStation.latitude, long: closestStation.longitude});
                //console.log(location, distance, closestStation.station);
                expect(distance).toBeLessThanOrEqual(20);
            }
        }
    });

    test("Returns null if input location is invalid", () => {
        const origin: Coordinates = {lat: -9999, long: -9999};
        const closestStation: Station | null = getClosestStation(origin);
        expect(closestStation).not.toBeNull();
    });
});

describe('getClosestPoint', () => {
    const locations: Coordinates[] = [
        eugene, medford, steensMountain, burns, malheurLake, joseph, laGrande, tillamook, oceanside, springfield, grantsPass
    ]

    test("returns Springfield as Eugene's closest point", () => {
        const locationsFilter = locations.filter( location => location !== eugene);
        const closest = getClosestPoint(eugene, locationsFilter);
        expect(closest).toBe(springfield);
    });

    test("returns Grants Pass as Medford's closest point", () => {
        const locationsFilter = locations.filter( location => location !== medford);
        const closest = getClosestPoint(medford, locationsFilter);
        expect(closest).toBe(grantsPass);
    });

    test("returns Malheur Lake as Steens's Mountain's closest point", () => {
        const locationsFilter = locations.filter( location => location !== steensMountain);
        const closest = getClosestPoint(steensMountain, locationsFilter);
        expect(closest).toBe(malheurLake);
    });

    test("returns Malheur Lake as Burns' closest point", () => {
        const locationsFilter = locations.filter( location => location !== burns);
        const closest = getClosestPoint(burns, locationsFilter);
        expect(closest).toBe(malheurLake);
    });

    test("returns La Grande as Joseph's closest point", () => {
        const locationsFilter = locations.filter( location => location !== joseph);
        const closest = getClosestPoint(joseph, locationsFilter);
        expect(closest).toBe(laGrande);
    });

    test("returns Joseph as La Grande's closest point", () => {
        const locationsFilter = locations.filter( location => location !== laGrande);
        const closest = getClosestPoint(laGrande, locationsFilter);
        expect(closest).toBe(joseph);
    });

    test("returns Oceanside as Tillamook's closest point", () => {
        const locationsFilter = locations.filter( location => location !== tillamook);
        const closest = getClosestPoint(tillamook, locationsFilter);
        expect(closest).toBe(oceanside);
    });

    test("returns Tillamook as Oceanside's closest point", () => {
        const locationsFilter = locations.filter( location => location !== oceanside);
        const closest = getClosestPoint(oceanside, locationsFilter);
        expect(closest).toBe(tillamook);
    });

    test("returns Eugene as Springfield's closest point", () => {
        const locationsFilter = locations.filter( location => location !== springfield);
        const closest = getClosestPoint(springfield, locationsFilter);
        expect(closest).toBe(eugene);
    });

    test("returns Medford as Grants Pass' closest point", () => {
        const locationsFilter = locations.filter( location => location !== grantsPass);
        const closest = getClosestPoint(grantsPass, locationsFilter);
        expect(closest).toBe(medford);
    });
});
