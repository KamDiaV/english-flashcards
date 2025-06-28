import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addWord } from '../../../api/words'
import { useForm } from '../../../hooks/base/useForm'
import styles from './AddWordForm.module.scss'

const FIELDS = [
  { name: 'english', label: 'Слово (англ.)', required: true },
  { name: 'transcription', label: 'Транскрипция', required: true },
  { name: 'russian', label: 'Перевод', required: true },
  { name: 'tags', label: 'Тема', required: true },
]

export default function AddWordForm() {
  const qc = useQueryClient()

  const [newWord, handleChange, resetForm] = useForm({ english: '', transcription: '', russian: '', tags: '' })
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState('')
  const [showErrors, setShowErrors] = React.useState(false)

  const errors = React.useMemo(() => {
    return FIELDS.reduce((acc, { name, required }) => {
      if (required && !newWord[name].trim()) acc[name] = true
      return acc
    }, {})
  }, [newWord])

  const isFormValid = Object.keys(errors).length === 0

  const mutation = useMutation(addWord, {
    onSuccess: () => {
      qc.invalidateQueries(['words'])
      setSuccess(true)
      setError('')
      resetForm()
      setShowErrors(false)
    },
    onError: () => {
      setError('Не удалось добавить слово')
      setSuccess(false)
    },
  })

  const onButtonClick = () => {
    // при попытке сохранить с ошибками — показать обводку
    if (!isFormValid) setShowErrors(true)
  }

  const onSubmit = e => {
    e.preventDefault()
    setSuccess(false)
    setError('')
    if (!isFormValid) {
      setError('Пожалуйста, заполните все обязательные поля')
      return
    }
    mutation.mutate(newWord)
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      {FIELDS.map(({ name, label }) => (
        <label key={name} className={styles.field}>
          {label}:
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
        onClick={onButtonClick}
        className={`${styles.button} ${!isFormValid ? styles.buttonInactive : ''}`}
      >
        {mutation.isLoading ? 'Добавляю…' : 'Добавить'}
      </button>

      {success && <p className={styles.success}>✅ Добавлено!</p>}
      {error && <p className={styles.error}>❌ {error}</p>}
    </form>
  )
}
