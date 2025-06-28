/**
 * Утилиты для работы с localStorage
 */
export function getFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

export function setToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
