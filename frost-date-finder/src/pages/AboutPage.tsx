import { useNavigate } from 'react-router-dom'

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <>
      <header className="toolbar">
        <button className="toolbar-btn" onClick={() => navigate(-1)} title="Back">
          &#8592;
        </button>
        <span className="toolbar-title">Frost Date Finder</span>
        <div style={{ width: 44 }} />
      </header>

      <main className="page-container">
        <h1 className="page-header">About</h1>

        <div className="card">
          <div className="card-header info-card-header">
            <h2 className="card-title info-card-title">Frost Data</h2>
          </div>
          <div className="card-content">
            <p>
              The climate data presented on this application comes directly from
              the National Oceanic and Atmospheric Administration (NOAA).
              Specifically, NOAA&rsquo;s{' '}
              <a
                href="https://www.ncdc.noaa.gov/data-access/land-based-station-data/land-based-datasets/climate-normals/1981-2010-normals-data"
                target="_blank"
                rel="noopener noreferrer"
              >
                1981-2010 U.S. Climate Normals
              </a>{' '}
              using their 30th percentile probability data for the three given
              temperature thresholds (32, 28 and 24 degrees).
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header info-card-header">
            <h2 className="card-title info-card-title">Location Data</h2>
          </div>
          <div className="card-content">
            <p>
              This application uses location information from several sources.
              The user location is either obtained directly from the device GPS
              or browser, or it is obtained from API calls based on the zip code
              or the city and state entered by the user. Once the user&rsquo;s
              location is obtained, the app employs the Haversine formula to
              determine the nearest NOAA weather stations.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header info-card-header">
            <h2 className="card-title info-card-title">Development Team</h2>
          </div>
          <div className="card-content">
            <p>
              The Frost Date Finder App was a collaboration between Oregon State
              University Extension Service and the Oregon State University
              College of Engineering. This application was created by a team of
              three computer science undergraduates as part of their senior
              capstone project: Andrew Clos, Kirsten Corrao, and John Lebens.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
