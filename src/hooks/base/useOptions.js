import { useMemo } from 'react'
import shuffle from '../../utils/shuffle'

export function useOptions(allWords, words, safeIndex, direction) {
  return useMemo(() => {
    if (
      !Array.isArray(words) ||
      words.length === 0 ||
      safeIndex < 0 ||
      safeIndex >= words.length
    )
      return { options: [], correctAnswer: null }

    const word = words[safeIndex]
    if (!word || !Array.isArray(allWords) || allWords.length === 0)
      return { options: [], correctAnswer: null }

    const correctVal =
      direction === 'en-ru' ? word.russian : word.english
    const correctLower = correctVal.toLowerCase()

    const pool = allWords
      .filter(w => w.id !== word.id)
      .map(w => (direction === 'en-ru' ? w.russian : w.english))
      .filter(t => t && t.toLowerCase() !== correctLower) 

    const distractors = shuffle([...new Set(pool)]).slice(0, 3)

    let options = shuffle([correctVal, ...distractors])

    options = [...new Set(options)].slice(0, 4)

    return {
      options,
      correctAnswer: correctLower,
    }
  }, [allWords, words, safeIndex, direction])
}
