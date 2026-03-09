interface Props {
  title: string
  springFrost: string
  fallFrost: string
  frostFree: string
}

// NOAA special codes
function formatValue(dayNum: string): string {
  if (dayNum === '-4444') return 'Year-Round Frost Risk'
  if (dayNum === '-6666') return 'Too Infrequent to Estimate'
  if (dayNum === '-7777') return 'Nearly Zero, Rounded Down'
  return dayNum
}

export default function DisplayFrostDates({ title, springFrost, fallFrost, frostFree }: Props) {
  return (
    <div className="frost-card">
      <div className="frost-card-header">
        <h3 className="frost-card-title">{title}</h3>
      </div>
      <div className="frost-card-content">
        <div className="frost-card-col">
          <div className="frost-card-col-header card-item">Last Freeze</div>
          <div className="frost-card-col-header card-item">First Freeze</div>
          <div className="frost-card-col-header card-item">Growing Season</div>
        </div>
        <div className="frost-card-col">
          <div className="card-item">{formatValue(springFrost)}</div>
          <div className="card-item">{formatValue(fallFrost)}</div>
          <div className="card-item">{formatValue(frostFree)} days</div>
        </div>
      </div>
    </div>
  )
}
