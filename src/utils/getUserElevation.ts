interface ElevationData {
    elevation: number | null;
}
// gets elevation for a lat,long variable
// if API has an error, it will return just the error message
export async function getElevation(lat: number, long: number): Promise<ElevationData> {
  //build the string for the get request to usgs
  const apiEndpoint = 'https://ned.usgs.gov/epqs/pqs.php?';
  const data = await fetch((apiEndpoint + 'x=' + long.toString() + '&y=' + lat.toString() + '&units=Feet&output=json'), {
    method: 'GET'
  });
  const apiReturn = await data.json();
  let results: ElevationData = {
    elevation: null
  };
  try{ //get the elevation out of the return from the API call
    if (apiReturn && apiReturn !== undefined){
      results = { elevation: apiReturn.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation };
    }
  }
  catch{ console.log('Error: ', apiReturn); }
  return results;
}
