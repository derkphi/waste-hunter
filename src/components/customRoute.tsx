import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { auth } from '../firebase/config';

export enum Routes {
  login = '/login',
  calendar = '/calendar',
  reports = '/reports',
  cleanup = '/cleanups/:id',
  home = '/',
  createEvent = '/calendar/new-event',
  editEvent = '/calendar/edit-event/:id',
  hidden = '/hidden/:id',
  logout = '/logout',
}

function isAuthenticated() {
  return auth.currentUser !== null;
}

export function PrivateRoute(props: RouteProps): React.ReactElement {
  let element: React.ReactElement;
  if (isAuthenticated()) {
    element = <Route {...props}>{props.children}</Route>;
  } else {
    element = <Redirect to={Routes.login} />;
  }
  return element;
}

export function RestrictedRoute(props: RouteProps): React.ReactElement {
  let element: React.ReactElement;
  if (isAuthenticated()) {
    element = <Redirect to={Routes.home} />;
  } else {
    element = <Route {...props}>{props.children}</Route>;
  }
  return element;
}
