interface CityStateApiData {
    records: { 
        fields: { 
            geo_point_2d: number[]
            name: string
            state: string
        }
    } [];
}

// if error from API: set hasError and enter string for errorMessage
// if no error from API: set latitudea and longitude to appropriate values
export interface LocationData {
    hasError: boolean,
    errorMessage: string,
    latitude: number | null,
    longitude: number | null
}

// gets latitude and longitude for a city-state pair (for example, Eugene, OR)
// if API returns an error, the LocationData object will have hasError = true
export async function getCityStateCoordinates(cityState: string, cityName: string, stateCode: string): Promise<LocationData> {
    const cityApiStr = 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=cities-and-towns-of-the-united-states&q='
    const data = await fetch(cityApiStr + cityState, {
        method: 'GET',
    });

    const json: CityStateApiData = await data.json();
    console.log(json);
    // starts with error message--change if API returns valid response
    let locationData: LocationData = {
        hasError: true,
        errorMessage: 'Error in API response',
        latitude: null,
        longitude: null
    };

    try {
        console.log(`nhits: `, json.records.length)
        for(let i = 0; i < json.records.length; i++) {
            
            
            if(json.records[i].fields.name.toUpperCase() === cityName && json.records[i].fields.state.toUpperCase() === stateCode) {
                console.log(`city states: `, i)
                if(json.records[i].fields.geo_point_2d[0] && json.records[i].fields.geo_point_2d[1]) {
                    locationData =  {
                        hasError: false,
                        errorMessage: '',
                        latitude: json.records[i].fields.geo_point_2d[0],
                        longitude: json.records[i].fields.geo_point_2d[1]
                    };
                }
            }
        }
    } catch(error){
        console.log(error);
    }

    return locationData;
}
