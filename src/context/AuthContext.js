import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    window.dispatchEvent(new Event('logout'));
    localStorage.removeItem('userid');
    setIsLoggedIn(false);
  };

  const handleLogin = (userId) => {
    localStorage.setItem('userid', userId);
    setIsLoggedIn(true);
  };

  return (
      <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
