import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header style={{ padding: '20px', background: '#EEE' }}>
      <nav>
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Главная</NavLink>
        <NavLink to="/train" className={({ isActive }) => isActive ? 'active' : ''}>Тренировка</NavLink>
        <NavLink to="/add" className={({ isActive }) => isActive ? 'active' : ''}>Добавить слово</NavLink>
      </nav>
    </header>
  );
}

export default Header;
