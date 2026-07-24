import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'whoami'], data)
    },
  })
}