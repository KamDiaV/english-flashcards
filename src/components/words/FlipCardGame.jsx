import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence }     from 'framer-motion'
import { useQueryClient }              from '@tanstack/react-query'
import { useProgress }                 from '../../hooks/useProgress'
import WordCard                        from './WordCard'
import styles                          from './FlipCardGame.module.scss'

export default function FlipCardGame({ words }) {
  const [idx, setIdx]           = useState(0)     
  const [direction, setDirection] = useState(1)   
  const [marked, setMarked]     = useState(false) 

  const qc = useQueryClient()

  const safeIndex =
    Array.isArray(words) && words.length > 0 ? Math.min(idx, words.length - 1) : 0

  const currentWord =
    Array.isArray(words) && words.length > 0
      ? words[safeIndex]
      : { id: null, english: '', transcription: '', russian: '' }

  const [, saveProgress] = useProgress(currentWord.id ?? '')

  const goPrev = useCallback(() => {
    if (!Array.isArray(words) || words.length === 0) return
    if (safeIndex === 0) return
    setDirection(-1)
    setIdx(i => i - 1)
  }, [safeIndex, words])

  const goNext = useCallback(() => {
    if (!Array.isArray(words) || words.length === 0) return
    if (safeIndex === words.length - 1) return
    setDirection(1)
    setIdx(i => i + 1)
  }, [safeIndex, words])

  function handleMarkKnown() {
    saveProgress({ knownByUser: true })
    qc.invalidateQueries(['trainWords'])
    qc.invalidateQueries(['vocabWords'])
    setMarked(true)
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

  function handleAnimationComplete(definition) {
    if (marked && definition === 'exit') {
      setMarked(false)
      goNext()
    }
  }

  return (
    <div className={styles.container}>
      {!Array.isArray(words) || words.length === 0 ? (
        <p className={styles.status}>Нет слов для тренировки.</p>
      ) : (
        <>
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
                onAnimationComplete={handleAnimationComplete}
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
