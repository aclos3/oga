import stationsJSON from '../data/station_details.json'
import frostJSON from '../data/frost_data.json'

export interface Station {
  station: string
  latitude: number
  longitude: number
  elevation: number
  state: string
  city: string
  distance: number
}

interface FrostData {
  station: string
  fallSevere: string
  fallModerate: string
  fallLight: string
  springSevere: string
  springModerate: string
  springLight: string
  frostFreeSevere: string
  frostFreeModerate: string
  frostFreeLight: string
  quality: string
}

export interface Coordinates {
  lat: number
  long: number
}

const METERS_TO_FEET = 3.28084
const KM_TO_MILES = 0.621371

const stations: Station[] = getWeatherStations()
const frostData: FrostData[] = getFrostData()

export function getClosestStationAndFrostData(
  origin: Coordinates
): [Station | null, FrostData | null] {
  const sorted = getClosestStationList(origin)
  let closestStation: Station | null = null
  let stationFrostData: FrostData | null = null

  if (sorted) {
    for (let i = 0; i < sorted.length; i++) {
      const frostIdx = frostData.findIndex(
        (o) => o.station === sorted[i].station
      )
      if (frostIdx >= 0) {
        closestStation = {
          station: sorted[i].station,
          latitude: sorted[i].latitude,
          longitude: sorted[i].longitude,
          elevation: sorted[i].elevation * METERS_TO_FEET,
          state: sorted[i].state,
          city: sorted[i].city,
          distance: sorted[i].distance * KM_TO_MILES,
        }
        stationFrostData = frostData[frostIdx]
        break
      }
    }
  }

  return [closestStation, stationFrostData]
}

function getWeatherStations(): Station[] {
  return (stationsJSON as Array<{ id: string; latitude: number; longitude: number; elevation: number; state: string; city: string }>).map((data) => ({
    station: data.id,
    latitude: data.latitude,
    longitude: data.longitude,
    elevation: data.elevation,
    state: data.state,
    city: data.city,
    distance: Infinity,
  }))
}

function getFrostData(): FrostData[] {
  if (Array.isArray(frostJSON)) {
    return (frostJSON as Record<string, string>[]).map((data) => ({
      station: data.station,
      fallSevere: data['ann-tmin-prbfst-t24Fp30'],
      fallModerate: data['ann-tmin-prbfst-t28Fp30'],
      fallLight: data['ann-tmin-prbfst-t32Fp30'],
      springSevere: data['ann-tmin-prblst-t24Fp30'],
      springModerate: data['ann-tmin-prblst-t28Fp30'],
      springLight: data['ann-tmin-prblst-t32Fp30'],
      frostFreeSevere: data['ann-tmin-prbgsl-t24Fp30'],
      frostFreeModerate: data['ann-tmin-prbgsl-t28Fp30'],
      frostFreeLight: data['ann-tmin-prbgsl-t32Fp30'],
      quality: data['quality'],
    }))
  }
  return []
}

function getClosestStationList(origin: Coordinates): Station[] {
  for (const station of stations) {
    station.distance = getDistanceFromLatLongInKm(origin, {
      lat: station.latitude,
      long: station.longitude,
    })
  }
  stations.sort((a, b) => a.distance - b.distance)
  return stations
}

const toRad = (deg: number) => deg * (Math.PI / 180)

export function getDistanceFromLatLongInKm(
  a: Coordinates,
  b: Coordinates
): number {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.long - a.long)
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) *
      Math.cos(toRad(b.lat)) *
      Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}
