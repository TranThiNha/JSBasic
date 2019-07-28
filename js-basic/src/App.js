import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './assets/css/component.scss'
import { routes } from './constants/routeConfig'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        {Object.values(routes).map(item => <Route key={item.path} path={item.path} component={item.component}/>)}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
