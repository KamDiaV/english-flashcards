import React, { useState } from 'react'
import styles from './FormattedTextDisplay.module.scss'

export default function FormattedTextDisplay() {
  const [inputValue, setInputValue] = useState('')
  const [displayText, setDisplayText] = useState('')

  const handleChange = e => {
    setInputValue(e.target.value)
  }

  const handleClick = () => {
    setDisplayText(inputValue.toUpperCase())
  }

  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.input}
        value={inputValue}
        onChange={handleChange}
        placeholder="Введите текст"
      />
      <button className={styles.button} onClick={handleClick}>
        Отобразить
      </button>
      {displayText && (
        <p className={styles.displayText}>
          {displayText}
        </p>
      )}
    </div>
  )
}
