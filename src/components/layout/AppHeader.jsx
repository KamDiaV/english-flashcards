import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import styles from './AppHeader.module.scss'

export default function AppHeader() {
  return (
    <header className={styles.header}>
      <Link to={ROUTES.ABOUT} className={styles.logo}>Vocardo</Link>

      <nav className={styles.nav}>
        <NavLink
          to={ROUTES.HOME}
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          Главная
        </NavLink>
        <NavLink
          to={ROUTES.TRAIN}
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          Тренировка
        </NavLink>
        <NavLink
          to={ROUTES.ADD_WORD}
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          Добавить слово
        </NavLink>
      </nav>

      <NavLink
        to={ROUTES.VOCAB}
        className={({ isActive }) =>
          isActive ? styles.activeVocab : styles.vocab
        }
      >
        Мой словарный запас
      </NavLink>
    </header>
  )
}