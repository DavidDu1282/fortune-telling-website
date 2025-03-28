// fortune-telling-website\src\services\authService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "";
const API_URL = `${BASE_URL}/api/auth`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookie-based authentication
});

const authService = {
    async register(username, email, password) {
        try {
            const response = await api.post('/register', { username, email, password });
            return response.data; // Return the whole response data
        } catch (error) {
            console.error("Registration error:", error);
            // Handle validation errors from the backend (Pydantic)
            if (error.response && error.response.status === 422 && error.response.data && Array.isArray(error.response.data.detail)) {
                // Extract error messages and locations
                const validationErrors = error.response.data.detail.map(err => ({
                    message: err.msg,
                    field: err.loc[0], // Assuming the field is always the first element in the 'loc' array
                    msg: err.msg  // Add the original message here
                }));
                return { success: false, validationErrors: validationErrors };
            }
            // General error handling
            return { success: false, message: error.response?.data?.message || "Registration failed" };
        }
    },
    async login(username, password) {
       try {
            const response = await api.post('/login', { username, password });
            return response.data; // Return the whole response data
        } catch (error) {
            console.error("Login error:", error);
            return error.response.data; //return the error
        }
    },
    async logout() {
       try {
            const response = await api.post('/logout');
            return response.data; // Return the whole response data
        } catch (error) {
            console.error("Logout error:", error);
            return error.response.data; // Return the whole error
        }
    },
    async checkAuth() {
       try {
            const response = await api.get('/check-auth'); //check-auth should return the user
            return response.data;  // Send back to context
        } catch (error) {
            console.error("Error checking auth:", error);
            return { success: false, message: error.response.data.message };
        }
    },

};

export default authService;