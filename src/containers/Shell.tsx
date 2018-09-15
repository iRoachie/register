import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Login } from '../pages';
import App from './App';
import { AuthProvider } from './Auth';
import { PrivateRoute } from '../utils';

const Shell = () => (
  <AuthProvider>
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/" component={App} />
      </Switch>
    </Router>
  </AuthProvider>
);

export default Shell;
