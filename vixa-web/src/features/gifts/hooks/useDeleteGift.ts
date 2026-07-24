import { useMutation, useQueryClient } from '@tanstack/react-query'
import { giftsApi } from '../api/gifts.api'

export function useDeleteGift() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: giftsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts', 'mine'] })
    },
  })
}