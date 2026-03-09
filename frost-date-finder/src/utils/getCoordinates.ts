import { getElevation } from './getUserElevation'

export interface LocationData {
  hasError: boolean
  errorMessage: string
  latitude: number | null
  longitude: number | null
  elevation: number | null
}

const NOMINATIM = 'https://nominatim.openstreetmap.org/search'
const HEADERS = { 'User-Agent': 'FrostDateFinder/1.0' }

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',
  CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',
  HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',
  KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',
  MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',
  MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',
  NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',
  OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',
  SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',
  VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',
  DC:'District of Columbia',
}

// Nominatim geocoding API for city/state lookup
export async function getCityStateCoordinates(
  cityName: string,
  stateCode: string
): Promise<LocationData> {
  const stateName = STATE_NAMES[stateCode.toUpperCase()] ?? stateCode
  const params = new URLSearchParams({
    city: cityName,
    state: stateName,
    country: 'US',
    format: 'json',
    limit: '1',
  })

  let locationData: LocationData = {
    hasError: true,
    errorMessage: 'Error in API response',
    latitude: null,
    longitude: null,
    elevation: null,
  }

  try {
    const response = await fetch(`${NOMINATIM}?${params}`, { headers: HEADERS })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const results = await response.json()

    if (results.length > 0) {
      const lat = parseFloat(results[0].lat)
      const lon = parseFloat(results[0].lon)
      const elev = await getElevation(lat, lon)
      locationData = {
        hasError: false,
        errorMessage: '',
        latitude: lat,
        longitude: lon,
        elevation: elev,
      }
    }
  } catch (err) {
    console.error('City/state lookup error:', err)
  }

  return locationData
}

// Nominatim geocoding API for zip code lookup
export async function getZipCoordinates(
  zipCode: string
): Promise<LocationData> {
  const params = new URLSearchParams({
    postalcode: zipCode,
    country: 'US',
    format: 'json',
    limit: '1',
  })

  let locationData: LocationData = {
    hasError: true,
    errorMessage: 'Error in API response',
    latitude: null,
    longitude: null,
    elevation: null,
  }

  try {
    const response = await fetch(`${NOMINATIM}?${params}`, { headers: HEADERS })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const results = await response.json()

    if (results.length > 0) {
      const lat = parseFloat(results[0].lat)
      const lon = parseFloat(results[0].lon)
      const elev = await getElevation(lat, lon)
      locationData = {
        hasError: false,
        errorMessage: '',
        latitude: lat,
        longitude: lon,
        elevation: elev,
      }
    }
  } catch (err) {
    console.error('Zip lookup error:', err)
  }

  return locationData
}
