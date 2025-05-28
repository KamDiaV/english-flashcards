import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';

import HomePage from './pages/HomePage';
import TrainPage from './pages/TrainPage';
import AddWordPage from './pages/AddWordPage';
import AboutPage from './pages/AboutPage.jsx';
import VocabPage from './pages/VocabPage.jsx';

import './styles/globals.scss';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<AboutPage />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/train" element={<TrainPage />} />
        <Route path="/add"  element={<AddWordPage />} />
        <Route path="/vocab" element={<VocabPage />} />

        {/* На всякий случай: всё, что не нашлось, кидаем на About */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;