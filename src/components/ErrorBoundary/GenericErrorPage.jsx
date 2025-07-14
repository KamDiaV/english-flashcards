import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GenericErrorPage.module.scss';

export default function GenericErrorPage({
  title = 'Упс… Что-то пошло не так',
  message = 'Попробуйте проверить подключение к интернету и обновить страницу.',
  linkPath = '/about',
  buttonText = 'Вернуться на страницу Vocardo',
  errorInfo,
}) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.message}>{message}</p>

      {errorInfo?.componentStack && (
        <details className={styles.details}>
          <summary>Показать технические детали</summary>
          <pre className={styles.stack}>
            {errorInfo.componentStack}
          </pre>
        </details>
      )}

      <Link to={linkPath} className={styles.button}>
        {buttonText}
      </Link>
    </div>
  );
}
