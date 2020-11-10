import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { FrostDatesBySeverity } from '../pages/ResultsPage';
import './DisplayFrostDates.css';

const checkApiReturn = (dayNum: any) => {
    if(dayNum === "-4444") {  //-4444 is the code for year round frost risk
        return "Year-Round Frost Risk"
    }
    else if (dayNum === "-6666") { //-6666 is the code for undefined parameter/insufficent data
        return "Insufficient Data"
    }
    else if ( dayNum === "-7777") { //-7777 is the code for non-zero value that rounds to zero
        return "0 (rounded)"
    }
    else {
        let retStr = dayNum.toString()
        return retStr
    }
}

const DisplayFrostDates: React.FC<FrostDatesBySeverity> = ({title, springFrost, fallFrost, frostFree}) => { 
    return (
        <div>
            <IonCard className="frost-card">
                <IonCardHeader className="frost-card-header">
                    <IonCardTitle>{title}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="frost-card-content">
                <div className="frost-card-row">
                    <div className="frost-card-col frost-card-col-header">Last Freeze</div>
                    <div className="frost-card-col">{checkApiReturn(springFrost)}</div>
                </div>
                <div className="frost-card-row">
                    <div className="frost-card-col frost-card-col-header">First Freeze</div>
                    <div className="frost-card-col">{checkApiReturn(fallFrost)}</div>
                </div>
                <div className="frost-card-row">
                    <div className="frost-card-col frost-card-col-header">Growing Season</div>
                    <div className="frost-card-col">{frostFree} days</div>
                </div>
                </IonCardContent>
          </IonCard>
        </div>
    );
};
export default DisplayFrostDates;
