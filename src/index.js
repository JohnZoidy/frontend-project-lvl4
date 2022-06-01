import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import runApp from './main.jsx';

const run = () => {
  const socket = io();
  const app = runApp(socket);

  ReactDOM.createRoot(document.getElementById('chat')).render(app);
};

run();
