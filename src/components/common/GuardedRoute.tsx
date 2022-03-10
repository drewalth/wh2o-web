import React, { JSXElementConstructor } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUserContext } from '../user/userContext';

type GuardedRouteProps = {
  component: JSXElementConstructor<any>;
  authenticated: boolean;
  path: string;
};

export const GuardedRoute = ({ component: Component, ...rest }: GuardedRouteProps) => {
  const { data } = useUserContext();
  const whitelistedRoutes = ['/login'];
  const authenticated = !!data?.id || whitelistedRoutes.includes(rest.path);

  return <Route {...rest} render={(props) => (authenticated ? <Component {...props} /> : <Redirect to="/" />)} />;
};
