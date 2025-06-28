import axios from 'axios'
import { getFromStorage, setToStorage } from '../utils/storage'

const API_URL = process.env.REACT_APP_API_URL

export const STORAGE_KEY_ADDED   = 'addedWords'
export const STORAGE_KEY_DELETED = 'deletedWords'

export function fetchWordsFromServer() {
  return axios.get(`${API_URL}/words`).then(res => res.data)
}
export function addWordOnServer(word) {
  return axios.post(`${API_URL}/words`, word).then(res => res.data)
}
export function updateWordOnServer(word) {
  return axios.put(`${API_URL}/words/${word.id}`, word).then(res => res.data)
}
export function deleteWordOnServer(id) {
  return axios.delete(`${API_URL}/words/${id}`)
}

/**
 * Обёртка: POST + локальное сохранение
 */
export async function addWord(word) {
  const data = await addWordOnServer(word)
  const id   = typeof data.id === 'number' ? data.id : `local-${Date.now()}`
  const entry = { id, ...word }

  const added = getFromStorage(STORAGE_KEY_ADDED)
  setToStorage(STORAGE_KEY_ADDED, [...added, entry])

  return entry
}

/**
 * Обёртка: PUT + локальная синхронизация
 */
export async function updateWord(word) {
  const data = await updateWordOnServer(word)
  const id   = typeof data.id === 'number' ? data.id : word.id
  const entry = { id, ...word }

  const added = getFromStorage(STORAGE_KEY_ADDED)
    .filter(w => String(w.id) !== String(id))
  setToStorage(STORAGE_KEY_ADDED, [...added, entry])

  return entry
}

/**
 * Обёртка: DELETE + учёт удалённых
 */
export async function deleteWord(id) {
  if (!String(id).startsWith('local-')) {
    await deleteWordOnServer(id)
  }

  const added = getFromStorage(STORAGE_KEY_ADDED)
    .filter(w => String(w.id) !== String(id))
  setToStorage(STORAGE_KEY_ADDED, added)

  const deleted = getFromStorage(STORAGE_KEY_DELETED)
  if (!deleted.includes(String(id))) {
    setToStorage(STORAGE_KEY_DELETED, [...deleted, String(id)])
  }

  return id
}

/**
 * Получить «слитые» слова:
 * — серверные без удалённых
 * — заменённые локальными
 * — добавленные локально
 */
export async function fetchMergedWords() {
  const serverWords = await fetchWordsFromServer()
  const deleted     = getFromStorage(STORAGE_KEY_DELETED)
  const added       = getFromStorage(STORAGE_KEY_ADDED)

  const filtered = serverWords.filter(w => !deleted.includes(String(w.id)))
  const merged   = filtered.map(w =>
    added.find(a => String(a.id) === String(w.id)) || w
  )
  const extras   = added.filter(a =>
    !filtered.find(w => String(w.id) === String(a.id))
  )

  return [...merged, ...extras]
}
