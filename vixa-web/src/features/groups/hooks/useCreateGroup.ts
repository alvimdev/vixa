import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsApi } from '../api/groups.api'

export function useCreateGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: groupsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', 'list'] })
    },
  })
}