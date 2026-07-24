import { useMutation, useQueryClient } from '@tanstack/react-query'
import { giftsApi } from '../api/gifts.api'
import type { SetVisibilityInput } from '../schemas/gifts.schema'

export function useSetVisibility() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SetVisibilityInput }) =>
      giftsApi.setVisibility(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts', 'mine'] })
    },
  })
}