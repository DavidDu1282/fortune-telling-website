// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from "react-helmet-async";

// import Home from "./pages/Home";
import TarotPage from "./pages/TarotPage";
// import NewFeature from "./pages/NewFeature";
import BaguaPage from "./pages/BaguaPage";
import CounsellorPage from "./pages/CounsellorPage";
import DownloadPage from "./pages/DownloadPage";
import LanguageSwitcher from "./components/LanguageSwitcher";
import AuthForm from "./components/AuthForm";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
      {!isMenuOpen && ( // <-- Conditionally render the button
        <button
          onClick={toggleMenu}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={t('menu_title')} // Changed aria-label for clarity
        >
          {/* Only need the Hamburger Icon now */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar Menu (remains fixed and animated) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 flex flex-col p-4`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">{t("menu_title")}</h2>
          {/* Keep the close button inside the menu */}
          <button onClick={closeMenu} className="text-white hover:text-gray-400" aria-label="Close Menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col space-y-3 flex-grow">
          {/* Links remain the same */}
          <Link to="/" onClick={closeMenu} className="text-white hover:bg-gray-700 p-2 rounded">{t("counsellor_title")}</Link>
          {/* <Link to="/home" onClick={closeMenu} className="text-white hover:bg-gray-700 p-2 rounded">{t("home_title")}</Link> */}
          <Link to="/tarot" onClick={closeMenu} className="text-white hover:bg-gray-700 p-2 rounded">{t("tarot_title")}</Link>
          <Link to='/bagua' onClick={closeMenu} className="text-white hover:bg-gray-700 p-2 rounded">{t("bagua_title")}</Link>
          <Link to='/download' onClick={closeMenu} className="text-white hover:bg-gray-700 p-2 rounded">{t("download_title")}</Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-left text-white hover:bg-gray-700 p-2 rounded">{t("logout_title")}</button>
          ) : (
            <Link to="/login" onClick={closeMenu} className="text-white hover:bg-gray-700 p-2 rounded">{t("login_title")}</Link>
          )}
        </nav>
        <div className="mt-auto">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Overlay (remains the same) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={closeMenu}
        ></div>
      )}

      {/* Page Content Wrapper (remains the same) */}
      <div className={`pt-20 transition-all duration-300 ease-in-out ${isMenuOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Inner Content Container (remains the same) */}
        <div className="container mx-auto p-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Routes>
              {/* Routes remain the same */}
               <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Helmet><title>{t("counsellor_title")}</title></Helmet>
                    <CounsellorPage />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path="/home"
                // ... home route definition ...
              /> */}
              <Route path="/login" element={<><Helmet><title>{t("login_title")}</title></Helmet><AuthForm /></>} />
              <Route
                path="/tarot"
                element={
                  <ProtectedRoute>
                    <Helmet><title>{t("tarot_title")}</title></Helmet>
                    <TarotPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bagua"
                element={
                  <ProtectedRoute>
                    <Helmet><title>{t("bagua_title")}</title></Helmet>
                    <BaguaPage />
                  </ProtectedRoute>
                }
              />
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
// // src/App.jsx
// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { Helmet, HelmetProvider } from "react-helmet-async";

// // import Home from "./pages/Home";
// import TarotPage from "./pages/TarotPage";
// // import NewFeature from "./pages/NewFeature";
// import BaguaPage from "./pages/BaguaPage";
// import CounsellorPage from "./pages/CounsellorPage";
// import LanguageSwitcher from "./components/LanguageSwitcher";
// import AuthForm from "./components/AuthForm";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";

// const App = () => {
//   return (
//     <Router>
//       <AuthProvider>
//         <HelmetProvider>
//           <AppContent />
//         </HelmetProvider>
//       </AuthProvider>
//     </Router>
//   );
// };

// const AppContent = () => {
//   const { t } = useTranslation("routes_titles");
//   const { isAuthenticated, logout, loading } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [location]);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const closeMenu = () => {
//     setIsMenuOpen(false);
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       closeMenu();
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-purple-700 text-gray-100 relative">
//       {/* Hamburger Menu Button (remains fixed) */}
//       <button
//         onClick={toggleMenu}
//         className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         aria-label="Toggle Menu"
//       >
//         {/* SVG icons remain the same */}
//         {isMenuOpen ? (
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           ) : (
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           )}
//       </button>

//       {/* Sidebar Menu (remains fixed and animated) */}
//       <div
//         className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg transform ${
//           isMenuOpen ? "translate-x-0" : "-translate-x-full"
//         } transition-transform duration-300 ease-in-out z-40 flex flex-col p-4`}
//       >
//          {/* Menu content remains the same */}
//          <div className="flex justify-between items-center mb-6">
//              <h2 className="text-xl font-semibold text-white">{t("menu_title")}</h2>
//              <button onClick={closeMenu} className="text-white hover:text-gray-400" aria-label="Close Menu">
//                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                  </svg>
//              </button>
//         </div>
//         <nav className="flex flex-col space-y-3 flex-grow">
//           <Link to="/" onClick={closeMenu} className="text-white hover:bg-gray-700 p-2 rounded">{t("counsellor_title")}</Link>
//           {/* <Link to="/home" onClick={closeMenu} className="text-white hover:bg-gray-700 p-2 rounded">{t("home_title")}</Link> */}
//           <Link to="/tarot" onClick={closeMenu} className="text-white hover:bg-gray-700 p-2 rounded">{t("tarot_title")}</Link>
//           <Link to='/bagua' onClick={closeMenu} className="text-white hover:bg-gray-700 p-2 rounded">{t("bagua_title")}</Link>
//           {isAuthenticated ? (
//             <button onClick={handleLogout} className="text-left text-white hover:bg-gray-700 p-2 rounded">{t("logout_title")}</button>
//           ) : (
//             <Link to="/login" onClick={closeMenu} className="text-white hover:bg-gray-700 p-2 rounded">{t("login_title")}</Link>
//           )}
//         </nav>
//          <div className="mt-auto">
//             <LanguageSwitcher />
//          </div>
//       </div>

//       {/* Overlay (remains the same) */}
//       {isMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 z-30"
//           onClick={closeMenu}
//         ></div>
//       )}

//       {/* Page Content Wrapper *** NEW *** */}
//       <div className={`pt-20 transition-all duration-300 ease-in-out ${isMenuOpen ? 'ml-64' : 'ml-0'}`}> {/* Apply ml-* and transition here */}
//         {/* Inner Content Container (handles centering) */}
//         <div className="container mx-auto p-6"> {/* Keep container mx-auto here */}
//           {loading ? (
//             <div>Loading...</div>
//           ) : (
//             <Routes>
//               {/* Routes remain the same */}
//               <Route
//                 path="/"
//                 element={
//                   <ProtectedRoute>
//                     <Helmet><title>{t("counsellor_title")}</title></Helmet>
//                     <CounsellorPage />
//                   </ProtectedRoute>
//                 }
//               />
//               {/* <Route
//                 path="/home"
//                 element={
//                   <>
//                     <Helmet><title>{t("home_title") || "My Default App Title"}</title></Helmet>
//                     <Home />
//                   </>
//                 }
//               /> */}
//               <Route path="/login" element={<><Helmet><title>{t("login_title")}</title></Helmet><AuthForm /></>} />
//               <Route
//                 path="/tarot"
//                 element={
//                   <ProtectedRoute>
//                     <Helmet><title>{t("tarot_title")}</title></Helmet>
//                     <TarotPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/bagua"
//                 element={
//                   <ProtectedRoute>
//                     <Helmet><title>{t("bagua_title")}</title></Helmet>
//                     <BaguaPage />
//                   </ProtectedRoute>
//                 }
//               />
//             </Routes>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;
