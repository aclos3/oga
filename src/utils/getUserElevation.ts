export interface elevationData{
    elevation: number | null,
    resolution: number | null
}
// gets elevation for a lat,long variable
// if API hasan error, it will return just the error message
export async function getElevation(latLong: string): Promise<elevationData> {
    const apiEndpoint = 'https://api.jawg.io/elevations?locations='
    const token = '&access-token=Vna6bzn5juKUCodACBvtFuEk4PlGU6Wmh6vrzJAWyTN6rL8Zca5Tzu60TpuET9pf'
    const data = await fetch((apiEndpoint + latLong + token), {
        method: 'GET'
    });
    const api_return = await data.json();
    let results: elevationData = {
        elevation: null,
        resolution: null
    }
    try{
        if (api_return[0] && api_return[0] !== undefined){
            results = {
                elevation: Math.round(api_return[0].elevation),
                resolution: api_return[0].resolution
            }
        }
    }
    catch{ console.log("Error: ", api_return); }
    return results;
}
