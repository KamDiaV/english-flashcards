import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Spinner from './components/Spinner/Spinner';

import './styles/globals.scss';

import AppLayout from './components/layout/AppLayout';

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
          <Route path="/" element={<AboutPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/train" element={<TrainPage />} />
          <Route path="/add" element={<AddWordPage />} />
          <Route path="/vocab"  element={<VocabPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}

export default App;