import React, { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchMergedWords } from '../../../api/words'
import { useProgress } from '../../../hooks/useProgress'
import { useOptions } from '../../../hooks/useOptions'
import { useWordNavigation } from '../../../hooks/useWordNavigation'
import Spinner from '../../Spinner/Spinner'
import styles from './TestGame.module.scss'

export default function TestGame({ words }) {
  const qc = useQueryClient()

  const [celebrating, setCelebrating] = useState(false)
  const [displayedStreak, setDisplayedStreak] = useState(null)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [direction, setDirection] = useState('en-ru')

  const {
    data: allWords = [],
    isLoading: allLoading,
    isError: allError,
  } = useQuery(['wordsFull'],fetchMergedWords,{
      refetchOnWindowFocus: false,
      staleTime: 5 * 60_000,
    }
  )

  const { empty, safeIndex, word, currentId, next, reset } = useWordNavigation(words)

  useEffect(() => {
    setCelebrating(false)
    setDisplayedStreak(null)
    setSelected(null)
    setIsCorrect(null)
    }, [currentId])

  const [progress, saveProgress] = useProgress(currentId)
  const { correctStreak = 0, knownByUser = false } = progress

  const { options, correctAnswer } = useOptions(allWords, word, direction)

  if (allLoading) {
    return <Spinner />
  }
  if (allError) {
    return <p className={styles.status}>Ошибка загрузки вариантов</p>
  }
  if (empty || (knownByUser && !celebrating)) {
    return <Spinner />
  }

  const handleSelect = choice => {
    if (selected !== null) return
    setSelected(choice)
    const ok = choice.toLowerCase() === correctAnswer
    setIsCorrect(ok)

    const nextStreak = ok ? correctStreak + 1 : 0
    const update = { correctStreak: nextStreak }
    if (nextStreak >= 5) update.knownByUser = true

    saveProgress(update)

    if (ok && nextStreak >= 5) {
      setCelebrating(true)
      setDisplayedStreak(nextStreak)
    } else {
      qc.invalidateQueries(['trainWords'])
      qc.invalidateQueries(['vocabWords'])
    }
  }

  const handleScreenClick = () => {
    if (!celebrating) return
    setCelebrating(false)
    setDisplayedStreak(null)
    setSelected(null)
    setIsCorrect(null)
    qc.invalidateQueries(['trainWords'])
    qc.invalidateQueries(['vocabWords'])
  }

  const rawCount = displayedStreak ?? correctStreak
  const displayCount = Math.min(rawCount, 5)

  return (
    <div className={styles.container} onClick={handleScreenClick}>
      <div className={styles.toggle}>
        <button
          className={direction === 'en-ru' ? styles.active : ''}
          onClick={() => setDirection('en-ru')}
        >
          Англ → Рус
        </button>
        <button
          className={direction === 'ru-en' ? styles.active : ''}
          onClick={() => setDirection('ru-en')}
        >
          Рус → Англ
        </button>
      </div>

      <p className={styles.prompt}>
        {direction === 'en-ru' ? word.english : word.russian}
      </p>

      <div className={styles.progress}>
        <progress value={displayCount} max={5} />
        <span>{displayCount}/5</span>
      </div>

      <div className={styles.options}>
        {options.map(opt => (
          <button
            key={opt}
            disabled={selected !== null || celebrating}
            onClick={e => {
              e.stopPropagation()
              handleSelect(opt)
            }}
            className={
              selected === null
                ? ''
                : opt.toLowerCase() === correctAnswer
                ? styles.correct
                : opt === selected
                ? styles.wrong
                : ''
            }
          >
            {opt}
          </button>
        ))}
      </div>

      {celebrating && (
        <div className={styles.celebration}>
          🎉🎆 Отлично! Слово выучено! 🎆🎉
        </div>
      )}

      {!celebrating && selected !== null && (
        <div className={styles.footer}>
          <p className={isCorrect ? styles.ok : styles.err}>
            {isCorrect
              ? '✅ Правильно!'
              : `❌ Неверно, ответ: ${
                  direction === 'en-ru' ? word.russian : word.english
                }`}
          </p>

          <button
            onClick={next}
            disabled={safeIndex === words.length - 1}
            className={styles.nextButton}
          >
            Следующее →
          </button>

          {safeIndex === words.length - 1 && (
            <button onClick={reset} className={styles.resetButton}>
              Начать сначала
            </button>
          )}
        </div>
      )}
    </div>
  )
}