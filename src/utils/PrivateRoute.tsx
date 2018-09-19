import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthConsumer } from '../containers/Auth';
import { Loading } from 'components';
import DocumentTitle from 'react-document-title';
import pageTitle from './pageTitle';

const PrivateRoute = ({ component: Component, ...rest }: any) => (
  <AuthConsumer>
    {({ loggedIn }) => {
      if (loggedIn === null) {
        return (
          <DocumentTitle title={pageTitle('Loading...')}>
            <Loading />
          </DocumentTitle>
        );
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
