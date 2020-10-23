import { Position, getClosestPoint } from './calculateClosestPoint'

// Eugene
const origin: Position = {
    lat: 44.032883,
    long: -123.090570
};

const closest: Position = {lat: 44.159490, long: -123.572924};      // Coast Mountains W of Eugene
const second: Position = {lat: 42.282803, long: -122.771226};       // Medford
const third: Position = {lat: 45.534046, long: -118.849208};        // S of Pendleton

test('finds closest location: index 0', () => {
    const locations: Position[] = [closest, second, third];
    const result = getClosestPoint(origin, locations);
    expect(result).toBe(closest);
});

test('finds closest location: index 1', () => {
    const locations: Position[] = [second, closest, third];
    const result = getClosestPoint(origin, locations);
    expect(result).toBe(closest);
});

test('finds closest location: index 2', () => {
    const locations: Position[] = [second, third, closest];
    const result = getClosestPoint(origin, locations);
    expect(result).toBe(closest);
});
