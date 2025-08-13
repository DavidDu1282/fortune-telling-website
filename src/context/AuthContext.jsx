// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };


  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const response = await authService.checkAuth();

        if (response.success) {
          setUser({ username: response.username, email: response.email });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      const result = await authService.login(username, password);
      console.log("AuthContext login result:", result);

      if (result.success) {
        const checkAuthResponse = await authService.checkAuth();
        if (checkAuthResponse.success) {
          setUser({username: checkAuthResponse.username, email: checkAuthResponse.email});
          setIsAuthenticated(true);
        } else {
            setUser(null);
            setIsAuthenticated(false);
            return "Error checking user details.";
        }
        
        return null; // Success
      } else {
        throw new Error(result.message); // Throw error from authService
      }
    } catch (error) {
      console.error("AuthContext login Error:", error);
      return error.message || 'An unexpected error occurred.';
    }
  };

  const logout = async () => {
    try {
      const result = await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return null; // Success
    } catch (error) {
      console.error("Logout error:", error);
      return error.message || 'An unexpected error occurred.';
    }
  };

  const authContextValue = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
