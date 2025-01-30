import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home";
import TarotPage from "./pages/TarotPage";
import NewFeature from "./pages/NewFeature";
import LanguageSwitcher from "./components/LanguageSwitcher";

const App = () => {
  const { t } = useTranslation(); // Use translations

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-purple-700 text-gray-100">
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center p-4 bg-gray-800 shadow-lg">
          <div className="flex space-x-6">
            <Link to="/" className="text-white hover:underline">{t("home")}</Link>
            <Link to="/tarot" className="text-white hover:underline">{t("tarot_title")}</Link>
            <Link to="/new-feature" className="text-white hover:underline">{t("new_feature")}</Link>
          </div>
          <LanguageSwitcher /> {/* Language Dropdown */}
        </nav>

        {/* Page Content */}
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tarot" element={<TarotPage />} />
            <Route path="/new-feature" element={<NewFeature />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
