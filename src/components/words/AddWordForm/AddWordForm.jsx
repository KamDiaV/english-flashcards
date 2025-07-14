import React, { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { addWord } from '../../../api/words';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useForm } from '../../../hooks/base/useForm';
import { useValidation } from '../../../hooks/words/useValidation';
import styles from './AddWordForm.module.scss';

const FIELDS = {
  english:       { label: 'Слово (англ.)', rules: ['required', 'englishWord'] },
  transcription: { label: 'Транскрипция',  rules: ['required', 'transcription'] },
  russian:       { label: 'Перевод',       rules: ['required', 'russianWord'] },
  tags:          { label: 'Тема',          rules: [] },
};

export default function AddWordForm() {
  const qc = useQueryClient();

  const [newWord, handleChange, resetForm] = useForm(
    Object.keys(FIELDS).reduce((a, k) => ({ ...a, [k]: '' }), {})
  );
  const { errors, validateForm } = useValidation(FIELDS, newWord);

  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');
  const [touched, setTouched] = useState(false);

  const mutation = useMutation({
    mutationFn: addWord,

    onMutate: async (word) => {
      await qc.cancelQueries({ queryKey: QUERY_KEYS.WORDS_FULL });

      const prev = qc.getQueryData(QUERY_KEYS.WORDS_FULL) ?? [];
      const temp = { ...word, id: Date.now(), __temp: true };
      qc.setQueryData(QUERY_KEYS.WORDS_FULL, [...prev, temp]);

      return { prev, tempId: temp.id };
    },

    onError: (_err, _word, ctx) => {
      ctx?.prev && qc.setQueryData(QUERY_KEYS.WORDS_FULL, ctx.prev);
      setError('Не удалось добавить слово');
    },

    onSuccess: (_saved, _word, ctx) => {
      qc.setQueryData(QUERY_KEYS.WORDS_FULL, (old = []) =>
        old.filter(w => w.id !== ctx?.tempId)
      );
      setSuccess(true);
      resetForm();
      setTouched(false);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.WORDS_FULL });
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    if (!validateForm()) {
      setTouched(true);
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    mutation.mutate(newWord);
  };

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      {Object.entries(FIELDS).map(([name, { label, rules }]) => {
        const required  = rules.includes('required');
        const showError = touched && errors[name];

        return (
          <label key={name} className={styles.field}>
            <span className={styles.caption}>
              {label}
              {required && <span className={styles.asterisk}>*</span>}:
            </span>

            <input
              name={name}
              value={newWord[name]}
              onChange={handleChange}
              className={`${styles.input} ${showError ? styles.errorInput : ''}`}
            />

            {showError && <span className={styles.errorNote}>{errors[name]}</span>}
          </label>
        );
      })}

      <button
        type="submit"
        disabled={mutation.isPending}
        className={`${styles.button} ${
          Object.keys(errors).length ? styles.buttonInactive : ''
        }`}
      >
        {mutation.isPending ? 'Добавляю…' : 'Добавить'}
      </button>

      {success && <p className={styles.success}>✅ Добавлено!</p>}
      {error   && <p className={styles.error}>❌ {error}</p>}
    </form>
  );
}
