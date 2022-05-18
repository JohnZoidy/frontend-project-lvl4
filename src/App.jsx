import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import LoginPage from './components/LoginPage.jsx';
import Page404 from './components/Page404.jsx';
import ChatPage from './components/ChatPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import AuthContext from './contexts/AuthContext.jsx';
import useAuth from './hooks/AuthHook.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = React.useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? children : <Redirect to={{ pathname: '/login', state: { from: location } }} />
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Slack on minimals</Navbar.Brand>
      </Navbar>
      <Switch>
        <Route exact path="/">
          <PrivateRoute>
            <ChatPage />
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
    </Router>
  </AuthProvider>
);

export default App;
