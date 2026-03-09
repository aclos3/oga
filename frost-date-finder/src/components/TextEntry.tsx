import { useState, FormEvent } from 'react'
import {
  getCityStateCoordinates,
  getZipCoordinates,
  LocationData,
} from '../utils/getCoordinates'

interface Props {
  onSubmit: (lat: number, long: number, elev: number) => void
}

const CITY_STATE_RE = /^[a-zA-Z',.\s-]+,\s?[A-Za-z]{2}$/

export default function TextEntry({ onSubmit }: Props) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const entry = text.trim()
    if (!entry) {
      setError('Input appears to be blank.')
      return
    }

    // Check if it's a 5-digit zip code
    if (/^\d{5}$/.test(entry)) {
      setLoading(true)
      const data: LocationData = await getZipCoordinates(entry)
      setLoading(false)
      if (data.hasError || !data.latitude || !data.longitude) {
        setError('No results found for your entry. Please check your five digit zip code.')
        return
      }
      onSubmit(data.latitude, data.longitude, data.elevation ?? 0)
      return
    }

    // Check if it's a city, state pair
    if (CITY_STATE_RE.test(entry)) {
      const commaIdx = entry.indexOf(',')
      const cityName = entry.substring(0, commaIdx).trim()
      const stateCode = entry.substring(commaIdx + 1).trim()

      setLoading(true)
      const data: LocationData = await getCityStateCoordinates(
        cityName.toUpperCase(),
        stateCode.toUpperCase()
      )
      setLoading(false)
      if (data.hasError || !data.latitude || !data.longitude) {
        setError('No results found for your entry. Please check your city/state pair.')
        return
      }
      onSubmit(data.latitude, data.longitude, data.elevation ?? 0)
      return
    }

    setError(
      'Entry is invalid. Enter a five digit zip code or a city name followed by a comma and the two letter state abbreviation.'
    )
  }

  return (
    <div className="text-entry">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-box">Getting Data…</div>
        </div>
      )}
      {error && <div className="toast">{error}</div>}
      <form className="location-form" onSubmit={handleSubmit}>
        <input
          className="location-input"
          type="text"
          placeholder="Example: Corvallis, OR"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}
