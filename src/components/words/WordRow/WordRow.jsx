import React, { useState, useEffect } from 'react';
import styles from './WordRow.module.scss';

export default function WordRow({ word, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited]       = useState(word);

  const englishInvalid       = isEditing && !edited.english.trim();
  const transcriptionInvalid = isEditing && !edited.transcription.trim();
  const russianInvalid       = isEditing && !edited.russian.trim();
  const tagsInvalid          = isEditing && !(edited.tags?.trim());

  // при входе в режим редактирования копируем текущее слово
  useEffect(() => {
    if (isEditing) setEdited(word);
  }, [isEditing, word]);

  // обновляем состояние при вводе
  const handleChange = e => {
    const { name, value } = e.target;
    setEdited(prev => ({ ...prev, [name]: value }));
  };

  // сохранить
  const handleSave = () => {
    if (englishInvalid || transcriptionInvalid || russianInvalid) {
      alert('Ошибка: заполните все обязательные поля перед сохранением');
      return;
    }
    console.log('Сохранено слово:', edited);
    onSave(edited);
    setIsEditing(false);
  };

  // отменить
  const handleCancel = () => {
    setIsEditing(false);
    setEdited(word);
  };

  // Enter = сохранить
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <tr className={styles.row}>
      {isEditing ? (
        <>
          <td>
            <input
              name="english"
              value={edited.english}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={`${styles.input} ${englishInvalid ? styles.errorInput : ''}`}
            />
          </td>
          <td>
            <input
              name="transcription"
              value={edited.transcription}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={`${styles.input} ${transcriptionInvalid ? styles.errorInput : ''}`}
            />
          </td>
          <td>
            <input
              name="russian"
              value={edited.russian}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={`${styles.input} ${russianInvalid ? styles.errorInput : ''}`}
            />
          </td>
          <td>
            <input
              name="tags"
              value={edited.tags || ''}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={`${styles.input} ${tagsInvalid ? styles.errorInput : ''}`}
            />
          </td>
          <td className={styles.actions}>
            <button
              onClick={handleSave}
              className={styles.button}
              disabled={englishInvalid || transcriptionInvalid || russianInvalid}
            >
              💾
            </button>
            <button onClick={handleCancel} className={styles.button}>❌</button>
          </td>
        </>
      ) : (
        <>
          <td>{word.english}</td>
          <td>{word.transcription}</td>
          <td>{word.russian}</td>
          <td>{word.tags}</td>
          <td className={styles.actions}>
            <button onClick={() => setIsEditing(true)} className={styles.button}>✏️</button>
            <button onClick={onDelete} className={styles.button}>🗑</button>
          </td>
        </>
      )}
    </tr>
  );
}
