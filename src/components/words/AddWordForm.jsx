import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addWord }                     from '../../api/words'
import { useForm }                     from '../../hooks/useForm'
import styles                          from './AddWordForm.module.scss'

const FIELDS = [
  { name: 'english',      label: 'Слово (англ.)',    required: true },
  { name: 'transcription',label: 'Транскрипция' },
  { name: 'russian',      label: 'Перевод',          required: true },
  { name: 'tags',         label: 'Тема' }
]

export default function AddWordForm() {
  const qc = useQueryClient()

  const [newWord, handleChange, resetForm] = useForm({
    english: '', transcription: '', russian: '', tags: ''
  })
  const [success, setSuccess] = React.useState(false)
  const [error,   setError]   = React.useState('')

  const mutation = useMutation(
    addWord,
    {
      onSuccess: () => {
        qc.invalidateQueries(['words'])
        setSuccess(true)
        setError('')
        resetForm()
      },
      onError: () => {
        setError('Не удалось добавить слово')
        setSuccess(false)
      }
    }
  )

  const onSubmit = e => {
    e.preventDefault()
    setSuccess(false)
    setError('')
    mutation.mutate(newWord)
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {FIELDS.map(({name,label,required}) => (
        <label key={name} className={styles.field}>
          {label}:
          <input
            name={name}
            value={newWord[name]}
            onChange={handleChange}
            required={required}
            className={styles.input}
          />
        </label>
      ))}

      <button
        type="submit"
        disabled={mutation.isLoading}
        className={styles.button}
      >
        {mutation.isLoading ? 'Добавляю…' : 'Добавить'}
      </button>

      {success && <p className={styles.success}>✅ Добавлено!</p>}
      {error   && <p className={styles.error}>❌ {error}</p>}
    </form>
  )
}
