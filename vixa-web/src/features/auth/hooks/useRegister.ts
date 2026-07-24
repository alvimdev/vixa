import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'whoami'], data)
    },
  })
}