import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Provider } from '@rollbar/react';
import { ToastContainer } from 'react-toastify';
import LoginPage from './components/LoginPage.jsx';
import Page404 from './components/Page404.jsx';
import ChatPage from './components/ChatPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import { AuthContext } from './contexts/AuthContext.jsx';

const rollbarConfig = {
  accessToken: '9b16bfaa364844b19e877f05709e4b7b',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: 'production',
  },
};

const PrivateRoute = ({ user, children }) => {
  const location = useLocation();
  return (
    user ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const App = () => {
  const { t } = useTranslation();
  const { user, logOut } = React.useContext(AuthContext);

  return (
    <Provider config={rollbarConfig}>
      <Router>
        <div className="d-flex flex-column h-100">
          <Navbar className="shadow-sm" bg="white" expand="lg">
            <Container>
              <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
              {user && <Button variant="outline-success" onClick={logOut}>{t('buttons.logOut')}</Button>}
            </Container>
          </Navbar>
          <Routes>
            <Route
              path="/"
              element={(
                <PrivateRoute user={user}>
                  <ChatPage username={user} />
                </PrivateRoute>
              )}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        progress={undefined}
      />
    </Provider>
  );
};

export default App;
