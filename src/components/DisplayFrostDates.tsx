import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { FrostDatesBySeverity } from '../pages/ResultsPage';
import './DisplayFrostDates.css';

//these codes are defined in NOAA's "NORMAL_ANN_documentation.pdf"
const checkApiReturn = (dayNum: any) => {
  if(dayNum === '-4444') {  //-4444 is the code for year round frost risk
    return 'Year-Round Frost Risk';
  }
  else if (dayNum === '-6666') { //-6666 is the code for undefined parameter/insufficent data
    return 'Too Infrequent to Estimate';
  }
  else if ( dayNum === '-7777') { //-7777 is the code for non-zero value that rounds to zero
    return 'Nearly Zero, Rounded Down.';
  }
  else { return dayNum.toString(); }
};
const DisplayFrostDates: React.FC<FrostDatesBySeverity> = ({title, springFrost, fallFrost, frostFree}) => { 
  return (
    <div>
      <IonCard className="frost-card">
        <IonCardHeader className="frost-card-header">
          <IonCardTitle className="frost-card-title">{title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent className="frost-card-content">
          <div className="frost-card-col">
            <div className="frost-card-col-header card-item">Last Freeze</div>
            <div className="frost-card-col-header card-item">First Freeze</div>
            <div className="frost-card-col-header card-item">Growing Season</div>
          </div>
          <div className="frost-card-col">
            <div className="card-item">{checkApiReturn(springFrost)}</div>
            <div className="card-item">{checkApiReturn(fallFrost)}</div>
            <div className="card-item">{checkApiReturn(frostFree)} days</div>
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );
};
export default DisplayFrostDates;
