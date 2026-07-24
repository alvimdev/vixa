import { useMutation, useQueryClient } from '@tanstack/react-query'
import { giftsApi } from '../api/gifts.api'

export function useCreateGift() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: giftsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts', 'mine'] })
    },
  })
}