// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { logout as logoutApi } from '../api/authApi.js';

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
  }); // user will be { email: '...', role: 'legal', ... }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // This function will be called from the LoginPage
  const login = (userData) => {
    // In a real app, you'd get this from your API response
    setUser(userData);
    setError(null);
    try {
      localStorage.setItem('brd_user', JSON.stringify(userData));
    } catch {
      // ignore write errors
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call logout API
      await logoutApi();
    } catch (err) {
      // Even if API logout fails, clear local storage
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      try {
        localStorage.removeItem('brd_user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } catch {
        // ignore write errors
      }
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('access_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        loading,
        error,
      }}
    >
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