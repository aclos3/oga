import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import HomePage from './HomePage';
import ResultsPage from './ResultsPage';
import InfoPage from './InfoPage';

const DashboardPage: React.FC<RouteComponentProps> = ({match}) => {
  return (
    <IonRouterOutlet>
      <Route exact path={match.url} component={HomePage} />
      <Route exact path={`${match.url}/results/:id`} component={ResultsPage} />
      <Route exact path={`${match.url}/info`} component={InfoPage} />
    </IonRouterOutlet>
  );
};
export default DashboardPage;
