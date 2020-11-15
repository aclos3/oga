/*
interface elevation_api [{
    "elevation": number,
    "location": {
        "lat": number,
        "lng": number
    },
    "resolution": number
}]
*/

export interface elevation_data{
    elevation: number | null,
    resolution: number | null
}

// gets elevation for a lat,long variable
// if API hasan error, it will return just the error message
export async function get_elevation(lat_long: string): Promise<elevation_data> {
    const api_endpoint = 'https://api.jawg.io/elevations?locations='
    const token = '&access-token=Vna6bzn5juKUCodACBvtFuEk4PlGU6Wmh6vrzJAWyTN6rL8Zca5Tzu60TpuET9pf'
    const data = await fetch((api_endpoint + lat_long + token), {
        method: 'GET'
    });
    const api_return = await data.json();
    let results: elevation_data = {
        elevation: null,
        resolution: null
    }
    try{
        if (api_return[0].elevation > 0){
            results = {
                elevation: api_return[0].elevation,
                resolution: api_return[0].resolution
            }
        }
    }
    catch{
        console.log("Error: ", api_return);
    }
    return results;
}