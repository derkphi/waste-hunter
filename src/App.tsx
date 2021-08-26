import React from 'react';
import { BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import Login from './components/login';
import Home from './screens/home';
import Calendar from './screens/calendar';
import Reports from './screens/reports';
import { Routes } from './constants';
import {PrivateRoute, RestrictedRoute} from './components/customRoute'  

function App() { 
  return (
    <Router>
      <Switch>
        <RestrictedRoute path={Routes.login} exact >
          <Login />
          </RestrictedRoute>
        <PrivateRoute path={Routes.calendar} exact >
          {withHeader(<Calendar />)}
          </PrivateRoute>
        <PrivateRoute path={Routes.reports} exact >
          {withHeader(<Reports />)}
          </PrivateRoute>
        <PrivateRoute path={Routes.home} exact >
          {withHeader(<Home />)}
          </PrivateRoute>
      </Switch>
      {/*<Link to="/">Login</Link> / <Link to="/catalog">Catalog</Link>*/}
    </Router>
  );
}

function withHeader(element: React.ReactElement ) : React.ReactElement{
  return (
    <div>
      <ul>
        <li><Link to={Routes.home}>Home</Link></li>
        <li><Link to={Routes.calendar}>Kalender</Link></li>
        <li><Link to={Routes.reports}>Berichte</Link></li>
      </ul>
      {element}
    </div>
  )
}

export default App;
