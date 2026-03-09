import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Station,
  getClosestStationAndFrostData,
} from '../utils/getClosestStation'
import DisplayFrostDates from '../components/DisplayFrostDates'

const EXPAND_WORDS: Record<string, string> = {
  AP: 'Airport',
  FLD: 'Field',
  STN: 'Station',
  CTR: 'Center',
  RGNL: 'Regional',
  UNIV: 'University',
}
const IGNORE_WORDS = [
  'HCN','N','E','S','W','NE','NW','SE','SW',
  'NNE','NNW','SSE','SSW','ENE','WNW','ESE','WSW',
]

interface FrostDates {
  light: string
  moderate: string
  severe: string
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [station, setStation] = useState<Station | null>(null)
  const [springFrost, setSpringFrost] = useState<FrostDates>({ light: '', moderate: '', severe: '' })
  const [fallFrost, setFallFrost] = useState<FrostDates>({ light: '', moderate: '', severe: '' })
  const [frostFree, setFrostFree] = useState<FrostDates>({ light: '', moderate: '', severe: '' })
  const [userElevation, setUserElevation] = useState(0)
  const [showPopover, setShowPopover] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    const [latStr, longStr, elevStr] = id.split(',')
    const lat = parseFloat(latStr)
    const long = parseFloat(longStr)
    const elev = parseFloat(elevStr) || 0

    setUserElevation(elev)

    if (isNaN(lat) || isNaN(long)) {
      setError('Invalid coordinates')
      return
    }

    const [closest, frost] = getClosestStationAndFrostData({ lat, long })

    if (closest && frost) {
      setStation(closest)
      setFallFrost({ severe: frost.fallSevere, moderate: frost.fallModerate, light: frost.fallLight })
      setSpringFrost({ severe: frost.springSevere, moderate: frost.springModerate, light: frost.springLight })
      setFrostFree({ severe: frost.frostFreeSevere, moderate: frost.frostFreeModerate, light: frost.frostFreeLight })
    } else {
      setError('No station was found. Try another location.')
    }
  }, [id])

  const isLatPositive = () => (station && station.latitude >= 0 ? 'N' : 'S')
  const isLongPositive = () => (station && station.longitude >= 0 ? 'E' : 'W')

  const capitalizeStationName = () => {
    if (!station) return ''
    return station.city
      .split(' ')
      .map((word) => {
        if (!word || word === ' ') return ''
        if (EXPAND_WORDS[word]) return EXPAND_WORDS[word]
        if (IGNORE_WORDS.includes(word)) return ''
        if (word.length >= 2 && word[0] === 'M' && word[1] === 'C') {
          return word[0] + word[1].toLowerCase() + word[2] + word.substring(3).toLowerCase()
        }
        return word[0] + word.substring(1).toLowerCase()
      })
      .filter(Boolean)
      .join(' ')
      .trim()
  }

  return (
    <>
      <header className="toolbar">
        <button className="toolbar-btn" onClick={() => navigate('/')} title="Back">
          &#8592;
        </button>
        <span className="toolbar-title">Frost Date Finder</span>
        <button className="toolbar-btn" onClick={() => navigate('/about')} title="About">
          &#9432;
        </button>
      </header>

      <main className="page-container">
        {error && <div className="toast">{error}</div>}

        <h1 className="page-header">Your Frost Dates</h1>

        {station && (
          <>
            <div className="station-container">
              <p>Station: {capitalizeStationName()}, {station.state}</p>
              <button className="btn btn-outline" onClick={() => setShowPopover(true)}>
                More Information
              </button>
            </div>

            <DisplayFrostDates
              title="Light Freeze (32° F)"
              springFrost={springFrost.light}
              fallFrost={fallFrost.light}
              frostFree={frostFree.light}
            />
            <DisplayFrostDates
              title="Moderate Freeze (28° F)"
              springFrost={springFrost.moderate}
              fallFrost={fallFrost.moderate}
              frostFree={frostFree.moderate}
            />
            <DisplayFrostDates
              title="Severe Freeze (24° F)"
              springFrost={springFrost.severe}
              fallFrost={fallFrost.severe}
              frostFree={frostFree.severe}
            />
          </>
        )}

        {showPopover && station && (
          <div className="popover-overlay" onClick={() => setShowPopover(false)}>
            <div className="popover" onClick={(e) => e.stopPropagation()}>
              <h5>Station Information</h5>
              <p>ID: {station.station}</p>
              <p>Station Lat: {Math.abs(parseFloat(station.latitude.toPrecision(4)))}°{isLatPositive()}</p>
              <p>Station Long: {Math.abs(parseFloat(station.longitude.toPrecision(5)))}°{isLongPositive()}</p>
              <p>Station Elevation: {station.elevation.toFixed(0)} feet</p>
              <p>Local Elevation: {userElevation.toFixed(0)} feet</p>
              <p>Distance: {Math.round(station.distance)} miles</p>
              <button className="btn" onClick={() => setShowPopover(false)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
