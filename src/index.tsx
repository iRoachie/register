import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import 'antd/dist/antd.css';

import './config/firebase';

import { Shell } from './containers/Shell';
import { Theme } from './config';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={Theme}>
      <Shell />
    </ThemeProvider>
  </React.StrictMode>
);
