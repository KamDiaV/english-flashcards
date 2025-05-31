import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { useProgress } from '../../hooks/useProgress'
import WordCard from './WordCard'
import styles from './FlipCardGame.module.scss'

export default function FlipCardGame({ words }) {
  // 1. Все hook’и вызываем в самом начале, до любых условий
  const [idx, setIdx] = useState(0)             // текущий индекс слова
  const [direction, setDirection] = useState(1) // +1: влево→вправо, -1: вправо→влево
  const [marked, setMarked] = useState(false)   // запуск exit-анимации при «знаю»

  const qc = useQueryClient()

  // Универсальный safeIndex: если words пустой или idx вне диапазона, safeIndex = 0
  const safeIndex =
    Array.isArray(words) && words.length > 0
      ? Math.min(idx, words.length - 1)
      : 0

  const currentWord = Array.isArray(words) && words.length > 0
    ? words[safeIndex]
    : { id: null, english: '', transcription: '', russian: '' }

  // Теперь можно вызывать useProgress для currentWord.id
  const [saveProgress] = useProgress(currentWord.id ?? '')

  const goPrev = useCallback(() => {
    // Проверяем всё равно, чтобы safeIndex и words были корректны
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

  const handleMarkKnown = () => {
    // Сохраняем, что текущее слово «знаю»
    saveProgress({ knownByUser: true })
    qc.invalidateQueries(['trainWords'])
    qc.invalidateQueries(['vocabWords'])

    // Запускаем exit-анимацию
    setMarked(true)
  }

  // Обработка нажатий клавиш «←»/«→»
  useEffect(() => {
    const onKey = e => {
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
      // Flip-in: карточка входит из-под угла
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
      transformOrigin: dir > 0 ? 'left center' : 'right center',
    }),
    center: {
      // Состояние «после flip-in»
      rotateY: 0,
      opacity: 1,
      transformOrigin: 'center center',
      transition: { duration: 0.5 },
    },
    exit: dir => ({
      // Flip-out: карточка уезжает и исчезает
      rotateY: dir > 0 ? -90 : 90,
      opacity: 0,
      transformOrigin: dir > 0 ? 'right center' : 'left center',
      transition: { duration: 0.4 },
    }),
  }

  const handleAnimationComplete = definition => {
    // Framer Motion передаёт имя завершённого варианта:
    // если мы в marked==true и завершился «exit» — переключаем idx
    if (marked && definition === 'exit') {
      setMarked(false)
      goNext()
    }
  }

  return (
    <div className={styles.container}>
      {/*
        Вместо «раннего return» мы здесь внутри JSX проверяем,
        есть ли слова. Если нет, показываем статус.
      */}
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
            <button
              onClick={goNext}
              disabled={safeIndex === words.length - 1}
            >
              →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
