import React from 'react';
import BackButton from '../components/common/BackButton';
import styles from './TrainPage.module.scss';

function TrainPage() {
  return (
    <div className={styles.trainPage}>
      <BackButton />
      <h2 className={styles.title}>Режим тренировки</h2>
      {/* Здесь будет логика карточек для тренировки */}
    </div>
  );
}

export default TrainPage;
