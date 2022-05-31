import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { Provider } from '@rollbar/react';
import LoginPage from './components/LoginPage.jsx';
import Page404 from './components/Page404.jsx';
import ChatPage from './components/ChatPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import AuthContext from './contexts/AuthContext.jsx';

const rollbarConfig = {
  accessToken: '9b16bfaa364844b19e877f05709e4b7b',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: 'production',
  },
};

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { user } = React.useContext(AuthContext);

  return (
    user !== '' ? children : <Redirect to={{ pathname: '/login', state: { from: location } }} />
  );
};

const socket = io();

const App = () => {
  const { t } = useTranslation();
  const [user, setUser] = React.useState('');
  const logIn = (username) => setUser(username);
  const logOut = () => {
    localStorage.removeItem('userId');
    setUser('');
  };
  if (user === '' && localStorage.getItem('userId')) {
    const data = JSON.parse(localStorage.getItem('userId'));
    logIn(data.username);
  }

  return (
    <Provider config={rollbarConfig}>
      {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
      <AuthContext.Provider value={{ user, logIn, logOut }}>
        <Router>
          <div className="d-flex flex-column h-100">
            <Navbar className="shadow-sm" bg="white" expand="lg">
              <Container>
                <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
                {user && <Button variant="outline-success" onClick={logOut}>{t('buttons.logOut')}</Button>}
              </Container>
            </Navbar>
            <Switch>
              <Route exact path="/">
                <PrivateRoute>
                  <ChatPage username={user} socket={socket} />
                </PrivateRoute>
              </Route>
              <Route path="/login">
                <LoginPage />
              </Route>
              <Route path="/signup">
                <SignUpPage />
              </Route>
              <Route path="*">
                <Page404 />
              </Route>
            </Switch>
          </div>
        </Router>
      </AuthContext.Provider>
    </Provider>
  );
};

export default App;
