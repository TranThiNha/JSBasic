import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './assets/css/component.scss'
import { routes } from './constants/routeConfig'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={routes.moment.path} component={routes.moment.component}/>
        <Route path={routes.home.path} render={() => window.location.pathname="/moment/subtract"}/>

      </Switch>
    </BrowserRouter>
  );
}

export default App;
