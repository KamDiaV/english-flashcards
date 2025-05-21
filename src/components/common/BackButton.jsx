import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.scss';

function BackButton({ label = '← Назад' }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className={styles.backButton}>
      {label}
    </button>
  );
}

export default BackButton;
