import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './AddWordForm.module.scss';

const STORAGE_KEY = 'addedWords';

export default function AddWordForm() {
  const [newWord, setNewWord] = useState({
    english: '',
    transcription: '',
    russian: '',
    tags: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: word =>
      axios.post('http://itgirlschool.justmakeit.ru/api/words', word),
    onSuccess: () => {
      const entry = {
        id: Date.now(), 
        ...newWord
      };

      queryClient.setQueryData(['words'], old => [...(old || []), entry]);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...stored, entry]));

      setNewWord({ english: '', transcription: '', russian: '', tags: '' });
      setSuccess(true);
      setError('');
    },
    onError: () => {
      setError('Не удалось добавить слово');
      setSuccess(false);
    },
  });

  const handleChange = ({ target: { name, value } }) => {
    setNewWord(prev => ({ ...prev, [name]: value }));
    setSuccess(false);
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    addMutation.mutate(newWord);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.field}>
        Слово (англ.):
        <input
          type="text"
          name="english"
          value={newWord.english}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </label>

      <label className={styles.field}>
        Транскрипция:
        <input
          type="text"
          name="transcription"
          value={newWord.transcription}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </label>

      <label className={styles.field}>
        Перевод:
        <input
          type="text"
          name="russian"
          value={newWord.russian}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </label>

      <label className={styles.field}>
        Тема:
        <input
          type="text"
          name="tags"
          value={newWord.tags}
          onChange={handleChange}
          className={styles.input}
        />
      </label>

      <button
        type="submit"
        disabled={addMutation.isLoading}
        className={styles.button}
      >
        {addMutation.isLoading ? 'Добавляю…' : 'Добавить'}
      </button>

      {success && (
        <p className={styles.success}>✅ Слово успешно добавлено!</p>
      )}
      {error && (
        <p className={styles.error}>❌ {error}</p>
      )}
    </form>
  );
}
