import React from 'react';
import { useTranslation } from 'react-i18next';

export default function NoMatch() {
  const { t } = useTranslation();

  return (
    <div className="text-center fade alert alert-warning show p-2">
      <h2>{t('404')}</h2>
      <a href="/">{t('goBack')}</a>
    </div>
  );
}
