import React from 'react'
import { observer } from 'mobx-react-lite'
import { useWordsStore } from '../../../stores/WordsStoreContext'
import WordRow from '../WordRow/WordRow'
import Spinner from '../../Spinner/Spinner'
import ErrorDisplay from '../../ErrorBoundary/ErrorBoundary'
import styles from './WordList.module.scss'

const WordList = observer(() => {
  const store = useWordsStore()

  if (store.loading) {
    return <Spinner />
  }

  if (store.error) {
    return <ErrorDisplay message={store.error} />
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
        {store.words.map((w) => (
          <WordRow
            key={w.id}
            word={w}
            onDelete={() => store.deleteWord(w.id)}
            onSave={store.updateWord}
          />
        ))}
      </tbody>
    </table>
  )
})

export default WordList
