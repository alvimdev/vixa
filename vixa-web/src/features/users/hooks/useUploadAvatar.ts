import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/users.api'

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: usersApi.uploadAvatar,
    onSuccess: (data) => {
      queryClient.setQueryData(['users', 'me'], data)
      queryClient.invalidateQueries({ queryKey: ['auth', 'whoami'] })
    },
  })
}