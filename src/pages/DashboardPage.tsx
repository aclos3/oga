import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import HomePage from './HomePage';
import ResultsPage from './ResultsPage';

const DashboardPage: React.FC<RouteComponentProps> = ({match}) => {
    return (
    <IonRouterOutlet>
      <Route exact path={match.url} component={HomePage} />
      <Route path={`${match.url}/station/:id`} component={ResultsPage} />
    </IonRouterOutlet>
  );
};

export default DashboardPage
