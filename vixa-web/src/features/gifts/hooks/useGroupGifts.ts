import { useInfiniteQuery } from '@tanstack/react-query'
import { giftsApi } from '../api/gifts.api'

const PAGE_SIZE = 20

export function useGroupGifts(groupId: string) {
  return useInfiniteQuery({
    queryKey: ['gifts', 'group', groupId],
    queryFn: ({ pageParam }) => giftsApi.listByGroup(groupId, { limit: PAGE_SIZE, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.length === PAGE_SIZE ? lastPage[lastPage.length - 1].id : undefined,
    refetchInterval: 5000, // presente de outro membro precisa aparecer sem F5
  })
}