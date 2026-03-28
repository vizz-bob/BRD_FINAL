// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // initialize user from localStorage so sessions persist on refresh
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('brd_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      // ignore parse errors
      return null;
    }
  }); // user will be { email: '...', role: 'sales' }

  // This function will be called from the LoginPage
  const login = (userData) => {
    // In a real app, you'd get this from your API response
    setUser(userData);
    try {
      localStorage.setItem('brd_user', JSON.stringify(userData));
    } catch {
      // ignore write errors
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('brd_user');
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// A custom hook to easily access the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// default export helps some fast-refresh setups
export default AuthProvider;