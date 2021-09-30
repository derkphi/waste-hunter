import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Login from './screens/login';
import Header from './components/header';
import Home from './screens/home';
import Calendar from './screens/calendar';
import Reports from './screens/reports';
import CreateEvent from './screens/createEvent';
import Cleanup from './screens/cleanup';
import CleanupData from './screens/cleanupData';
import { PrivateRoute, RestrictedRoute, Routes } from './components/customRoute';
import { Container, createTheme, ThemeProvider } from '@mui/material';
import SignOutButton from './components/SignOutButton';

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
    {
      label: 'Logout',
      href: Routes.logout,
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
            {withHeader('Kalender', <Calendar />)}
          </PrivateRoute>
          <PrivateRoute path={Routes.reports} exact>
            {withHeader('Berichte', <Reports />)}
          </PrivateRoute>
          <PrivateRoute path={Routes.cleanup} exact>
            <Cleanup />
          </PrivateRoute>
          <PrivateRoute path={Routes.home} exact>
            {withHeader('Home', <Home />)}
          </PrivateRoute>
          <PrivateRoute path={Routes.createEvent} exact>
            {withHeader('Event erfassen', <CreateEvent />)}
          </PrivateRoute>
          <PrivateRoute path={Routes.editEvent} exact>
            {withHeader('Event ändern', <CreateEvent />)}
          </PrivateRoute>
          <PrivateRoute path={Routes.logout} exact>
            {withHeader('Logout', <SignOutButton />)}
          </PrivateRoute>
          <PrivateRoute path={Routes.hidden} exact>
            {withHeader('Cleanup Data', <CleanupData />)}
          </PrivateRoute>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

function withHeader(title: string, element: React.ReactElement): React.ReactElement {
  return (
    <>
      <Header title={title} menuItems={headerData.menuItems} />

      <Container maxWidth="lg" style={{ marginTop: '20px' }}>
        {element}
      </Container>
    </>
  );
}

export default App;
