import { useInfiniteQuery } from '@tanstack/react-query'
import { giftsApi } from '../api/gifts.api'

const PAGE_SIZE = 20

export function useMyGifts() {
  return useInfiniteQuery({
    queryKey: ['gifts', 'mine'],
    queryFn: ({ pageParam }) => giftsApi.listMine({ limit: PAGE_SIZE, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.length === PAGE_SIZE ? lastPage[lastPage.length - 1].id : undefined,
  })
}