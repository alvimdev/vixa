import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsApi } from '../api/groups.api'

export function useJoinGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: groupsApi.join,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', 'list'] })
    },
  })
}