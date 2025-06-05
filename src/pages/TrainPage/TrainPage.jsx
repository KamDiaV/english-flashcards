import React, { useState } from 'react'
import { useQuery }        from '@tanstack/react-query'
import { Link }            from 'react-router-dom'
import { fetchMergedWords, STORAGE_KEY_DELETED } from '../../api/words'
import FlipCardGame        from '../../components/words/FlipCardGame/FlipCardGame'
import TestGame            from '../../components/words/TestGame/TestGame'
import styles              from './TrainPage.module.scss'

/**
 * Берём все слова (API + локалка),
 * отфильтровываем:
 *  — изученные (knownByUser)
 *  — удалённые (deletedWords)
 */

async function fetchTrainWords() {
  const all     = await fetchMergedWords()
  const prog    = JSON.parse(localStorage.getItem('vocabProgress') || '{}')
  const deleted = JSON.parse(localStorage.getItem(STORAGE_KEY_DELETED) || '[]')

  return all.filter(w =>
    !prog[w.id]?.knownByUser &&
    !deleted.includes(String(w.id))
  )
}

export default function TrainPage() {
  const [mode, setMode] = useState(null)

  const { data: trainWords = [], isLoading, isError } = useQuery(
    ['trainWords', mode],
    fetchTrainWords,
    {
      enabled: Boolean(mode),
      refetchOnWindowFocus: false,
      staleTime: 5 * 60_000,
    }
  )

  if (mode === null) {
    return (
      <div className={styles.page}>
        <h2 className={styles.title}>Выберите режим</h2>
        <div className={styles.selection}>
          <button className={styles.largeButton} onClick={() => setMode('flip')}>
            Переверни карточку
          </button>
          <button className={styles.largeButton} onClick={() => setMode('test')}>
            Тест
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) return <p className={styles.status}>Загрузка слов…</p>
  if (isError)   return <p className={styles.status}>Ошибка при загрузке</p>

  if (trainWords.length === 0) {
    return (
      <div className={styles.page}>
        <h2 className={styles.status}>Поздравляем, все слова выучены! 🎉</h2>
        <div className={styles.emptyActions}>
          <Link to="/vocab" className={styles.linkButton}>Мой словарный запас</Link>
          <Link to="/add"   className={styles.linkButton}>Добавить новые слова</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <button className={styles.backToMenu} onClick={() => setMode(null)}>
        ← Назад к выбору режима
      </button>
      {mode === 'flip'
        ? <FlipCardGame words={trainWords} />
        : <TestGame     words={trainWords} />
      }
    </div>
  )
}
