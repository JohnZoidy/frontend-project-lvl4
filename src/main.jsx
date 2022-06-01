// @ts-check
import React from 'react';
import { Provider } from 'react-redux';
import './i18.js';
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import App from './App.jsx';
import store from './slices/index.js';
import AuthProvider from './contexts/AuthContext.jsx';
import SocketProvider from './contexts/SocketAPI.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

export default (socket) => (
  <Provider store={store}>
    <SocketProvider socket={socket}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SocketProvider>
  </Provider>
);
