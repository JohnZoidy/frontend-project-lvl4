// @ts-check
import ReactDOM from 'react-dom/client';
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import app from './App.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const root = ReactDOM.createRoot(document.getElementById('chat'));
root.render(app());
