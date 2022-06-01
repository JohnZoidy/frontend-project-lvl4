/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState } from 'react';

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const logIn = (username) => setUser(username);
  const logOut = () => {
    localStorage.removeItem('userId');
    setUser('');
  };
  if (user === '' && localStorage.getItem('userId')) {
    const data = JSON.parse(localStorage.getItem('userId'));
    logIn(data.username);
  }

  const getAuthHeader = () => {
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }
    return {};
  };

  return (
    <AuthContext.Provider value={{
      logIn, logOut, getAuthHeader, user,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
