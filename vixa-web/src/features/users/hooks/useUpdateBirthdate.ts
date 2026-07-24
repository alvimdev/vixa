import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/users.api'

export function useUpdateBirthdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: usersApi.updateBirthdate,
    onSuccess: (data) => {
      queryClient.setQueryData(['users', 'me'], data)
      // aniversário não aparece no header, então não precisa invalidar whoami aqui
    },
  })
}