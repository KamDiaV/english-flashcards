import React from 'react';
import WordList from '../components/words/WordList';
import styles from './HomePage.module.scss';

function HomePage() {
  return (
    <div className={styles.homePage}>
      <h2 className={styles.title}>Список слов</h2>
      <WordList />
    </div>
  );
}

export default HomePage;
