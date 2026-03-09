// USGS Elevation Point Query Service
// https://epqs.nationalmap.gov/v1/json
export async function getElevation(
  lat: number,
  long: number
): Promise<number | null> {
  const params = new URLSearchParams({
    x: long.toString(),
    y: lat.toString(),
    units: 'Feet',
    output: 'json',
  })
  const url = `https://epqs.nationalmap.gov/v1/json?${params}`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    const elev = data?.value
    return elev != null ? Number(elev) : null
  } catch (err) {
    console.error('Elevation API error:', err)
    return null
  }
}
