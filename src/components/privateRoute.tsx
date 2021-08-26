import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Routes } from '../constants';
import { isAuthenticated } from '../auth';

function PrivateRoute({component: Component, ...rest}): React.ReactElement {
  return (
    <Route {...rest} render={props => (
      isAuthenticated() 
        ? <Component {...props} />
        : <Redirect to={Routes.login} />
    )} />
  );
}

export default PrivateRoute;
