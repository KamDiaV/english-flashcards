import { useState, useEffect, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../../constants/queryKeys'
import { fetchMergedWords } from '../../../api/words'
import { useProgress } from '../useProgress'
import { useOptions } from './useOptions'
import { useWordNavigation } from '../useWordNavigation'

/**
 * useTestGameLogic — хук, который инкапсулирует всю логику TestGame:
 *  • загрузка allWords через React Query
 *  • навигация по тренировочным словам
 *  • подсчёт прогресса (useProgress)
 *  • формирование options и correctAnswer (useOptions)
 *  • обработка выбора варианта (handleSelect)
 *  • обработка клика по экрану (handleScreenClick)
 */
export function useTestGameLogic(words) {
  const qc = useQueryClient()

  const [celebrating, setCelebrating] = useState(false)
  const [displayedStreak, setDisplayedStreak] = useState(null)
  const [selected, setSelected] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [direction, setDirection] = useState('en-ru')

  const {
    data: allWords = [],
    isLoading: allLoading,
    isError: allError,
  } = useQuery({
    queryKey: QUERY_KEYS.WORDS_FULL,
    queryFn: fetchMergedWords,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
  })

  const { empty, safeIndex, word, currentId, next, reset } =
    useWordNavigation(words)

  useEffect(() => {
    setCelebrating(false)
    setDisplayedStreak(null)
    setSelected(null)
    setIsCorrect(null)
  }, [currentId])

  const [progress, saveProgress] = useProgress(currentId)
  const { correctStreak = 0, knownByUser = false } = progress

  const { options, correctAnswer } = useOptions(
    allWords,
    words,
    safeIndex,
    direction
  )

  const handleClearSelection = useCallback(() => {
    setSelected(null)
    setIsCorrect(null)
    setCelebrating(false)
    setDisplayedStreak(null)
  }, [])

  const invalidateTrainAndVocab = useCallback(() => {
    qc.invalidateQueries({ queryKey: QUERY_KEYS.TRAIN_WORDS })
    qc.invalidateQueries({ queryKey: QUERY_KEYS.VOCAB_WORDS })
  }, [qc])

  const handleSelect = useCallback(
    choice => {
      if (selected !== null) return
      setSelected(choice)

      const isCorrectChoice = choice.toLowerCase() === correctAnswer
      setIsCorrect(isCorrectChoice)

      const nextStreak = isCorrectChoice ? correctStreak + 1 : 0
      const update = { correctStreak: nextStreak }
      if (nextStreak >= 5) update.knownByUser = true

      saveProgress(update)

      if (isCorrectChoice && nextStreak >= 5) {
        setCelebrating(true)
        setDisplayedStreak(nextStreak)
      } else {
        invalidateTrainAndVocab()
      }
    },
    [
      selected,
      correctAnswer,
      correctStreak,
      saveProgress,
      invalidateTrainAndVocab,
    ]
  )

  const handleScreenClick = useCallback(() => {
    if (!celebrating) return
    setCelebrating(false)
    setDisplayedStreak(null)
    setSelected(null)
    setIsCorrect(null)
    invalidateTrainAndVocab()
  }, [celebrating, invalidateTrainAndVocab])

  const rawCount = displayedStreak ?? correctStreak
  const displayCount = Math.min(rawCount, 5)

  return {
    isLoading: allLoading,
    isError: allError,
    empty,
    word,
    safeIndex,
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
    handleClearSelection,
    next,
    reset,
  }
}
