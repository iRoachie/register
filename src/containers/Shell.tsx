import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { Login, Events } from 'pages';
import { AuthProvider } from './Auth';
import { PrivateRoute } from 'utils';
import { Theme } from 'config';
import styled from '@styled';

const Shell = () => (
  <ThemeProvider theme={Theme}>
    <AuthProvider>
      <Content>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/" component={Events} />
            <PrivateRoute exact path="/events" component={Events} />
            <PrivateRoute exact path="/events/new" component={Events} />
          </Switch>
        </Router>
      </Content>
    </AuthProvider>
  </ThemeProvider>
);

export default Shell;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
`;
