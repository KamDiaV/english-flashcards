import React, { useState } from 'react';
import styles from './WordRow.module.scss';

function WordRow({ word, onDelete, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(word);

  const handleChange = ({ target: { name, value } }) => {
    setEdited(prev => ({ ...prev, [name]: value }));
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
              className={styles.input}
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
              className={styles.input}
            />
          </td>
          <td>
            <input
              name="tags"
              value={edited.tags}
              onChange={handleChange}
              className={styles.input}
            />
          </td>
          <td className={styles.actions}>
            <button
              onClick={() => {
                onSave(edited);
                setIsEditing(false);
              }}
              className={styles.button}
            >
              💾
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={styles.button}
            >
              ❌
            </button>
          </td>
        </>
      ) : (
        <>
          <td>{word.english}</td>
          <td>{word.transcription}</td>
          <td>{word.russian}</td>
          <td>{word.tags || '—'}</td>
          <td className={styles.actions}>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.button}
            >
              ✏️
            </button>
            <button onClick={onDelete} className={styles.button}>
              🗑
            </button>
          </td>
        </>
      )}
    </tr>
  );
}

export default WordRow;
