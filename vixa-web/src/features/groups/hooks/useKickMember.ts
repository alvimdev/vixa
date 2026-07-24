import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsApi } from '../api/groups.api'

export function useKickMember(groupId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => groupsApi.kickMember(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'members'] })
    },
  })
}