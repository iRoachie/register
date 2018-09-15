import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { Login } from 'pages';
import App from './App';
import { AuthProvider } from './Auth';
import { PrivateRoute } from 'utils';
import { Theme } from 'config';

const Shell = () => (
  <ThemeProvider theme={Theme}>
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/" component={App} />
        </Switch>
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default Shell;
