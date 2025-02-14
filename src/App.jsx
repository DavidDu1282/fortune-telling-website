// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home";
import TarotPage from "./pages/TarotPage";
import NewFeature from "./pages/NewFeature";
import LanguageSwitcher from "./components/LanguageSwitcher";
import CounsellorPage from "./pages/CounselorPage";
import AuthForm from "./components/AuthForm"; // Import the AuthForm component
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import AuthProvider and useAuth
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute


const App = () => {
  const { t } = useTranslation();
  // const { isAuthenticated, logout, loading } = useAuth(); // Get auth status and logout function (not ideal place)

  return (
    <Router>
      <AuthProvider> {/* Wrap the entire app with AuthProvider */}
        <AppContent />
      </AuthProvider>
    </Router>
  );
};



const AppContent = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout, loading } = useAuth();

    // Function to handle logout with error handling
    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error("Logout failed:", error);
        // Optionally show an error message to the user
      }
    };

  return(
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-purple-700 text-gray-100">
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center p-4 bg-gray-800 shadow-lg">
          <div className="flex space-x-6">
            <Link to="/" className="text-white hover:underline">{t("home")}</Link>
            <Link to="/tarot" className="text-white hover:underline">{t("tarot_title")}</Link>
            <Link to="/new-feature" className="text-white hover:underline">{t("new_feature")}</Link>
            <Link to="/counsellor" className="text-white hover:underline">{t("counsellor_title")}</Link>
           {isAuthenticated ? (
              <button onClick={handleLogout} className="text-white hover:underline">Logout</button>
            ) : (
              <Link to="/login" className="text-white hover:underline">Login</Link>
            )}
          </div>
          <LanguageSwitcher />
        </nav>

        {/* Page Content */}
        <div className="container mx-auto p-6">
        {loading ? (
          <div>Loading...</div> // Show loading indicator while checking auth
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthForm />} /> {/* Use AuthForm */}
            {/* Example of a protected route */}
            <Route
              path="/tarot"
              element={
                <ProtectedRoute>
                  <TarotPage />
                </ProtectedRoute>
              }
            />
            <Route path="/new-feature" element={<NewFeature />} />
            <Route
              path="/counsellor"
              element={
                <ProtectedRoute>
                  <CounsellorPage />
                </ProtectedRoute>
              }
            />
            {/* Add other routes here */}
          </Routes>
        )}
        </div>
      </div>
  )
}

export default App;