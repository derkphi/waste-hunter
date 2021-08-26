import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Login from './components/login';
import Header from './components/header';
import Home from './screens/home';
import Calendar from './screens/calendar';
import Reports from './screens/reports';
import CreateEvent from './screens/createEvent';
import {PrivateRoute, RestrictedRoute, Routes } from './components/customRoute';

const headerData = {
  title: 'WasteHunter',
  menuItems:[
    {
      label: "Home",
      href: Routes.home,
    },
    {
      label: "Kalender",
      href: Routes.calendar,
    },
    {
      label: "Berichte",
      href: Routes.reports,
    }
]};

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
        <PrivateRoute path={Routes.createEvent} exact >
          {withHeader(<CreateEvent />)}
        </PrivateRoute>
      </Switch>
    </Router>
  );
}

function withHeader(element: React.ReactElement ) : React.ReactElement{
  return (
    <>
      <Header title={headerData.title} menuItems={headerData.menuItems} />
      {element}
    </>
  )
}

export default App;
