import {getCityStateCoordinates, LocationData} from '../utils/getCoordinates';
import {Coordinates} from './getClosestStation';

describe('getCityStateCoordinates', () => {
  const bend: Coordinates = {lat: 44.05817280000002, long: -121.31530959999996};
  const eugene: Coordinates = {lat: 44.05206910000004, long: -123.08675359999994};

  test('Bends coordinates are correct', async () => {
    const data: LocationData = await getCityStateCoordinates('BEND', 'OR');
    expect(data.hasError).toBe(false);
    expect(data.errorMessage).toBe('');
    expect(data.latitude).toEqual(bend.lat);
    expect(data.longitude).toEqual(bend.long);
  });

  test('Eugeness coordinates are correct', async () => {
    const data: LocationData = await getCityStateCoordinates('EUGENE', 'OR');
    expect(data.hasError).toBe(false);
    expect(data.errorMessage).toBe('');
    expect(data.latitude).toEqual(eugene.lat);
    expect(data.longitude).toEqual(eugene.long);
  });

  test('Error message for city that doesnt exist', async () => {
    const data: LocationData = await getCityStateCoordinates('FJKLDS', 'OR');
    expect(data.hasError).toBe(true);
    expect(data.errorMessage).toBe('Error in API response');
    expect(data.latitude).toBe(null);
    expect(data.longitude).toBe(null);
  });

  test('Error message for state that doesnt exist', async () => {
    const data: LocationData = await getCityStateCoordinates('SALEM', 'MK');
    expect(data.hasError).toBe(true);
    expect(data.errorMessage).toBe('Error in API response');
    expect(data.latitude).toBe(null);
    expect(data.longitude).toBe(null);
  });
});
