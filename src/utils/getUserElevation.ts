
interface elevation_api {
    results: [
        {
            elevation: number,
            location: {
                "lat": number,
                "lng": number
            }
        }
    ],
    //status will be "OK" id successful
    status: string
}

// if error from API: set hasError and enter string for errorMessage
// if no error from API: set latitudea and longitude to appropriate values
export interface elevation_api_call {
    elevation: number | null
    status: string
}

// gets latitude and longitude for a city-state pair (for example, Eugene, OR)
// if API returns an error, the LocationData object will have hasError = true
export async function get_elevation(lat_long: string): Promise<elevation_api_call> {
    const api_endpoint = 'https://api.opentopodata.org/v1/ned10m?locations='
    const data = await fetch(api_endpoint + lat_long, {
        method: 'GET',
    });

    const json: elevation_api = await data.json();
    console.log(json);
    // starts with error message--change if API returns valid response
    let user_elevation_data: elevation_api_call = {
        elevation: null,
        status: "null"
    };

    try {
        if(json.results[0].elevation!=null && json.status=="OK") {
            user_elevation_data =  {
                elevation: json.results[0].elevation,
                status: "OK"
            };
        }
    } catch(error){
        console.log(error);
    }

    return user_elevation_data;
}