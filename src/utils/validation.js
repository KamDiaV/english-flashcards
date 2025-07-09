export const ERROR_MESSAGES = {
  REQUIRED     : 'Это поле обязательно для заполнения',
  ENGLISH_WORD : 'Используйте только английские буквы, пробелы, дефисы и апострофы',
  TRANSCRIPTION: 'Используйте корректные символы транскрипции',
  RUSSIAN_WORD : 'Используйте только русские буквы, пробелы и дефисы',
  MIN_LENGTH   : min => `Минимальная длина ${min} символов`,
  MAX_LENGTH   : max => `Максимальная длина ${max} символов`,
};

const PATTERNS = {
  ENGLISH_WORD : /^[A-Za-z\s'-]+$/,
  TRANSCRIPTION: /^[a-zA-Z\u0250-\u02AF\u02C8\u02CC\u02D0\s'ːˈˌ]+$/,
  RUSSIAN_WORD : /^[А-Яа-яЁё\s-]+$/,
};

export const validators = {
  required: value =>
    value && value.trim() ? null : ERROR_MESSAGES.REQUIRED,

  englishWord: value =>
    !value || !value.trim() || PATTERNS.ENGLISH_WORD.test(value)
      ? null
      : ERROR_MESSAGES.ENGLISH_WORD,

  transcription: value => {
    if (!value || !value.trim()) return null;       
    const pure = value.replace(/\[|\]/g, '');       
    return PATTERNS.TRANSCRIPTION.test(pure)
      ? null
      : ERROR_MESSAGES.TRANSCRIPTION;
  },

  russianWord: value =>
    !value || !value.trim() || PATTERNS.RUSSIAN_WORD.test(value)
      ? null
      : ERROR_MESSAGES.RUSSIAN_WORD,

  minLength: min => value =>
    !value || !value.trim() || value.length >= min
      ? null
      : ERROR_MESSAGES.MIN_LENGTH(min),

  maxLength: max => value =>
    !value || !value.trim() || value.length <= max
      ? null
      : ERROR_MESSAGES.MAX_LENGTH(max),
};
