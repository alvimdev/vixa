import { useQuery } from '@tanstack/react-query'
import { usersApi } from '../api/users.api'

export function useMyProfile() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: usersApi.getMe,
  })
}