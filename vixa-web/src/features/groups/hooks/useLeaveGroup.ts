import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsApi } from '../api/groups.api'

export function useLeaveGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: groupsApi.leave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', 'list'] })
    },
  })
}