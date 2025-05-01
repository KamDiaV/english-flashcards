import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Train from './pages/Train';
import AddWord from './pages/AddWord';
import './styles/App.scss';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/train" element={<Train />} />
        <Route path="/add" element={<AddWord />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;