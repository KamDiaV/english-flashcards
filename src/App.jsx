import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';

import HomePage from './pages/HomePage';
import TrainPage from './pages/TrainPage';
import AddWordPage from './pages/AddWordPage';
import AboutPage from './pages/AboutPage';
import VocabPage from './pages/VocabPage';

import './styles/globals.scss';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/train" element={<TrainPage />} />
        <Route path="/add" element={<AddWordPage />} />
        <Route path="/vocab" element={<VocabPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
