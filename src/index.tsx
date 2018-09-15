import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import 'antd/dist/antd.css';

import 'firebase/auth';
import 'firebase/database';

import App from './containers/App';

const config = {
  apiKey: process.env.FIREBASE_apiKey,
  authDomain: process.env.FIREBASE_authDomain,
  databaseURL: process.env.FIREBASE_databaseURL,
  projectId: process.env.FIREBASE_projectId,
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

ReactDOM.render(<App />, document.getElementById('root'));
