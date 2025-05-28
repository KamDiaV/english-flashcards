import React from 'react';
import AddWordForm from '../components/words/AddWordForm';
import styles from './AddWordPage.module.scss';

export default function AddWordPage() {
  return (
    <div className={styles.addWordPage}>
      <h2 className={styles.title}>Добавить новое слово</h2>
      <div className={styles.formWrapper}>
        <AddWordForm />
      </div>
    </div>
  );
}
