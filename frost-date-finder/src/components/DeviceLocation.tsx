import { useState } from 'react'
import { getElevation } from '../utils/getUserElevation'

const METERS_TO_FEET = 3.28084

interface Props {
  onSubmit: (lat: number, long: number, elev: number) => void
}

export default function DeviceLocation({ onSubmit }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setLoading(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const long = position.coords.longitude
        let elev: number | null = null

        if (position.coords.altitude != null) {
          elev = position.coords.altitude * METERS_TO_FEET
        } else {
          elev = await getElevation(lat, long)
        }

        setLoading(false)
        onSubmit(lat, long, elev ?? 0)
      },
      (err) => {
        setLoading(false)
        if (err.code === err.TIMEOUT) {
          setError('Timed out. Make sure your device location service is enabled.')
        } else if (err.code === err.PERMISSION_DENIED) {
          setError('You must allow access to use your device location.')
        } else {
          setError(err.message || 'Could not get location.')
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  return (
    <div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-box">Getting Location…</div>
        </div>
      )}
      {error && <div className="toast">{error}</div>}
      <button className="btn" onClick={getLocation}>
        Use My Location
      </button>
    </div>
  )
}
