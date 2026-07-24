import { useInfiniteQuery } from '@tanstack/react-query'
import { groupsApi } from '../api/groups.api'

const PAGE_SIZE = 20

export function useGroups() {
  return useInfiniteQuery({
    queryKey: ['groups', 'list'],
    queryFn: ({ pageParam }) => groupsApi.list({ limit: PAGE_SIZE, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.length === PAGE_SIZE ? lastPage[lastPage.length - 1].id : undefined,
    // refetchInterval: 15000,
  })
}