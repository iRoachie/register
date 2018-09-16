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
import { PrivateRoute } from 'utils';
import { Theme } from 'config';

const Shell = () => (
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
            to="/events/:eventId/register"
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
            path="/events/:eventId/register"
            component={ViewEvent}
          />
        </Switch>
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default Shell;
