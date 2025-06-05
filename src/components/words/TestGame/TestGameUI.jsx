import React from 'react'
import Spinner from '../../Spinner/Spinner'
import styles from './TestGame.module.scss'

export function TestGameUI(props) {
  const {
    isLoading,
    isError,
    empty,
    word,
    direction,
    setDirection,
    options,
    correctAnswer,
    selected,
    isCorrect,
    rawCount,
    displayCount,
    celebrating,
    handleSelect,
    handleScreenClick,
    next,
    reset,
    safeIndex,
    wordsLength,
  } = props

  if (isLoading) {
    return <Spinner />
  }
  if (isError) {
    return <p className={styles.status}>Ошибка загрузки вариантов</p>
  }
  if (empty || (props.knownByUser && !celebrating)) {
    return <Spinner />
  }

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
            disabled={safeIndex === wordsLength - 1}
            className={styles.nextButton}
          >
            Следующее →
          </button>

          {safeIndex === wordsLength - 1 && (
            <button onClick={reset} className={styles.resetButton}>
              Начать сначала
            </button>
          )}
        </div>
      )}
    </div>
  )
}