import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../../constants/queryKeys'
import { fetchMergedWords } from '../../../api/words'
import { useWordMutations } from '../../../hooks/words/useWordMutations'
import WordRow from '../WordRow/WordRow'
import Spinner from '../../Spinner/Spinner'
import styles from './WordList.module.scss'

export default function WordList() {
  const { deleteWord, updateWord } = useWordMutations()

  const { data: words = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.WORDS_FULL,
    queryFn: fetchMergedWords,
    staleTime: 300_000,
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return <Spinner />
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
