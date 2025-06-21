import React, { useState, useEffect, useRef } from 'react'
import styles from './WordCard.module.scss'

export default function WordCard({ english, transcription, russian }) {
  const [flipped, setFlipped] = useState(false)
  const iconRef = useRef(null)

  useEffect(() => {
    if (!flipped && iconRef.current) {
      iconRef.current.focus()
    }
  }, [english, transcription, flipped])

  const toggleFlip = e => {
    e.stopPropagation()
    setFlipped(f => !f)
  }

  return (
    <div
      className={styles.cardWrapper}
      onClick={() => setFlipped(f => !f)}
    >
      <div className={`${styles.card} ${flipped ? styles.isFlipped : ''}`}>
        <div className={styles.cardFront}>
          <p className={styles.english}>{english}</p>
          <p className={styles.transcription}>{transcription}</p>
          <span
            ref={iconRef}
            className={styles.flipIcon}
            onClick={toggleFlip}
            role="button"
            tabIndex={0}
            aria-label="Flip card"
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleFlip(e)
              }
            }}
          >
            🔄
          </span>
        </div>
        <div className={styles.cardBack}>
          <p className={styles.translation}>{russian}</p>
          <span
            className={styles.flipIcon}
            onClick={toggleFlip}
            role="button"
            tabIndex={0}
            aria-label="Flip card back"
          >
            🔄
          </span>
        </div>
      </div>
    </div>
  )
}
