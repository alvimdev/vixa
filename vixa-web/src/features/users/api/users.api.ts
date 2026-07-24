import { httpClient } from '@/shared/api/httpClient'
import type {
  PrivateProfile,
  PublicProfile,
  UpdateNameInput,
  UpdateAvatarInput,
  UpdateBirthdateInput,
} from '../schemas/users.schema'

export const usersApi = {
  getMe: () => httpClient.get<PrivateProfile>('/users/me'),

  getPublicProfile: (id: string) => httpClient.get<PublicProfile>(`/users/${id}`),

  updateName: (data: UpdateNameInput) => httpClient.patch<PrivateProfile>('/users/me/name', data),

  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return httpClient.postFormData<PrivateProfile>('/users/me/avatar', formData)
  },

  updateBirthdate: (data: UpdateBirthdateInput) =>
    httpClient.patch<PrivateProfile>('/users/me/birthdate', {
      birthdate: data.birthdate.toISOString(),
    }),
}