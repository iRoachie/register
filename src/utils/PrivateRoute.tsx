import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthConsumer } from '../containers/Auth';

const PrivateRoute = ({ component: Component, ...rest }: any) => (
  <AuthConsumer>
    {({ loggedIn }) => (
      <Route
        {...rest}
        render={props =>
          loggedIn ? <Component {...props} /> : <Redirect to="/login" />
        }
      />
    )}
  </AuthConsumer>
);

export default PrivateRoute;
