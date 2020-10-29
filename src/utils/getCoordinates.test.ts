import {getCityStateCoordinates, LocationData} from '../utils/getCoordinates';
import {Coordinates} from './getClosestStation';

describe('getCityStateCoordinates', () => {
    const bend: Coordinates = {lat: 44.05817280000002, long: -121.31530959999996};
    const eugene: Coordinates = {lat: 44.05206910000004, long: -123.08675359999994};

    test("Bend's coordinates are correct", async () => {
        const data: LocationData = await getCityStateCoordinates("bend+'or");
        expect(data.hasError).toBe(false);
        expect(data.errorMessage).toBe('');
        expect(data.latitude).toEqual(bend.lat);
        expect(data.longitude).toEqual(bend.long);
    });

    test("Eugenes's coordinates are correct", async () => {
        const data: LocationData = await getCityStateCoordinates("eugene+'or");
        expect(data.hasError).toBe(false);
        expect(data.errorMessage).toBe('');
        expect(data.latitude).toEqual(eugene.lat);
        expect(data.longitude).toEqual(eugene.long);
    });

    test("Error message for city that doesn't exist", async () => {
        const data: LocationData = await getCityStateCoordinates("fjklds+'or");
        expect(data.hasError).toBe(true);
        expect(data.errorMessage).toBe('Error in API response');
        expect(data.latitude).toBe(null);
        expect(data.longitude).toBe(null);
    });

    test("Error message for state that doesn't exist", async () => {
        const data: LocationData = await getCityStateCoordinates("salem+'mk");
        expect(data.hasError).toBe(true);
        expect(data.errorMessage).toBe('Error in API response');
        expect(data.latitude).toBe(null);
        expect(data.longitude).toBe(null);
    });
});
