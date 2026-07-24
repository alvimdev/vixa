import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsApi } from '../api/groups.api'

export function useRegenerateInviteCode(groupId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => groupsApi.regenerateInviteCode(groupId),
    onSuccess: (data) => {
      queryClient.setQueryData(['groups', 'detail', groupId], (old: any) =>
        old ? { ...old, inviteCode: data.inviteCode } : old
      )
    },
  })
}