export interface elevationData2{
    elevation: number | null,
    resolution: number | null
}

interface elevationData {
    elevation: number | null
}
// gets elevation for a lat,long variable
// if API has an error, it will return just the error message
export async function getElevation(lat: number, long: number): Promise<elevationData> {
    //build the string for the get request to usgs
    const apiEndpoint = `https://ned.usgs.gov/epqs/pqs.php?`
    const data = await fetch((apiEndpoint + `x=` + long.toString() + `&y=` + lat.toString() + `&units=Feet&output=json`), {
        method: 'GET'
    });
    const api_return = await data.json();
    let results: elevationData = {
        elevation: null
    }
    try{ //get the elevation out of the return from the API call
        if (api_return && api_return !== undefined){
            results = { elevation: api_return.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation }
        }
    }
    catch{ console.log(`Error: `, api_return); }
    return results;
}
