// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home";
import TarotPage from "./pages/TarotPage";
import NewFeature from "./pages/NewFeature";
import BaguaPage from "./pages/BaguaPage";
import LanguageSwitcher from "./components/LanguageSwitcher";
import CounsellorPage from "./pages/CounsellorPage";
import AuthForm from "./components/AuthForm"; // Import the AuthForm component
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import AuthProvider and useAuth
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import { Helmet, HelmetProvider } from "react-helmet-async"; // Import in App.jsx


const App = () => {
  const { t } = useTranslation();
  // const { isAuthenticated, logout, loading } = useAuth(); // Get auth status and logout function (not ideal place)

  return (
    <Router>
      <AuthProvider> {/* Wrap the entire app with AuthProvider */}
        <HelmetProvider>
        <AppContent />
        </HelmetProvider>
      </AuthProvider>
    </Router>
  );
};



const AppContent = () => {
  const { t } = useTranslation("routes_titles");
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
            <Link to="/" className="text-white hover:underline">{t("home_title")}</Link>
            <Link to="/tarot" className="text-white hover:underline">{t("tarot_title")}</Link>
            {/* <Link to="/new-feature" className="text-white hover:underline">{t("new_feature")}</Link> */}
            <Link to="/counsellor" className="text-white hover:underline">{t("counsellor_title")}</Link>
            <Link to='/bagua' className="text-white hover:underline">{t("bagua_title")}</Link>

           {isAuthenticated ? (
              <button onClick={handleLogout} className="text-white hover:underline">{t("logout_title")}</button>
            ) : (
              <Link to="/login" className="text-white hover:underline">{t("login_title")}</Link>
            )}
          </div>
          <LanguageSwitcher />
        </nav>

        {/* Page Content */}
        <div className="container mx-auto p-6">

        {loading ? (
          <div>Loading...</div>
        ) : (
          <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Helmet>
                      <title>{t("home_title") || "My Default App Title"}</title> {/* Fallback title */}
                    </Helmet>
                    <Home />
                  </>
                }
              />
            <Route path="/login" element={<><Helmet><title>{t("login_title")}</title></Helmet><AuthForm /></>} />

            <Route
              path="/tarot"
              element={
                <ProtectedRoute>
                  <Helmet>
                    <title>{t("tarot_title")}</title>
                  </Helmet>
                  <TarotPage />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/new-feature" element={<NewFeature />} /> */}
            <Route
              path="/counsellor"
              element={
                <ProtectedRoute>
                   <Helmet>
                    <title>{t("counsellor_title")}</title>
                  </Helmet>
                  <CounsellorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bagua"
              element={
                <ProtectedRoute>
                   <Helmet>
                    <title>{t("bagua_title")}</title>
                  </Helmet>
                  <BaguaPage />
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