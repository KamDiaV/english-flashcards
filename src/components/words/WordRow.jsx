import React, { useState, useEffect } from 'react'
import styles from './WordRow.module.scss'

export default function WordRow({ word, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [edited, setEdited]       = useState(word)

  const englishInvalid = isEditing && !edited.english.trim()
  const russianInvalid = isEditing && !edited.russian.trim()

  useEffect(() => {
    if (isEditing) setEdited(word)
  }, [isEditing, word])

  const handleChange = e => {
    const { name, value } = e.target
    setEdited(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    if (englishInvalid || russianInvalid) return
    onSave(edited)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEdited(word)
  }

  return (
    <tr className={styles.row}>
      {isEditing ? (
        <>   
          <td>
            <input
              name="english"
              value={edited.english}
              onChange={handleChange}
              className={`${styles.input} ${englishInvalid ? styles.errorInput : ''}`}
            />
          </td>
          <td>
            <input
              name="transcription"
              value={edited.transcription}
              onChange={handleChange}
              className={styles.input}
            />
          </td>
          <td>
            <input
              name="russian"
              value={edited.russian}
              onChange={handleChange}
              className={`${styles.input} ${russianInvalid ? styles.errorInput : ''}`}
            />
          </td>
          <td>
            <input
              name="tags"
              value={edited.tags || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </td>
          <td className={styles.actions}>
            <button
              onClick={handleSave}
              className={styles.button}
              disabled={englishInvalid || russianInvalid}
            >
              💾
            </button>
            <button onClick={handleCancel} className={styles.button}>❌</button>
          </td>
        </>
      ) : (
        <>  
          <td>{word.english}</td>
          <td>{word.transcription || '—'}</td>
          <td>{word.russian}</td>
          <td>{word.tags || '—'}</td>
          <td className={styles.actions}>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.button}
            >
              ✏️
            </button>
            <button onClick={onDelete} className={styles.button}>🗑</button>
          </td>
        </>
      )}
    </tr>
  )
}
