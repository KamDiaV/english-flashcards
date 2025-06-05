import { useState, useEffect } from 'react'

/**
 * useWordNavigation — хук, который хранит текущий индекс, 
 * вычисляет безопасный индекс и текущее слово, а также даёт функции
 * для перехода к следующему и сброса навигации.
 *
 * @param {Array} words — массив слов (каждый элемент {id, english, russian, …})
 * @returns {{
 *   safeIndex: number,   // индекс, не выходящий за границы массива
 *   word: object|null,   // текущее слово или null
 *   currentId: number|null, // id текущего слова
 *   next: () => void,    // функция «следующее слово»
 *   reset: () => void    // функция «начать сначала»
 * }}
 */

export function useWordNavigation(words) {
  const [index, setIndex] = useState(0)

  const empty = !Array.isArray(words) || words.length === 0
  const safeIndex = empty ? 0 : Math.min(index, words.length - 1)
  const word = empty ? null : words[safeIndex]
  const currentId = word?.id ?? null

  useEffect(() => {
    setIndex(0)
  }, [words])

  const next = () => {
    if (empty) return
    setIndex(prev => {
      return prev < words.length - 1 ? prev + 1 : prev
    })
  }

  const reset = () => {
    setIndex(0)
  }

  return { safeIndex, word, currentId, next, reset, empty }
}
