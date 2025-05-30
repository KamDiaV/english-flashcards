// src/components/FlipCardGame/FlipCardGame.jsx

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import WordCard from './WordCard'
import styles from './FlipCardGame.module.scss'

export default function FlipCardGame({ words }) {
  const [idx, setIdx] = useState(0)
  const [direction, setDirection] = useState(1)

  const goPrev = useCallback(() => {
    setDirection(-1)
    setIdx(i => Math.max(i - 1, 0))
  }, [])

  const goNext = useCallback(() => {
    setDirection(1)
    setIdx(i => Math.min(i + 1, words.length - 1))
  }, [words.length])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  if (!Array.isArray(words) || words.length === 0) {
    return <p className={styles.status}>Нет слов для тренировки.</p>
  }

  const safeIndex = Math.min(idx, words.length - 1)
  const word = words[safeIndex]

  return (
    <div className={styles.container}>
      <div className={styles.cardWrapper}>
        <motion.div
          key={safeIndex}
          // при монтировании: стартовый поворот от левого или правого края
          initial={{
            rotateY: direction > 0 ? 90 : -90,
            opacity: 0,
            transformOrigin: direction > 0
              ? 'left center'
              : 'right center'
          }}
          animate={{
            rotateY: 0,
            opacity: 1,
            transformOrigin: 'center center'
          }}
          transition={{ duration: 0.5 }}
          className={styles.cardMotion}
        >
          <WordCard
            wordId={word.id}
            english={word.english}
            transcription={word.transcription}
            russian={word.russian}
          />
        </motion.div>
      </div>

      <div className={styles.controls}>
        <button onClick={goPrev} disabled={safeIndex === 0}>←</button>
        <button onClick={goNext} disabled={safeIndex === words.length - 1}>→</button>
      </div>
    </div>
  )
}
