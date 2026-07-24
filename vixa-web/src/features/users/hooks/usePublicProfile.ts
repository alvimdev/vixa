import { useQuery } from '@tanstack/react-query'
import { usersApi } from '../api/users.api'

export function usePublicProfile(id: string) {
  return useQuery({
    queryKey: ['users', 'public', id],
    queryFn: () => usersApi.getPublicProfile(id),
  })
}