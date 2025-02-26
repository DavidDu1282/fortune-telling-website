// Home.jsx
import React from "react";
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">{t("welcome")}</h1>
      <p className="mt-4 text-lg">{t("choose_feature")}</p>
    </div>
  );
};

export default Home;