import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteWord as apiDeleteWord, updateWord as apiUpdateWord } from '../api/words'

/**
 * Кастомный хук для мутаций слова: удаления и обновления.
 */
export function useWordMutations() {
  const qc = useQueryClient()

  const deleteMutation = useMutation(apiDeleteWord, {
    onSuccess: () => {
      qc.invalidateQueries(['words'])
      qc.invalidateQueries(['trainWords'])
      qc.invalidateQueries(['vocabWords'])
    }
  })

  const updateMutation = useMutation(apiUpdateWord, {
    onSuccess: () => {
      qc.invalidateQueries(['words'])
      qc.invalidateQueries(['trainWords'])
      qc.invalidateQueries(['vocabWords'])
    }
  })

  return {
    deleteWord: deleteMutation.mutate,
    updateWord: updateMutation.mutate,
    isDeleting: deleteMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    deleteError: deleteMutation.error,
    updateError: updateMutation.error
  }
}