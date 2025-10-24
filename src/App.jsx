// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from "react-helmet-async";

import DownloadPage from "./pages/DownloadPage";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { AuthProvider, useAuth } from "./context/AuthContext";

const App = () => {
  return (
    <Router>
      <AuthProvider>
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-purple-700 text-gray-100 relative">
      {/* Hamburger Menu Button (Only visible when menu is closed) */}
      {!isMenuOpen && (
        <button
          onClick={toggleMenu}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={t('menu_title')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 flex flex-col p-4`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">{t("menu_title")}</h2>
          <button onClick={closeMenu} className="text-white hover:text-gray-400" aria-label="Close Menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col space-y-3 flex-grow">
          <Link to='/download' onClick={closeMenu} className="text-white hover:bg-gray-700 p-2 rounded">{t("download_title")}</Link>
        </nav>
        <div className="mt-auto">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={closeMenu}
        ></div>
      )}

      {/* Page Content Wrapper */}
      <div className={`pt-20 transition-all duration-300 ease-in-out ${isMenuOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="container mx-auto p-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/download" replace />} />
              <Route
                path="/download"
                element={
                  <>
                    <Helmet><title>{t("download_title")}</title></Helmet>
                    <DownloadPage />
                  </>
                }
              />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
