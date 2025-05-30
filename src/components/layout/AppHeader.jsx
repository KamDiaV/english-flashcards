import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import styles from './AppHeader.module.scss'

export default function AppHeader() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>Vocardo</Link>

      <nav className={styles.nav}>
        <NavLink
          to="/home"
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

      <NavLink
        to="/vocab"
        className={({ isActive }) =>
          isActive ? styles.activeVocab : styles.vocab
        }
      >
        Мой словарный запас
      </NavLink>
    </header>
  )
}