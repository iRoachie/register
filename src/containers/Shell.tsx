import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { Login, Events, ViewEvent } from 'pages';
import { AuthProvider } from './Auth';
import { PrivateRoute, pageTitle } from 'utils';
import { Theme } from 'config';
import DocumentTitle from 'react-document-title';

const Shell = () => (
  <DocumentTitle title={pageTitle('Loading...')}>
    <ThemeProvider theme={Theme}>
      <AuthProvider>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/" component={Events} />
            <Redirect exact path="/events" to="/" />
            <PrivateRoute exact path="/events/new" component={Events} />
            <Redirect
              exact
              path="/events/:eventId"
              to="/events/:eventId/attendance"
            />
            <PrivateRoute
              exact
              path="/events/:eventId/categories"
              component={ViewEvent}
            />
            <PrivateRoute
              exact
              path="/events/:eventId/attendees"
              component={ViewEvent}
            />
            <PrivateRoute
              exact
              path="/events/:eventId/attendance"
              component={ViewEvent}
            />
            <Redirect to="/" />
          </Switch>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  </DocumentTitle>
);

export default Shell;
