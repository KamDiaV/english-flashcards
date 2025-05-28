import { useState, useEffect } from 'react'

const STORAGE_KEY = 'vocabProgress'
const DEFAULT = { correctStreak: 0, knownByUser: false }

/**
 * Хук хранит для каждого wordId:
 *  - correctStreak: сколько раз подряд угадано в тесте
 *  - knownByUser
 *
 * Возвращает [state, saveProgress, resetProgress]
 */
export function useProgress(wordId) {
  const [state, setState] = useState(DEFAULT)

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    setState(all[wordId] || DEFAULT)
  }, [wordId])

  const saveProgress = updates => {
    setState(prev => {
      const next = { ...prev, ...updates }
      const all  = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      all[wordId] = next
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
      return next
    })
  }

  const resetProgress = () => {
    setState(DEFAULT)
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    delete all[wordId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  }

  return [state, saveProgress, resetProgress]
}
