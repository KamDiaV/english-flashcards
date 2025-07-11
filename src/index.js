import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter } from 'react-router-dom';

import App from './App';
import './styles/globals.scss';

import * as serviceWorkerRegistration from './serviceWorkerRegistration'; 

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <HashRouter>
      <App />
    </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
);


// Регистрируем сервис-воркер CRA
serviceWorkerRegistration.register({
  // опционально: уведомляем пользователя о новой версии
  onUpdate: reg => {
    if (window.confirm('Доступна новая версия приложения. Обновить?')) {
      reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }
});