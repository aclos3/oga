import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import HomePage from './HomePage';
import ResultsPage from './ResultsPage';
import InfoPage1 from './InfoPage1';
import InfoPage2 from './InfoPage2';

const DashboardPage: React.FC<RouteComponentProps> = ({match}) => {
    return (
    <IonRouterOutlet>
      <Route exact path={match.url} component={HomePage} />
      <Route exact path={`${match.url}/results/:id`} component={ResultsPage} />
      <Route exact path={`${match.url}/info1`} component={InfoPage1} />
      <Route exact path={`${match.url}/info2`} component={InfoPage2} />
    </IonRouterOutlet>
  );
};
export default DashboardPage
