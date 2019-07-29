import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import './assets/css/component.scss'
import { routes } from './constants/routeConfig'

function App() {
  return (
    <BrowserRouter>
      {Object.values(routes).map(item => <Route key={item.path} path={item.path} component={item.component}/>)}
    </BrowserRouter>
  );
}

export default App;
