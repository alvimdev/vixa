import { useInfiniteQuery } from '@tanstack/react-query'
import { groupsApi } from '../api/groups.api'

const PAGE_SIZE = 30

export function useGroupMembers(groupId: string) {
  return useInfiniteQuery({
    queryKey: ['groups', groupId, 'members'],
    queryFn: ({ pageParam }) => groupsApi.listMembers(groupId, { limit: PAGE_SIZE, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.length === PAGE_SIZE ? lastPage[lastPage.length - 1].id : undefined,
    refetchInterval: 15000,
  })
}