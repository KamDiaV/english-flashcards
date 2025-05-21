import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';

import HomePage from './pages/HomePage';
import TrainPage from './pages/TrainPage';
import AddWordPage from './pages/AddWordPage';

import './styles/globals.scss';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/train" element={<TrainPage />} />
        <Route path="/add" element={<AddWordPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
