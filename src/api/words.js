import axios from 'axios';
import { getFromStorage, setToStorage } from '../utils/storage';

const API_URL = process.env.REACT_APP_API_URL;

export const STORAGE_KEY_ADDED   = 'addedWords';
export const STORAGE_KEY_DELETED = 'deletedWords';

export const fetchWordsFromServer  = () =>
  axios.get(`${API_URL}/words`).then(r => r.data);

export const addWordOnServer       = (word) =>
  axios.post(`${API_URL}/words`, word).then(r => r.data);

export const updateWordOnServer    = (word) =>
  axios.put(`${API_URL}/words/${word.id}`, word).then(r => r.data);

export const deleteWordOnServer    = (id) =>
  axios.delete(`${API_URL}/words/${id}`);

/* ────────────── ADD (он-/офлайн) ────────────── */
export async function addWord(word) {
  try {
    const data = await addWordOnServer(word);       

    if (data?.id != null) {
      const withoutDup = getFromStorage(STORAGE_KEY_ADDED)
        .filter(w => String(w.english).toLowerCase() !== word.english.toLowerCase());
      setToStorage(STORAGE_KEY_ADDED, withoutDup);
      return data;         
    }
  } catch (_) {
  }

  const entry  = { id: `local-${Date.now()}`, ...word };
  const added  = getFromStorage(STORAGE_KEY_ADDED);
  setToStorage(STORAGE_KEY_ADDED, [...added, entry]);
  return entry;
}

/* ────────────── UPDATE ────────────── */
export async function updateWord(word) {
  const data  = await updateWordOnServer(word);
  const id    = typeof data.id === 'number' ? data.id : word.id;
  const entry = { id, ...word };

  const merged = getFromStorage(STORAGE_KEY_ADDED)
    .filter(w => String(w.id) !== String(id));
  setToStorage(STORAGE_KEY_ADDED, [...merged, entry]);
  return entry;
}

/* ────────────── DELETE ────────────── */
export async function deleteWord(id) {
  if (!String(id).startsWith('local-')) {
    await deleteWordOnServer(id);
  }

  const kept   = getFromStorage(STORAGE_KEY_ADDED)
    .filter(w => String(w.id) !== String(id));
  setToStorage(STORAGE_KEY_ADDED, kept);

  const deleted = getFromStorage(STORAGE_KEY_DELETED);
  if (!deleted.includes(String(id))) {
    setToStorage(STORAGE_KEY_DELETED, [...deleted, String(id)]);
  }
  return id;
}

/* ────────────── MERGED LIST ────────────── */
export async function fetchMergedWords() {
  const server = await fetchWordsFromServer();
  const deleted = getFromStorage(STORAGE_KEY_DELETED);
  const added   = getFromStorage(STORAGE_KEY_ADDED);

  const filtered = server.filter(w => !deleted.includes(String(w.id)));
  const merged   = filtered.map(w =>
    added.find(a => String(a.id) === String(w.id)) || w
  );
  const extras = added.filter(a =>
    !filtered.find(w => String(w.id) === String(a.id))
  );
  return [...merged, ...extras];
}
