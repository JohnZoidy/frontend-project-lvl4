import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
// Импортируем нужные действия slices

import LoginPage from './components/LoginPage.jsx';
import Page404 from './components/Page404.jsx';
import ChatPage from './components/ChatPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import AuthContext from './contexts/AuthContext.jsx';
// import useAuth from './hooks/AuthHook.jsx';

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
  // const auth = useAuth();
  const location = useLocation();
  return (
    localStorage.getItem('userId') ? children : <Redirect to={{ pathname: '/login', state: { from: location } }} />
  );
};

const App = () => (
  <AuthProvider>
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
      </div>
    </Router>
  </AuthProvider>
);

export default App;
