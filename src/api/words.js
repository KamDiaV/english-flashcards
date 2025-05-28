import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const STORAGE_KEY_ADDED   = 'addedWords'
export const STORAGE_KEY_DELETED = 'deletedWords'

/**
 * Получаем данные с сервера (без учёта локальных изменений)
 */
export function fetchWordsFromServer() {
  return axios
    .get(`${API_URL}/words`)
    .then(res => res.data)
}

/**
 * Добавляем новое слово
 */
export function addWordOnServer(word) {
  return axios
    .post(`${API_URL}/words`, word)
    .then(res => res.data)
}

/**
 * Обновляем слово на сервере
 */
export function updateWordOnServer(word) {
  return axios
    .put(`${API_URL}/words/${word.id}`, word)
    .then(res => res.data)
}

/**
 * Удаляем слово на сервере
 */
export function deleteWordOnServer(id) {
  return axios.delete(`${API_URL}/words/${id}`)
}

/**
 * Обёртка: POST + локальное сохранение
 */
export async function addWord(word) {
  const data = await addWordOnServer(word)
  const id = typeof data.id === 'number' ? data.id : `local-${Date.now()}`

  const entry = {
    id,
    english: word.english,
    transcription: word.transcription,
    russian: word.russian,
    tags: word.tags
  }

  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_ADDED) || '[]')
  localStorage.setItem(
    STORAGE_KEY_ADDED,
    JSON.stringify([...stored, entry])
  )

  return entry
}

/**
 * Обёртка: PUT + локальная синхронизация (для редактирования локальных слов)
 */
export async function updateWord(word) {
  const data = await updateWordOnServer(word)
  const id = typeof data.id === 'number' ? data.id : word.id

  const entry = {
    id,
    english:      word.english,
    transcription: word.transcription,
    russian:      word.russian,
    tags:         word.tags
  }

  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_ADDED) || '[]')
    .filter(w => String(w.id) !== String(id))
  localStorage.setItem(
    STORAGE_KEY_ADDED,
    JSON.stringify([...stored, entry])
  )

  return entry
}

/**
 * Обёртка: DELETE + пометка в deletedWords
 */
export async function deleteWord(id) {
  if (!String(id).startsWith('local-')) {
    await deleteWordOnServer(id)
  }

  const added = JSON.parse(localStorage.getItem(STORAGE_KEY_ADDED) || '[]')
    .filter(w => String(w.id) !== String(id))
  localStorage.setItem(
    STORAGE_KEY_ADDED,
    JSON.stringify(added)
  )

  const deleted = JSON.parse(localStorage.getItem(STORAGE_KEY_DELETED) || '[]')
  if (!deleted.includes(String(id))) {
    deleted.push(String(id))
    localStorage.setItem(
      STORAGE_KEY_DELETED,
      JSON.stringify(deleted)
    )
  }

  return id
}

/**
 * Получить слова серверные и локальные:
 *  1) Фетчим с сервера
 *  2) Отрезаем удалённые (deletedWords)
 *  3) Заменяем серверные на локальные правки (addedWords)
 *  4) Добавляем полностью новые из addedWords
 */
export async function fetchMergedWords() {
  const serverWords = await fetchWordsFromServer()
  const deleted = JSON.parse(localStorage.getItem(STORAGE_KEY_DELETED) || '[]')
  const added = JSON.parse(localStorage.getItem(STORAGE_KEY_ADDED) || '[]')

  const filtered = serverWords.filter(w => !deleted.includes(String(w.id)))

  const merged = filtered.map(w =>
    added.find(a => String(a.id) === String(w.id)) || w
  )

  const extras = added.filter(a =>
    !filtered.find(w => String(w.id) === String(a.id))
  )

  return [...merged, ...extras]
}
