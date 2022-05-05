import React from 'react';
import i18n from 'i18next';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { I18nextProvider } from 'react-i18next';
import store from './slices/index.js';
import ru from './locales/ru.js';
import App from './App.jsx';
import './css/style.css';

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
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>
  );
};
