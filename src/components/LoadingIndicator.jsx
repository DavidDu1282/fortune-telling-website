// src/components/LoadingIndicator.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingIndicator = () => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center items-center my-8">
      <p className="text-lg font-semibold">{t('loading')}</p>
    </div>
  );
};

export default LoadingIndicator;