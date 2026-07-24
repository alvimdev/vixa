import { useQuery } from '@tanstack/react-query'
import { groupsApi } from '../api/groups.api'

export function useGroup(id: string) {
  return useQuery({
    queryKey: ['groups', 'detail', id],
    queryFn: () => groupsApi.getById(id),
    // refetchInterval: 10000,
  })
}