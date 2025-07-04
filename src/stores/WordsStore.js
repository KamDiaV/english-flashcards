import { makeAutoObservable, flow } from 'mobx'
import {
  fetchWordsFromServer,
  addWordOnServer,
  updateWordOnServer,
  deleteWordOnServer,
} from '../api/words'

export class WordsStore {
  words   = []
  loading = false
  error   = null

  constructor() {
    makeAutoObservable(this)
    this.loadWords()
  }

  // ------------  async actions  ------------
  loadWords = flow(function* () {
    this.loading = true; this.error = null
    try {
      const data = yield fetchWordsFromServer()
      this.words = data
    } catch (e) {
      this.error = e.message || 'Ошибка при загрузке слов'
    } finally {
      this.loading = false
    }
  })

  addWord = flow(function* (word) {
    this.loading = true
    try {
      const newWord = yield addWordOnServer(word)
      this.words.push(newWord)
    } catch (e) {
      this.error = e.message
    } finally {
      this.loading = false
    }
  })

  updateWord = flow(function* (word) {
    this.loading = true
    try {
      const upd = yield updateWordOnServer(word)
      const idx = this.words.findIndex(w => w.id === upd.id)
      if (idx !== -1) this.words[idx] = upd
    } catch (e) {
      this.error = e.message
    } finally {
      this.loading = false
    }
  })

  deleteWord = flow(function* (id) {
    this.loading = true
    try {
      yield deleteWordOnServer(id)
      this.words = this.words.filter(w => w.id !== id)
    } catch (e) {
      this.error = e.message
    } finally {
      this.loading = false
    }
  })
}

export const wordsStore = new WordsStore()
