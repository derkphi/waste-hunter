import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Login from './components/login';
import Header from './components/header';
import Home from './screens/home';
import Calendar from './screens/calendar';
import Reports from './screens/reports';
import CreateEvent from './screens/createEvent';
import Cleanup from './screens/cleanup';
import { PrivateRoute, RestrictedRoute, Routes } from './components/customRoute';
import { Container, createTheme, ThemeProvider } from '@material-ui/core';

const theme = createTheme({
  palette: {
    primary: {
      light: '#528777',
      main: '#276955',
      dark: '#1b493b',
    },
    secondary: {
      light: '#67b7a3',
      main: '#41a58d',
      dark: '#2d7362',
    },
  },
});

const headerData = {
  title: 'WasteHunter',
  menuItems: [
    {
      label: 'Home',
      href: Routes.home,
    },
    {
      label: 'Kalender',
      href: Routes.calendar,
    },
    {
      label: 'Berichte',
      href: Routes.reports,
    },
  ],
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <RestrictedRoute path={Routes.login} exact>
            <Login />
          </RestrictedRoute>
          <PrivateRoute path={Routes.calendar} exact>
            {withHeader(<Calendar />)}
          </PrivateRoute>
          <PrivateRoute path={Routes.reports} exact>
            {withHeader(<Reports />)}
          </PrivateRoute>
          <PrivateRoute path={Routes.cleanup} exact>
            {withHeader(<Cleanup />)}
          </PrivateRoute>
          <PrivateRoute path={Routes.home} exact>
            {withHeader(<Home />)}
          </PrivateRoute>
          <PrivateRoute path={Routes.createEvent} exact>
            {withHeader(<CreateEvent />)}
          </PrivateRoute>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

function withHeader(element: React.ReactElement): React.ReactElement {
  return (
    <>
      <Header title={headerData.title} menuItems={headerData.menuItems} />
      <Container maxWidth="lg" style={{ marginTop: '20px' }}>
        {element}
      </Container>
    </>
  );
}

export default App;
