import React, { useState, useEffect } from 'react'
import { useQueryClient }            from '@tanstack/react-query'
import { useProgress }               from '../../hooks/useProgress'
import styles                        from './WordCard.module.scss'

export default function WordCard({ wordId, english, transcription, russian }) {
  const qc = useQueryClient()
  const [flipped, setFlipped] = useState(false)

  const [progress, saveProgress] = useProgress(wordId)

  const [known, setKnown] = useState(() => !!progress.knownByUser)

  useEffect(() => {
    if (progress.knownByUser) {
      setKnown(true)
    }
  }, [progress.knownByUser])

  const handleCheck = () => {
    const next = !known
    setKnown (next)
    saveProgress({ knownByUser: next })
    qc.invalidateQueries(['trainWords'])
    qc.invalidateQueries(['vocabWords'])
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardWrapper}>
        <div
          className={`${styles.card} ${flipped ? styles.isFlipped : ''}`}
          onClick={() => setFlipped(f => !f)}
        >
          <div className={styles.cardFront}>
            <p className={styles.english}>{english}</p>
            <p className={styles.transcription}>{transcription}</p>
          </div>
          <div className={styles.cardBack}>
            <p className={styles.translation}>{russian}</p>
          </div>
        </div>
      </div>

      <button
        className={`${styles.checkButton} ${known ? styles.checked : ''}`}
        onClick={handleCheck}
        title="Отметить как знаю"
        type="button"
      >
        Отметить как знаю
      </button>
    </div>
  )
}
