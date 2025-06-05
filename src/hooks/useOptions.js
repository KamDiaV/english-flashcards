import { useMemo } from 'react'
import shuffle from '../utils/shuffle'

/**
 * useOptions — хук, который по входным данным (список всех слов, текущее слово, направление)
 * возвращает:
 *   - options: массив строк (перемешанные варианты, включая правильный)
 *   - correctAnswer: строка — правильный вариант (в нижнем регистре, готовая для сравнения)
 *
 * @param {Array} allWords   — полный массив вопросов/слов (каждый элемент { id, english, russian, … })
 * @param {Object|null} word — объект текущего слова (или null)
 * @param {String} direction — 'en-ru' или 'ru-en'
 * @returns {{ options: string[], correctAnswer: string|null }}
 */

export function useOptions(allWords, word, direction) {
  return useMemo(() => {
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
  }, [allWords, word, direction])
}
