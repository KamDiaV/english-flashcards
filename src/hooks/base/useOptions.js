import { useMemo } from 'react'
import shuffle from '../../utils/shuffle'

/**
 * useOptions — принимает:
 *   - allWords: полный массив слов (в том числе не только тренировочных)
 *   - words:   массив текущих «тренировочных» слов (откуда берётся слово по safeIndex)
 *   - safeIndex: индекс текущего слова в массиве words
 *   - direction: 'en-ru' или 'ru-en'
 *
 * Возвращает:
 *   - options: массив из 4 вариантов (правильный + 3 «отвлекающих»), уже случайно перемешанный
 *   - correctAnswer: правильное значение (низкий регистр, для простого сравнения)
 */

export function useOptions(allWords, words, safeIndex, direction) {
  return useMemo(() => {
    if (
      !Array.isArray(words) ||
      words.length === 0 ||
      safeIndex < 0 ||
      safeIndex >= words.length
    ) {
      return { options: [], correctAnswer: null }
    }

    const word = words[safeIndex]
    if (!word || !Array.isArray(allWords) || allWords.length === 0) {
      return { options: [], correctAnswer: null }
    }

    const pool = allWords
      .filter(w => w.id !== word.id)
      .map(w => (direction === 'en-ru' ? w.russian : w.english))

    const distractors = shuffle(pool).slice(0, 3)

    const correctVal = direction === 'en-ru' ? word.russian : word.english

    const options = shuffle([correctVal, ...distractors])

    return {
      options,
      correctAnswer: correctVal.toLowerCase(),
    }
  }, [allWords, words, safeIndex, direction])
}