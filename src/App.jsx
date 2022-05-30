import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import { io } from 'socket.io-client';
import LoginPage from './components/LoginPage.jsx';
import Page404 from './components/Page404.jsx';
import ChatPage from './components/ChatPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import AuthContext from './contexts/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { user } = React.useContext(AuthContext);
  return (
    user !== '' ? children : <Redirect to={{ pathname: '/login', state: { from: location } }} />
  );
};

const socket = io.connect('http://0.0.0.0:5000');

const App = () => {
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
    <AuthContext.Provider value={{ user, logIn, logOut }}>
      <Router>
        <div className="d-flex flex-column h-100">
          <Navbar className="shadow-sm" bg="white" expand="lg">
            <Container>
              <Navbar.Brand href="/">Slack on minimals</Navbar.Brand>
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
  );
};

export default App;
