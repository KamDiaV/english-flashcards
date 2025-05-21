import React from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import WordRow from './WordRow';
import styles from './WordList.module.scss';

const STORAGE_KEY = 'addedWords';

// Сначала получаем данные из API, затем "накладываем" изменения из localStorage
const fetchWords = async () => {
  const { data: serverWords } = await axios.get('http://itgirlschool.justmakeit.ru/api/words');
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  const merged = serverWords.map(w =>
    stored.find(s => s.id === w.id) || w
  );
  const extras = stored.filter(s => !serverWords.find(w => w.id === s.id));

  return [...merged, ...extras];
};

export default function WordList() {
  const queryClient = useQueryClient();
  const { data: words = [], isLoading } = useQuery({
    queryKey: ['words'],
    queryFn: fetchWords,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // DELETE mutation: удаляем и на сервере, и из localStorage + из кэша
  const deleteMutation = useMutation({
    mutationFn: async id => {
      if (typeof id === 'string') {
        await axios.delete(`http://itgirlschool.justmakeit.ru/api/words/${id}`);
      }
      return id;
    },
    onSuccess: id => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        .filter(w => w.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

      queryClient.setQueryData(['words'], old => old.filter(w => w.id !== id));
    }
  });

  // PUT mutation: обновляем и на сервере, и в localStorage + кэше
  const updateMutation = useMutation({
    mutationFn: async word => {
      if (typeof word.id === 'string') {
        await axios.put(`http://itgirlschool.justmakeit.ru/api/words/${word.id}`, word);
      }
      return word;
    },
    onSuccess: updated => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        .filter(w => w.id !== updated.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...stored, updated]));

      queryClient.setQueryData(['words'], old =>
        old.map(w => (w.id === updated.id ? updated : w))
      );
    }
  });

  const handleDelete = id => deleteMutation.mutate(id);
  const handleSave   = word => updateMutation.mutate(word);

  if (isLoading) {
    return <p className={styles.loading}>Загрузка слов…</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Слово</th>
          <th>Транскрипция</th>
          <th>Перевод</th>
          <th>Тема</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {words.map(word => (
          <WordRow
            key={word.id}
            word={word}
            onDelete={() => handleDelete(word.id)}
            onSave={handleSave}
          />
        ))}
      </tbody>
    </table>
  );
}
