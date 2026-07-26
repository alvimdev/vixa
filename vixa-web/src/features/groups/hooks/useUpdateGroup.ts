import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsApi } from '../api/groups.api'
import type { UpdateGroupInput } from '../schemas/groups.schema'

export function useUpdateGroup(groupId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateGroupInput) => groupsApi.update(groupId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(['groups', 'detail', groupId], data)
      queryClient.invalidateQueries({ queryKey: ['groups', 'list'] })
    },
  })
}