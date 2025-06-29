import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addWord } from '../../../api/words'
import { QUERY_KEYS } from '../../../constants/queryKeys'
import { useForm } from '../../../hooks/base/useForm'
import { useValidation } from '../../../hooks/words/useValidation'
import styles from './AddWordForm.module.scss'

const FIELDS = [
  { name: 'english', label: 'Слово (англ.)', required: true },
  { name: 'transcription', label: 'Транскрипция', required: true },
  { name: 'russian', label: 'Перевод', required: true },
  { name: 'tags', label: 'Тема', required: false },
]

export default function AddWordForm() {
  const qc = useQueryClient()

  const [newWord, handleChange, resetForm] = useForm({
    english: '', transcription: '', russian: '', tags: ''
  })

  const { errors, validateForm } = useValidation(FIELDS, newWord)

  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState('')
  const [showErrors, setShowErrors] = React.useState(false)

  const mutation = useMutation(addWord, {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.WORDS })
      setSuccess(true)
      resetForm()
      setShowErrors(false)
    },
    onError: () => setError('Не удалось добавить слово'),
  })

  const onSubmit = e => {
    e.preventDefault()
    setSuccess(false)
    setError('')

    const isValid = validateForm()
    if (!isValid) {
      setShowErrors(true)
      setError('Пожалуйста, заполните все обязательные поля')
      return
    }

    mutation.mutate(newWord)
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      {FIELDS.map(({ name, label, required }) => (
        <label key={name} className={styles.field}>
          {label}{!required && ' (необязательно)'}:
          <input
            name={name}
            value={newWord[name]}
            onChange={handleChange}
            className={`${styles.input} ${showErrors && errors[name] ? styles.errorInput : ''}`}
          />
        </label>
      ))}

      <button
        type="submit"
        className={`${styles.button} ${Object.keys(errors).length ? styles.buttonInactive : ''}`}
      >
        {mutation.isLoading ? 'Добавляю…' : 'Добавить'}
      </button>

      {success && <p className={styles.success}>✅ Добавлено!</p>}
      {error   && <p className={styles.error}>❌ {error}</p>}
    </form>
  )
}
