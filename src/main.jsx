// @ts-check
import React from 'react';
import { Provider } from 'react-redux';
import './i18.js';
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import App from './App.jsx';
import store from './slices/index.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
