import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AppHeader.module.scss';

function AppHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          Главная
        </NavLink>
        <NavLink
          to="/train"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          Тренировка
        </NavLink>
        <NavLink
          to="/add"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          Добавить слово
        </NavLink>
      </nav>
    </header>
  );
}

export default AppHeader;
