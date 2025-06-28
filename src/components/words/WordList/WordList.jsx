import React, { useContext } from 'react'
import { WordsContext } from '../../../context/WordsContext'
import WordRow from '../WordRow/WordRow'
import Spinner from '../../Spinner/Spinner'
import ErrorDisplay from '../../ErrorBoundary/ErrorBoundary'
import styles from './WordList.module.scss'

export default function WordList() {
  const {
    words = [],
    loading,
    error,
    updateWord,
    deleteWord
  } = useContext(WordsContext)

  if (loading) {
    return <Spinner />
  }
  if (error) {
    return <ErrorDisplay message={error} />
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
            onSave={upd => updateWord(upd)}
          />
        ))}
      </tbody>
    </table>
  )
}
