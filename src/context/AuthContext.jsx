// d:\OtherCodingProjects\fortune-telling-website\src\context\AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper function to get cookies (more robust than document.cookie directly)
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };


  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        // Check auth status by calling the /check-auth endpoint
        const response = await authService.checkAuth();

        if (response.success) {
          setUser({ username: response.username, email: response.email }); // Set user data
          setIsAuthenticated(true);
        } else {
          // If checkAuth fails, consider the user not authenticated
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // Even if there's an error (e.g., network issue), clear user data
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
        // No need to set local storage, cookies are handled by the server
        // Instead, immediately check auth to get the user details from the server.
        const checkAuthResponse = await authService.checkAuth();
        if (checkAuthResponse.success) {
          setUser({username: checkAuthResponse.username, email: checkAuthResponse.email});
          setIsAuthenticated(true);
        } else {
            //this handles a case where the login succeeds in setting a token,
            //but on checking the newly set token the user is not found.
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
      // No need to remove from local storage, server deletes cookies
      setUser(null);
      setIsAuthenticated(false);
      return null; // Success
    } catch (error) {
      console.error("Logout error:", error);
      return error.message || 'An unexpected error occurred.';
    }
  };
    
  //No longer required.
  // const getTokens = () => {
  //   const accessToken = getCookie('access_token');
  //   const refreshToken = getCookie('refresh_token');
  //   return { accessToken, refreshToken };
  // };

  const authContextValue = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
    // getTokens // Removed get tokens.
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
