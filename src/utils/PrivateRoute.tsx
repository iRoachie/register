import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthConsumer } from '../containers/Auth';
import { Loading } from 'components';

const PrivateRoute = ({ component: Component, ...rest }: any) => (
  <AuthConsumer>
    {({ loggedIn }) => {
      if (loggedIn === null) {
        return <Loading />;
      }

      return (
        <Route
          {...rest}
          render={props =>
            loggedIn ? <Component {...props} /> : <Redirect to="/login" />
          }
        />
      );
    }}
  </AuthConsumer>
);

export default PrivateRoute;
