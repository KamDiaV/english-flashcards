import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants/routes';

import './styles/globals.scss';

import AppLayout from './components/layout/AppLayout';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import GenericErrorPage from './components/ErrorBoundary/GenericErrorPage';
import Spinner from './components/Spinner/Spinner';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const TrainPage = React.lazy(() => import('./pages/TrainPage'));
const AddWordPage = React.lazy(() => import('./pages/AddWordPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const VocabPage = React.lazy(() => import('./pages/VocabPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <AppLayout>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />

          <Route
            path={ROUTES.HOME}
            element={
              <ErrorBoundary
                FallbackComponent={(props) => (
                  <GenericErrorPage
                    title="Не удалось загрузить Словарь"
                    message="Попробуйте обновить страницу или зайти позже."
                    linkPath="/home"
                    buttonText="Обновить"
                    errorInfo={props.errorInfo}
                  />
                )}
              >
                <HomePage />
              </ErrorBoundary>
            }
          />

          <Route
            path={ROUTES.TRAIN}
            element={
              <ErrorBoundary
                FallbackComponent={(props) => (
                  <GenericErrorPage
                    title="Ошибка на странице «Тренировка»"
                    message="Не удалось загрузить TrainPage. Пожалуйста, попробуйте ещё раз."
                    linkPath="/train"
                    buttonText="Попробовать снова"
                    errorInfo={props.errorInfo}
                  />
                )}
              >
                <TrainPage />
              </ErrorBoundary>
            }
          />

          <Route
            path={ROUTES.ADD_WORD}
            element={
              <ErrorBoundary
                FallbackComponent={(props) => (
                  <GenericErrorPage
                    title="Не удалось загрузить форму «Добавление слова»"
                    message="Произошла внутренняя ошибка при попытке показать AddWordPage."
                    linkPath="/add"
                    buttonText="Обновить страницу"
                    errorInfo={props.errorInfo}
                  />
                )}
              >
                <AddWordPage />
              </ErrorBoundary>
            }
          />
    
          <Route
            path={ROUTES.VOCAB}
            element={
              <ErrorBoundary
                FallbackComponent={(props) => (
                  <GenericErrorPage
                    title="Ошибка на странице Мой словарный запас"
                    message="VocabPage не удалось загрузить. Попробуйте зайти позже."
                    linkPath="/vocab"
                    buttonText="Повторить попытку"
                    errorInfo={props.errorInfo}
                  />
                )}
              >
                <VocabPage />
              </ErrorBoundary>
            }
          />

          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}

export default App;
