// d:\OtherCodingProjects\fortune-telling-website\src\context\AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const getTokens = () => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        return { accessToken, refreshToken };
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            setLoading(true);
            try {
                const { accessToken, refreshToken } = getTokens();
                if (accessToken) {
                    // Use the NOW IMPLEMENTED decodeToken function
                    const user = authService.decodeToken(accessToken);
                    if (user) { // Check if decoding was successful
                        setUser(user);
                        setIsAuthenticated(true);
                    } else {
                        // Token was invalid, clear it
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                    }
                }
            } catch (error) {
                console.error("Error checking auth status:", error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            } finally {
                setUser(null); // Always clear user if there was an error
                setIsAuthenticated(false);
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
                localStorage.setItem('accessToken', result.access_token);
                localStorage.setItem('refreshToken', result.refresh_token);

                const user = authService.decodeToken(result.access_token);
                setUser(user);
                setIsAuthenticated(true);
                return null; // Success

            } else {
                throw new Error(result.message); // Throw error from authService
            }
        } catch (error) {
            console.error("AuthContext login Error:", error);
            // Return the error message from the error object, or a default message
            return error.message || 'An unexpected error occurred.';
        }
    };

    const logout = async () => {
        try {
            const result = await authService.logout();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            setIsAuthenticated(false);
            return null; // Success
        } catch (error) {
            console.error("Logout error:", error);
            return error.message || 'An unexpected error occurred.'; // Return error message
        }
    };

    const authContextValue = {
        user,
        isAuthenticated,
        login,
        logout,
        loading,
        getTokens
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);