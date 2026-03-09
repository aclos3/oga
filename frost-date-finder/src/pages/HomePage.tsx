import { useNavigate } from 'react-router-dom'
import DeviceLocation from '../components/DeviceLocation'
import TextEntry from '../components/TextEntry'

export default function HomePage() {
  const navigate = useNavigate()

  const onLocationFound = (lat: number, long: number, elev: number) => {
    navigate(`/results/${lat},${long},${elev}`)
  }

  return (
    <>
      <header className="toolbar">
        <div style={{ width: 44 }}>
          <img className="toolbar-logo" src="/assets/icon/icon.png" alt="Logo" />
        </div>
        <span className="toolbar-title">Frost Date Finder</span>
        <button className="toolbar-btn" onClick={() => navigate('/about')} title="About">
          &#9432;
        </button>
      </header>

      <main className="page-container">
        <h1 className="page-header">Enter your location</h1>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Use your device's location</h2>
          </div>
          <div className="card-content">
            <DeviceLocation onSubmit={onLocationFound} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Enter your zip code or city, state</h2>
          </div>
          <div className="card-content">
            <TextEntry onSubmit={onLocationFound} />
          </div>
        </div>
      </main>
    </>
  )
}
