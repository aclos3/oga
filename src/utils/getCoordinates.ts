import { getElevation} from '../utils/getUserElevation';

interface CityStateApiData {
    records: { 
        fields: { 
            geo_point_2d: number[],
            elev_in_ft: number,
            name: string,
            state: string
        }
    } [];
}
interface ZipCodeApiData {
    records: { 
        fields: { 
            latitude: number,
            longitude: number
        }
    } [];
}
// if error from API: set hasError and enter string for errorMessage
// if no error from API: set latitudea and longitude to appropriate values
export interface LocationData {
    hasError: boolean,
    errorMessage: string,
    latitude: number | null,
    longitude: number | null,
    elevation: number | null
}

// gets latitude and longitude for a city-state pair (for example, Eugene, OR)
// if API returns an error, the LocationData object will have hasError = true
export async function getCityStateCoordinates(cityState: string): Promise<LocationData> {
    const cityApiStr = 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=cities-and-towns-of-the-united-states&q='
    let name = cityState.split(`,`)
    let cityName = name[0].toUpperCase()
    let stateCode = name[name.length - 1].slice(2).toUpperCase()
    console.log(name)
    console.log(`City`, cityName, ` length: `, cityName.length)
    console.log(`State:`, stateCode.slice(2))

    const data = await fetch(cityApiStr + cityState, {
        method: 'GET',
    });

    const json: CityStateApiData = await data.json();
    // starts with error message--change if API returns valid response
    let locationData: LocationData = {
        hasError: true,
        errorMessage: 'Error in API response',
        latitude: null,
        longitude: null,
        elevation: null
    };

    try {
        for(let i = 0; i < json.records.length; i++) {
            if(json.records[i].fields.name.toUpperCase() === cityName && json.records[i].fields.state.toUpperCase() === stateCode) {
                if(json.records[i].fields.geo_point_2d[0] && json.records[i].fields.geo_point_2d[1]) {
                    locationData =  {
                        hasError: false,
                        errorMessage: '',
                        latitude: json.records[i].fields.geo_point_2d[0],
                        longitude: json.records[i].fields.geo_point_2d[1],
                        elevation: json.records[i].fields.elev_in_ft
                    };
                }
            }
        }
    } catch(error){ console.log(error) }
    return locationData;
}
// gets latitude, longitude and elevation for a zip code pair (for example, 97365)
// if API returns an error, the LocationData object will have hasError = true
export async function getZipCoordinates(zipCode: string): Promise<LocationData> {
    const zipApiStr = 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q='
    const data = await fetch(zipApiStr + zipCode, {
        method: 'GET',
    });
    const json: ZipCodeApiData = await data.json();
    // starts with error message--change if API returns valid response
    let locationData: LocationData = {
        hasError: true,
        errorMessage: 'Error in API response',
        latitude: null,
        longitude: null,
        elevation: null
    };
    try {
        if(json.records[0].fields.latitude && json.records[0].fields.longitude) {
            const apiElev = await getElevation(json.records[0].fields.latitude.toString() + `,` + json.records[0].fields.longitude.toString())
            locationData =  {
                hasError: false,
                errorMessage: '',
                latitude: json.records[0].fields.latitude,
                longitude: json.records[0].fields.longitude,
                elevation: apiElev.elevation
            };
        }
    } catch(error){ console.log(error) }
    return locationData;
}
