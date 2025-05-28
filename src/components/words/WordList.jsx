import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchMergedWords } from '../../api/words'
import { useWordMutations } from '../../hooks/useWordMutations'
import WordRow from './WordRow'
import styles  from './WordList.module.scss'

export default function WordList() {
  const { deleteWord, updateWord } = useWordMutations()
  const { data: words = [], isLoading } = useQuery(
    ['words'],
    fetchMergedWords,
    { staleTime: 300_000, refetchOnWindowFocus: false }
  )

  if (isLoading) {
    return <p className={styles.loading}>Загрузка слов…</p>
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
        {words.map(w => (
          <WordRow
            key={w.id}
            word={w}
            onDelete={() => deleteWord(w.id)}
            onSave={updated => updateWord(updated)}
          />
        ))}
      </tbody>
    </table>
  )
}
