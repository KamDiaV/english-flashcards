import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants/routes';

import './styles/globals.scss';

import AppLayout from './components/layout/AppLayout';
import ErrorBoundaryWrapper from './components/ErrorBoundary/ErrorBoundaryWrapper'
import Spinner from './components/Spinner/Spinner';

const AboutPage = React.lazy(() => import('./pages/AboutPage/AboutPage'));
const HomePage = React.lazy(() => import('./pages/HomePage/HomePage'));
const TrainPage = React.lazy(() => import('./pages/TrainPage/TrainPage'));
const AddWordPage = React.lazy(() => import('./pages/AddWordPage/AddWordPage'));
const VocabPage = React.lazy(() => import('./pages/VocabPage/VocabPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage/NotFoundPage'));

function App() {
  return (
    <AppLayout>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />

          <Route
            path={ROUTES.HOME}
            element={
              <ErrorBoundaryWrapper
                title="Не удалось загрузить Словарь"
                message="Попробуйте обновить страницу или зайти позже."
                linkPath="/home"
                buttonText="Обновить"
              >
                <HomePage />
              </ErrorBoundaryWrapper>
            }
          />

          <Route
            path={ROUTES.TRAIN}
            element={
              <ErrorBoundaryWrapper
                title="Ошибка на странице «Тренировка»"
                message="Не удалось загрузить TrainPage. Пожалуйста, попробуйте ещё раз."
                linkPath="/train"
                buttonText="Обновить"
              >
                <TrainPage />
              </ErrorBoundaryWrapper>
            }
          />

          <Route
            path={ROUTES.ADD_WORD}
            element={
              <ErrorBoundaryWrapper
                title="Не удалось загрузить форму «Добавление слова»"
                message="Произошла внутренняя ошибка при попытке показать AddWordPage."
                linkPath="/add"
                buttonText="Обновить"
              >
                <AddWordPage />
              </ErrorBoundaryWrapper>
            }
          />        
  
          <Route
            path={ROUTES.VOCAB}
            element={
              <ErrorBoundaryWrapper
                title="Ошибка на странице Мой словарный запас"
                message="VocabPage не удалось загрузить. Попробуйте зайти позже."
                linkPath="/vocab"
                buttonText="Обновить"
              >
                <VocabPage />
              </ErrorBoundaryWrapper>
            }
          />

          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}

export default App;
