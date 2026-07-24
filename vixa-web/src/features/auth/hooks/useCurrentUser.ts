import { useQuery } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { ApiError } from '@/shared/api/httpClient'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'whoami'],
    queryFn: authApi.whoami,
    retry: false, // 401 é esperado quando não logado, não faz sentido retentar
    refetchInterval: false, // sessão não precisa de polling, só refetch manual
    throwOnError: (error) => {
      // 401 é estado normal ("não logado"), não deve virar erro global — outros status sim
      return !(error instanceof ApiError && error.status === 401)
    },
  })
}