import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { useProgress } from '../../../hooks/useProgress'
import WordCard from '../WordCard/WordCard'
import styles from './FlipCardGame.module.scss'

export default function FlipCardGame({ words }) {
  const qc = useQueryClient()

  const [idx, setIdx] = useState(0)
  const [direction, setDirection] = useState(1)
  const [marked, setMarked] = useState(false)

  const [learnedCount, setLearnedCount] = useState(0)

  const safeIndex = Array.isArray(words) && words.length
    ? Math.min(idx, words.length - 1)
    : 0

  const currentWord = Array.isArray(words) && words.length
    ? words[safeIndex]
    : { id: null, english: '', transcription: '', russian: '' }

  const [progress, saveProgress] = useProgress(currentWord.id ?? '')

  const goPrev = useCallback(() => {
    if (!words?.length || safeIndex === 0) return
    setDirection(-1)
    setIdx(i => i - 1)
  }, [safeIndex, words])

  const goNext = useCallback(() => {
    if (!words?.length || safeIndex === words.length - 1) return
    setDirection(1)
    setIdx(i => i + 1)
  }, [safeIndex, words])

  function handleMarkKnown() {
    saveProgress({ knownByUser: true })
    qc.invalidateQueries(['trainWords'])
    qc.invalidateQueries(['vocabWords'])
    setMarked(true)
  
    setLearnedCount(c => c + 1)
  
    setTimeout(() => {
      setMarked(false)
      goNext()
    }, 500)
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  const variants = {
    enter: dir => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
      transformOrigin: dir > 0 ? 'left center' : 'right center',
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      transformOrigin: 'center center',
      transition: { duration: 0.5 },
    },
    exit: dir => ({
      rotateY: dir > 0 ? -90 : 90,
      opacity: 0,
      transformOrigin: dir > 0 ? 'right center' : 'left center',
      transition: { duration: 0.4 },
    }),
  }

  return (
    <div className={styles.container}>
      {!words?.length ? (
        <p className={styles.status}>Нет слов для тренировки.</p>
      ) : (
        <>
          <div className={styles.learnedCounter}>
            Выучено слов за эту тренировку: <strong>{learnedCount}</strong>
          </div>

          <div className={styles.cardWrapper}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentWord.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate={marked ? 'exit' : 'center'}
                exit="exit"
                transition={{ duration: 0.5 }}
                className={styles.cardMotion}
              >
                <WordCard
                  english={currentWord.english}
                  transcription={currentWord.transcription}
                  russian={currentWord.russian}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            className={styles.checkButton}
            onClick={handleMarkKnown}
            disabled={marked}
          >
            Отметить как знаю
          </button>

          <div className={styles.controls}>
            <button onClick={goPrev} disabled={safeIndex === 0}>
              ←
            </button>
            <button onClick={goNext} disabled={safeIndex === words.length - 1}>
              →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
