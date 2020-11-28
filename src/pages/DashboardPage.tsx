import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import HomePage from './HomePage';
import ResultsPage from './ResultsPage';
import AboutPage from './AboutPage';

const DashboardPage: React.FC<RouteComponentProps> = ({match}) => {
  return (
    <IonRouterOutlet>
      <Route exact path={match.url} component={HomePage} />
      <Route exact path={`${match.url}/results/:id`} component={ResultsPage} />
      <Route exact path={`${match.url}/info`} component={AboutPage} />
    </IonRouterOutlet>
  );
};
export default DashboardPage;
