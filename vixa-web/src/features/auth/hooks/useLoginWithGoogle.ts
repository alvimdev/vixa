import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'

export function useLoginWithGoogle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.loginWithGoogle,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'whoami'], data)
    },
  })
}