import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import App from './App.jsx';
import ru from './locales/ru.js';

export default async () => {
  await i18n
    .init({
      lng: 'ru',
      debug: false,
      resources: {
        ru,
      },
    });

  return (
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
  );
};