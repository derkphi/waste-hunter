import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { Routes } from '../constants';
import { isAuthenticated } from '../auth';

function RestrictedRoute (props: RouteProps): React.ReactElement {
    const { component: Component, ...rest } = props;
  return (
    <Route {...rest} render={props => (
      isAuthenticated() 
        ? <Redirect to={Routes.home} />
        : <Component {...props} />
    )} />
  );
};

export default RestrictedRoute;