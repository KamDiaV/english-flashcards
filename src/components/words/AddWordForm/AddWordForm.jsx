import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addWord } from '../../../api/words'
import { QUERY_KEYS } from '../../../constants/queryKeys'
import { useForm } from '../../../hooks/base/useForm'
import { useValidation } from '../../../hooks/words/useValidation'
import styles from './AddWordForm.module.scss'

const FIELDS = {
  english: { label: 'Слово (англ.)', rules: ['required', 'englishWord'] },
  transcription: { label: 'Транскрипция', rules: ['required', 'transcription'] },
  russian: { label: 'Перевод', rules: ['required', 'russianWord'] },
  tags: { label: 'Тема', rules: [] },
}

export default function AddWordForm() {
  const qc = useQueryClient()

  const [newWord, handleChange, resetForm] = useForm(
    Object.keys(FIELDS).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
  )

  const { errors, validateForm } = useValidation(FIELDS, newWord)

  const [success, setSuccess] = React.useState(false)
  const [error,   setError]   = React.useState('')
  const [touched, setTouched] = React.useState(false)

  const mutation = useMutation({
    mutationFn: addWord,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.WORDS_FULL })
      setSuccess(true)
      resetForm()
      setTouched(false)
    },
    onError: () => setError('Не удалось добавить слово'),
  })

  const onSubmit = e => {
    e.preventDefault()
    setSuccess(false)
    setError('')

    const isValid = validateForm()
    if (!isValid) {
      setTouched(true)
      setError('Пожалуйста, заполните все обязательные поля')
      return
    }

    mutation.mutate(newWord)
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      {Object.entries(FIELDS).map(([name, { label, rules }]) => {
        const isRequired = rules.includes('required')
        const showError  = touched && errors[name]

        return (
          <label key={name} className={styles.field}>
            <span className={styles.caption}>
              {label}
              {isRequired && <span className={styles.asterisk}>*</span>}:
            </span>

            <input
              name={name}
              value={newWord[name]}
              onChange={handleChange}
              className={`${styles.input} ${showError ? styles.errorInput : ''}`}
            />

            {showError && (
              <span className={styles.errorNote}>{errors[name]}</span>
            )}
          </label>
        )
      })}

      <button
        type="submit"
        disabled={mutation.isPending}
        className={`${styles.button} ${Object.keys(errors).length ? styles.buttonInactive : ''}`}
      >
        {mutation.isPending ? 'Добавляю…' : 'Добавить'}
      </button>

      {success && <p className={styles.success}>✅ Добавлено!</p>}
      {error   && <p className={styles.error}>❌ {error}</p>}
    </form>
  )
}
