import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import HomePage from './HomePage';
import ResultsPage from './ResultsPage';

const DashboardPage: React.FC<RouteComponentProps> = ({match}) => {
    console.log(`match: `, match.url)
    return (
    <IonRouterOutlet>
      <Route exact path={match.url} component={HomePage} />
      <Route path={`${match.url}/user/:id`} component={ResultsPage} />
    </IonRouterOutlet>
  );
};

export default DashboardPage
