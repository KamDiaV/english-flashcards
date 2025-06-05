/**
 * Простая функция для случайного перемешивания массива
 * @param {Array} arr — входной массив
 * @returns {Array} — новый массив с теми же элементами, но в случайном порядке
 */

export default function shuffle(arr) {
  return arr
    .map(v => ({ sort: Math.random(), value: v }))
    .sort((a, b) => a.sort - b.sort)
    .map(o => o.value)
}
