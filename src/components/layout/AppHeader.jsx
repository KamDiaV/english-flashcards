import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import clsx from 'clsx';
import styles from './AppHeader.module.scss';

export default function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu  = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <Link to={ROUTES.ABOUT} className={styles.logo}>Vocardo</Link>

      <button
        className={clsx(styles.burger, isMenuOpen && styles.burgerOpened)}
        onClick={toggleMenu}
        aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={isMenuOpen}
      >
        <span /><span /><span />
      </button>

      <nav className={clsx(styles.nav, isMenuOpen && styles.navOpened)}>
        <div className={styles.centerLinks}>
          <NavLink 
            to={ROUTES.HOME}      
            onClick={closeMenu}
            className={({isActive}) => isActive ? styles.activeLink : styles.link}>
            Главная
          </NavLink>
          <NavLink 
            to={ROUTES.TRAIN}     
            onClick={closeMenu}
            className={({isActive}) => isActive ? styles.activeLink : styles.link}>
            Тренировка
          </NavLink>
          <NavLink 
            to={ROUTES.ADD_WORD}  
            onClick={closeMenu}
            className={({isActive}) => isActive ? styles.activeLink : styles.link}>
            Добавить слово
          </NavLink>
        </div>

        <NavLink 
          to={ROUTES.VOCAB}      
          onClick={closeMenu}
          className={({isActive}) => isActive ? styles.activeVocab : styles.vocab}>
          Мой словарный запас
        </NavLink>
      </nav>
    </header>
  );
}
