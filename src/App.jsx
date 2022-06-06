import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import * as filter from 'leo-profanity';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Provider } from '@rollbar/react';
import { ToastContainer } from 'react-toastify';
import LoginPage from './components/LoginPage.jsx';
import Page404 from './components/Page404.jsx';
import ChatPage from './components/ChatPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import { AuthContext } from './contexts/AuthContext.jsx';
import routes from './routes.js';

const rollbarConfig = {
  accessToken: `${process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN}`,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: 'production',
  },
};

const PrivateRoute = ({ user, children }) => {
  const location = useLocation();
  return (
    user ? children : <Navigate to={routes.loginPage()} state={{ from: location }} />
  );
};
filter.add(filter.getDictionary('ru'));

const App = () => {
  const { t } = useTranslation();
  const { user, logOut } = React.useContext(AuthContext);

  return (
    <Provider config={rollbarConfig}>
      <Router>
        <div className="d-flex flex-column h-100">
          <Navbar className="shadow-sm" bg="white" expand="lg">
            <Container>
              <Navbar.Brand href={routes.mainPage()}>Hexlet Chat</Navbar.Brand>
              {user && <Button variant="outline-success" onClick={logOut}>{t('buttons.logOut')}</Button>}
            </Container>
          </Navbar>
          <Routes>
            <Route
              path={routes.mainPage()}
              element={(
                <PrivateRoute user={user}>
                  <ChatPage username={user} filter={filter} />
                </PrivateRoute>
              )}
            />
            <Route path={routes.loginPage()} element={<LoginPage />} />
            <Route path={routes.signupPage()} element={<SignUpPage />} />
            <Route path={routes.notFoundPage()} element={<Page404 />} />
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
