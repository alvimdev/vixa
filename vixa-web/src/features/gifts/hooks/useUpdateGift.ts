import { useMutation, useQueryClient } from '@tanstack/react-query'
import { giftsApi } from '../api/gifts.api'
import type { UpdateGiftInput } from '../schemas/gifts.schema'

export function useUpdateGift() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGiftInput }) => giftsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts', 'mine'] })
    },
  })
}