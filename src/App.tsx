import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './components/login';
import Home from './screens/home';
import Calendar from './screens/calendar';
import Reports from './screens/reports';
import { Routes } from './constants';
import RestrictedRoute from './components/restrictedRoute' 
import PrivateRoute from './components/privateRoute' 

function App() { 
  return (
    <Router>
      <Switch>
        <RestrictedRoute component={Login} path={Routes.login} exact />
        <PrivateRoute component={Calendar} path={Routes.calendar} exact />
        <PrivateRoute component={Reports} path={Routes.reports} exact />
        <PrivateRoute component={Home} path={Routes.home} exact/>
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
        <li><Link to={Routes.calendar}>Calendar</Link></li>
        <li><Link to={Routes.reports}>Reports</Link></li>
      </ul>
      {element}
    </div>
  )
}

export default App;
