import React, { createContext, useState, useEffect } from 'react'
import {
  fetchWordsFromServer,
  addWordOnServer,
  updateWordOnServer,
  deleteWordOnServer
} from '../api/words'

export const WordsContext = createContext()

export function WordsProvider({ children }) {
  const [words, setWords]     = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    loadWords()
  }, [])

  async function loadWords() {
    setLoading(true); setError(null)
    try {
      const data = await fetchWordsFromServer()
      setWords(data)
    } catch (e) {
      setError(e.message || 'Ошибка при загрузке слов')
    } finally {
      setLoading(false)
    }
  }

  async function addWord(word) {
    setLoading(true)
    try {
      const newWord = await addWordOnServer(word)
      setWords(prev => [...prev, newWord])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateWord(word) {
    setLoading(true)
    try {
      const upd = await updateWordOnServer(word)
      setWords(prev => prev.map(w => w.id === upd.id ? upd : w))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteWord(id) {
    setLoading(true)
    try {
      await deleteWordOnServer(id)
      setWords(prev => prev.filter(w => w.id !== id))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <WordsContext.Provider value={{
      words, loading, error,
      loadWords, addWord, updateWord, deleteWord
    }}>
      {children}
    </WordsContext.Provider>
  )
}
