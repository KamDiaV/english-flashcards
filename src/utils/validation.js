export const ERROR_MESSAGES = {
  REQUIRED: 'Это поле обязательно для заполнения',
  ENGLISH_WORD: 'Используйте только английские буквы, пробелы, дефисы и апострофы',
  TRANSCRIPTION: 'Используйте корректные символы транскрипции',
  RUSSIAN_WORD: 'Используйте только русские буквы, пробелы и дефисы',
  MIN_LENGTH: min  => `Минимальная длина ${min} символов`,
  MAX_LENGTH: max  => `Максимальная длина ${max} символов`,
}

const PATTERNS = {
  ENGLISH_WORD:  /^[A-Za-z\s'-]+$/,
  TRANSCRIPTION: /^[a-zəʌɔːæ…\s]+$/i,
  RUSSIAN_WORD:  /^[А-Яа-яЁё\s-]+$/,
}

export const validators = {
  required: value => value?.trim() ? null : ERROR_MESSAGES.REQUIRED,

  englishWord: value =>
    !value?.trim() ? null
      : PATTERNS.ENGLISH_WORD.test(value)
      ? null
      : ERROR_MESSAGES.ENGLISH_WORD,

  transcription: value =>
    !value?.trim() ? null
      : PATTERNS.TRANSCRIPTION.test(value.replace(/[[\]]/g, ''))
      ? null
      : ERROR_MESSAGES.TRANSCRIPTION,

  russianWord: value =>
    !value?.trim() ? null
      : PATTERNS.RUSSIAN_WORD.test(value)
      ? null
      : ERROR_MESSAGES.RUSSIAN_WORD,

  minLength: min => value =>
    !value?.trim() ? null
      : value.length >= min
      ? null
      : ERROR_MESSAGES.MIN_LENGTH(min),

  maxLength: max => value =>
    !value?.trim() ? null
      : value.length <= max
      ? null
      : ERROR_MESSAGES.MAX_LENGTH(max),
}
