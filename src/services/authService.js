// d:\OtherCodingProjects\fortune-telling-website\src\services\authService.js
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

// Interceptors are no longer needed.
// // Interceptor to add the access token to requests  -- REMOVED
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('accessToken'); //  REMOVED
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`; //  REMOVED
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Interceptor for handling token refresh. VERY IMPORTANT.  -- MODIFIED
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // If the error is 401 (Unauthorized) and we haven't already tried to refresh
//         if (error.response && error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true; // Prevent infinite loops
//             try {
//                 // const refreshToken = localStorage.getItem('refreshToken'); // REMOVED, now from cookie
//                 // if (!refreshToken) { // No refresh token, can't refresh  -- REMOVED
//                 //     throw new Error("No refresh token available."); //Go straight to catch -- REMOVED
//                 // }
//                 //We no longer need to send the refresh token, the request is made with credentials.
//                 const refreshResult = await api.post('/refresh'); // Removed , { refreshToken }

//                 if (refreshResult.data.success) {
//                     // localStorage.setItem('accessToken', refreshResult.data.access_token); // REMOVED
//                     // localStorage.setItem('refreshToken', refreshResult.data.refresh_token); // REMOVED, now from cookie

//                     // Retry the original request.  No need to set headers, cookies are automatic.
//                     // originalRequest.headers['Authorization'] = `Bearer ${refreshResult.data.access_token}`; -- REMOVED
//                     return api(originalRequest); // Use the axios instance
//                 } else {
//                     // Refresh failed.  Log them out.
//                     throw new Error("Refresh failed.");
//                 }
//             } catch (refreshError) {
//                 console.error("Token refresh failed:", refreshError);
//                 // Clear tokens and force logout -- REMOVED, handled by backend and AuthContext
//                 // localStorage.removeItem('accessToken'); // REMOVED
//                 // localStorage.removeItem('refreshToken'); // REMOVED
//                  //  Logout is handled in AuthContext, but we need to reject the promise
//                 return Promise.reject(refreshError); // Reject to propagate to caller
//             }
//         }
//         return Promise.reject(error); // Return all other errors
//     }
// );



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
    // decodeToken is no longer needed because the server handles token validation.
    // decodeToken(token) {
    //     try {
    //         return jwtDecode(token); // CORRECT: Use the named export
    //     } catch (error) {
    //         console.error("Error decoding token:", error);
    //         return null; // Invalid token
    //     }
    // },
};

export default authService;