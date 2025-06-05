import React, { useState } from 'react'
import styles from './WordCard.module.scss'

export default function WordCard({ english, transcription, russian }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className={styles.cardWrapper} onClick={() => setFlipped(f => !f)}>
      <div className={`${styles.card} ${flipped ? styles.isFlipped : ''}`}>
        <div className={styles.cardFront}>
          <p className={styles.english}>{english}</p>
          <p className={styles.transcription}>{transcription}</p>
        </div>
        <div className={styles.cardBack}>
          <p className={styles.translation}>{russian}</p>
        </div>
      </div>
    </div>
  )
}
