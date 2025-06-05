import React from 'react'
import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.scss'
import NotFoundGif from '../../assets/not-found.gif'

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <img src={NotFoundGif} alt="страница не найдена" className={styles.gif} />
      <h2 className={styles.subtitle}>Ой нет! Это</h2>
      <h1 className={styles.title}>404</h1>
      <p className={styles.text}>Похоже, мы потеряли связь с Землёй...</p>
      <Link to="/home" className={styles.button}>
        Вернуться на главную
      </Link>
    </div>
  )
}
