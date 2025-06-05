import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchMergedWords }         from '../../api/words'
import { resetProgress } from '../../hooks/useProgress'
import Spinner from '../../components/Spinner/Spinner'
import styles from './VocabPage.module.scss'

export default function VocabPage() {
  const qc = useQueryClient()
  const progress = JSON.parse(localStorage.getItem('vocabProgress') || '{}')

  const { data: words = [], isLoading, isError } = useQuery({
    queryKey: ['vocabWords'],
    queryFn: async () => {
      const all = await fetchMergedWords()
      return all.filter(w => progress[w.id]?.knownByUser)
    },
    refetchOnWindowFocus: false
  })

  const handleRemove = id => {
    resetProgress(id)

    qc.setQueryData(['vocabWords'], old =>
      (old || []).filter(w => w.id !== id)
    )

    const removed = words.find(w => w.id === id)
    qc.setQueryData(['trainWords'], old =>
      removed ? [removed, ...(old || [])] : (old || [])
    )
  }

  if (isLoading) return <Spinner />
  if (isError)   return <p className={styles.status}>Ошибка при загрузке</p>

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Мой словарный запас</h2>
      {words.length === 0 ? (
        <p className={styles.status}>Словарь пока пуст.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Слово</th><th>Транскрипция</th><th>Перевод</th><th>Тема</th><th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {words.map(w => (
              <tr key={`vocab-${w.id}`}>
                <td>{w.english}</td>
                <td>{w.transcription || '—'}</td>
                <td>{w.russian}</td>
                <td>{w.tags || '—'}</td>
                <td className={styles.actions}>
                  <button
                    className={styles.repeatButton}
                    onClick={() => handleRemove(w.id)}
                  > Повторить </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
