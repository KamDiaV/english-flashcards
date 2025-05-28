import React, { useState, useEffect, useCallback } from 'react'
import WordCard from './WordCard'
import styles from './FlipCardGame.module.scss'

export default function FlipCardGame({ words }) {
  const [idx, setIdx] = useState(0)

  const goPrev = useCallback(() => {
    setIdx(i => Math.max(i - 1, 0))
  }, [])

  const goNext = useCallback(() => {
    setIdx(i => Math.min(i + 1, words.length - 1))
  }, [words.length])

  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goPrev, goNext])

  const hasWords  = Array.isArray(words) && words.length > 0
  const safeIndex = hasWords ? Math.min(idx, words.length - 1) : 0
  const word = hasWords
    ? words[safeIndex]
    : { id: null, english: '', transcription: '', russian: '' }

  if (!hasWords) {
    return <p className={styles.status}>Нет слов для тренировки.</p>
  }

  const isFirst = safeIndex === 0
  const isLast  = safeIndex === words.length - 1

  return (
    <div className={styles.container}>
      <div className={styles.cardWrapper}>
        <WordCard
          key={word.id}
          wordId={word.id}
          english={word.english}
          transcription={word.transcription}
          russian={word.russian}
        />
      </div>

      <div className={styles.controls}>
        <button onClick={goPrev} disabled={isFirst}> ← </button>
        <button onClick={goNext} disabled={isLast}> → </button>
      </div>
    </div>
  )
}
