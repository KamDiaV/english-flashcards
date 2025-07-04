import { createContext, useContext } from 'react'
import { wordsStore } from './WordsStore'

export const WordsStoreContext = createContext(wordsStore)

export const useWordsStore = () => useContext(WordsStoreContext)

export { wordsStore }
