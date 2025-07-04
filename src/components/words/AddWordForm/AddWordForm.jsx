import React from 'react'
import { observer } from 'mobx-react-lite'
import { useWordsStore } from '../../../stores/WordsStoreContext'
import { useForm } from '../../../hooks/useForm'
import styles from './AddWordForm.module.scss'

const FIELDS = [
  { name: 'english',       label: 'Слово (англ.)', required: true },
  { name: 'transcription', label: 'Транскрипция',  required: true },
  { name: 'russian',       label: 'Перевод',       required: true },
  { name: 'tags',          label: 'Тема',          required: true },
]

const AddWordForm = observer(() => {
  const store = useWordsStore()

  const [word, handleChange, resetForm] = useForm({
    english: '', transcription: '', russian: '', tags: ''
  })

  const [showErrors, setShowErrors] = React.useState(false)
  const [localError,   setLocalError]   = React.useState('')
  const [localSuccess, setLocalSuccess] = React.useState(false)

  // ─── валидация ───────────────────────────────────────────
  const errors = React.useMemo(() => (
    FIELDS.reduce((acc, { name, required }) => {
      if (required && !word[name].trim()) acc[name] = true
      return acc
    }, {})
  ), [word])

  const isFormValid = Object.keys(errors).length === 0
  // ─────────────────────────────────────────────────────────

  const onSubmit = async e => {
    e.preventDefault()
    setLocalSuccess(false)
    setLocalError('')

    /* показываем обводку при пустых полях */
    if (!isFormValid) {
      setShowErrors(true)
      setLocalError('Пожалуйста, заполните все обязательные поля')
      return
    }

    try {
      await store.addWord(word)    // MobX-action (async flow)
      setLocalSuccess(true)
      resetForm()
      setShowErrors(false)
    } catch (err) {                // если внутри addWord бросится исключение
      setLocalError(err?.message || 'Не удалось добавить слово')
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      {FIELDS.map(({ name, label }) => (
        <label key={name} className={styles.field}>
          {label}:
          <input
            name={name}
            value={word[name]}
            onChange={handleChange}
            className={`${styles.input} ${showErrors && errors[name] ? styles.errorInput : ''}`}
          />
        </label>
      ))}

      <button
        type="submit"
        disabled={store.loading}
        className={`${styles.button} ${!isFormValid ? styles.buttonInactive : ''}`}
      >
        {store.loading ? 'Добавляю…' : 'Добавить'}
      </button>

      {localSuccess             && <p className={styles.success}>✅ Добавлено!</p>}
      {(localError || store.error) && (
        <p className={styles.error}>❌ {localError || store.error}</p>
      )}
    </form>
  )
})

export default AddWordForm
