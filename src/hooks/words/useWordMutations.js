import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../constants/queryKeys'
import {
  deleteWord as apiDeleteWord,
  updateWord as apiUpdateWord,
} from '../../api/words'

export function useWordMutations() {
  const qc = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: apiDeleteWord,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.WORDS })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.TRAIN_WORDS })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.VOCAB_WORDS })
    },
  })

  const updateMutation = useMutation({
    mutationFn: apiUpdateWord,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.WORDS })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.TRAIN_WORDS })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.VOCAB_WORDS })
    },
  })

  return {
    deleteWord: deleteMutation.mutate,
    updateWord: updateMutation.mutate,
    isDeleting: deleteMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    deleteError: deleteMutation.error,
    updateError: updateMutation.error,
  }
}
